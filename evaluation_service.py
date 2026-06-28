import google.generativeai as genai
import json
import os

class AIEvaluator:
    def __init__(self):
        # Initialize the true AI engine
        # In a real production app, use os.environ.get("GEMINI_API_KEY")
        api_key = "YOUR_API_KEY_HERE" 
        genai.configure(api_key=api_key)
        
        # We use flash because it's insanely fast for backend middleware
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def evaluate_submission(self, qna_responses, daily_description):
        """
        Passes the staff's raw text to the LLM to judge context, effort, and impact.
        Returns a strict float score out of 10.0.
        """
        
        # Create a strict system prompt instructing the AI exactly how to behave
        prompt = f"""
        You are a highly analytical technical manager evaluating a staff member's daily performance report.
        
        Here is their Q&A input: {json.dumps(qna_responses)}
        Here is their detailed description of the day's work: "{daily_description}"
        
        Evaluate this based on:
        1. Completeness and detail of the description.
        2. Actual technical or business impact (e.g., resolving issues, pushing issues, co-ordination/ collaborations with other departments).
        3. Clarity on their issues and focus for tomorrow.
        
        You must return a single JSON object with exactly one key: "score". 
        The value must be a float between 0.0 and 10.0 representing their performance score.
        Do not return any markdown formatting, backticks, or extra text. Just the JSON object.
        """
        
        try:
            # Generate the response
            response = self.model.generate_content(prompt)
            
            # The AI is instructed to return raw JSON like: {"score": 8.5}
            raw_text = response.text.strip()
            
            # Clean up just in case the LLM tries to add markdown code blocks
            if raw_text.startswith("```json"):
                raw_text = raw_text.replace("```json", "").replace("```", "").strip()
                
            result = json.loads(raw_text)
            
            # Extract and format the score safely
            final_score = round(float(result.get("score", 0.0)), 1)
            return min(max(final_score, 0.0), 10.0) # Ensure it stays between 0 and 10
            
        except Exception as e:
            print(f"AI Evaluation Error: {e}")
            # Fallback score if the API call fails or times out
            return 5.0