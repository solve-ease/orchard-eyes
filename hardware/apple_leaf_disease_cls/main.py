import os
import json
import torch
import torchvision.transforms as transforms
from PIL import Image


# Define the same model architecture
class SimpleResidualBlock(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = torch.nn.Conv2d(in_channels=3, out_channels=3, kernel_size=3, stride=1, padding=1)
        self.relu1 = torch.nn.ReLU()
        self.conv2 = torch.nn.Conv2d(in_channels=3, out_channels=3, kernel_size=3, stride=1, padding=1)
        self.relu2 = torch.nn.ReLU()
        
    def forward(self, x):
        out = self.conv1(x)
        out = self.relu1(out)
        out = self.conv2(out)
        return self.relu2(out) + x

class ImageClassificationBase(torch.nn.Module):
    def validation_step(self, batch):
        images, labels = batch
        out = self(images)
        loss = torch.nn.functional.cross_entropy(out, labels)
        acc = accuracy(out, labels)
        return {"val_loss": loss.detach(), "val_accuracy": acc}
    
    def validation_epoch_end(self, outputs):
        batch_losses = [x["val_loss"] for x in outputs]
        batch_accuracy = [x["val_accuracy"] for x in outputs]
        epoch_loss = torch.stack(batch_losses).mean()
        epoch_accuracy = torch.stack(batch_accuracy).mean()
        return {"val_loss": epoch_loss, "val_accuracy": epoch_accuracy}
    
    def epoch_end(self, epoch, result):
        print("Epoch [{}], last_lr: {:.5f}, train_loss: {:.4f}, val_loss: {:.4f}, val_acc: {:.4f}".format(
            epoch, result['lrs'][-1], result['train_loss'], result['val_loss'], result['val_accuracy']))

def ConvBlock(in_channels, out_channels, pool=False):
    layers = [torch.nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
             torch.nn.BatchNorm2d(out_channels),
             torch.nn.ReLU(inplace=True)]
    if pool:
        layers.append(torch.nn.MaxPool2d(4))
    return torch.nn.Sequential(*layers)

class ResNet9(ImageClassificationBase):
    def __init__(self, in_channels, num_diseases):
        super().__init__()
        
        self.conv1 = ConvBlock(in_channels, 64)
        self.conv2 = ConvBlock(64, 128, pool=True)
        self.res1 = torch.nn.Sequential(ConvBlock(128, 128), ConvBlock(128, 128))
        
        self.conv3 = ConvBlock(128, 256, pool=True)
        self.conv4 = ConvBlock(256, 512, pool=True)
        self.res2 = torch.nn.Sequential(ConvBlock(512, 512), ConvBlock(512, 512))
        
        self.classifier = torch.nn.Sequential(torch.nn.MaxPool2d(4),
                                       torch.nn.Flatten(),
                                       torch.nn.Linear(512, num_diseases))
        
    def forward(self, xb):
        out = self.conv1(xb)
        out = self.conv2(out)
        out = self.res1(out) + out
        out = self.conv3(out)
        out = self.conv4(out)
        out = self.res2(out) + out
        out = self.classifier(out)
        return out

def accuracy(outputs, labels):
    _, preds = torch.max(outputs, dim=1)
    return torch.tensor(torch.sum(preds == labels).item() / len(preds))

# Hardcoded class names (shorter, one-word labels)
CLASS_NAMES = [
    'Scab', 'Black_rot', 'Rust', 'Healthy_Apple',
    'Healthy_Blueberry', 'Mildew', 'Healthy_Cherry',
    'Leaf_spot', 'Common_rust', 'Blight', 'Healthy_Corn',
    'Black_rot_Grape', 'Measles', 'Leaf_blight', 'Healthy_Grape',
    'Greening', 'Bacterial_spot_Peach', 'Healthy_Peach',
    'Bacterial_spot_Pepper', 'Healthy_Pepper', 'Early_blight',
    'Late_blight', 'Healthy_Potato', 'Healthy_Raspberry', 'Healthy_Soybean',
    'Powdery_mildew', 'Leaf_scorch', 'Healthy_Strawberry',
    'Bacterial_spot_Tomato', 'Early_blight_Tomato', 'Late_blight_Tomato', 'Leaf_mold',
    'Septoria', 'Spider_mites', 'Target_spot',
    'Yellow_curl', 'Mosaic_virus', 'Healthy_Tomato'
]

def load_model(model_path):
    model = torch.load(model_path, map_location=torch.device('cpu'), weights_only=False)
    model.eval()
    return model

def predict_image(image_path, model):
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
    ])
    
    img = Image.open(image_path).convert('RGB')
    img_tensor = transform(img).unsqueeze(0)
    
    with torch.no_grad():
        outputs = model(img_tensor)
        _, predicted = torch.max(outputs, 1)
        
    return CLASS_NAMES[predicted.item()]

def process_images(input_folder, model, old_json_file, new_json_file):
    # Load existing data from the old JSON file
    if os.path.exists(old_json_file):
        with open(old_json_file, 'r') as f:
            tree_health_report = json.load(f)
    else:
        raise FileNotFoundError(f"{old_json_file} not found. Please provide a valid JSON file.")

    # Initialize the new JSON structure
    new_tree_health_report = {
        "Tree_Health_Report": {
            "Tree_ID": tree_health_report["Tree_Health_Report"]["Tree_ID"],
            "Overall_Health_Score": tree_health_report["Tree_Health_Report"]["Overall_Health_Score"],  # Preserve existing score
            "Organ_Counts": {
                "Fruits": tree_health_report["Tree_Health_Report"]["Organ_Counts"]["Fruits"],  # Preserve Fruits data
                "Leaves": {"healthy": 0, "diseased": 0},  # Initialize Leaves data
            },
            "Detected_Diseases": tree_health_report["Tree_Health_Report"]["Detected_Diseases"],  # Preserve existing diseases
        }
    }

    # Iterate over all images in the input folder
    for image_name in os.listdir(input_folder):
        if image_name.lower().endswith(('.png', '.jpg', '.jpeg')):
            image_path = os.path.join(input_folder, image_name)
            prediction = predict_image(image_path, model)
            
            # Determine the organ type (assume all images are leaves)
            organ_type = "Leaves"
            
            # Update Organ_Counts for Leaves
            if "healthy" in prediction.lower():
                new_tree_health_report["Tree_Health_Report"]["Organ_Counts"][organ_type]["healthy"] += 1
            else:
                new_tree_health_report["Tree_Health_Report"]["Organ_Counts"][organ_type]["diseased"] += 1
            
            # Update Detected_Diseases
            if prediction not in new_tree_health_report["Tree_Health_Report"]["Detected_Diseases"]:
                new_tree_health_report["Tree_Health_Report"]["Detected_Diseases"][prediction] = {organ_type.lower(): 1}
            else:
                if organ_type.lower() not in new_tree_health_report["Tree_Health_Report"]["Detected_Diseases"][prediction]:
                    new_tree_health_report["Tree_Health_Report"]["Detected_Diseases"][prediction][organ_type.lower()] = 1
                else:
                    new_tree_health_report["Tree_Health_Report"]["Detected_Diseases"][prediction][organ_type.lower()] += 1

    # Save the new data to the new JSON file
    with open(new_json_file, 'w') as f:
        json.dump(new_tree_health_report, f, indent=4)

    print(f"Processed {len(os.listdir(input_folder))} images. New data saved to {new_json_file}.")

def detect_apple_leaf_disease():
    # Load the trained model
    model_path = "models/best.pth"
    model = load_model(model_path)
    
    # Define input folder and JSON files
    input_folder = "../plant_part_classification/saves/leaves"  # Folder containing images to process
    old_json_file = "../tree_health_report.json"  # Old JSON file to read from
    new_json_file = "../new_tree_health_report.json"  # New JSON file to save to
    
    # Process images and update JSON file
    process_images(input_folder, model, old_json_file, new_json_file)