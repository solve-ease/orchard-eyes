import gradio as gr
import os
from dotenv import load_dotenv
from pinecone import Pinecone
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.prompts import PromptTemplate
from gemini_integ import GeminiIntegration

# Load environment variables
dotenv_path = 'F:/backup-kali/codeFiles/projects/AgriAero/ai/server/.env'
load_dotenv(dotenv_path)

PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
index_name = "apple-chatbot"

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(index_name)

# Load embeddings
def load_embeddings():
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

embeddings = load_embeddings()

def get_similarity_search(query_embedding, top_k):
    search_results = index.query(
        namespace="ns1",  # Replace with actual namespace
        vector=query_embedding,
        top_k=top_k,
        include_values=True,
        include_metadata=True
    )
    return search_results

# Prompt Template
prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template="""
        Helpful Answer for Farmer:
        Use the following pieces of information to answer the farmer's question about apple orchard management:

        Context: {context}
        Question: {question}

        If you don't know the answer, say "I'm not sure, but I can try to find more information for you."
        Only return the helpful answer below and nothing else.
        Helpful Answer:
        """
)

def get_rag_response(query, top_k=2):
    query_embed = embeddings.embed_query(query)
    search_res = get_similarity_search(query_embed, top_k=top_k)
    llm = GeminiIntegration()
    prompt = prompt_template.format(context=search_res, question=query)
    response = llm.generate_response(query=prompt)
    return response

# Gradio Interface
def chatbot_interface(query):
    response = get_rag_response(query, top_k=3)
    return response

# Gradio UI
with gr.Blocks(theme=gr.themes.Soft()) as demo:
    gr.Markdown("""<h1 style='text-align: center; color: #4CAF50;'>🍏 Smart Orchard AI Chatbot 🍏</h1>""")
    gr.Markdown("""<p style='text-align: center;'>Ask anything about apple cultivation, soil types, pest management, and more!</p>""")
    
    with gr.Row():
        query_input = gr.Textbox(label="Enter Your Query", placeholder="Ask about apple orchard management...")
        submit_btn = gr.Button("🔍 Search")
    
    response_output = gr.Textbox(label="Response", interactive=False)
    submit_btn.click(chatbot_interface, inputs=query_input, outputs=response_output)
    
    gr.Markdown("""<p style='text-align: center;'>Powered by <b>Gemini API</b> and <b>Pinecone Vector Database</b></p>""")

demo.launch()
