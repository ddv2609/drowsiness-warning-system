import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { notification } from "antd";
import moment from "moment";

import LiveVideo from './pages/LiveVideo/LiveVideo';
import WarningHistory from './pages/WarningHistory/WarningHistory';
import LayoutDefault from './pages/Layout/LayoutDefault';
import Home from './pages/Home/Home';
import Statistical from "./pages/Statistical/Statistical";

function App() {
  const socketVideoRef = useRef(null);
  const socketHistoryRef = useRef(null);
  const [isVideoConnect, setIsVideoConnect] = useState(false);
  const [isHistoryConnect, setIsHistoryConnect] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const initVideoSocket = () => {
    if (socketVideoRef.current === null || !isVideoConnect) {
      console.log('Connecting /warn...')
      socketVideoRef.current = new WebSocket("ws://localhost:8000/warn");

      socketVideoRef.current.onopen = () => {
        console.log("Connected to server - warn");
        setIsVideoConnect(true);
      };
    }
  }

  const initHistorySocket = () => {
    if (socketHistoryRef.current === null || !isHistoryConnect) {
      console.log('Connecting /history...')
      socketHistoryRef.current = new WebSocket("ws://localhost:8080/history");

      socketHistoryRef.current.onopen = () => {
        console.log("Connected to server - history");
        setIsHistoryConnect(true);
        socketHistoryRef.current.send("client-session");
      };
    }
  }

  const openNotification = (placement, key, content) => {
    api.warning({
      key,
      message: <strong>Cảnh báo</strong>,
      description:
        <p>{content} - <strong>{moment().format("HH:mm:ss")}</strong></p>,
      placement,
      duration: null,
      style: {
        minWidth: '472px', // Đổi kích thước theo ý muốn
      },
    });
  }

  useEffect(() => {
    console.log("App call useEffect");

    initHistorySocket();
    initVideoSocket();

    socketHistoryRef.current.onmessage = async (event) => {
      try {
        const data = event.data;

        console.log(data);
        // let audio;

        switch (data) {
          case "fnd":
            openNotification("top", data, "Hệ thống không phát hiện khuôn mặt lái xe. Yêu cầu chỉnh lại vị trí khuân mặt hoặc camera!");
            // audio = new Audio("/fnd.mp3");
            // audio.play();
            break;
          case "dw":
            openNotification("top", data, "Hệ thống phát hiện lái xe có dấu hiệu ngủ gật và đang thực hiện cảnh báo!")
            // audio = new Audio("/dw.mp3");
            // audio.play();
            break;
          case "dfnd":
            api.destroy("fnd");
            break;
          case "ddw":
            api.destroy("dw");
            break;
          default:
            openNotification("top", data.type, "Hệ thống phản hồi không xác định!")
            break;
        }

      } catch (error) {
        console.log(`Error when recieve data: ${error}`);
      }
    };

    socketVideoRef.current.onclose = (event) => {
      if (event.wasClean) {
        console.log('Kết nối /warn đã được đóng một cách đúng đắn.');
      } else {
        console.log(`Kết nối /warn bị đóng với mã: ${event.code} và lý do: ${event.reason}`);
      }
      setIsVideoConnect(false);
      console.log("Disconnected from server - warn");
      initVideoSocket();
    };

    socketHistoryRef.current.onclose = (event) => {
      if (event.wasClean) {
        console.log('Kết nối /history đã được đóng một cách đúng đắn.');
      } else {
        console.log(`Kết nối /history bị đóng với mã: ${event.code} và lý do: ${event.reason}`);
      }
      setIsHistoryConnect(false);
      console.log("Disconnected from server - history");
      initHistorySocket();
    };

  }, [])

  console.log("App re-dender");

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LayoutDefault contextHolder={contextHolder} />}>
          <Route index element={<Home />} />
          <Route path='/live-video' element={<LiveVideo />} />
          <Route path='/warn-history' element={<WarningHistory />} />
          <Route path='/statistical' element={<Statistical />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
