# fetching data from pinecone vector db;

from langchain.embeddings import HuggingFaceEmbeddings
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA

import os
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

# loading envs
dotenv_path = 'F:/backup-kali/codeFiles/projects/AgriAero/ai/server/.env'

load_dotenv(dotenv_path)

PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
index_name = "apple-chatbot"

#download embedding model
def download_hugging_face_embeddings():
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    return embeddings


embeddings = download_hugging_face_embeddings()
print("embedd chekcing : ")
print(embeddings)

# check working:
query_result = embeddings.embed_query("Hello world")
print("Length", len(query_result))

# Initialize Pinecone


pc = Pinecone(
    api_key=PINECONE_API_KEY
)
index = pc.Index(index_name)


# data fetch from pinecone

# Your query
query = "What are different soil types for apple cultivation"

# Generate embedding for the query
query_embedding = embeddings.embed_query(query)

# Perform similarity search

def get_similarty_search(query_embedding, top_k):

    search_results = index.query(
        namespace="ns1",  # Replace with your actual namespace
        vector=query_embedding,
        top_k=top_k,  # Number of results you want
        include_values=True,
        include_metadata=True
    )

    return search_results

# search_results = get_similarty_search(query_embedding)

# Process and print results
# print("Results:")
# for match in search_results['matches']:
#     print(f"ID: {match['id']}")
#     print(f"Score: {match['score']}")
#     print(f"Metadata: {match['metadata']}")
#     print("---")


# defining the prompt template
prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template ="""
        Helpful Answer for Farmer:
        Use the following pieces of information to answer the farmer's question about apple orchard management:

            Context: {context}
            Question: {question}

        If you don't know the answer, say "I'm not sure, but I can try to find more information for you."
        Only return the helpful answer below and nothing else.
        Helpful Answer:
        """
)


# PROMPT=PromptTemplate(template=prompt_template, input_variables=["context", "question"])
# chain_type_kwargs={"prompt": PROMPT}


# Initialize the RetrievalQA chain


from gemini_integ import GeminiIntegration

# llm = GeminiIntegration()
# qa = RetrievalQA.from_chain_type(
#     llm=llm,
#     chain_type="stuff",
#     retriever=index.as_retriever(search_kwargs={'k': 2}),
#     return_source_documents=True,
#     chain_type_kwargs=chain_type_kwargs
# )

# Process a question
# question = "What are the best apple varieties for cultivation in India?"
# result = qa({"query": question})

# print(result["result"])
# print(result["source_documents"])


# function call fo chatbot

def get_response(query, top_k=2):
    # getting the query embedding:
    query_embed = embeddings.embed_query(query)

    # fetching data from the pinecone vector db

    search_res = get_similarty_search(query_embed, top_k=top_k)

    # print(search_res)

    # llm setup

    llm = GeminiIntegration()

    # Process a question
    prompt = prompt_template.format(context=search_res, question=query)
    response = llm.generate_response(query=prompt)

    return response


# example usage
query = input("Enter your query: ")
response = get_response(query, top_k=3)
print(response)

