
import os
import logging
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_community.vectorstores import Pinecone as LangchainPinecone
from typing import List
from sentence_transformers import SentenceTransformer
from langchain.prompts import PromptTemplate
import sys

from gemini_integ import GeminiIntegration


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

dotenv_path = 'F:/backup-kali/codeFiles/projects/AgriAero/ai/server/.env'
load_dotenv(dotenv_path)

class SentenceTransformerEmbedder:
    """Handles text embeddings using Sentence Transformers"""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
    
    def embed_query(self, text: str) -> List[float]:
        """Generate embedding for a single text query"""
        try:
            return self.model.encode(text).tolist()
        except Exception as e:
            logger.error(f"Embedding generation failed: {str(e)}")
            raise

class PineconeRetriever:
    """Handles Pinecone vector database operations"""
    
    def __init__(self, index_name: str = "apple-chatbot"):
        self.index_name = index_name
        self._configure_pinecone()
        self.embedder = SentenceTransformerEmbedder()
        self.llm = GeminiIntegration()
        self.index = self._get_pinecone_index()
        self.prompt_template = PromptTemplate(
            input_variables=["context", "question"],
            template="""
            You are an AI assistant for AgriAero, a precision farming solution that uses drones, AI, and blockchain to help orchard farmers monitor crop health, optimize resources, and improve traceability. Your role is to answer user queries strictly based on the context provided. If the query is unrelated to orchard farming, drone technology, crop health monitoring, or resource optimization, politely refuse to answer.

            **Context:**
            {context}

            **Question:**
            {question}
            """
        )
    
    def _configure_pinecone(self):
        """Configure Pinecone client"""
        try:
            api_key = os.getenv("PINECONE_API_KEY")
            if not api_key:
                raise ValueError("PINECONE_API_KEY not found in environment variables")
            self.pc = Pinecone(api_key=api_key)
        except Exception as e:
            logger.error(f"Pinecone configuration failed: {str(e)}")
            raise
    
    def _get_pinecone_index(self):
        """Retrieve or create Pinecone index"""
        try:
            if self.index_name not in self.pc.list_indexes().names():
                self._create_index()
            return self.pc.Index(self.index_name)
        except Exception as e:
            logger.error(f"Index retrieval failed: {str(e)}")
            raise
    
    def _create_index(self):
        """Create new Pinecone index if not exists"""
        try:
            self.pc.create_index(
                name=self.index_name,
                dimension=384,  # Sentence Transformer embedding dimension
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region="us-west-2"
                )
            )
            logger.info(f"Created new index: {self.index_name}")
        except Exception as e:
            logger.error(f"Index creation failed: {str(e)}")
            raise
    
    def get_retriever(self, k: int = 2):
        """Create Langchain retriever"""
        try:
            vector_store = LangchainPinecone(
                index=self.index,
                embedding=self.embedder.embed_query,
                text_key="text"
            )
            return vector_store.as_retriever(
                search_kwargs={'k': k}
            )
        except Exception as e:
            logger.error(f"Retriever creation failed: {str(e)}")
            raise
    
    def query_rag(self, user_input: str) -> str:
        """Retrieve relevant context and generate response"""
        try:
            retriever = self.get_retriever()
            docs = retriever.get_relevant_documents(user_input)
            # context = "\n".join([doc.page_content for doc in docs])
            context = """**Examples of Relevant Topics:**
    - Drone-based crop health monitoring
    - Disease and pest detection in orchards
    - Optimizing irrigation and fertilization
    - Using blockchain for farm-to-market traceability
    - Reducing labor costs with drone technology
    - Calculating NDVI for crop health analysis """
            
            if not context:
                return "I'm sorry, but I can only answer questions related to Orchard Management"
            
            prompt = self.prompt_template.format(context=context, question=user_input)
            response = self.llm.generate_response(query=prompt)
            return response
        except Exception as e:
            logger.error(f"RAG query failed: {str(e)}")
            raise

# Example usage
def main():
    retriever = PineconeRetriever()
    while True:
        user_input = input("You: ")
        if user_input.lower() in ['exit', 'quit']:
            break
        response = retriever.query_rag(user_input)
        print(f"Bot: {response}")

if __name__ == "__main__":
    main()