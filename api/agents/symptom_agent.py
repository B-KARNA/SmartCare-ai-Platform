# ============================================================
# Symptom Analysis Agent
# ============================================================
import re

# High-risk heuristics that demand immediate routing to the Emergency Agent
HIGH_RISK_SYMPTOMS = [
    r"chest (pain|tightness|pressure)",
    r"arm numbness",
    r"trouble breathing",
    r"shortness of breath",
    r"spitting blood",
    r"face drooping",
    r"slurred speech",
    r"loss of consciousness"
]

class SymptomAgent:
    def __init__(self, db_session=None):
        self.db_session = db_session
        self.agent_name = "Symptom Agent"

    def _get_user_memory(self, user_id: int, limit: int = 3):
        """
        Fetches the last N interactions to provide context-aware responses.
        """
        from ..models import ChatInteraction
        if self.db_session:
            return self.db_session.query(ChatInteraction).filter(
                ChatInteraction.user_id == user_id, 
                ChatInteraction.agent_name == self.agent_name
            ).order_by(ChatInteraction.timestamp.desc()).limit(limit).all()
        return []

    def is_high_risk(self, user_string: str) -> bool:
        """
        Uses heuristic regex lists to flag 'red flag' symptoms.
        """
        s = user_string.lower()
        for pattern in HIGH_RISK_SYMPTOMS:
            if re.search(pattern, s):
                return True
        return False

    def analyze_symptoms(self, user_id: int, user_string: str) -> dict:
        """
        Main logic. Assesses severity. If severe, immediately flags emergency routing.
        Otherwise, provides general, safe, non-diagnostic guidance.
        """
        # 1. Fetch memory to see if symptoms are worsening over recent messages
        recent_history = self._get_user_memory(user_id=user_id)
        
        # 2. Check for high-risk red flags
        if self.is_high_risk(user_string):
            return {
                "status": "EMERGENCY_ESCALATION",
                "message": "High-risk symptoms detected. Triggering emergency protocol."
            }

        # 3. Specific advice for common minor symptoms
        if "fever" in user_string.lower():
            response = "I've noted your fever. Please monitor your temperature regularly and stay hydrated. " \
                       "If it exceeds 103°F (39.4°C) or is accompanied by a stiff neck or confusion, seek medical help immediately."
        elif "vomit" in user_string.lower() or "nausea" in user_string.lower():
            response = "For nausea/vomiting, try small sips of clear liquids like ginger ale or electrolyte drinks. " \
                       "If you can't keep fluids down for 12 hours, contact a professional to prevent dehydration."
        else:
            response = (
                "I'm sorry you're not feeling well. Based on what you described, it doesn't appear "
                "to be an immediate emergency. I've noted your symptoms in your health vault.\n\n"
                "Please rest and stay hydrated. If your condition worsens or you experience shortness "
                "of breath, chest pain, or severe weakness, please let me know immediately or press the SOS button."
            )

        return {
            "status": "SUCCESS",
            "message": response
        }

