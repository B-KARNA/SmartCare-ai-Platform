# ============================================================
# Report Analysis Agent
# ============================================================
import re

# Mock reference dictionary for normal lab values
NORMAL_RANGES = {
    "hemoglobin": {"min": 13.0, "max": 17.0, "unit": "g/dL", "desc": "Red blood cell protein for oxygen transport."},
    "glucose_fasting": {"min": 70, "max": 99, "unit": "mg/dL", "desc": "Blood sugar levels after fasting."},
    "cholesterol_total": {"min": 0, "max": 200, "unit": "mg/dL", "desc": "Total amount of cholesterol in blood."},
    "platelets": {"min": 150000, "max": 450000, "unit": "mcL", "desc": "Cells that help blood clot."},
}

class ReportAgent:
    def __init__(self, db_session=None):
        self.db_session = db_session
        self.agent_name = "Report Agent"

    def _get_user_memory(self, user_id: int, limit: int = 3):
        """
        Fetches the last N interactions involving this agent to provide context.
        """
        from models import ChatInteraction
        if self.db_session:
             return self.db_session.query(ChatInteraction).filter(
                ChatInteraction.user_id == user_id, 
                ChatInteraction.agent_name == self.agent_name
            ).order_by(ChatInteraction.timestamp.desc()).limit(limit).all()
        return []

    def perform_ocr(self, image_data: bytes) -> str:
        """
        Stub for OCR logic. In this demo, if the data is just a small string like a filename,
        we return the mock OCR result to simulate a parsed medical document.
        """
        mock_data = "Patient CBC Hemoglobin: 11.2 g/dL. Platelets: 200000 mcL. Glucose_fasting: 105 mg/dL."
        try:
            decoded = image_data.decode('utf-8')
            # If the string is too short to be a real document (e.g., just a filename), return mock data
            if len(decoded) < 50:
                return mock_data
            return decoded
        except:
            return mock_data

    def analyze_report(self, user_id: int, image_data: bytes) -> str:
        """
        Main logic. Extracts text, finds parameters, checks against NORMAL_RANGES,
        and generates a simplified explanation.
        """
        # 1. Fetch memory (context-aware)
        recent_history = self._get_user_memory(user_id=user_id)
        
        # 2. Extract text (OCR)
        extracted_text = self.perform_ocr(image_data).lower()
        
        # 3. Parse values and compare
        findings = []
        for marker, ranges in NORMAL_RANGES.items():
            # Crude Regex to find a number near the marker name in the extracted text
            # e.g., looks for "hemoglobin: 11.2"
            pattern = rf"{marker}[^\d]*(\d+(?:\.\d+)?)"
            match = re.search(pattern, extracted_text)
            
            if match:
                value = float(match.group(1))
                if value < ranges["min"]:
                    findings.append(f"• **{marker.capitalize()}**: {value} {ranges['unit']} is **LOW** (Normal: {ranges['min']}-{ranges['max']}). {ranges['desc']}")
                elif value > ranges["max"]:
                    findings.append(f"• **{marker.capitalize()}**: {value} {ranges['unit']} is **HIGH** (Normal: {ranges['min']}-{ranges['max']}). {ranges['desc']}")
                else:
                    findings.append(f"• **{marker.capitalize()}**: {value} {ranges['unit']} is **NORMAL**.")

        # 4. Generate AI Response
        if not findings:
            response = "I couldn't detect any standard lab values in this report."
        else:
            response = "I have analyzed your report. Here is a simplified breakdown:\n" + "\n".join(findings)
            if any("HIGH" in f or "LOW" in f for f in findings):
                response += "\n\n**Note**: You have some out-of-range values. Please consult your doctor for a professional medical opinion."

        # Note: In a real system, you'd save this interaction back to `ChatInteraction` here.
        return response
