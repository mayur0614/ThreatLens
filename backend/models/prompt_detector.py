import re

class PromptDetector:
    def __init__(self):
        self.jailbreak_patterns = [
            r"ignore previous instructions",
            r"developer mode",
            r"system prompt",
            r"bypass",
            r"disregard",
            r"print instructions"
        ]

    def predict_proba(self, prompt: str) -> float:
        prompt_lower = prompt.lower()
        score = 0.05
        
        for pattern in self.jailbreak_patterns:
            if re.search(pattern, prompt_lower):
                score += 0.4
                
        if len(prompt) > 500: # Sometimes long prompts try to overflow context
            score += 0.1
            
        return min(max(score, 0.05), 0.98)

    def predict(self, prompt: str) -> bool:
        return self.predict_proba(prompt) > 0.6
