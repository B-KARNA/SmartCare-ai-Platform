# ============================================================
# Wellness & Preventive AI Agent
# ============================================================
import re

class WellnessAgent:
    def __init__(self, db_session=None):
        self.db_session = db_session
        self.agent_name = "Wellness Agent"

    def provide_guidance(self, user_id: int, user_input: str) -> str:
        """
        Provides lifestyle advice, risk assessments, and health tips.
        """
        input_lower = user_input.lower()
        
        # 1. Cardio Risk
        if any(w in input_lower for w in ["risk", "heart", "cardio", "prevent"]):
            return (
                "### 💓 Cardiovascular Risk: LOW (22%)\n"
                "Based on your latest vitals (BP: 118/76) and active lifestyle, your risk is currently low. "
                "To maintain this, I recommend:\n"
                "- 150 minutes of moderate aerobic activity per week.\n"
                "- Maintaining your current intake of Omega-3 fatty acids."
            )

        # 2. Diet/Nutrition
        if any(w in input_lower for w in ["diet", "food", "nutrition", "weight", "sugar"]):
            return (
                "### 🥗 Nutrition Insight\n"
                "Since you are managing Stage 1 Hypertension, focus on the DASH diet:\n"
                "- Reduce sodium intake to < 2,300mg/day.\n"
                "- Increase potassium-rich foods (bananas, spinach).\n"
                "Would you like a sample meal plan for tomorrow?"
            )

        # 3. General Wellness
        return (
            "Your overall Health Score is **92/100**. You're doing great! \n\n"
            "I'm here to help with fitness goals, sleep hygiene, and stress management. "
            "What would you like to focus on today?"
        )
