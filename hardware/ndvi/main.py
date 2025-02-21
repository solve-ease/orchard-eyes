import cv2
import numpy as np

# Load images
rgb_image = cv2.imread('rgb_image.jpg', 0)  # Grayscale
noir_image = cv2.imread('noir_image.jpg', 0)  # Grayscale

# Initialize feature detector
sift = cv2.SIFT_create()

# Detect keypoints and descriptors
kp1, des1 = sift.detectAndCompute(rgb_image, None)
kp2, des2 = sift.detectAndCompute(noir_image, None)

# Match features
bf = cv2.BFMatcher()
matches = bf.knnMatch(des1, des2, k=2)

# Filter good matches
good_matches = []
for m, n in matches:
    if m.distance < 0.75 * n.distance:
        good_matches.append(m)

# Compute homography
if len(good_matches) > 10:
    src_pts = np.float32([kp1[m.queryIdx].pt for m in good_matches]).reshape(-1, 1, 2)
    dst_pts = np.float32([kp2[m.trainIdx].pt for m in good_matches]).reshape(-1, 1, 2)
    H, _ = cv2.findHomography(dst_pts, src_pts, cv2.RANSAC, 5.0)

    # Warp the NOIR image to align with the RGB image
    aligned_noir = cv2.warpPerspective(noir_image, H, (rgb_image.shape[1], rgb_image.shape[0]))
else:
    print("Not enough matches to align images.")