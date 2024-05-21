from fastapi import FastAPI, WebSocket
from detect import run
import cv2
import torch
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from datetime import datetime
import asyncio
import base64
from websockets import client
import msgpack
from PIL import Image
from io import BytesIO

class Warn:
    def __init__(self, message, typeWarn, dateWarn, timeWarn) -> None:
        self.message = message
        self.typeWarn = typeWarn
        self.dateWarn = dateWarn
        self.timeWarn = timeWarn
    
    # def __str__(self):
    #     return f"Message: {self.message}, Type of Warning: {self.typeWarn}, Date of Warning: {self.dateWarn}, Time Warning: {self.timeWarn}"

app = FastAPI()

origins = [
    "http://localhost",  # Thay đổi thành nguồn của ứng dụng React
    "http://localhost:3000",  # Đây là ví dụ URL của ứng dụng React
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cap = cv2.VideoCapture(0) 

model = torch.hub.load("ultralytics/yolov5", "custom", path="face_detection.pt")
eyes_state_model = torch.hub.load("ultralytics/yolov5", "custom", path="eyes_state.pt")
names = (
    eyes_state_model.module.names
    if hasattr(eyes_state_model, "module")
    else eyes_state_model.names
)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


@app.websocket("/warn")
async def warning_enpoint(socketclient: WebSocket):
    try:
        await socketclient.accept()
        print("Start")
        async with client.connect("ws://localhost:8080/history") as websocket:
            print("Connected")
            try:
                drowsiness = 0
                alarm_max_time = 10
                typeWarn = None

                # Cảnh báo không phát hiện khuân mặt: 
                # 1: Trước đó không có cảnh báo 
                # 0: Hiện tại có cảnh bảo
                # -1: Trước đó đã có cảnh báo
                previousFaceState = 1 
                previousEyeState = 1 
                hasDestroyFaceNotification = False
                hasDestroyEyeNotification = False
                while True:
                    _, frame = cap.read() # Read a frame from the webcam
                    _, img_encoded = cv2.imencode(".jpg", frame)
                    img_base64 = base64.b64encode(img_encoded.tobytes()).decode("utf-8")
                    results = model(frame) # Perform inference on the frameq
                    objects = results.pred[0] # Get the detected objects

                    # Draw bounding boxes on the frame
                    hasFace = False
                    for obj in objects:
                        x1, y1, x2, y2, conf, label = obj.tolist()
                        x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        face = frame[y1:y2, x1:x2]


                        ##=======================eyes state========================
                        eyes = eyes_state_model(face)
                        state = eyes.pred[0]
                        for st in state:
                            x1e, y1e, x2e, y2e, confe, labele = st.tolist()
                            x1e, y1e, x2e, y2e = map(int, [x1e, y1e, x2e, y2e])
                            cv2.rectangle(face, (x1e, y1e), (x2e, y2e), (0, 255, 0), 2)
                            cv2.putText(
                                face,
                                f"state: {names[int(labele)]}",
                                (x1e, y1e - 10),
                                cv2.FONT_HERSHEY_SIMPLEX,
                                0.5,
                                (0, 255, 0),
                                2,
                            )
                            now = datetime.now()
                            current_time = now.strftime("%H:%M:%S")
                            print(f"State: {names[int(labele)]} - {current_time} - Label: {labele}")
                            if labele == 1:
                                drowsiness += 1
                            else:
                                drowsiness = 0

                        hasFace = True
                    
                    await socketclient.send_json(json.dumps({
                        "message_type": "TEXT",
                        "imgBase64": img_base64
                    }))

                    if hasFace == False:
                        if  previousFaceState >= 0:
                            previousFaceState -= 1
                        typeWarn = "fnd"
                        drowsiness = 0
                    else:
                        previousFaceState = 1

                    if drowsiness > alarm_max_time:
                        if previousEyeState >= 0:
                            previousEyeState -= 1
                        typeWarn = "dw"
                    else:
                        previousEyeState = 1

                    if typeWarn is not None:
                        now = datetime.now()
                        current_time = now.strftime("%H:%M:%S")
                        today = datetime.today().strftime("%Y-%m-%d")
                        print(f"Type warn: {typeWarn} - {current_time}")
                        if typeWarn == "fnd":
                            if previousFaceState == 0:
                                await websocket.send(json.dumps({
                                    "message": "Hệ thống không phát hiện khuôn mặt lái xe. Yêu cầu chỉnh lại vị trí khuân mặt hoặc camera!",
                                    "typeWarn": "fnd",
                                    "dateWarn": today,
                                    "timeWarn": current_time
                                }))
                                await asyncio.sleep(0.5)
                                hasDestroyFaceNotification = True
                        else:
                            if previousEyeState == 0:
                                await websocket.send(json.dumps(json.dumps({
                                    "message": "Hệ thống phát hiện lái xe có dấu hiệu ngủ gật và đang thực hiện cảnh báo!",
                                    "typeWarn": "dw",
                                    "dateWarn": today,
                                    "timeWarn": current_time
                                })))
                                await asyncio.sleep(0.5)
                                hasDestroyEyeNotification = True
                    
                    if previousFaceState == 1 and hasDestroyFaceNotification:
                        hasDestroyFaceNotification = False
                        now = datetime.now()
                        current_time = now.strftime("%H:%M:%S")
                        today = datetime.today().strftime("%Y-%m-%d")
                        await websocket.send(json.dumps({
                            "message": "Hệ thống không phát hiện khuôn mặt lái xe và đã thực hiện cảnh báo",
                            "typeWarn": "dfnd",
                            "dateWarn": today,
                            "timeWarn": current_time
                        }))
                        await asyncio.sleep(0.5)
                    
                    if previousEyeState == 1 and hasDestroyEyeNotification:
                        hasDestroyEyeNotification = False
                        now = datetime.now()
                        current_time = now.strftime("%H:%M:%S")
                        today = datetime.today().strftime("%Y-%m-%d")
                        await websocket.send(json.dumps({
                            "message": "Hệ thống phát hiện lái xe có dấu hiệu ngủ gật và đã thực hiện cảnh báo!",
                            "typeWarn": "ddw",
                            "dateWarn": today,
                            "timeWarn": current_time
                        }))
                        await asyncio.sleep(0.5)

                    typeWarn = None

            except Exception as err:
                print(f"Error in /warn: {err}")

    except Exception as err:
        print(f"Error in /warn: {err}")
    # finally:
    #     print("Handle Error")
    #     await websocket.close(code=1000, reason="A server-side error occurred")

@app.websocket("/video")
async def video_endpoint(websocket: WebSocket):
    try:
        await websocket.accept()

        while True:
            _, frame = cap.read() # Read a frame from the webcam
            _, img_encoded = cv2.imencode(".jpg", frame)
            img_base64 = base64.b64encode(img_encoded.tobytes()).decode("utf-8")
            await websocket.send_json(json.dumps({
                "message_type": "TEXT",
                "imgBase64": img_base64
            }))

    except Exception as err:
        print(f"Error in /ws: {err}")


if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, log_level="info")