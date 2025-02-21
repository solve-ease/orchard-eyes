import cv2
import numpy as np

# Load images
rgb_image = cv2.imread('assets/imgZ1.jpg')  # Load RGB image in color
noir_image = cv2.imread('assets/img1.jpg', 0)  # Load NOIR image in grayscale

# Initialize feature detector
sift = cv2.SIFT_create()

# Detect keypoints and descriptors
kp1, des1 = sift.detectAndCompute(cv2.cvtColor(rgb_image, cv2.COLOR_BGR2GRAY), None)
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

    # Extract the Red channel from the RGB image
    red_channel = rgb_image[:, :, 2].astype(float)

    # Calculate NDVI
    ndvi = (aligned_noir.astype(float) - red_channel) / (aligned_noir.astype(float) + red_channel + 1e-10)  # Add small value to avoid division by zero

    # Normalize NDVI to the range [0, 255] for display
    ndvi_normalized = cv2.normalize(ndvi, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8U)

    # Apply a colormap to the NDVI image for better visualization
    ndvi_colormap = cv2.applyColorMap(ndvi_normalized, cv2.COLORMAP_JET)

    # Resize the NDVI image to fit the screen
    scale_percent = 50  # Adjust this value to resize the image (e.g., 50% of original size)
    width = int(ndvi_colormap.shape[1] * scale_percent / 100)
    height = int(ndvi_colormap.shape[0] * scale_percent / 100)
    resized_ndvi = cv2.resize(ndvi_colormap, (width, height))

    # Create a legend
    legend_width = 100
    legend_height = resized_ndvi.shape[0]  # Match the height of the resized NDVI image
    legend = np.zeros((legend_height, legend_width, 3), dtype=np.uint8)

    # Fill the legend with a gradient representing the colormap
    for i in range(legend_height):
        color_value = int((i / legend_height) * 255)  # Map height to [0, 255]
        color = cv2.applyColorMap(np.array([[color_value]], dtype=np.uint8), cv2.COLORMAP_JET)
        legend[i, :] = color

    # Add text to the legend
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(legend, 'High', (10, 30), font, 0.5, (255, 255, 255), 1, cv2.LINE_AA)
    cv2.putText(legend, 'Low', (10, legend_height - 20), font, 0.5, (255, 255, 255), 1, cv2.LINE_AA)

    # Combine the NDVI image and the legend
    combined_image = np.hstack((resized_ndvi, legend))

    # Display the combined image
    cv2.imshow('NDVI Result with Legend', combined_image)
    cv2.waitKey(0)  # Wait for a key press to close the window
    cv2.destroyAllWindows()  # Close all OpenCV windows
else:
    print("Not enough matches to align images.")