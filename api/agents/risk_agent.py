# ============================================================
# Risk Analysis Agent (Proactive Health Guard)
# ============================================================
import re

class RiskAgent:
    def __init__(self, db_session=None):
        self.db_session = db_session
        self.agent_name = "Risk Agent"

    def calculate_cardio_risk(self, age: int, bp: str, glucose: float) -> str:
        """
        Rudimentary risk calculator based on vitals.
        Returns a formatted risk assessment string.
        """
        #bp_sys = int(bp.split('/')[0]) if '/' in bp else 120
        risk_level = "LOW"
        percentage = 12.5
        
        # Heuristic scoring
        if glucose > 100:
            percentage += 10
        #if bp_sys > 140:
        #    percentage += 15
        
        if percentage > 30:
            risk_level = "HIGH (Immediate Action Recommended)"
        elif percentage > 20:
            risk_level = "MODERATE"
            
        return f"### Cardio Risk: {risk_level} ({percentage}%)\n" \
               f"Risk factors identified: {'Elevated Glucose' if glucose > 100 else 'None'}. " \
               "Consistent monitoring of BP and sodium levels is advised."

    def analyze_preventive_risk(self, user_id: int, user_input: str) -> str:
        """
        Main logic for risk assessment.
        """
        input_lower = user_input.lower()
        
        # Mocking data for now, in real app, query DB for latest vitals
        age = 45
        bp = "128/84"
        glucose = 105.0
        
        if any(w in input_lower for w in ["risk", "heart", "stroke", "chance", "probability", "predict"]):
            cardio_risk = self.calculate_cardio_risk(age, bp, glucose)
            return f"{cardio_risk}\n\n" \
                   "Would you like me to generate a personalized prevention plan based on this risk?"
        
        return "I am currently monitoring your vitals in the background. " \
               "I'll alert you if I detect any significant trends. Is there a specific risk you're concerned about?"
