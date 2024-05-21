import { Col, DatePicker, Row, Space, TimePicker } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import moment from "moment";

import styles from "./Picker.module.css";

function Picker({ datePick, startPick, endPick }) {

  const handleChangeDate = (_, date) => datePick.current = date

  const handleChangeStartTime = (_, start) => startPick.current = start

  const handleChangeEndTime = (_, end) => endPick.current = end

  return (
    <div className={styles.picker}>
      <div className={styles.time}>
        <Row align="middle" justify="center">
          <Col span={8}>
            <div className={styles.date}>
              <Space align="center">
                <strong>Chọn ngày: </strong>
                <CalendarOutlined />
                <DatePicker
                  defaultValue={dayjs(moment().format("DD-MM-YYYY"), "DD/MM/YYYY")}
                  format={"DD/MM/YYYY"}
                  placeholder="Chọn ngày"
                  allowClear={false}
                  onChange={handleChangeDate}
                />
              </Space>
            </div>
          </Col>

          <Col span={8}>
            <div className={styles.startTime}>
              <Space align="center">
                <strong>Chọn thời điểm bắt đầu: </strong>
                <ClockCircleOutlined />
                <TimePicker
                  defaultValue={dayjs("00:00:00", "HH:mm:ss")}
                  placeholder="Bắt đầu"
                  allowClear={false}
                  onChange={handleChangeStartTime}
                />
              </Space>
            </div>
          </Col>

          <Col span={8}>
            <div className={styles.endTime}>
              <Space align="center">
                <strong>Chọn thời điểm kết thúc: </strong>
                <ClockCircleOutlined />
                <TimePicker
                  defaultValue={dayjs("23:59:59", "HH:mm:ss")}
                  placeholder="Kết thúc"
                  allowClear={false}
                  onChange={handleChangeEndTime}
                />
              </Space>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Picker;