from upload import upload
from apple_disease_classification.main import detect_apple_disease
from plant_part_classification.yolo_detection_tracking import plant_part_cls
from apple_leaf_disease_cls.main import detect_apple_leaf_disease
from tree_detection.yolo_detection_tracking import tree_detection

# reducing the current input video to snapshots of trees
tree_detection()

# reducing the tree images to cropped images of leafs flowers and fruits
plant_part_cls()

# now diagnosing all the leaves images
detect_apple_leaf_disease

# now diagnosing all the fruits iamges
detect_apple_disease()

# now condensing all the captured data to a json file and uploading to the backend endpoint
upload()