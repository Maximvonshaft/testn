@echo off
cd /d %~dp0
if not exist .venv python -m venv .venv
call .venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed
start http://127.0.0.1:8088
uvicorn app.main:app --reload --host 127.0.0.1 --port 8088
