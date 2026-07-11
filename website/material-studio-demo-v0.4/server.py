#!/usr/bin/env python3
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import json, uuid, datetime, os

ROOT=Path(__file__).resolve().parent
DATA=ROOT/'data'; DATA.mkdir(exist_ok=True)
os.chdir(ROOT)

class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control','no-cache' if self.path.endswith(('.html','.js','.css','.json')) else 'public, max-age=3600')
        self.send_header('X-Content-Type-Options','nosniff')
        super().end_headers()
    def do_GET(self):
        if self.path=='/api/health':
            self._json(200,{'ok':True,'version':'0.4.0'}); return
        super().do_GET()
    def do_POST(self):
        if self.path!='/api/leads': self._json(404,{'error':'not_found'}); return
        try:
            length=int(self.headers.get('content-length','0'))
            if length>256_000: raise ValueError('payload_too_large')
            payload=json.loads(self.rfile.read(length) or b'{}')
            required=['name','company']
            if any(not str(payload.get(k,'')).strip() for k in required):
                self._json(422,{'error':'name_and_company_required'}); return
            record={'id':'MS-'+uuid.uuid4().hex[:10].upper(),'createdAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),**payload}
            with (DATA/'leads.jsonl').open('a',encoding='utf-8') as f: f.write(json.dumps(record,ensure_ascii=False)+'\n')
            self._json(201,{'ok':True,'id':record['id']})
        except Exception as e: self._json(400,{'error':str(e)})
    def _json(self,status,payload):
        body=json.dumps(payload,ensure_ascii=False).encode();self.send_response(status);self.send_header('content-type','application/json; charset=utf-8');self.send_header('content-length',str(len(body)));self.end_headers();self.wfile.write(body)

if __name__=='__main__':
    port=int(os.environ.get('PORT','8080'))
    print(f'Material Studio v0.4: http://127.0.0.1:{port}')
    ThreadingHTTPServer(('127.0.0.1',port),Handler).serve_forever()
