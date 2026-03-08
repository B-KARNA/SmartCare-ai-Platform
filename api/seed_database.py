# ============================================================
# Seed Script — Populate the MedVault database with sample data
# ============================================================
# Run with:  python seed_database.py

from database import engine, SessionLocal, init_db
from models import Base, User, HealthHistory, MedicalReport, Medication, ChatInteraction, encrypt_pii
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def seed():
    # 1. Create all tables
    init_db()
    db = SessionLocal()

    # ── Clear existing data ──
    db.query(ChatInteraction).delete()
    db.query(Medication).delete()
    db.query(MedicalReport).delete()
    db.query(HealthHistory).delete()
    db.query(User).delete()
    db.commit()

    # ═══════════════════════════════════════════
    # 2. Seed Users
    # ═══════════════════════════════════════════
    users_data = [
        {"email": "jane.doe@medvault.io", "password": "securePass123", "name": "Jane Doe", "phone": "+1-555-0101", "blood": "O+"},
        {"email": "raj.kumar@medvault.io", "password": "securePass456", "name": "Raj Kumar", "phone": "+91-98765-43210", "blood": "B+"},
        {"email": "maria.garcia@medvault.io", "password": "securePass789", "name": "Maria Garcia", "phone": "+1-555-0303", "blood": "A-"},
    ]

    users = []
    for u in users_data:
        user = User(
            email=u["email"],
            hashed_password=hash_password(u["password"]),
            encrypted_name=encrypt_pii(u["name"]),
            encrypted_phone=encrypt_pii(u["phone"]),
            encrypted_blood_group=u["blood"]
        )
        db.add(user)
        users.append(user)

    db.commit()
    for u in users:
        db.refresh(u)

    jane, raj, maria = users

    # ═══════════════════════════════════════════
    # 3. Seed Health History
    # ═══════════════════════════════════════════
    histories = [
        HealthHistory(user_id=jane.id, condition="Type 2 Diabetes",    diagnosed_date=datetime(2019, 3, 15), notes="Managed with Metformin. HbA1c at 6.8%."),
        HealthHistory(user_id=jane.id, condition="Hypertension",       diagnosed_date=datetime(2020, 7, 1),  notes="Stage 1. On Lisinopril 10mg."),
        HealthHistory(user_id=raj.id,  condition="Asthma",             diagnosed_date=datetime(2015, 1, 10), notes="Mild intermittent. Uses albuterol inhaler PRN."),
        HealthHistory(user_id=raj.id,  condition="Seasonal Allergies", diagnosed_date=datetime(2018, 5, 20), notes="Spring pollen. Manages with cetirizine."),
        HealthHistory(user_id=maria.id,condition="Migraine",           diagnosed_date=datetime(2021, 11, 8), notes="Chronic migraine with aura. On Sumatriptan."),
    ]
    db.add_all(histories)
    db.commit()

    # ═══════════════════════════════════════════
    # 4. Seed Medical Reports
    # ═══════════════════════════════════════════
    reports = [
        MedicalReport(user_id=jane.id, report_type="lab",     title="Complete Blood Count (CBC)",         file_url="/uploads/jane_cbc_2024.pdf"),
        MedicalReport(user_id=jane.id, report_type="lab",     title="HbA1c Panel",                       file_url="/uploads/jane_hba1c_2024.pdf"),
        MedicalReport(user_id=raj.id,  report_type="imaging", title="Chest X-Ray",                       file_url="/uploads/raj_xray_2024.pdf"),
        MedicalReport(user_id=maria.id,report_type="lab",     title="Thyroid Panel (TSH, T3, T4)",       file_url="/uploads/maria_thyroid_2024.pdf"),
    ]
    db.add_all(reports)
    db.commit()

    # ═══════════════════════════════════════════
    # 5. Seed Medications
    # ═══════════════════════════════════════════
    meds = [
        Medication(user_id=jane.id, name="Metformin",    dosage="500mg", frequency="Twice daily",     is_active=1),
        Medication(user_id=jane.id, name="Lisinopril",   dosage="10mg",  frequency="Once daily",      is_active=1),
        Medication(user_id=raj.id,  name="Albuterol",    dosage="90mcg", frequency="As needed (PRN)", is_active=1),
        Medication(user_id=raj.id,  name="Cetirizine",   dosage="10mg",  frequency="Once daily",      is_active=0),
        Medication(user_id=maria.id,name="Sumatriptan",  dosage="50mg",  frequency="As needed",       is_active=1),
        Medication(user_id=maria.id,name="Ibuprofen",    dosage="400mg", frequency="Every 6 hours",   is_active=1),
    ]
    db.add_all(meds)
    db.commit()

    # ═══════════════════════════════════════════
    # 6. Seed Chat Interactions (User Memory)
    # ═══════════════════════════════════════════
    now = datetime.utcnow()
    chats = [
        ChatInteraction(user_id=jane.id, agent_name="Symptom Agent",
                        user_input="I've been having headaches and blurred vision lately.",
                        agent_response="[ROUTED: SYMPTOMS] Given your history of Hypertension, blurred vision can be a concern. Please monitor your blood pressure and consult your doctor.",
                        timestamp=now - timedelta(days=2)),
        ChatInteraction(user_id=jane.id, agent_name="Report Agent",
                        user_input="Can you analyze my latest CBC report?",
                        agent_response="[ROUTED: REPORT EXTRACTED]\n• Hemoglobin: 12.8 g/dL is **LOW** (Normal: 13.0-17.0).\n• Platelets: 250000 mcL is **NORMAL**.",
                        timestamp=now - timedelta(days=1)),
        ChatInteraction(user_id=jane.id, agent_name="Mental Health Agent",
                        user_input="I've been feeling really overwhelmed and stressed about my diagnosis.",
                        agent_response="[ROUTED: MENTAL HEALTH]\nI hear you. Managing a chronic condition can feel overwhelming. Would you like to try the Mood Tracker?",
                        timestamp=now - timedelta(hours=6)),
        ChatInteraction(user_id=raj.id, agent_name="Symptom Agent",
                        user_input="I have a persistent cough and slight chest tightness.",
                        agent_response="[ROUTED: SYMPTOMS] Given your asthma history, please use your rescue inhaler. If tightness persists beyond 15 minutes, press SOS.",
                        timestamp=now - timedelta(hours=12)),
        ChatInteraction(user_id=maria.id, agent_name="Preventive AI Agent",
                        user_input="What is my cardiovascular risk?",
                        agent_response="[ROUTED: RISK_PREDICTION] Based on your vitals and history, your Cardiovascular Risk is: Low.",
                        timestamp=now - timedelta(hours=3)),
    ]
    db.add_all(chats)
    db.commit()

    db.close()
    print("═" * 50)
    print("✅ MedVault Database seeded successfully!")
    print(f"   → 3 Users created")
    print(f"   → 5 Health History records")
    print(f"   → 4 Medical Reports")
    print(f"   → 6 Medications")
    print(f"   → 5 Chat Interactions (User Memory)")
    print("═" * 50)


if __name__ == "__main__":
    seed()
