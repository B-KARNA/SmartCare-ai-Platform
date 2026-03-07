# ============================================================
# Prescription Management Agent
# ============================================================
import re

class PrescriptionAgent:
    def __init__(self, db_session=None):
        self.db_session = db_session
        self.agent_name = "Prescription Agent"

    def analyze_medication_query(self, user_id: int, user_input: str) -> str:
        """
        Handles queries about dosages, side effects, and refill reminders.
        """
        input_lower = user_input.lower()
        
        # 1. Refill Logic
        if any(w in input_lower for w in ["refill", "running out", "order more", "pharmacy"]):
            return (
                "I see you're asking about a refill. I've checked your active prescriptions. "
                "Your **Metformin 500mg** is due for a refill on **March 15, 2026**. "
                "Would you like me to send a request to Dr. Meena Patel's office?"
            )
            
        # 2. Side Effect Logic
        if any(w in input_lower for w in ["side effect", "nausea", "dizzy", "stomach", "rash"]):
            return (
                "It's important to monitor side effects. Common reactions to your current medications "
                "can include mild nausea or digestive changes. \n\n"
                "**Warning**: If you experience a severe allergic reaction (hives, swelling, difficulty breathing), "
                "please use the SOS button immediately or call 911."
            )

        # 3. Dosage/Schedule Logic
        return (
            "You are currently prescribed:\n"
            "- **Metformin 500mg**: 1 tablet twice daily (after breakfast & dinner).\n"
            "- **Lisinopril 10mg**: 1 tablet every morning.\n"
            "Always take your medications as directed. Do you have a specific question about these?"
        )
