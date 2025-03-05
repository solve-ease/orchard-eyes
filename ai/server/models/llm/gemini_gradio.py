import os
import gradio as gr
import google.generativeai as genai
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
# load_dotenv()

dotenv_path = 'F:/backup-kali/codeFiles/projects/AgriAero/ai/server/.env'

load_dotenv(dotenv_path)

class GeminiIntegration:
    """Handles interaction with Google's Gemini API"""
   
    def __init__(self, model_name: str = "gemini-2.0-flash", embedding_model: str = "text-embedding-004"):
        self.model_name = model_name
        self.embedding_model = embedding_model
        self._configure_gemini()
   
    def _configure_gemini(self):
        """Configure Gemini API client"""
        try:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("GEMINI_API_KEY not found in environment variables")
            genai.configure(api_key=api_key)
            logger.info("Gemini API configured successfully.")
        except Exception as e:
            logger.error(f"Failed to configure Gemini: {str(e)}")
            raise
   
    def generate_response(self, query: str, context: str = "") -> str:
        """Generate a response from Gemini given a query and optional context"""
        try:
            system_prompt = """
            You are an AI assistant for apple farmers. Respond only to queries related to apple cultivation, orchard management, 
            pest control, harvesting, and apple varieties. Keep your responses brief (80-100 words), use simple language that 
            farmers can easily understand, and focus on practical advice. If asked about topics unrelated to apple farming, 
            politely redirect to apple cultivation topics. You are part of the AgriAero Smart Apple Orchard Management System.
            """
            
            prompt = f"{system_prompt}\n\nContext: {context}\n\nQuestion: {query}"
            response = genai.GenerativeModel(self.model_name).generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Response generation failed: {str(e)}")
            return f"Sorry, I couldn't process your request. Please try again later."

# Initialize the Gemini integration
gemini = GeminiIntegration()

def process_query(query):
    """Process user query and return response"""
    if not query.strip():
        return "Please enter a question about apple cultivation."
        
    try:
        response = gemini.generate_response(query)
        return response
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        return "Sorry, I'm having trouble connecting to the service. Please try again later."

# Create Gradio interface
with gr.Blocks(title="AgriAero Apple Cultivation Assistant") as app:
    gr.Markdown("# 🍎 AgriAero Apple Cultivation Assistant")
    gr.Markdown("Ask questions about apple cultivation and get simple, practical answers.")
    
    with gr.Row():
        with gr.Column():
            query_input = gr.Textbox(
                label="Your Question",
                placeholder="Ask about apple varieties, pest control, pruning techniques, etc.",
                lines=3
            )
            submit_btn = gr.Button("Get Answer", variant="primary")
        
    response_output = gr.Textbox(label="Answer", lines=5)
    
    # Examples
    gr.Examples(
        examples=[
            "What are the best apple varieties for cold regions?",
            "How do I control apple scab in my orchard?",
            "When is the best time to prune apple trees?",
            "How can I increase my apple yield?",
            "What's the proper spacing for planting new apple trees?"
        ],
        inputs=query_input
    )
    
    # Set up event handlers
    submit_btn.click(fn=process_query, inputs=query_input, outputs=response_output)
    query_input.submit(fn=process_query, inputs=query_input, outputs=response_output)

# Launch app
if __name__ == "__main__":
    app.launch()