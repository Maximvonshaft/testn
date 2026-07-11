from __future__ import annotations

import argparse
import json
import re
import socket
import threading
import webbrowser
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / 'data'
LEADS_FILE = DATA_DIR / 'leads.jsonl'
EMAIL_RE = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')


class LeadValidationError(ValueError):
    pass


def _clean(value: Any, *, max_length: int = 1000) -> str:
    text = str(value or '').strip()
    return text[:max_length]


def validate_lead(payload: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(payload, dict):
        raise LeadValidationError('Payload must be a JSON object.')

    name = _clean(payload.get('name'), max_length=120)
    company = _clean(payload.get('company'), max_length=160)
    email = _clean(payload.get('email'), max_length=200).lower()
    request_type = _clean(payload.get('requestType'), max_length=20)
    configuration_code = _clean(payload.get('configurationCode'), max_length=240)

    missing = [
        label for label, value in (
            ('name', name), ('company', company), ('email', email),
            ('requestType', request_type), ('configurationCode', configuration_code),
        ) if not value
    ]
    if missing:
        raise LeadValidationError(f"Missing required fields: {', '.join(missing)}")
    if not EMAIL_RE.match(email):
        raise LeadValidationError('Email format is invalid.')
    if request_type not in {'sample', 'quote'}:
        raise LeadValidationError('requestType must be sample or quote.')

    return {
        'name': name,
        'company': company,
        'email': email,
        'country': _clean(payload.get('country'), max_length=120),
        'area': _clean(payload.get('area'), max_length=40),
        'role': _clean(payload.get('role'), max_length=120),
        'notes': _clean(payload.get('notes'), max_length=4000),
        'requestType': request_type,
        'configurationCode': configuration_code,
        'configuration': payload.get('configuration') if isinstance(payload.get('configuration'), dict) else {},
        'scene': _clean(payload.get('scene'), max_length=120),
        'clientCreatedAt': _clean(payload.get('createdAt'), max_length=80),
        'receivedAt': datetime.now(timezone.utc).isoformat(),
    }


class MaterialStudioHandler(SimpleHTTPRequestHandler):
    server_version = 'MaterialStudioLocal/0.5.1'
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        '.mjs': 'text/javascript; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.webp': 'image/webp',
        '.css': 'text/css; charset=utf-8',
        '.svg': 'image/svg+xml',
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def _send_json(self, status: int, payload: Dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.split('?', 1)[0] == '/api/health':
            self._send_json(HTTPStatus.OK, {'ok': True, 'version': '0.5.1'})
            return
        super().do_GET()

    def do_POST(self):
        if self.path.split('?', 1)[0] != '/api/leads':
            self._send_json(HTTPStatus.NOT_FOUND, {'ok': False, 'error': 'Not found'})
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if length <= 0 or length > 1_000_000:
                raise LeadValidationError('Invalid request size.')
            raw = self.rfile.read(length)
            payload = json.loads(raw.decode('utf-8'))
            lead = validate_lead(payload)
            DATA_DIR.mkdir(parents=True, exist_ok=True)
            with LEADS_FILE.open('a', encoding='utf-8') as handle:
                handle.write(json.dumps(lead, ensure_ascii=False) + '\n')
            self._send_json(HTTPStatus.CREATED, {'ok': True, 'configurationCode': lead['configurationCode']})
        except (json.JSONDecodeError, UnicodeDecodeError):
            self._send_json(HTTPStatus.BAD_REQUEST, {'ok': False, 'error': 'Invalid JSON.'})
        except LeadValidationError as error:
            self._send_json(HTTPStatus.UNPROCESSABLE_ENTITY, {'ok': False, 'error': str(error)})
        except Exception as error:
            self.log_error('Lead persistence failed: %s', error)
            self._send_json(HTTPStatus.INTERNAL_SERVER_ERROR, {'ok': False, 'error': 'Lead could not be saved.'})


class ReusableThreadingHTTPServer(ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True


def _port_is_available(host: str, port: int) -> bool:
    if port == 0:
        return True
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            probe.bind((host, port))
        except OSError:
            return False
    return True


def find_available_port(host: str = '127.0.0.1', preferred_port: int = 8080, *, search_span: int = 50) -> int:
    if preferred_port == 0:
        return 0
    upper = min(65535, preferred_port + max(1, search_span))
    for candidate in range(preferred_port, upper):
        if _port_is_available(host, candidate):
            return candidate
    raise OSError(f'No available TCP port found from {preferred_port} to {upper - 1}.')


def create_server(host: str = '127.0.0.1', port: int = 8080) -> ReusableThreadingHTTPServer:
    return ReusableThreadingHTTPServer((host, port), MaterialStudioHandler)


def create_server_with_fallback(
    host: str = '127.0.0.1',
    preferred_port: int = 8080,
    *,
    search_span: int = 50,
) -> ReusableThreadingHTTPServer:
    last_error: OSError | None = None
    if preferred_port == 0:
        return create_server(host, 0)
    upper = min(65535, preferred_port + max(1, search_span))
    for candidate in range(preferred_port, upper):
        try:
            return create_server(host, candidate)
        except OSError as error:
            last_error = error
    raise OSError(f'No available TCP port found from {preferred_port} to {upper - 1}.') from last_error


def run(host: str = '127.0.0.1', port: int = 8080, *, open_browser: bool = True) -> None:
    server = create_server_with_fallback(host, port)
    bound_port = server.server_address[1]
    url = f'http://{host}:{bound_port}'
    if bound_port != port:
        print(f'Port {port} was already in use. Using port {bound_port} instead.')
    print(f'Material Studio v0.5.1 running at {url}')
    print('Keep this window open while using the demo. Press Ctrl+C to stop.')
    if open_browser:
        threading.Timer(0.35, lambda: webbrowser.open(url, new=2)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nStopping Material Studio...')
    finally:
        server.server_close()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Run the Material Studio local demo server.')
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=8080)
    parser.add_argument('--no-browser', action='store_true')
    return parser.parse_args()


if __name__ == '__main__':
    args = parse_args()
    run(args.host, args.port, open_browser=not args.no_browser)
