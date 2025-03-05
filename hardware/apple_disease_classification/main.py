import cv2
import os
import json
from ultralytics import YOLO

def detect_apple_disease():
    # Paths
    MODEL_PATH = "models/best.pt"  # Path to the pre-trained YOLO model
    INPUT_DIR = "../plant_part_classification/saves/fruits"  # Directory containing input images
    OUTPUT_JSON = "../tree_health_report.json"  # Path to save the JSON file

    # TODO:make it such that it reads from the existing file in the begining instead of assuming values 

    # Initialize counters
    tree_health_report = {
        "Tree_Health_Report": {
            "Tree_ID": 12345,  # Replace with the actual tree ID
            "Overall_Health_Score": "0.00%",  # Will be calculated later
            "Organ_Counts": {
                "Fruits": {"healthy": 0, "diseased": 0},  # Only fruits are detected
                "Leaves": {"healthy": 0, "diseased": 0},  # Leaves are not detected
                "Flowers": {"healthy": 0, "diseased": 0},  # Flowers are not detected
            },
            "Detected_Diseases": {},  # No disease detection in this model
        }
    }

    # Load the pre-trained YOLO model
    model = YOLO(MODEL_PATH)

    # Process each image in the input directory
    for image_name in os.listdir(INPUT_DIR):
        # Skip non-image files
        if not image_name.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".tiff")):
            continue

        # Load the image
        image_path = os.path.join(INPUT_DIR, image_name)
        frame = cv2.imread(image_path)

        # Perform detection
        results = model(frame)

        # Process detections
        for result in results:
            for box in result.boxes:
                confidence = box.conf.item()  # Confidence score
                class_id = int(box.cls.item())  # Class ID

                # Update counts based on class ID
                if class_id == 0:  # Assuming class_id 0 corresponds to healthy apples
                    tree_health_report["Tree_Health_Report"]["Organ_Counts"]["Fruits"]["healthy"] += 1
                elif class_id == 1:  # Assuming class_id 1 corresponds to rotten apples
                    tree_health_report["Tree_Health_Report"]["Organ_Counts"]["Fruits"]["diseased"] += 1

    # Calculate Overall Health Score
    total_fruits = (
        tree_health_report["Tree_Health_Report"]["Organ_Counts"]["Fruits"]["healthy"]
        + tree_health_report["Tree_Health_Report"]["Organ_Counts"]["Fruits"]["diseased"]
    )
    if total_fruits > 0:
        health_score = (
            tree_health_report["Tree_Health_Report"]["Organ_Counts"]["Fruits"]["healthy"] / total_fruits
        ) * 100
        tree_health_report["Tree_Health_Report"]["Overall_Health_Score"] = f"{health_score:.2f}%"

    # Save the results to a JSON file
    with open(OUTPUT_JSON, "w") as json_file:
        json.dump(tree_health_report, json_file, indent=4)

    print(f"Tree health report saved to {OUTPUT_JSON}")
    print("Report:")
    print(json.dumps(tree_health_report, indent=4))