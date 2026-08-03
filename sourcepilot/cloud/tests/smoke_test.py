from pathlib import Path

from app.db import Base, engine, SessionLocal
from app.models import LeadEntity
from app.seed import main as seed_main
from app.services import import_csv, export_clean_csv


def test_import_export_smoke():
    Base.metadata.create_all(engine)
    seed_main()
    db = SessionLocal()
    try:
        sample = Path(__file__).resolve().parents[1] / "data" / "uploads" / "sample_plugin_leads.csv"
        if sample.exists():
            result = import_csv(db, sample)
            assert result["imported"] > 0
            assert db.query(LeadEntity).count() > 0
            out = export_clean_csv(db)
            assert out.exists()
    finally:
        db.close()
