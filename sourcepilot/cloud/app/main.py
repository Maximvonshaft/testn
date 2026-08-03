from __future__ import annotations

import json
import shutil
from pathlib import Path

from fastapi import Depends, FastAPI, File, Form, Request, UploadFile
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from .db import Base, engine, get_db
from .models import AuditLog, Campaign, LeadEntity, Query
from .services import create_campaign_from_playbook, export_clean_csv, import_csv, get_default_workspace, log

APP_DIR = Path(__file__).resolve().parent
ROOT = APP_DIR.parents[0]
DATA_DIR = ROOT / "data"
UPLOAD_DIR = DATA_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
PLAYBOOK_PATH = ROOT / "playbooks" / "playbooks.json"

Base.metadata.create_all(bind=engine)
app = FastAPI(title="SourcePilot Commercial Suite")
app.mount("/static", StaticFiles(directory=APP_DIR / "static"), name="static")
templates = Jinja2Templates(directory=APP_DIR / "templates")

def load_playbooks():
    with open(PLAYBOOK_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/", response_class=HTMLResponse)
def dashboard(request: Request, db: Session = Depends(get_db)):
    get_default_workspace(db)
    leads = db.query(LeadEntity).all()
    campaigns = db.query(Campaign).order_by(Campaign.created_at.desc()).limit(5).all()
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(8).all()
    total = len(leads)
    with_website = len([x for x in leads if x.website])
    with_phone = len([x for x in leads if x.phone])
    a_count = len([x for x in leads if x.priority == "A"])
    return templates.TemplateResponse("dashboard.html", {"request": request, "total": total, "with_website": with_website, "with_phone": with_phone, "a_count": a_count, "campaigns": campaigns, "logs": logs})

@app.get("/campaigns", response_class=HTMLResponse)
def campaigns(request: Request, db: Session = Depends(get_db)):
    return templates.TemplateResponse("campaigns.html", {"request": request, "campaigns": db.query(Campaign).order_by(Campaign.created_at.desc()).all(), "playbooks": load_playbooks()})

@app.post("/campaigns")
def create_campaign(industry: str = Form(...), market: str = Form(...), max_cities: int = Form(2), max_keywords: int = Form(3), name: str = Form(""), db: Session = Depends(get_db)):
    playbooks = load_playbooks()
    book = playbooks[industry]
    cities = book["markets"][market][:max_cities]
    keywords = book["keywords"][:max_keywords]
    cname = name or f"{industry}_{market}_{max_cities}x{max_keywords}"
    create_campaign_from_playbook(db, industry, market, cities, keywords, cname)
    return RedirectResponse("/campaigns", status_code=303)

@app.get("/campaigns/{campaign_id}/queries", response_class=HTMLResponse)
def campaign_queries(campaign_id: int, request: Request, db: Session = Depends(get_db)):
    camp = db.get(Campaign, campaign_id)
    queries = db.query(Query).filter(Query.campaign_id == campaign_id).all()
    return templates.TemplateResponse("queries.html", {"request": request, "campaign": camp, "queries": queries})

@app.get("/import", response_class=HTMLResponse)
def import_page(request: Request, db: Session = Depends(get_db)):
    return templates.TemplateResponse("import.html", {"request": request, "campaigns": db.query(Campaign).order_by(Campaign.created_at.desc()).all()})

@app.post("/import")
async def import_upload(file: UploadFile = File(...), campaign_id: int = Form(0), db: Session = Depends(get_db)):
    dest = UPLOAD_DIR / file.filename
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)
    result = import_csv(db, dest, campaign_id=campaign_id or None)
    return templates.TemplateResponse("import_result.html", {"request": {}, "result": result, "file": file.filename})

@app.get("/leads", response_class=HTMLResponse)
def leads(request: Request, q: str = "", priority: str = "", status: str = "", db: Session = Depends(get_db)):
    query = db.query(LeadEntity)
    if priority:
        query = query.filter(LeadEntity.priority == priority)
    if status:
        query = query.filter(LeadEntity.status == status)
    rows = query.order_by(LeadEntity.lead_score.desc(), LeadEntity.canonical_name.asc()).limit(500).all()
    if q:
        ql = q.lower()
        rows = [r for r in rows if ql in (r.canonical_name or "").lower() or ql in (r.website or "").lower() or ql in (r.address or "").lower()]
    return templates.TemplateResponse("leads.html", {"request": request, "leads": rows, "q": q, "priority": priority, "status": status})

@app.post("/leads/{lead_id}/status")
def update_status(lead_id: int, status: str = Form(...), notes: str = Form(""), db: Session = Depends(get_db)):
    lead = db.get(LeadEntity, lead_id)
    if lead:
        lead.status = status
        lead.notes = notes
        db.commit()
        log(db, "lead_update", f"Lead {lead.canonical_name} set to {status}")
    return RedirectResponse("/leads", status_code=303)

@app.get("/exports", response_class=HTMLResponse)
def exports(request: Request, db: Session = Depends(get_db)):
    return templates.TemplateResponse("exports.html", {"request": request, "count": db.query(LeadEntity).count()})

@app.post("/exports")
def do_export(db: Session = Depends(get_db)):
    path = export_clean_csv(db)
    return FileResponse(path, media_type="text/csv", filename=path.name)

@app.get("/diagnostics", response_class=HTMLResponse)
def diagnostics(request: Request, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(200).all()
    return templates.TemplateResponse("diagnostics.html", {"request": request, "logs": logs})

@app.get("/website-blueprint", response_class=HTMLResponse)
def website_blueprint(request: Request):
    return templates.TemplateResponse("website_blueprint.html", {"request": request})
