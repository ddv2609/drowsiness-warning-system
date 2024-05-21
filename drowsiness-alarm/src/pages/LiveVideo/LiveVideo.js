import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import styles from "./LiveVideo.module.css";
import VideoInfo from "../../components/VideoInfo/VideoInfo";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function LiveVideo() {
  const [toggle, setToggle] = useState(false);
  const socketWsRef = useRef(null);
  const imageRef = useRef({src: null});
  const [isWsConnect, setIsWsConnect] = useState(false);
  const [loading, setLoading] = useState(true);

  const initWsSocket = () => {
    if (socketWsRef.current === null || !isWsConnect) {
      console.log('Connecting /warn...')
      socketWsRef.current = new WebSocket("ws://localhost:8000/warn");

      socketWsRef.current.onopen = () => {
        console.log("Connected to server - warn");
        setIsWsConnect(true);
      };
    }
  }

  useEffect(() => {
    console.log("Live Video call useEffect");
    
    document.title = "Video trực tuyến";

    initWsSocket();

    socketWsRef.current.onmessage = async (event) => {
      try {
        const data = JSON.parse(JSON.parse(event.data));
        if (data.message_type === "TEXT") {
          if (loading) {
            setLoading(false);
          }

          imageRef.current.src = `data:image/jpeg;base64, ${data.imgBase64}`;
        }

      } catch (error) {
        console.log(`Error when recieve data /ws: ${error}`);
      }
    };

    socketWsRef.current.onclose = (event) => {
      if (event.wasClean) {
        console.log('Kết nối /warn đã được đóng một cách đúng đắn.');
      } else {
        console.log(`Kết nối /warn bị đóng với mã: ${event.code} và lý do: ${event.reason}`);
      }
      setIsWsConnect(false);
      console.log("Disconnected from server - warn");
      initWsSocket();
    };

    return () => {
      socketWsRef.current.close();
      console.log("Disconnected from server - ws");
      setIsWsConnect(false);
    }
  }, [])

  console.log("Live Video re-render");

  return (
    <div className={styles.liveVideo}>
      <div className={clsx([styles.wrapperLiveVideo, "container"])}>
        <VideoInfo toggle={toggle} setToggle={setToggle} />
        <div className={styles.wrapperVideo}
          onClick={() => {
            setToggle(!toggle);
            setLoading(true);
          }} >
          {toggle ? (
            !loading ? (
              <img className={styles.video} ref={imageRef} alt="Frame" />
            ) : (
              <Spin
                indicator={<LoadingOutlined />}
                size="large"
              >
                <></>
              </Spin>
            )
          ) : (
            <img className={styles.videoImg} srcSet="/video.jpg" alt="Video Off" />
          )}
        </div>
      </div>
    </div>
  )
}

export default LiveVideo;