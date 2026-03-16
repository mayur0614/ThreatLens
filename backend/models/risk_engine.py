class RiskEngine:
    @staticmethod
    def calculate_risk_score(ml_probability: float, indicators: list, threat_type: str) -> int:
        # Base score from ML model (0-100 scale)
        base_score = ml_probability * 100
        
        # Add weight based on number of indicators
        indicator_weight = len(indicators) * 5
        
        # Threat severity weight
        severity_weight = 0
        if threat_type == "phishing":
            severity_weight = 10
        elif threat_type == "url":
            severity_weight = 5
        elif threat_type == "prompt_injection":
            severity_weight = 8
            
        final_score = base_score + indicator_weight + severity_weight
        
        return int(min(max(final_score, 0), 100))

    @staticmethod
    def get_risk_level(score: int) -> str:
        if score < 40:
            return "Safe"
        elif score < 70:
            return "Suspicious"
        else:
            return "Dangerous"
