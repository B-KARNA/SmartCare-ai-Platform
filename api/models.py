# ============================================================
# Backend Database Models & Encryption Layer
# ============================================================

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import declarative_base, relationship
from cryptography.fernet import Fernet
import os

Base = declarative_base()

# ---------------------------------------------------------
# Health Vault Encryption Layer
# ---------------------------------------------------------
# In production, this key must be securely provided via env vars 
# and NEVER hardcoded. For dev, we use a stable key to avoid decryption errors on reload.
DEV_KEY = "ElDagpPSM0RpeEG0n4BuEnHErFbnSX5mlzeI11gIr9I="
ENCRYPTION_KEY = os.getenv("VAULT_ENCRYPTION_KEY", DEV_KEY)
fernet = Fernet(ENCRYPTION_KEY.encode("utf-8"))

def encrypt_pii(data: str) -> str:
    if not data:
        return data
    return fernet.encrypt(data.encode('utf-8')).decode('utf-8')

def decrypt_pii(token: str) -> str:
    if not token:
        return token
    return fernet.decrypt(token.encode('utf-8')).decode('utf-8')

# ---------------------------------------------------------
# Database Schema
# ---------------------------------------------------------

class User(Base):
    """
    Core User Profile. PII data like real names, phone numbers, and addresses 
    are encrypted at rest using the Health Vault layer.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # Encrypted fields
    encrypted_name = Column(Text, nullable=True)
    encrypted_phone = Column(Text, nullable=True)
    encrypted_blood_group = Column(String, nullable=True)
    
    # Accessibility & Emergency
    accessibility_mode = Column(String, nullable=True)  # JSON string of accessibility toggles
    emergency_contact_name = Column(String, nullable=True)
    emergency_contact_phone = Column(String, nullable=True)
    emergency_relationship = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    history = relationship("HealthHistory", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("MedicalReport", back_populates="user", cascade="all, delete-orphan")
    medications = relationship("Medication", back_populates="user", cascade="all, delete-orphan")
    
    # Helper methods for encryption
    def set_name(self, raw_name: str):
        self.encrypted_name = encrypt_pii(raw_name)

    def get_name(self) -> str:
        return decrypt_pii(self.encrypted_name)


class HealthHistory(Base):
    """
    Stores past conditions, surgeries, and diagnoses.
    """
    __tablename__ = "health_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    condition = Column(String, nullable=False)
    diagnosed_date = Column(DateTime)
    notes = Column(Text)
    
    user = relationship("User", back_populates="history")


class MedicalReport(Base):
    """
    Metadata for uploaded lab reports (e.g. CBC, X-Ray)
    """
    __tablename__ = "medical_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    report_type = Column(String, nullable=False) # e.g., 'lab', 'imaging'
    title = Column(String, nullable=False)
    file_url = Column(String, nullable=False) # S3/GCS bucket URI
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="reports")


class Medication(Base):
    """
    Active and past prescriptions.
    """
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    name = Column(String, nullable=False)
    dosage = Column(String, nullable=False)
    frequency = Column(String, nullable=False)
    is_active = Column(Integer, default=1) # 1=Active, 0=Past
    
    user = relationship("User", back_populates="medications")


class ChatInteraction(Base):
    """
    Stores the history of interactions between the user and the Multi-Agent system 
    to provide context-aware 'User Memory' for the AI.
    """
    __tablename__ = "chat_interactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    agent_name = Column(String, nullable=False) # e.g., 'Symptom Agent', 'Wellness Counselor'
    user_input = Column(Text, nullable=False)
    agent_response = Column(Text, nullable=False)
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Note: user relationship goes here assuming you append it to User model later
