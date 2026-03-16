import re

class URLModel:
    def __init__(self):
        # In a real scenario, this would load a trained Random Forest classifier
        pass

    def predict_proba(self, url: str) -> float:
        score = 0.1 # Base score
        url_lower = url.lower()
        
        # Suspicious features
        if url_lower.count('-') > 2:
            score += 0.2
        if url_lower.count('.') > 3: # Excessive subdomains
            score += 0.3
        
        suspicious_words = ["secure", "login", "verify", "update", "banking", "paypal"]
        for word in suspicious_words:
            if word in url_lower:
                score += 0.25
                
        # Length check
        if len(url) > 75:
            score += 0.15
            
        return min(max(score, 0.05), 0.96)

    def predict(self, url: str) -> bool:
        return self.predict_proba(url) > 0.5
