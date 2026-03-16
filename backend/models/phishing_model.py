import re

class PhishingModel:
    def __init__(self):
        # In a real scenario, this would load a trained model (e.g. TF-IDF + Logistic Regression)
        # We will use heuristics mimicking model behavior for the hackathon
        self.suspicious_keywords = ["urgent", "verify", "suspend", "account", "login", "password", "bank", "secure"]
        
    def predict_proba(self, text: str) -> float:
        text_lower = text.lower()
        score = 0.0
        
        # Heuristic rules
        for keyword in self.suspicious_keywords:
            if keyword in text_lower:
                score += 0.15
                
        if "http" in text_lower and "click" in text_lower:
            score += 0.2
            
        return min(max(score, 0.05), 0.95)  # Cap between 0.05 and 0.95

    def predict(self, text: str) -> bool:
        return self.predict_proba(text) > 0.5
