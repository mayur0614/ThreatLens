import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import numpy as np

class PhishingModel:
    def __init__(self):
        # Initialize the Machine Learning Pipeline
        self.vectorizer = TfidfVectorizer(lowercase=True, stop_words='english', max_features=1000)
        self.clf = LogisticRegression(class_weight='balanced', random_state=42)
        
        # Embedded synthetic dataset for the hackathon demo
        # 1 = Phishing/Malicious, 0 = Safe/Legitimate
        self.training_data = [
            ("URGENT: Your account has been suspended. Please verify your login details immediately.", 1),
            ("Click here to claim your $1000 Amazon gift card! Limited time offer.", 1),
            ("Security Alert: We detected unusual activity on your bank account. Reset password now.", 1),
            ("You have won the lottery! Send us your bank details to transfer the funds.", 1),
            ("Kindly check the attached invoice for your recent purchase. Open PDF to view.", 1),
            ("Your PayPal account is restricted. Update your billing information to restore access.", 1),
            ("Please review the document I shared with you on Google Drive using this link.", 1),
            ("Final notice: Pay your overdue tax bill or face legal action.", 1),
            ("Update your mailbox quota to continue receiving new messages.", 1),
            ("You have a pending package delivery. Pay the $2 shipping fee to schedule drop-off.", 1),
            
            ("Hey team, here is the agenda for tomorrow's marketing meeting.", 0),
            ("Don't forget we have lunch at noon today at the deli.", 0),
            ("Your monthly subscription receipt from Netflix is attached.", 0),
            ("Can you review my pull request for the new UI component?", 0),
            ("Thanks for signing up for our newsletter! We are excited to have you.", 0),
            ("Reminder: Your doctor appointment is scheduled for next Tuesday at 10 AM.", 0),
            ("Here is the recipe for the chocolate cake we talked about.", 0),
            ("I've finished the draft report. Let me know if you need any revisions.", 0),
            ("Happy Birthday! Hope you have a fantastic day and a great year ahead.", 0),
            ("Your flight details and boarding pass for your trip to New York.", 0)
        ]
        
        # Train the model upon instantiation
        self._train_model()

    def _train_model(self):
        # Extract features and labels
        texts = [item[0] for item in self.training_data]
        labels = [item[1] for item in self.training_data]
        
        # Fit and transform the texts
        X = self.vectorizer.fit_transform(texts)
        y = np.array(labels)
        
        # Train the Logistic Regression classifier
        self.clf.fit(X, y)
        
    def get_explanation(self, text: str) -> list[str]:
        """Extract the words in the text that contributed most to a phishing classification."""
        # Transform the single input text
        X_test = self.vectorizer.transform([text])
        
        # Get the feature names (vocabulary)
        feature_names = self.vectorizer.get_feature_names_out()
        
        # Multiply the TF-IDF representation by the model's learned coefficients
        # to get the individual contribution of each word in this specific document.
        # X_test is a sparse matrix, shape (1, vocab_size). coef_ is (1, vocab_size).
        contributions = X_test.toarray()[0] * self.clf.coef_[0]
        
        # Find indices of words with the highest positive contributions to the "1" (Phishing) class
        top_indices = np.argsort(contributions)[::-1]
        
        explanations = []
        for idx in top_indices:
            # We only care about words that actually appeared in the text and pushed the score up
            if contributions[idx] > 0.1: 
                word = feature_names[idx]
                explanations.append(f"Suspicious terminology detected: '{word}'")
                if len(explanations) >= 3: # Limit to top 3 indicators for brevity
                    break
                    
        return explanations

    def predict_proba(self, text: str) -> float:
        # Prevent completely empty predictions
        if not text.strip():
            return 0.0
            
        X_test = self.vectorizer.transform([text])
        # Returns probability for class 1 (Phishing)
        proba = self.clf.predict_proba(X_test)[0][1]
        return float(proba)

    def predict(self, text: str) -> bool:
        return self.predict_proba(text) > 0.5
