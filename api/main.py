# ============================================================
# FastAPI Backend & Master Router Agent (Connected to SQLite)
# ============================================================

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
import re, json
from datetime import datetime, timedelta

# Local imports
from database import get_db, init_db
from models import User, HealthHistory, MedicalReport, Medication, ChatInteraction
from auth import create_access_token, get_current_user, get_optional_user

app = FastAPI(title="Aegis Health API", version="3.0.0")

# CORS setup for the Vite frontend (Permissive for Vercel/Production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize the database on startup
@app.on_event("startup")
def on_startup():
    init_db()

# ---------------------------------------------------------
# 1. Pydantic Schemas
# ---------------------------------------------------------
class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    phone: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_relationship: Optional[str] = None
    accessibility_needs: Optional[dict] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    blood_group: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[int] = 1
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    intent: str
    agent_assigned: str
    response: str

class HealthHistoryOut(BaseModel):
    id: int
    condition: str
    diagnosed_date: Optional[str] = None
    notes: Optional[str] = None

class MedicationOut(BaseModel):
    id: int
    name: str
    dosage: str
    frequency: str
    is_active: int

class ReportOut(BaseModel):
    id: int
    report_type: str
    title: str
    file_url: str

class ChatHistoryOut(BaseModel):
    id: int
    agent_name: str
    user_input: str
    agent_response: str
    timestamp: Optional[str] = None

# ---------------------------------------------------------
# 2. Authentication with Real JWT
# ---------------------------------------------------------
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.post("/api/auth/register", response_model=Token)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        existing = db.query(User).filter(User.email == user.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        from models import encrypt_pii
        new_user = User(
            email=user.email,
            hashed_password=pwd_context.hash(user.password),
            encrypted_name=encrypt_pii(user.name),
            encrypted_phone=encrypt_pii(user.phone or ""),
            accessibility_mode=json.dumps(user.accessibility_needs) if user.accessibility_needs else None,
            emergency_contact_name=user.emergency_contact_name,
            emergency_contact_phone=user.emergency_contact_phone,
            emergency_relationship=user.emergency_relationship,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Generate real JWT
        token = create_access_token(data={"user_id": new_user.id, "email": new_user.email})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {"id": new_user.id, "email": new_user.email, "name": user.name}
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/auth/login", response_model=Token)
async def login(creds: LoginRequest, db: Session = Depends(get_db)):
    try:
        db_user = db.query(User).filter(User.email == creds.email).first()
        if not db_user or not pwd_context.verify(creds.password, db_user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
    
        token = create_access_token(data={"user_id": db_user.id, "email": db_user.email})
        name = db_user.get_name() if db_user.encrypted_name else "User"
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {"id": db_user.id, "email": db_user.email, "name": name}
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Database or Server Error: {str(e)}")


@app.get("/api/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Return current authenticated user info."""
    name = current_user.get_name() if current_user.encrypted_name else "User"
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": name,
        "accessibility_mode": json.loads(current_user.accessibility_mode) if current_user.accessibility_mode else None,
    }

# ---------------------------------------------------------
# 3. Demo & Feature Detail Endpoints
# ---------------------------------------------------------

@app.get("/api/demo-info")
async def get_demo_info():
    """Returns the guided tour content for the 'Watch AI Demo' button."""
    return {
        "title": "Aegis Health — AI Agent Ecosystem Tour",
        "steps": [
            {
                "step": 1,
                "agent": "Symptom Agent",
                "icon": "HeartPulse",
                "title": "You Report a Symptom",
                "description": "You tell Aegis: 'I've had a persistent headache for 3 days with blurry vision.' The Symptom Agent uses NLP to parse severity, duration, and associated symptoms.",
                "action": "Classifies urgency as MODERATE and flags 'blurry vision' as a co-symptom requiring cross-analysis."
            },
            {
                "step": 2,
                "agent": "Report Agent",
                "icon": "FileText",
                "title": "Cross-Referencing Your Records",
                "description": "The Report Agent automatically scans your uploaded lab reports using OCR. It finds your recent blood pressure reading was 150/95 mmHg — flagged as Stage 1 Hypertension.",
                "action": "Correlates headache + blurry vision + high BP into a unified risk profile."
            },
            {
                "step": 3,
                "agent": "Risk Agent",
                "icon": "AlertTriangle",
                "title": "Proactive Risk Assessment",
                "description": "The Risk Agent calculates your cardiovascular risk score based on the correlated data. It determines elevated stroke risk given the symptom pattern.",
                "action": "Generates a risk alert and escalates priority to HIGH. Recommends immediate consultation."
            },
            {
                "step": 4,
                "agent": "Prescription Agent",
                "icon": "Cpu",
                "title": "Medication Review",
                "description": "The Prescription Agent checks if your current medications could be causing the headache as a side effect. It cross-references drug interactions.",
                "action": "Flags that your current BP medication may need dose adjustment. Prepares a summary for your doctor."
            },
            {
                "step": 5,
                "agent": "Emergency Agent",
                "icon": "PhoneCall",
                "title": "Safety Net Activated",
                "description": "Because the Risk Agent flagged HIGH priority, the Emergency Agent enters standby mode. If your vitals worsen or you don't respond within 2 hours, it auto-alerts your emergency contact.",
                "action": "Sends a gentle notification: 'We recommend seeing a doctor today. Your emergency contact has been placed on soft-alert.'"
            }
        ]
    }


FEATURE_DETAILS = {
    "multi-agent": {
        "id": "multi-agent",
        "title": "Autonomous Multi-Agent Logic",
        "how_it_works": "Each AI agent operates on a specialized domain (symptoms, reports, prescriptions, risk, emergency) but shares a unified context bus. When one agent detects an anomaly, it broadcasts a signal that other agents can subscribe to. For example, the Report Agent detecting high glucose triggers the Nutrition Agent to recalculate meal plans — all without user intervention.",
        "data_privacy": "All inter-agent communication happens server-side within your encrypted session. No raw health data is ever exposed to third parties. Agent decisions are logged for full transparency and audit trails.",
        "accessibility": "Voice Mode: All agent interactions can be spoken aloud. Icon Mode: Each agent response includes a visual icon-based summary for non-verbal users.",
        "tech_stack": "Python FastAPI microservices, SQLAlchemy ORM, rule-based NLP intent classifier, encrypted SQLite vault."
    },
    "accessibility": {
        "id": "accessibility",
        "title": "Universal Accessibility",
        "how_it_works": "Three specialized modes adapt the entire UI: (1) Visual Impairment Mode activates full screen-reader support, high-contrast colors, and voice navigation. (2) Deaf Mode replaces all audio cues with visual pulses, screen flashes, and haptic vibrations. (3) Speech Impairment Mode enables icon-grid communication where users tap symbols instead of typing.",
        "data_privacy": "Accessibility preferences are stored locally on-device and synced only with explicit consent. No accessibility data is used for analytics or profiling.",
        "accessibility": "Built with WCAG 2.1 AA compliance. All interactive elements have ARIA labels. Tab navigation is fully supported. Font sizes are dynamically adjustable.",
        "tech_stack": "React Context API for mode switching, CSS custom properties for theme overrides, Web Speech API for voice navigation."
    },
    "fall-detection": {
        "id": "fall-detection",
        "title": "Proactive Fall & Emergency Detection",
        "how_it_works": "Device accelerometer data is processed through a lightweight ML model that distinguishes between normal movement (walking, sitting down) and impact patterns consistent with falls. A 15-second confirmation window prevents false positives — if the user doesn't respond, the system escalates: first to the Emergency Agent, then to the user's emergency contacts, and finally to local emergency services.",
        "data_privacy": "Accelerometer data is processed entirely on-device. Only the fall-detected event (timestamp + severity) is sent to the backend. Raw motion data never leaves the phone.",
        "accessibility": "Fall detection works across all accessibility modes. In Deaf Mode, detection triggers maximum-intensity haptic alerts. In Voice Mode, a loud audio alarm plays with verbal instructions.",
        "tech_stack": "Device Accelerometer API, TensorFlow Lite on-device inference, WebSocket for real-time alert propagation."
    },
    "mental-health": {
        "id": "mental-health",
        "title": "Mental Health AI",
        "how_it_works": "The Mental Health Agent uses sentiment analysis and emotional pattern recognition to track mood over time. It provides guided breathing exercises, CBT-based coping prompts, and journaling suggestions. If it detects crisis-level distress (keywords, patterns, or sudden mood drops), it gently recommends professional resources and can soft-alert emergency contacts with user consent.",
        "data_privacy": "Mental health conversations are given the highest encryption tier. They are NEVER used for ad targeting, analytics, or shared with insurance providers. Users can permanently delete their mental health data at any time.",
        "accessibility": "Voice journaling for visually impaired users. Emoji-based mood tracking for speech-impaired users. Simplified UI with calming color palette.",
        "tech_stack": "NLP sentiment analysis, mood trend visualization with Chart.js, secure journaling with AES-256 at-rest encryption."
    },
    "wearable": {
        "id": "wearable",
        "title": "Wearable Integration",
        "how_it_works": "Aegis connects to smartwatches and fitness trackers to pull real-time vitals: heart rate, SpO2, step count, sleep quality, and skin temperature. This data feeds into the Health Score algorithm and enables the Risk Agent to detect anomalies (e.g., resting heart rate sudden spike) proactively.",
        "data_privacy": "Wearable data is synced via encrypted Bluetooth LE connections. Historical data is stored in the Health Vault with the same AES-256 encryption as all other health records.",
        "accessibility": "Wearable alerts are delivered through the user's preferred accessibility mode (voice, visual, or haptic).",
        "tech_stack": "Web Bluetooth API, HealthKit/Google Fit bridge, real-time WebSocket data streaming, Chart.js visualizations."
    },
    "multi-language": {
        "id": "multi-language",
        "title": "Multi-Language Support",
        "how_it_works": "Aegis supports 12 languages with real-time translation of both UI elements and AI agent responses. Medical terminology is handled by a specialized medical lexicon that ensures accurate translations of symptoms, conditions, and medications across languages.",
        "data_privacy": "Translation is performed server-side using our own models — no third-party translation APIs touch your health data.",
        "accessibility": "RTL (right-to-left) layout support for Arabic, Hebrew, and Urdu. Font scaling adapts per language for optimal readability.",
        "tech_stack": "React i18n framework, custom medical NLP translation layer, dynamic font loading per locale."
    }
}

@app.get("/api/features/details/{feature_id}")
async def get_feature_details(feature_id: str):
    """Returns expanded technical details for a feature card's 'Learn More' button."""
    feature = FEATURE_DETAILS.get(feature_id)
    if not feature:
        raise HTTPException(status_code=404, detail=f"Feature '{feature_id}' not found")
    return feature

# ---------------------------------------------------------
# 4. Protected Dashboard Endpoint
# ---------------------------------------------------------

@app.get("/api/dashboard")
async def get_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """JWT-protected endpoint returning user's health summary."""
    user_id = current_user.id
    name = current_user.get_name() if current_user.encrypted_name else "User"

    # Get summary data
    conditions = db.query(HealthHistory).filter(HealthHistory.user_id == user_id).count()
    active_meds = db.query(Medication).filter(Medication.user_id == user_id, Medication.is_active == 1).count()
    reports = db.query(MedicalReport).filter(MedicalReport.user_id == user_id).count()
    recent_chats = db.query(ChatInteraction).filter(
        ChatInteraction.user_id == user_id
    ).order_by(ChatInteraction.timestamp.desc()).limit(5).all()

    return {
        "user": {
            "id": user_id,
            "name": name,
            "email": current_user.email,
            "accessibility_mode": json.loads(current_user.accessibility_mode) if current_user.accessibility_mode else None,
        },
        "health_score": 92,
        "summary": {
            "conditions": conditions,
            "active_medications": active_meds,
            "reports_uploaded": reports,
        },
        "vitals": {
            "heart_rate": {"value": 72, "unit": "bpm", "status": "normal"},
            "blood_pressure": {"value": "118/76", "unit": "mmHg", "status": "normal"},
            "spo2": {"value": 98, "unit": "%", "status": "normal"},
            "temperature": {"value": 36.6, "unit": "°C", "status": "normal"},
        },
        "recent_interactions": [
            {
                "agent": c.agent_name,
                "message": c.user_input[:80],
                "timestamp": str(c.timestamp) if c.timestamp else None
            }
            for c in recent_chats
        ]
    }

# ---------------------------------------------------------
# 5. User Data Endpoints
# ---------------------------------------------------------
@app.get("/api/users", response_model=List[UserOut])
async def list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": u.id, "email": u.email, "blood_group": u.encrypted_blood_group} for u in users]

@app.get("/api/users/{user_id}/health-history", response_model=List[HealthHistoryOut])
async def get_health_history(user_id: int, db: Session = Depends(get_db)):
    records = db.query(HealthHistory).filter(HealthHistory.user_id == user_id).all()
    return [{"id": r.id, "condition": r.condition, "diagnosed_date": str(r.diagnosed_date) if r.diagnosed_date else None, "notes": r.notes} for r in records]

@app.get("/api/users/{user_id}/medications", response_model=List[MedicationOut])
async def get_medications(user_id: int, db: Session = Depends(get_db)):
    meds = db.query(Medication).filter(Medication.user_id == user_id).all()
    return [{"id": m.id, "name": m.name, "dosage": m.dosage, "frequency": m.frequency, "is_active": m.is_active} for m in meds]

@app.get("/api/users/{user_id}/reports", response_model=List[ReportOut])
async def get_reports(user_id: int, db: Session = Depends(get_db)):
    reports = db.query(MedicalReport).filter(MedicalReport.user_id == user_id).all()
    return [{"id": r.id, "report_type": r.report_type, "title": r.title, "file_url": r.file_url} for r in reports]

@app.get("/api/users/{user_id}/chat-history", response_model=List[ChatHistoryOut])
async def get_chat_history(user_id: int, db: Session = Depends(get_db)):
    chats = db.query(ChatInteraction).filter(ChatInteraction.user_id == user_id).order_by(ChatInteraction.timestamp.desc()).limit(10).all()
    return [{"id": c.id, "agent_name": c.agent_name, "user_input": c.user_input, "agent_response": c.agent_response, "timestamp": str(c.timestamp) if c.timestamp else None} for c in chats]

# ---------------------------------------------------------
# 6. Multi-Agent Master Router Logic
# ---------------------------------------------------------
from agents.report_agent import ReportAgent
from agents.symptom_agent import SymptomAgent
from agents.mental_health_agent import MentalHealthAgent
from agents.prescription_agent import PrescriptionAgent
from agents.wellness_agent import WellnessAgent
from agents.risk_agent import RiskAgent

INTENT_MAP = {
    "emergency": {"agent": "Emergency Coordinator", "keywords": [r"heart attack", r"bleeding", r"chest pain", r"sos", r"unconscious", r"choking", r"stroke", r"help me", r"emergency"]},
    "risk_assessment": {"agent": "Risk Agent", "keywords": [r"risk", r"heart", r"stroke", r"chance", r"probability", r"predict", r"assessment"]},
    "symptom_analysis": {"agent": "Symptom Agent", "keywords": [r"pain", r"hurt", r"fever", r"nausea", r"vomit", r"ache", r"rash", r"dizzy", r"cough", r"cold", r"headache", r"fatigue", r"swelling", r"sore", r"cramp", r"bleeding"]},
    "prescription_help": {"agent": "Prescription Agent", "keywords": [r"pill", r"medication", r"dose", r"side effect", r"refill", r"tablet", r"prescription", r"medicine", r"drug", r"capsule"]},
    "report_extraction": {"agent": "Report Agent", "keywords": [r"report", r"upload", r"analysis", r"scan", r"mri", r"blood test", r"cbc", r"report says", r"lab result", r"x-ray", r"ct scan", r"ultrasound", r"biopsy", r"hemoglobin", r"glucose", r"cholesterol", r"sugar", r"platelets"]},
    "wellness": {"agent": "Wellness Agent", "keywords": [r"risk", r"chance", r"prevent", r"cardio", r"healthy", r"diet", r"fitness", r"nutrition", r"weight", r"sleep", r"lifestyle", r"yoga", r"meditation"]},
    "mental_health": {"agent": "Mental Health Agent", "keywords": [r"sad", r"depressed", r"anxious", r"stress", r"cry", r"overwhelmed", r"feel bad", r"lonely", r"hopeless", r"miserable"]},
}

# ---------------------------------------------------------
# 5. User Data & File Upload Endpoints
# ---------------------------------------------------------
from fastapi import UploadFile, File
import shutil
import os

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.post("/api/reports/upload")
async def upload_report(
    file: UploadFile = File(...), 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        user_id = current_user.id
        file_path = f"{UPLOAD_DIR}/{user_id}_{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Determine report type based on extension
        ext = file.filename.split('.')[-1].lower()
        report_type = "image" if ext in ['jpg', 'jpeg', 'png'] else "document" if ext == "pdf" else "other"

        new_report = MedicalReport(
            user_id=user_id,
            report_type=report_type,
            title=file.filename,
            file_url=f"/api/reports/download/{user_id}_{file.filename}"
        )
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        
        # --- PHASE 4: Automated Report Analysis Pipeline ---
        # 1. Report Extraction 
        report_agent = ReportAgent(db_session=db)
        report_analysis = report_agent.analyze_report(user_id, file.filename.encode())
        
        # 2. Diet & Wellness 
        wellness_agent = WellnessAgent(db_session=db)
        diet_advice = wellness_agent.provide_guidance(user_id, "diet nutrition based on my new report")
        
        # 3. Prescription Review
        rx_agent = PrescriptionAgent(db_session=db)
        rx_advice = rx_agent.analyze_medication_query(user_id, "side effect or prescription updates")
        
        # 4. Synthesize 
        synthesized_response = (
            "### 🔬 Automated Report Analysis\n"
            "I have safely vaulted your new report and automatically analyzed it across multiple domains.\n\n"
            f"**1. Lab Results**\n{report_analysis}\n\n"
            f"**2. Nutrition & Wellness**\n{diet_advice}\n\n"
            f"**3. Medication Review**\n{rx_advice}"
        )
        
        # 5. Save to ChatInteraction
        interaction = ChatInteraction(
            user_id=user_id,
            agent_name="Aegis Master AI",
            user_input=f"[SYSTEM: Uploaded {file.filename}]",
            agent_response=synthesized_response
        )
        db.add(interaction)
        db.commit()

        return {"message": "Report uploaded and analyzed successfully", "report_id": new_report.id}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reports/download/{filename}")
async def download_report(filename: str):
    from fastapi.responses import FileResponse
    file_path = f"{UPLOAD_DIR}/{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="File not found")

def classify_intent(message: str) -> str:
    msg_lower = message.lower()

    for pattern in INTENT_MAP["emergency"]["keywords"]:
        if re.search(pattern, msg_lower):
            return "emergency"

    scores = {intent: 0 for intent in INTENT_MAP}
    for intent, data in INTENT_MAP.items():
        if intent == "emergency": continue
        for pattern in data["keywords"]:
            if re.search(pattern, msg_lower):
                scores[intent] += 1

    best_intent = max(scores, key=scores.get)
    if scores[best_intent] > 0:
        return best_intent

    return "wellness"


@app.post("/api/chat/route", response_model=ChatResponse)
async def master_router(request: ChatRequest, current_user: Optional[User] = Depends(get_optional_user), db: Session = Depends(get_db)):
    user_id = current_user.id if current_user else 0 # 0 for Guest
    intent = classify_intent(request.message)
    agent_name = "Wellness Agent"
    response_text = ""

    # 1. Routing logic
    if intent == "emergency":
        agent_name = INTENT_MAP["emergency"]["agent"]
        e_contact = current_user.emergency_contact_name if current_user and current_user.emergency_contact_name else "local dispatch"
        response_text = f"🚨 **[ROUTED: EMERGENCY]**\nI have activated the emergency protocol. " \
                        f"Alerting your emergency contact (**{e_contact}**) and broadcasting your last known vitals and location. " \
                        "Please stay on the line or press the SOS button to speak with a dispatcher."

    elif intent == "risk_assessment":
        agent_name = INTENT_MAP["risk_assessment"]["agent"]
        risk_agent = RiskAgent(db_session=db)
        response_text = risk_agent.analyze_preventive_risk(user_id, request.message)
        response_text = f"**[ROUTED: RISK AGENT]**\n{response_text}"

    elif intent == "mental_health":
        agent_name = INTENT_MAP["mental_health"]["agent"]
        mh_agent = MentalHealthAgent(db_session=db)
        response_text = mh_agent.analyze_emotional_state(user_id, request.message)
        response_text = f"[ROUTED: MENTAL HEALTH]\n{response_text}"

    elif intent == "symptom_analysis":
        agent_name = INTENT_MAP["symptom_analysis"]["agent"]
        symptom_agent = SymptomAgent(db_session=db)
        result = symptom_agent.analyze_symptoms(user_id, request.message)
        
        if result["status"] == "EMERGENCY_ESCALATION":
            agent_name = "Emergency Coordinator"
            response_text = f"**[ESCALATION: EMERGENCY]**\n{result['message']}"
        else:
            response_text = f"**[ROUTED: {agent_name.upper()}]**\n{result['message']}"

    elif intent == "report_extraction":
        agent_name = INTENT_MAP["report_extraction"]["agent"]
        report_agent = ReportAgent(db_session=db)
        
        latest_report = db.query(MedicalReport).filter(MedicalReport.user_id == user_id).order_by(MedicalReport.uploaded_at.desc()).first()
        if latest_report:
            analysis = report_agent.analyze_report(user_id, latest_report.title.encode('utf-8'))
            response_text = f"**[ROUTED: REPORT ANALYZED - {latest_report.title}]**\n{analysis}"
        else:
            response_text = "**[ROUTED: REPORT ANALYZED]**\nI couldn't find any recent reports in your vault. Please upload one first."

    elif intent == "prescription_help":
        agent_name = INTENT_MAP["prescription_help"]["agent"]
        rx_agent = PrescriptionAgent(db_session=db)
        response_text = rx_agent.analyze_medication_query(user_id, request.message)
        response_text = f"[ROUTED: PRESCRIPTIONS]\n{response_text}"

    elif intent == "wellness":
        agent_name = INTENT_MAP["wellness"]["agent"]
        w_agent = WellnessAgent(db_session=db)
        response_text = w_agent.provide_guidance(user_id, request.message)
        response_text = f"[ROUTED: WELLNESS]\n{response_text}"

    else:
        # Fallback
        agent_name = INTENT_MAP.get(intent, {}).get("agent", "Aegis Assistant")
        response_text = f"[ROUTED: {intent.upper()}] I am processing your health data now."

    # 2. Save interaction to User Memory (Only for logged in users)
    if current_user:
        interaction = ChatInteraction(
            user_id=user_id,
            agent_name=agent_name,
            user_input=request.message,
            agent_response=response_text
        )
        db.add(interaction)
        db.commit()

    return {
        "intent": intent,
        "agent_assigned": agent_name,
        "response": response_text
    }

# ---------------------------------------------------------
# 7. Health Check
# ---------------------------------------------------------
@app.get("/api/health")
async def health_check(db: Session = Depends(get_db)):
    user_count = db.query(User).count()
    chat_count = db.query(ChatInteraction).count()
    return {
        "status": "healthy",
        "database": "connected",
        "users": user_count,
        "chat_interactions": chat_count
    }

# ---------------------------------------------------------
# Run with: uvicorn main:app --reload
# ---------------------------------------------------------
