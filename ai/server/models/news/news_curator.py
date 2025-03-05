import gradio as gr
import os
from dotenv import load_dotenv
from gemini_integ import GeminiIntegration
from web_module import search  # Assuming web browsing function for fetching data

# Load environment variables
dotenv_path = 'F:/backup-kali/codeFiles/projects/AgriAero/ai/server/.env'
load_dotenv(dotenv_path)

def fetch_and_simplify_news(farmer_info):
    """
    Fetch relevant news articles based on the farmer's profile and simplify using LLM.
    """
    search_query = f"latest news on {farmer_info['farm_type']} farming and pest control"
    news_results = search(search_query)
    
    if not news_results:
        return "No relevant news found. Please try again later."
    
    # Concatenate fetched data
    raw_text = "\n".join([article['snippet'] for article in news_results[:3]])
    
    # Format query for LLM simplification
    llm = GeminiIntegration()
    prompt = f"""
    Summarize the following news articles for a farmer with {farmer_info['education']} level education. 
    Ensure it's easy to understand and relevant to {farmer_info['farm_type']} farming.
    
    News Data:
    {raw_text}
    """
    
    simplified_response = llm.generate_response(query=prompt)
    return simplified_response

# Gradio UI
def news_curator_interface(name, education, farm_type, pest_history):
    farmer_info = {
        "name": name,
        "education": education,
        "farm_type": farm_type,
        "pest_history": pest_history
    }
    return fetch_and_simplify_news(farmer_info)

with gr.Blocks(theme=gr.themes.Soft()) as news_app:
    gr.Markdown("""<h1 style='text-align: center; color: #FF9800;'>📰 Smart Farming News Curator</h1>""")
    gr.Markdown("""<p style='text-align: center;'>Get the latest farming insights tailored to your needs!</p>""")
    
    with gr.Row():
        name_input = gr.Textbox(label="Your Name", placeholder="Enter your name")
        education_input = gr.Dropdown(["No Formal Education", "Primary", "Secondary", "Higher Education"], label="Education Level")
    
    with gr.Row():
        farm_type_input = gr.Dropdown(["Apple Orchard", "Mango Orchard", "Vegetable Farm", "Mixed Crops"], label="Farm Type")
        pest_history_input = gr.Textbox(label="Pest Infestation History", placeholder="E.g., Aphids, Fungal Infections")
    
    submit_btn = gr.Button("🌍 Fetch News")
    response_output = gr.Textbox(label="Curated News", interactive=False)
    submit_btn.click(news_curator_interface, inputs=[name_input, education_input, farm_type_input, pest_history_input], outputs=response_output)
    
    gr.Markdown("""<p style='text-align: center;'>Powered by <b>Gemini API</b> and <b>Web Scraping</b></p>""")

news_app.launch()
