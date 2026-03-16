import re

class Explainer:
    def __init__(self):
        # Dictionary of indicators and matching keywords/patterns
        self.phishing_indicators = {
            "Urgent language detected": ["urgent", "immediately", "24 hours", "suspended"],
            "Request for sensitive credentials": ["login", "password", "verify", "account information"],
            "Suspicious domain structure": ["http://", ".com-", "secure-"]
        }
        
        self.url_indicators = {
            "Domain impersonation detected": ["paypal", "bank", "login", "secure", "verify"],
            "Excessive subdomains": [r"(\.[a-zA-Z0-9-]+){3,}"],
            "Suspicious keywords": ["login-check", "verification", "secure-login"]
        }
        
        self.prompt_indicators = {
            "Attempt to override system instructions": ["ignore previous instructions", "disregard"],
            "Request for hidden system prompt": ["hidden system prompt", "print instructions"],
            "Safety bypass attempt": ["developer mode", "bypass"]
        }

    def explain_phishing(self, text: str) -> list:
        indicators = []
        text_lower = text.lower()
        for indicator, keywords in self.phishing_indicators.items():
            for kw in keywords:
                if kw in text_lower:
                    indicators.append(indicator)
                    break
        return indicators

    def explain_url(self, url: str) -> list:
        indicators = []
        url_lower = url.lower()
        for indicator, keywords in self.url_indicators.items():
            for kw in keywords:
                if (kw.startswith(r"(") or kw.startswith(r"[")) and kw.endswith(r")") or kw.endswith(r"]"):
                    if re.search(kw, url_lower):
                        indicators.append(indicator)
                        break
                elif kw in url_lower:
                    indicators.append(indicator)
                    break
        return indicators

    def explain_prompt(self, prompt: str) -> list:
        indicators = []
        prompt_lower = prompt.lower()
        for indicator, keywords in self.prompt_indicators.items():
            for kw in keywords:
                if kw in prompt_lower:
                    indicators.append(indicator)
                    break
        return indicators
