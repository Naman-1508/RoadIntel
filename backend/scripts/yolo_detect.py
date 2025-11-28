import sys
import json
import cv2
from ultralytics import YOLO

def analyze_video(video_path):
    try:
        # Load the YOLO model
        model = YOLO("yolo11n.pt")  # Using nano model for speed

        # Open the video file
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print(json.dumps({"error": "Could not open video file"}))
            return

        detected_objects = []
        frame_count = 0
        
        # Process every 30th frame to save time (adjust as needed)
        skip_frames = 30 

        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                break

            if frame_count % skip_frames == 0:
                # Run inference
                results = model(frame, verbose=False)
                
                for r in results:
                    for box in r.boxes:
                        cls = int(box.cls[0])
                        conf = float(box.conf[0])
                        label = model.names[cls]
                        
                        # Filter for relevant classes (vehicles, etc.) if needed
                        # For now, we log everything with high confidence
                        if conf > 0.5:
                            detected_objects.append({
                                "frame": frame_count,
                                "label": label,
                                "confidence": conf,
                                "box": box.xywh.tolist()[0]
                            })

            frame_count += 1

        cap.release()
        
        # Output results as JSON
        print(json.dumps({"success": True, "detections": detected_objects}))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Video path required"}))
    else:
        analyze_video(sys.argv[1])
