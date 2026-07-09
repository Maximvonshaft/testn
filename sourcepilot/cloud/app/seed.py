from .db import Base, engine, SessionLocal
from .models import Organization, Workspace

def main():
    Base.metadata.create_all(engine)
    db = SessionLocal()
    try:
        org = db.query(Organization).first()
        if not org:
            org = Organization(name="Demo Organization")
            db.add(org)
            db.commit()
            db.refresh(org)
        ws = db.query(Workspace).first()
        if not ws:
            db.add(Workspace(org_id=org.id, name="Default Workspace"))
            db.commit()
        print("SourcePilot DB initialized")
    finally:
        db.close()

if __name__ == "__main__":
    main()
