import cv2
import time
import os
from yolo_detector import YoloDetector
from tracker import Tracker
    

def plant_part_cls():

    MODEL_PATH = "models/tree_organ_cls_2.5k_best.pt"  # YOLO model for detecting leaves, fruits, and flowers
    VIDEO_PATH = "assets/latest2.mp4"
    SAVE_FOLDER = "saves"

    # Create the "saves" folder and subfolders if they don't exist
    if not os.path.exists(SAVE_FOLDER):
        os.makedirs(SAVE_FOLDER)

    # Create subfolders for leaves, fruits, and flowers
    for folder in ["leaves", "fruits", "flowers","branches"]:
        folder_path = os.path.join(SAVE_FOLDER, folder)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
    detector = YoloDetector(model_path=MODEL_PATH, confidence=0.2)
    tracker = Tracker()

    cap = cv2.VideoCapture(VIDEO_PATH)

    if not cap.isOpened():
        print("Error: Unable to open video file.")
        exit()

    # Dictionary to keep track of saved objects for each class
    saved_objects = {
        "leaves": {},
        "fruits": {},
        "flowers": {},
        "branches": {}
    }

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        start_time = time.perf_counter()
        detections = detector.detect(frame)  # Detections should include class labels (leaves, fruits, flowers)
        tracking_ids, boxes, class_ids = tracker.track(detections, frame)  # Modify tracker to return class IDs

        for tracking_id, bounding_box, class_id in zip(tracking_ids, boxes, class_ids):
            # Get the class name based on class_id
            if class_id == 0:
                class_name = "branches"
            elif class_id == 2:
                class_name = "leaves"
            elif class_id == 1:
                class_name = "flowers"
            elif class_id == 3:
                class_name = "fruits"
            else:
                continue  # Skip unknown classes

            # Draw bounding box and tracking ID on the frame
            x1, y1, x2, y2 = map(int, bounding_box)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"{class_name} {tracking_id}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            # Crop and save the image if it hasn't been saved before
            if tracking_id not in saved_objects[class_name]:
                # Validate bounding box coordinates
                if x1 >= 0 and y1 >= 0 and x2 > x1 and y2 > y1 and x2 <= frame.shape[1] and y2 <= frame.shape[0]:
                    cropped_image = frame[y1:y2, x1:x2]  # Crop the image using the bounding box

                    # Save the cropped image to the corresponding folder
                    save_path = os.path.join(SAVE_FOLDER, class_name, f"{class_name}_{tracking_id}.jpg")
                    cv2.imwrite(save_path, cropped_image)
                    print(f"Saved {class_name} {tracking_id} to {save_path}")

                    # Mark this object as saved
                    saved_objects[class_name][tracking_id] = True
                else:
                    print(f"Invalid bounding box for {class_name} {tracking_id}: ({x1}, {y1}, {x2}, {y2})")

        end_time = time.perf_counter()
        fps = 1 / (end_time - start_time)
        print(f"Current fps: {fps}")

        cv2.imshow("Frame", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord("q") or key == 27:
            break

    cap.release()
    cv2.destroyAllWindows()