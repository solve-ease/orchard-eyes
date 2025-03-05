from langchain.tools import DuckDuckGoSearchRun

def search(query, num_results=5):
    """
    Perform a web search using DuckDuckGo and return relevant news articles.
    """
    search_tool = DuckDuckGoSearchRun()
    results = search_tool.run(query)
    
    if not results:
        return []
    
    return results
    # Format results
    formatted_results = []
    for result in results[:num_results]:
        formatted_results.append({
            "title": result.get("title", "No title available"),
            "link": result.get("link", "No link available"),
            "snippet": result.get("snippet", "No snippet available")
        })
    
    return formatted_results

# Example usage
if __name__ == "__main__":
    query = "latest apple orchard pest control methods"
    search_results = search(query)

    print(search_results)
    # for res in search_results:
    #     print(f"Title: {res['title']}")
    #     print(f"Link: {res['link']}")
    #     print(f"Snippet: {res['snippet']}")
    #     print("-")
