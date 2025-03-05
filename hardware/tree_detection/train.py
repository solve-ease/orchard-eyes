from ultralytics import YOLO

# Load a pre-trained YOLO model (e.g., YOLOv8)
model = YOLO('models/yolo11l.pt')  # Use 'yolov11.pt' if YOLOv11 is available

# Train the model
results = model.train(
    data='dataset/data.yaml',  # Path to dataset configuration file
    epochs=50,  # Number of training epochs
    imgsz=640,  # Image size
    batch=4,  # Batch size
    device='0'  # Use GPU (set to 'cpu' if no GPU is available)
)
