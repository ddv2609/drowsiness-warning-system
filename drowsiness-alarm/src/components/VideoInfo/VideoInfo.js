import { Col, Row, Space, Switch } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import clsx from "clsx";

import styles from "./VideoInfo.module.css";

function VideoInfo({ toggle, setToggle }) {

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const updateRealTime = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(updateRealTime);
  })

  return (
    <div className={styles.videoInfo}>
      <Row align="middle" justify="center">
        <Col span={8}>
          <div className={styles.state}>
            <Space align="center">
              {toggle ? (
                <>
                  <EyeOutlined className={clsx([styles.iconState, styles.iconOn])} />
                  <span className={clsx([styles.statelb, styles.stateOnlb])}>Video đang phát trực tiếp</span>
                </>
              ) : (
                <>
                  <EyeInvisibleOutlined className={clsx([styles.iconState, styles.iconOff])} />
                  <span className={clsx([styles.statelb, styles.stateOfflb])}>Ngừng phát trực tiếp</span>
                </>
              )}
            </Space>
          </div>
        </Col>

        <Col span={8}>
          <div className={styles.time}>
            <span className={styles.timeDetail}>{moment(time).format("dddd, DD-MM-YYYY HH:mm:ss A")}</span>
          </div>
        </Col>

        <Col span={8}>
          <div className={styles.toggle}>
            <Space align="center">
              <span className={styles.actionlb}>{toggle ? "Tắt Video" : "Bật Video"}</span>
              <Switch checkedChildren="ON" unCheckedChildren="OFF" defaultChecked checked={toggle}
                onChange={(checked, _) => setToggle(checked)} />
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default VideoInfo;