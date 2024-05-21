import { Col, Row, Space } from "antd";
import { WarningOutlined } from "@ant-design/icons";

import styles from "./WarningItem.module.css";

function WarningItem({ warn }) {

  return (
    <div className={styles.item}>
      <Row align="middle" justify="space-between">
        <Col span={20}>
          <Space 
            align="center"
            size="middle"
          >
            <div className={styles.icon}>
              <WarningOutlined />
            </div>
            <div className={styles.content}>
              <strong>{warn.message}</strong>
            </div>
          </Space>
        </Col>

        <Col span={4}>
          <div className={styles.time}>
            <strong>{`${warn.startTime} - ${warn.endTime}`}</strong>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default WarningItem;