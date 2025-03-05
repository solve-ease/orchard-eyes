import cv2
import time
import os
from tree_detection.yolo_detector import YoloDetector
from tree_detection.tracker import Tracker


def tree_detection():
    MODEL_PATH = "tree_detection/models/best.pt"
    VIDEO_PATH = "tree_detection/assets/latest.mp4"
    SAVE_FOLDER = "tree_detection/saves"

    # Create the "saves" folder if it doesn't exist
    if not os.path.exists(SAVE_FOLDER):
        os.makedirs(SAVE_FOLDER)
    detector = YoloDetector(model_path=MODEL_PATH, confidence=0.2)
    tracker = Tracker()

    cap = cv2.VideoCapture(VIDEO_PATH)

    if not cap.isOpened():
        print("Error: Unable to open video file.")
        exit()

    # Dictionary to keep track of saved trees
    saved_trees = {}

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        start_time = time.perf_counter()
        detections = detector.detect(frame)
        tracking_ids, boxes = tracker.track(detections, frame)

        for tracking_id, bounding_box in zip(tracking_ids, boxes):
            # Draw bounding box and tracking ID on the frame
            # cv2.rectangle(frame, (int(bounding_box[0]), int(bounding_box[1])), (int(
            #     bounding_box[2]), int(bounding_box[3])), (0, 0, 255), 2)
            # cv2.putText(frame, f"{str(tracking_id)}", (int(bounding_box[0]), int(
            #     bounding_box[1] - 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            # Crop and save the tree image if it hasn't been saved before
            if tracking_id not in saved_trees:
                x1, y1, x2, y2 = map(int, bounding_box)

                # Validate bounding box coordinates
                if x1 >= 0 and y1 >= 0 and x2 > x1 and y2 > y1 and x2 <= frame.shape[1] and y2 <= frame.shape[0]:
                    cropped_image = frame[y1:y2, x1:x2]  # Crop the image using the bounding box

                    # Save the cropped image
                    save_path = os.path.join(SAVE_FOLDER, f"tree_{tracking_id}.jpg")
                    cv2.imwrite(save_path, cropped_image)
                    print(f"Saved tree {tracking_id} to {save_path}")

                    # Mark this tree as saved
                    saved_trees[tracking_id] = True
                else:
                    print(f"Invalid bounding box for tree {tracking_id}: ({x1}, {y1}, {x2}, {y2})")

        end_time = time.perf_counter()
        fps = 1 / (end_time - start_time)
        print(f"Current fps: {fps}")

        # cv2.imshow("Frame", frame)

        # key = cv2.waitKey(1) & 0xFF
        # if key == ord("q") or key == 27:
        #     break

    # cap.release()
    # cv2.destroyAllWindows()