import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.threatlens
scan_collection = database.get_collection("scans")

def log_scan_helper(scan) -> dict:
    return {
        "id": str(scan["_id"]),
        "timestamp": scan.get("timestamp"),
        "input_type": scan.get("input_type"),
        "input_text": scan.get("input_text"),
        "threat_type": scan.get("threat_type"),
        "risk_score": scan.get("risk_score"),
        "explanation": scan.get("explanation", [])
    }
