from __future__ import annotations

from datetime import datetime
from sqlalchemy import String, DateTime, Integer, Float, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base

class Organization(Base):
    __tablename__ = "organizations"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    workspaces: Mapped[list["Workspace"]] = relationship(back_populates="organization")

class Workspace(Base):
    __tablename__ = "workspaces"
    id: Mapped[int] = mapped_column(primary_key=True)
    org_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"))
    name: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    organization: Mapped[Organization] = relationship(back_populates="workspaces")
    campaigns: Mapped[list["Campaign"]] = relationship(back_populates="workspace")

class Campaign(Base):
    __tablename__ = "campaigns"
    id: Mapped[int] = mapped_column(primary_key=True)
    workspace_id: Mapped[int] = mapped_column(ForeignKey("workspaces.id"))
    name: Mapped[str] = mapped_column(String(255))
    industry: Mapped[str] = mapped_column(String(120), default="building_materials")
    market: Mapped[str] = mapped_column(String(120), default="switzerland")
    status: Mapped[str] = mapped_column(String(60), default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    workspace: Mapped[Workspace] = relationship(back_populates="campaigns")
    queries: Mapped[list["Query"]] = relationship(back_populates="campaign")

class Query(Base):
    __tablename__ = "queries"
    id: Mapped[int] = mapped_column(primary_key=True)
    campaign_id: Mapped[int] = mapped_column(ForeignKey("campaigns.id"))
    text: Mapped[str] = mapped_column(String(500))
    city: Mapped[str] = mapped_column(String(180), default="")
    keyword: Mapped[str] = mapped_column(String(240), default="")
    status: Mapped[str] = mapped_column(String(60), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    campaign: Mapped[Campaign] = relationship(back_populates="queries")

class LeadEntity(Base):
    __tablename__ = "lead_entities"
    id: Mapped[int] = mapped_column(primary_key=True)
    workspace_id: Mapped[int] = mapped_column(ForeignKey("workspaces.id"))
    canonical_name: Mapped[str] = mapped_column(String(500))
    normalized_name: Mapped[str] = mapped_column(String(500), index=True)
    domain: Mapped[str] = mapped_column(String(255), default="", index=True)
    phone: Mapped[str] = mapped_column(String(120), default="", index=True)
    website: Mapped[str] = mapped_column(String(500), default="")
    email: Mapped[str] = mapped_column(String(500), default="")
    address: Mapped[str] = mapped_column(String(1000), default="")
    lat: Mapped[str] = mapped_column(String(80), default="")
    lng: Mapped[str] = mapped_column(String(80), default="")
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    category: Mapped[str] = mapped_column(String(500), default="")
    lead_score: Mapped[int] = mapped_column(Integer, default=0, index=True)
    priority: Mapped[str] = mapped_column(String(20), default="C", index=True)
    status: Mapped[str] = mapped_column(String(80), default="New", index=True)
    notes: Mapped[str] = mapped_column(Text, default="")
    first_seen_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class LeadObservation(Base):
    __tablename__ = "lead_observations"
    id: Mapped[int] = mapped_column(primary_key=True)
    entity_id: Mapped[int] = mapped_column(ForeignKey("lead_entities.id"))
    campaign_id: Mapped[int | None] = mapped_column(ForeignKey("campaigns.id"), nullable=True)
    source: Mapped[str] = mapped_column(String(120), default="csv_import")
    source_query: Mapped[str] = mapped_column(String(500), default="")
    raw_name: Mapped[str] = mapped_column(String(500), default="")
    raw_json: Mapped[str] = mapped_column(Text, default="")
    observed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[int] = mapped_column(primary_key=True)
    level: Mapped[str] = mapped_column(String(30), default="info")
    stage: Mapped[str] = mapped_column(String(120), default="system")
    message: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

class ExportFile(Base):
    __tablename__ = "exports"
    id: Mapped[int] = mapped_column(primary_key=True)
    file_name: Mapped[str] = mapped_column(String(500))
    lead_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
