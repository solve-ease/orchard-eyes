import json
import requests

# Define the data in the required format
tree_health_report = {
    "Tree_Health_Report": {
        "Tree_ID": 12345,
        "Overall_Health_Score": "75.00%",
        "Organ_Counts": {
            "Fruits": {"healthy": 123, "diseased": 12},
            "Leaves": {"healthy": 118, "diseased": 200},
            "Flowers": {"healthy": 8, "diseased": 2},
        },
        "Detected_Diseases": {
            "Apple_Scab": {"fruits": 3, "leaves": 2},
            "Powdery_Mildew": {"leaves": 56},
            "Fire_Blight": {"flowers": 2},
        },
    }
}

# Save the data as a JSON file
json_file_path = "new_tree_health_report.json"
with open(json_file_path, "w") as json_file:
    json.dump(tree_health_report, json_file, indent=4)

print(f"JSON file saved to {json_file_path}")

# Define the endpoint URL
endpoint_url = "https://nbfdzfjj-5000.inc1.devtunnels.ms/farm-metrics"  # Replace with your actual endpoint URL

# Upload the JSON file to the endpoint
try:
    with open(json_file_path, "rb") as json_file:
        # files = {"file": (json.dumps({"aslknf":123}), "application/json")}
        headers = {"Content-Type": "application/json"}
        response = requests.post(endpoint_url, json=tree_health_report, headers=headers)

    # Check the response
    if response.status_code == 200:
        print("File uploaded successfully!")
        print("Response:", response.text)
    else:
        print(f"Failed to upload file. Status code: {response.status_code}")
        print("Response:", response.text)
except Exception as e:
    print(f"An error occurred: {e}")