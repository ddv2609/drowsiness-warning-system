import { Empty, Space, Spin } from "antd";

import WarningItem from "../../components/WarningItem/WarningItem";
import { LoadingOutlined } from "@ant-design/icons";

function Items({ warns }) {

  return (
    <>
      {
        warns !== null ? (
          <>
            {
              warns.length > 0 ? (
                <Space
                  direction="vertical"
                  align="center"
                  size="large"
                  style={{ width: "100%" }}
                >
                  {
                    warns.map(warn => <WarningItem key={warn.historyID} warn={warn} />)
                  }
                </Space>
              ) : (
                <Empty
                  style={{ marginTop: "24px" }}
                  imageStyle={{ minHeight: "152px" }}
                />
              )
            }
          </>
        ) : (<Spin
          tip="Loading ..."
          indicator={<LoadingOutlined />}
          size="large"
          style={{marginTop: "124px"}}
        >
          <></>
        </Spin>
        )
      }
    </>
  )
}

export default Items;