from deep_sort_realtime.deepsort_tracker import DeepSort

class Tracker:
    def __init__(self):
        self.object_tracker = DeepSort(
            max_age=20,
            n_init=2,
            nms_max_overlap=0.3,
            max_cosine_distance=0.8,
            nn_budget=None,
            override_track_class=None,
            embedder="mobilenet",
            half=True,
            bgr=True,
            embedder_model_name=None,
            embedder_wts=None,
            polygon=False,
            today=None
        )

    def track(self, detections, frame):
        # Update tracks with detections
        tracks = self.object_tracker.update_tracks(detections, frame=frame)

        tracking_ids = []
        boxes = []
        class_ids = []

        for track in tracks:
            if not track.is_confirmed():
                continue

            # Get tracking ID
            tracking_ids.append(track.track_id)

            # Get bounding box
            ltrb = track.to_ltrb()
            boxes.append(ltrb)

            # Get class ID from the detection
            if hasattr(track, 'det_class'):
                class_ids.append(track.det_class)
            else:
                # If class information is not available, use a default value (e.g., -1)
                class_ids.append(-1)

        return tracking_ids, boxes, class_ids