from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

from database import scan_collection, log_scan_helper
from models.phishing_model import PhishingModel
from models.url_model import URLModel
from models.prompt_detector import PromptDetector
from models.risk_engine import RiskEngine
from models.explainer import Explainer

app = FastAPI(title="ThreatLens AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

phishing_model = PhishingModel()
url_model = URLModel()
prompt_detector = PromptDetector()
explainer = Explainer()

class ScanEmailRequest(BaseModel):
    text: str

class ScanUrlRequest(BaseModel):
    url: str

class ScanPromptRequest(BaseModel):
    prompt: str

@app.post("/scan_email")
async def scan_email(req: ScanEmailRequest):
    prob = phishing_model.predict_proba(req.text)
    
    # Use Explainable AI directly from the ML model's feature weights if it's suspicious
    if prob > 0.4:
        indicators = phishing_model.get_explanation(req.text)
        if not indicators:
            indicators = explainer.explain_phishing(req.text)
    else:
        indicators = explainer.explain_phishing(req.text)
    risk_score = RiskEngine.calculate_risk_score(prob, indicators, "phishing")
    risk_level = RiskEngine.get_risk_level(risk_score)
    recommended_actions = [
        "Do not click any links",
        "Verify sender email address",
        "Report message to security team"
    ]
    
    result = {
        "threat_type": "Phishing Email",
        "risk_score": risk_score,
        "risk_level": risk_level,
        "confidence_level": "High" if risk_score > 70 else "Medium",
        "explanation": indicators,
        "recommended_actions": recommended_actions
    }
    
    # Log to MongoDB
    doc = {
        "input_type": "email",
        "input_text": req.text,
        "threat_type": "Phishing Email",
        "risk_score": risk_score,
        "explanation": indicators,
        "timestamp": datetime.utcnow().isoformat()
    }
    await scan_collection.insert_one(doc)
    
    return result

@app.post("/scan_url")
async def scan_url(req: ScanUrlRequest):
    prob = url_model.predict_proba(req.url)
    indicators = explainer.explain_url(req.url)
    risk_score = RiskEngine.calculate_risk_score(prob, indicators, "url")
    risk_level = RiskEngine.get_risk_level(risk_score)
    recommended_actions = [
        "Avoid visiting the website",
        "Block the domain",
        "Check domain reputation"
    ]
    
    result = {
        "threat_type": "Malicious URL",
        "risk_score": risk_score,
        "risk_level": risk_level,
        "confidence_level": "High" if risk_score > 70 else "Medium",
        "explanation": indicators,
        "recommended_actions": recommended_actions
    }
    
    doc = {
        "input_type": "url",
        "input_text": req.url,
        "threat_type": "Malicious URL",
        "risk_score": risk_score,
        "explanation": indicators,
        "timestamp": datetime.utcnow().isoformat()
    }
    await scan_collection.insert_one(doc)
    
    return result

@app.post("/scan_prompt")
async def scan_prompt(req: ScanPromptRequest):
    prob = prompt_detector.predict_proba(req.prompt)
    indicators = explainer.explain_prompt(req.prompt)
    risk_score = RiskEngine.calculate_risk_score(prob, indicators, "prompt_injection")
    risk_level = RiskEngine.get_risk_level(risk_score)
    recommended_actions = [
        "Reject the prompt",
        "Do not reveal system instructions",
        "Log the suspicious attempt"
    ]
    
    result = {
        "threat_type": "Prompt Injection",
        "risk_score": risk_score,
        "risk_level": risk_level,
        "confidence_level": "High" if risk_score > 70 else ("Low" if risk_score < 40 else "Medium"),
        "explanation": indicators,
        "recommended_actions": recommended_actions
    }
    
    doc = {
        "input_type": "prompt",
        "input_text": req.prompt,
        "threat_type": "Prompt Injection",
        "risk_score": risk_score,
        "explanation": indicators,
        "timestamp": datetime.utcnow().isoformat()
    }
    await scan_collection.insert_one(doc)
    
    return result

@app.get("/analytics")
async def get_analytics():
    scans = await scan_collection.find().to_list(1000)
    
    total_scans = len(scans)
    phishing = sum(1 for s in scans if s.get("input_type") == "email" and s.get("risk_score", 0) > 40)
    urls = sum(1 for s in scans if s.get("input_type") == "url" and s.get("risk_score", 0) > 40)
    prompts = sum(1 for s in scans if s.get("input_type") == "prompt" and s.get("risk_score", 0) > 40)
    
    avg_score = sum(s.get("risk_score", 0) for s in scans) / total_scans if total_scans > 0 else 0
    
    return {
        "total_scans": total_scans,
        "detections": {
            "phishing": phishing,
            "url": urls,
            "prompt": prompts
        },
        "average_risk_score": int(avg_score),
        "recent_history": [log_scan_helper(s) for s in reversed(scans[-20:])]
    }
