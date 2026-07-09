from __future__ import annotations

import csv
import hashlib
import json
import re
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

from sqlalchemy.orm import Session

from .models import AuditLog, Campaign, Query, LeadEntity, LeadObservation, ExportFile, Organization, Workspace

ROOT = Path(__file__).resolve().parents[1]
EXPORT_DIR = ROOT / "data" / "exports"
EXPORT_DIR.mkdir(parents=True, exist_ok=True)

NAME_KEYS = ["name", "title", "business_name", "businessName", "company", "canonical_name"]
PHONE_KEYS = ["phone", "telephone", "tel", "internationalPhoneNumber", "nationalPhoneNumber"]
WEBSITE_KEYS = ["website", "site", "url", "websiteUrl", "websiteURI"]
ADDRESS_KEYS = ["address", "formattedAddress", "location", "street"]
RATING_KEYS = ["rating", "stars"]
REVIEWS_KEYS = ["reviews", "reviewCount", "userRatingCount", "reviews_count"]
LAT_KEYS = ["lat", "latitude"]
LNG_KEYS = ["lng", "longitude", "lon"]
QUERY_KEYS = ["sourceQuery", "query", "keyword_query", "search_query"]
CITY_KEYS = ["market", "city", "locationText"]
KEYWORD_KEYS = ["keyword"]
MAPS_KEYS = ["googleMapsUrl", "mapsUrl", "place_url", "google_maps_url"]
CATEGORY_KEYS = ["category", "type", "types", "businessStatus"]

def log(db: Session, stage: str, message: str, level: str = "info") -> None:
    db.add(AuditLog(stage=stage, message=message, level=level))
    db.commit()

def first(row: dict, keys: list[str], default: str = "") -> str:
    for k in keys:
        if k in row and str(row[k]).strip():
            return str(row[k]).strip()
    return default

def normalize_name(name: str) -> str:
    value = re.sub(r"\bvisited link\b", "", str(name), flags=re.I)
    value = re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()
    return value

def normalize_phone(phone: str) -> str:
    if not phone:
        return ""
    raw = str(phone).strip()
    digits = re.sub(r"\D", "", raw)
    if len(digits) < 7:
        return ""
    if re.fullmatch(r"[1-5 ]{3,}\s*[0-5][.,][0-9].*", raw):
        return ""
    return raw

def normalize_website(site: str) -> str:
    if not site:
        return ""
    site = str(site).strip()
    if not site:
        return ""
    if "@" in site and not site.startswith("http"):
        return ""
    if not re.match(r"^https?://", site, re.I):
        site = "https://" + site
    return site

def domain_of(site: str) -> str:
    if not site:
        return ""
    try:
        parsed = urlparse(normalize_website(site))
        host = parsed.netloc.lower().replace("www.", "")
        return host.split(":")[0]
    except Exception:
        return ""

def to_int(v) -> int:
    try:
        return int(float(str(v).replace(",", "").strip()))
    except Exception:
        return 0

def to_float(v) -> float:
    try:
        return float(str(v).replace(",", ".").strip())
    except Exception:
        return 0.0

def score_lead(row: dict) -> tuple[int, str]:
    score = 0
    text = " ".join(str(row.get(k, "")) for k in ["name", "category", "source_query", "keyword", "website", "address"]).lower()
    if row.get("website"):
        score += 20
    if row.get("phone"):
        score += 15
    if row.get("address") and row.get("lat") and row.get("lng"):
        score += 10
    if to_float(row.get("rating")) >= 4:
        score += 10
    if to_int(row.get("review_count")) >= 50:
        score += 10
    if re.search(r"building|material|baustoff|baumarkt|panel|wall|floor|bath|construction|merchant|supplier|bricolage|budowl|буд", text):
        score += 25
    if re.search(r"restaurant|cafe|hotel|doctor|dentist|school", text):
        score -= 30
    score = max(0, min(100, score))
    priority = "A" if score >= 75 else "B" if score >= 55 else "C" if score >= 35 else "D"
    return score, priority

def entity_key(row: dict) -> str:
    if row.get("domain"):
        return "domain:" + row["domain"]
    if row.get("phone"):
        return "phone:" + re.sub(r"\D", "", row["phone"])
    basis = "|".join([
        normalize_name(row.get("name", "")),
        str(row.get("address", "")).lower()[:80],
        str(row.get("lat", ""))[:8],
        str(row.get("lng", ""))[:8],
    ])
    return "hash:" + hashlib.sha1(basis.encode("utf-8")).hexdigest()

def get_default_workspace(db: Session) -> Workspace:
    org = db.query(Organization).first()
    if not org:
        org = Organization(name="Demo Organization")
        db.add(org)
        db.commit()
        db.refresh(org)
    ws = db.query(Workspace).first()
    if not ws:
        ws = Workspace(org_id=org.id, name="Default Workspace")
        db.add(ws)
        db.commit()
        db.refresh(ws)
    return ws

def create_campaign_from_playbook(db: Session, industry: str, market: str, cities: list[str], keywords: list[str], name: str) -> Campaign:
    ws = get_default_workspace(db)
    camp = Campaign(workspace_id=ws.id, name=name, industry=industry, market=market, status="ready")
    db.add(camp)
    db.commit()
    db.refresh(camp)
    for city in cities:
        for keyword in keywords:
            db.add(Query(campaign_id=camp.id, text=f"{keyword} {city}", city=city, keyword=keyword))
    db.commit()
    log(db, "campaign_created", f"Campaign {camp.name} created with {len(cities)*len(keywords)} queries")
    return camp

def import_csv(db: Session, path: Path, campaign_id: int | None = None) -> dict:
    ws = get_default_workspace(db)
    imported = 0
    merged = 0
    created = 0
    with open(path, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for raw in reader:
            name = first(raw, NAME_KEYS)
            if not name:
                continue
            row = {
                "name": name,
                "phone": normalize_phone(first(raw, PHONE_KEYS)),
                "website": normalize_website(first(raw, WEBSITE_KEYS)),
                "address": first(raw, ADDRESS_KEYS),
                "rating": to_float(first(raw, RATING_KEYS)),
                "review_count": to_int(first(raw, REVIEWS_KEYS)),
                "lat": first(raw, LAT_KEYS),
                "lng": first(raw, LNG_KEYS),
                "maps_url": first(raw, MAPS_KEYS),
                "source_query": first(raw, QUERY_KEYS),
                "city": first(raw, CITY_KEYS),
                "keyword": first(raw, KEYWORD_KEYS),
                "category": first(raw, CATEGORY_KEYS),
            }
            row["domain"] = domain_of(row["website"])
            row["lead_score"], row["priority"] = score_lead(row)
            entity = None
            if row["domain"]:
                entity = db.query(LeadEntity).filter(LeadEntity.workspace_id == ws.id, LeadEntity.domain == row["domain"]).first()
            if not entity and row["phone"]:
                entity = db.query(LeadEntity).filter(LeadEntity.workspace_id == ws.id, LeadEntity.phone == row["phone"]).first()
            if not entity:
                entity = LeadEntity(
                    workspace_id=ws.id,
                    canonical_name=row["name"],
                    normalized_name=normalize_name(row["name"]),
                    domain=row["domain"],
                    phone=row["phone"],
                    website=row["website"],
                    address=row["address"],
                    lat=row["lat"],
                    lng=row["lng"],
                    rating=row["rating"],
                    review_count=row["review_count"],
                    category=row["category"],
                    lead_score=row["lead_score"],
                    priority=row["priority"],
                )
                db.add(entity)
                db.flush()
                created += 1
            else:
                merged += 1
                for attr, value in [("website", row["website"]), ("domain", row["domain"]), ("phone", row["phone"]), ("address", row["address"]), ("lat", row["lat"]), ("lng", row["lng"]), ("category", row["category"])]:
                    if value and not getattr(entity, attr):
                        setattr(entity, attr, value)
                if row["lead_score"] > entity.lead_score:
                    entity.lead_score = row["lead_score"]
                    entity.priority = row["priority"]
                entity.last_seen_at = datetime.utcnow()
            obs = LeadObservation(
                entity_id=entity.id,
                campaign_id=campaign_id,
                source="csv_import",
                source_query=row["source_query"],
                raw_name=name,
                raw_json=json.dumps(raw, ensure_ascii=False),
            )
            db.add(obs)
            imported += 1
    db.commit()
    log(db, "csv_import", f"Imported {imported} rows from {path.name}; created={created}; merged={merged}")
    return {"imported": imported, "created": created, "merged": merged}

def export_clean_csv(db: Session) -> Path:
    ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    path = EXPORT_DIR / f"sourcepilot_clean_leads_{ts}.csv"
    headers = ["priority", "lead_score", "status", "canonical_name", "phone", "website", "email", "address", "lat", "lng", "rating", "review_count", "category", "domain", "notes"]
    entities = db.query(LeadEntity).order_by(LeadEntity.lead_score.desc()).all()
    with open(path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for e in entities:
            writer.writerow([e.priority, e.lead_score, e.status, e.canonical_name, e.phone, e.website, e.email, e.address, e.lat, e.lng, e.rating, e.review_count, e.category, e.domain, e.notes])
    db.add(ExportFile(file_name=path.name, lead_count=len(entities)))
    db.commit()
    log(db, "export", f"Exported {len(entities)} leads to {path.name}")
    return path
