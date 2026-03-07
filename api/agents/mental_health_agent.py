# ============================================================
# Mental Health Agent (CBT & Sentiment Analysis)
# ============================================================
import re

# High-risk heuristics that demand an immediate override of normal conversation
SUICIDE_RISK_KEYWORDS = [
    r"kill myself",
    r"want to die",
    r"end it all",
    r"suicide",
    r"no reason to live",
    r"better off dead",
    r"self-harm",
    r"cut myself"
]

# Basic sentiment dictionaries
NEGATIVE_WORDS = ["sad", "depressed", "anxious", "overwhelmed", "hopeless", "crying", "miserable", "tired", "stressed", "lonely", "awful", "terrible", "bad"]
POSITIVE_WORDS = ["happy", "good", "great", "better", "improving", "okay", "fine", "calm", "relieved", "hopeful", "excellent"]

class MentalHealthAgent:
    def __init__(self, db_session=None):
        self.db_session = db_session
        self.agent_name = "Mental Health Agent"

    def _get_user_memory(self, user_id: int, limit: int = 3):
        """
        Fetches the last N interactions involving this agent to provide context.
        (Placeholder for actual SQLAlchemy query)
        """
        # In a real app, this queries the ChatInteraction table
        # return self.db_session.query(ChatInteraction)...
        return []

    def _analyze_sentiment(self, text: str) -> float:
        """
        Calculates a rudimentary sentiment score (-1.0 to 1.0) based on keyword density.
        """
        text_lower = text.lower()
        words = re.findall(r'\b\w+\b', text_lower)
        if not words:
            return 0.0
            
        neg_count = sum(1 for w in words if w in NEGATIVE_WORDS)
        pos_count = sum(1 for w in words if w in POSITIVE_WORDS)
        
        # Simple score calculation
        total = neg_count + pos_count
        if total == 0:
            return 0.0
        return (pos_count - neg_count) / total

    def _check_suicide_risk(self, text: str) -> bool:
        """
        Scans input for critical self-harm keywords.
        """
        text_lower = text.lower()
        for pattern in SUICIDE_RISK_KEYWORDS:
            if re.search(pattern, text_lower):
                return True
        return False

    def analyze_emotional_state(self, user_id: int, user_input: str) -> str:
        """
        Main logic. Evaluates crisis risk first, then sentiment, and provides CB- informed support.
        """
        # 1. CRISIS GUARDRAIL (Highest Priority)
        if self._check_suicide_risk(user_input):
            return (
                "🚨 **Medical Disclaimer: I am an AI, not a doctor.**\n\n"
                "You are not alone, and help is available right now. Your life is valuable. "
                "Please reach out to a professional who can support you:\n"
                "- **National Suicide Prevention Lifeline**: Dial 988\n"
                "- **Crisis Text Line**: Text HOME to 741741\n"
                "- **Emergency Services**: Dial 911\n\n"
                "[BUTTON: Call Helpline Now]"
            )
            
        # 2. Analyze Current Sentiment
        current_sentiment = self._analyze_sentiment(user_input)
        
        # 3. Analyze Historical Context (Memory)
        # Mocking a history of negative sentiment
        history = self._get_user_memory(user_id)
        # Assuming history check logic here...
        is_consistently_negative = False # Mocked variable
        
        # 4. Generate Response based on CBT principles
        if current_sentiment < -0.3 or is_consistently_negative:
            response = (
                "I hear you, and it sounds like things are feeling really heavy right now. "
                "It is completely okay to feel this way. I see you've been having a tough time recently.\n\n"
                "Would you like to try logging your feelings in the **Mood Tracker**? "
                "Sometimes writing things down can help us understand our emotions better."
            )
        elif current_sentiment > 0.3:
            response = (
                "I'm so glad to hear that you're feeling positive today! Celebrating these "
                "moments is a great way to build mental resilience. Keep up the great work!"
            )
        else:
            response = (
                "Thank you for sharing that with me. I'm here to listen whenever you need "
                "to talk. Is there anything specific on your mind today?"
            )
            
        return response
