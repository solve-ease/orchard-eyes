

import gradio as gr
from langchain.prompts import PromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings  # Updated import
from langchain_pinecone import Pinecone as LangchainPinecone  # Updated import
from langchain.chains import RetrievalQA
from pinecone import Pinecone
from dotenv import load_dotenv
import os
import google.generativeai as genai
import logging
from langchain.schema import BaseRetriever, Document
from langchain_core.runnables import Runnable

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
index_name = "apple-chatbot"

class GeminiRunnable(Runnable):
    def __init__(self, model_name="gemini-2.0-flash"):
        self.model = genai.GenerativeModel(model_name)

    def invoke(self, input_text, *args, **kwargs) -> str:
        """
        Invoke the Gemini model to generate a response.
        Args:
            input_text: The input text/prompt (can be a string, tuple, or StringPromptValue).
            *args: Additional positional arguments (ignored).
            **kwargs: Additional keyword arguments (e.g., `stop` parameter from LangChain).
        Returns:
            str: The generated response.
        """
        try:
            # Ignore the `stop` parameter if passed
            if "stop" in kwargs:
                logger.warning("The 'stop' parameter is not supported by Gemini and will be ignored.")
            
            # Extract the actual text from the input
            if hasattr(input_text, "to_string"):
                # Handle StringPromptValue or similar LangChain objects
                input_text = input_text.to_string()
            elif isinstance(input_text, tuple):
                # Extract the actual text from the tuple
                input_text = input_text[1]  # Assuming the text is the second element
            elif not isinstance(input_text, str):
                raise ValueError(f"Expected input_text to be a string, tuple, or StringPromptValue, got {type(input_text)}")
            
            # Generate the response
            response = self.model.generate_content(input_text)
            return response.text
        except Exception as e:
            logger.error(f"Gemini response generation failed: {str(e)}")
            raise

class AppleChatbot:
    def __init__(self, k=2, max_tokens=512, temperature=0.8):
        self.k = k
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.qa_chain = self.initialize_chatbot()

    def download_hf_embeddings(self):
        return HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")  # Explicit model name

    def initialize_chatbot(self):
        embeddings = self.download_hf_embeddings()
        
        # Initialize Gemini
        genai.configure(api_key=GEMINI_API_KEY)
        llm = GeminiRunnable()  # Use the custom wrapper
        
        # Initialize Pinecone
        pc = Pinecone(api_key=PINECONE_API_KEY)
        index = pc.Index(index_name)

        # Use the same prompt template from your original application
        prompt_template = """
        You are an expert in apple cultivation and orchard management. Use the following pieces of context to answer the question at the end.
        If you don't know the answer, just say that you don't know, don't try to make up an answer.
        {context}
        Question: {question}
        Answer:"""
        PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
        chain_type_kwargs = {"prompt": PROMPT}
        
        docsearch = LangchainPinecone.from_existing_index(index_name, embeddings)
        print(docsearch)
        qa = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=docsearch.as_retriever(search_kwargs={'k': self.k}),
            return_source_documents=True,
            chain_type_kwargs=chain_type_kwargs
        )
        return qa

    def get_response(self, question):
        try:
            result = self.qa_chain({"query": question})
            return result["result"]
        except Exception as e:
            return f"Error: {str(e)}"

# Initialize the chatbot
chatbot = AppleChatbot()

# Define the Gradio interface
def respond(message, history):
    response = chatbot.get_response(message)
    return response

# Create the Gradio interface
demo = gr.ChatInterface(
    respond,
    chatbot=gr.Chatbot(height=600),
    textbox=gr.Textbox(placeholder="Ask me anything about apple cultivation...", container=False),
    title="Apple Orchard Expert Chatbot",
    description="Ask questions about apple cultivation and orchard management. Built with Langchain, Pinecone, and Gemini.",
    theme=gr.themes.Soft(),
    examples=[
        "What are the ideal conditions for growing apples?",
        "How do I prevent common apple diseases?",
        "What is the best time to harvest apples?",
    ],
    cache_examples=False,
)

# Launch the interface
if __name__ == "__main__":
    demo.queue()  # Enable queuing
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=True
    )