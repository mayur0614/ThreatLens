"""
ThreatLens AI - Model Training Script
Downloads the UCI ML SMS Spam Collection Dataset, trains a TF-IDF + Logistic Regression
pipeline for phishing/spam detection, and saves the trained model artifacts to disk.

Run this script ONCE from the backend directory:
    python train_model.py
"""
import os
import pickle
import io
import zipfile
import urllib.request
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

# ─── Configuration ────────────────────────────────────────────────────────────
DATASET_URL  = "https://archive.ics.uci.edu/ml/machine-learning-databases/00228/smsspamcollection.zip"
MODEL_DIR    = os.path.join(os.path.dirname(__file__), "model_artifacts")
VECTORIZER_PATH = os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl")
CLASSIFIER_PATH = os.path.join(MODEL_DIR, "phishing_classifier.pkl")

def download_dataset() -> list[tuple[str, int]]:
    """Download and parse the SMS Spam Collection dataset."""
    print("[*] Downloading SMS Spam Collection dataset from UCI ML Repository...")

    try:
        with urllib.request.urlopen(DATASET_URL, timeout=30) as response:
            zip_bytes = response.read()

        with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
            # The dataset file inside the zip is 'SMSSpamCollection'
            with z.open("SMSSpamCollection") as f:
                raw = f.read().decode("utf-8", errors="replace")

        samples = []
        for line in raw.strip().splitlines():
            parts = line.split("\t", 1)
            if len(parts) == 2:
                label_str, text = parts
                label = 1 if label_str.strip().lower() == "spam" else 0
                samples.append((text.strip(), label))

        print(f"[✓] Loaded {len(samples)} samples ({sum(l for _,l in samples)} spam, {sum(1-l for _,l in samples)} ham)")
        return samples

    except Exception as e:
        print(f"[!] Failed to download from UCI: {e}")
        print("[*] Falling back to an expanded synthetic dataset...")
        return _get_fallback_dataset()


def _get_fallback_dataset() -> list[tuple[str, int]]:
    """A larger synthetic phishing/spam vs. legitimate dataset as fallback."""
    return [
        # --- PHISHING / SPAM (label=1) ---
        ("URGENT: Your PayPal account has been limited. Verify now or you will lose access.", 1),
        ("Congratulations! You've won a $1,000,000 prize. Send your bank details to claim.", 1),
        ("ACCOUNT SUSPENDED: Login immediately to restore access to your bank account.", 1),
        ("Your Netflix subscription has failed. Update your payment info within 24 hours.", 1),
        ("FREE OFFER: Click here to claim your free iPhone 15. Limited time only!", 1),
        ("Security Alert: Unusual login detected on your account. Verify your identity.", 1),
        ("You have a pending transfer of $5,000. Provide your details to approve.", 1),
        ("Tax Refund: You are entitled to a $890 tax refund. Confirm your SSN.", 1),
        ("Dear User, your password is about to expire. Click here to reset immediately.", 1),
        ("Kindly verify your bank account login or face immediate suspension.", 1),
        ("You've been selected: Free $500 Amazon voucher! Claim before it expires.", 1),
        ("Final warning: Your account will be permanently closed in 48 hours.", 1),
        ("Bitcoin investment opportunity: Double your money in 24 hours guaranteed.", 1),
        ("Your package could not be delivered. Click to reschedule and pay $1.50 fee.", 1),
        ("Update your mailbox storage or your emails will be deleted permanently.", 1),
        ("You have (1) unread pending message. Click here to view and verify now.", 1),
        ("IRS Notification: You owe back taxes. Pay immediately to avoid arrest.", 1),
        ("DEAR WINNER: You won the annual international lottery. Send details.", 1),
        ("Hi! We noticed suspicious activity. Click to secure your account now!", 1),
        ("Verify your Apple ID immediately. Failure may lead to account deletion.", 1),
        ("URGENT REPLY NEEDED: I have a business proposal worth $4.5 million USD.", 1),
        ("FREE: Enter to win a brand new car! Just provide your name and address.", 1),
        ("Your mortgage application was approved! Click to view and sign your documents.", 1),
        ("Claim your loyalty bonus now! Your reward point balance is expiring.", 1),
        ("You've been shortlisted for a cash prize. Click to confirm eligibility.", 1),

        # --- LEGITIMATE (label=0) ---
        ("Hey, are we still on for lunch at noon? Let me know!", 0),
        ("Please find the attached quarterly report for your review.", 0),
        ("Your Amazon order has been shipped. Expected delivery: Thursday.", 0),
        ("Reminder: Team standup at 10 AM tomorrow. Meeting link is in the calendar.", 0),
        ("Hi, I finished reviewing your pull request. Left a few comments.", 0),
        ("Thanks for signing up! Here is how to get started with our platform.", 0),
        ("Your doctor appointment is confirmed for next Monday at 3 PM.", 0),
        ("Happy Birthday! Hope you have a wonderful day!", 0),
        ("I wanted to share this interesting article I read this morning with you.", 0),
        ("Can you send over the latest design mockups before end of day?", 0),
        ("Your monthly bank statement is now available to view online.", 0),
        ("Meeting notes from yesterday's standup are attached. Please review.", 0),
        ("Hi, just checking in to see how the project is progressing.", 0),
        ("Your flight to New York departs at 6:30 AM. Please arrive by 4:30 AM.", 0),
        ("Welcome to our team! We are excited to have you on board.", 0),
        ("The office will be closed on Friday for the public holiday.", 0),
        ("Here is the link to the shared Google Drive folder for our project.", 0),
        ("I booked the conference room for the 2 PM presentation tomorrow.", 0),
        ("Your subscription renewal receipt is attached. Thank you!", 0),
        ("Can we reschedule our weekly sync? I have a conflict tomorrow.", 0),
        ("Just wanted to follow up on the proposal we discussed last week.", 0),
        ("The new version of the software has been deployed to staging.", 0),
        ("Looking forward to seeing you at the conference next week!", 0),
        ("Please review the attached contract and let me know if you have questions.", 0),
        ("I've uploaded the final presentation slides to SharePoint.", 0),
    ]


def train_and_save(samples: list[tuple[str, int]]):
    """Train the TF-IDF + Logistic Regression pipeline and save the artifacts."""
    texts  = [s[0] for s in samples]
    labels = [s[1] for s in samples]

    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, random_state=42, stratify=labels
    )

    print(f"[*] Training on {len(X_train)} samples, validating on {len(X_test)} samples...")

    # ── Feature Extraction ─────────────────────────────────────────────────────
    vectorizer = TfidfVectorizer(
        lowercase=True,
        stop_words="english",
        max_features=5000,
        ngram_range=(1, 2),          # Unigrams + Bigrams for richer signal
        sublinear_tf=True            # Apply sublinear TF scaling
    )
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf  = vectorizer.transform(X_test)

    # ── Classifier ────────────────────────────────────────────────────────────
    clf = LogisticRegression(
        class_weight="balanced",
        C=1.0,
        solver="lbfgs",
        max_iter=1000,
        random_state=42
    )
    clf.fit(X_train_tfidf, y_train)

    # ── Evaluation ────────────────────────────────────────────────────────────
    y_pred = clf.predict(X_test_tfidf)
    acc = accuracy_score(y_test, y_pred) * 100
    print(f"\n[✓] Accuracy on test set: {acc:.1f}%")
    print("\n[Classification Report]")
    print(classification_report(y_test, y_pred, target_names=["Legitimate", "Phishing/Spam"]))

    # ── Persist ───────────────────────────────────────────────────────────────
    os.makedirs(MODEL_DIR, exist_ok=True)
    with open(VECTORIZER_PATH, "wb") as f:
        pickle.dump(vectorizer, f)
    with open(CLASSIFIER_PATH, "wb") as f:
        pickle.dump(clf, f)

    print(f"[✓] Vectorizer saved → {VECTORIZER_PATH}")
    print(f"[✓] Classifier saved → {CLASSIFIER_PATH}")
    print("\n[*] Training complete! Restart your FastAPI server to load the new model.")


if __name__ == "__main__":
    samples = download_dataset()
    train_and_save(samples)
