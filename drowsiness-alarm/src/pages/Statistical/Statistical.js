import { Spin } from "antd";
import { Line } from "@ant-design/plots";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import clsx from "clsx";

import styles from "./Statistical.module.css";

function Statistical() {

  const [data, setData] = useState([]);

  useEffect(() => {
    document.title = "Thống kê";

    fetch('http://localhost:8080/all-histories')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('Fetch data failed', error);
      });
  }, [])

  const config = {
    data,
    xField: 'time',
    yField: 'freq',
    seriesField: 'category',
    xAxis: {
      // type: 'time',
    },
    yAxis: {
      label: {
        formatter: (v) => `${v} lần`,
      },
      min: 0,
      tickInterval: 1,
    },
  }

  const [dwMax, fndMax] = (function () {
    let dw = {
      freq: 0,
    };

    let fnd = {
      freq: 0,
    }

    data.forEach(element => {
      if (element.typeWarn === "dw") {
        if (element.freq >= dw.freq) {
          dw = element;
        }
      } else {
        if (element.freq >= fnd.freq) {
          fnd = element;
        }
      }
    });

    return [dw, fnd];
  })();

  return (
    <div className={styles.statistical}>
      <div className={clsx([styles.wrapperStatistical, "container"])}>
        {
          data.length > 0 ? (
            <>
              <Line {...config} />
              <p className={styles.description}>Bảng thống kê số lần ngủ gật và không phát hiện mặt tại mỗi thời điểm</p>
              <p>Tài xế cần chú ý 2 thời điểm được dự đoán có rủi ro cao khi lái xe: </p>
              <p>- Thời điểm có tần xuất cảnh báo ngủ gật nhiều nhất: <strong>{dwMax.time} - {dwMax.freq} lần</strong></p>
              <p>- Thời điểm có tần xuất cảnh báo không phát hiện khuân mặt nhiều nhất: <strong>{fndMax.time} - {fndMax.freq} lần</strong></p>
            </>
          ) : (
            <Spin
              tip="Loading ..."
              indicator={<LoadingOutlined />}
              size="large"
              style={{ marginTop: "192px" }}
            >
              <></>
            </Spin>
          )
        }
      </div>
    </div>
  )
}

export default Statistical;