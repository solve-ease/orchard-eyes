from ultralytics import YOLO

class YoloDetector:
    def __init__(self, model_path, confidence):
        # Load the YOLO model
        self.model = YOLO(model_path)
        self.confidence = confidence

    def detect(self, frame):
        # Perform detection using the YOLO model
        results = self.model(frame)

        # Extract detections (bounding boxes, confidence scores, class IDs)
        detections = []
        for result in results:
            for box in result.boxes:
                confidence = box.conf.item()  # Confidence score
                if confidence < self.confidence:
                    continue

                # Extract bounding box coordinates
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())

                # Extract class ID
                class_id = int(box.cls.item())  # Class ID

                # Append detection to the list
                detections.append(([x1, y1, x2, y2], confidence, class_id))

        return detections