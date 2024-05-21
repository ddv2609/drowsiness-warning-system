import { Layout } from "antd";
import { Outlet } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function LayoutDefault({ contextHolder }) {

  return (
    <>
      {contextHolder}
      <Layout
        style={{
          backgroundColor: "#fff"
        }}
      >
        <Header />
        <Outlet />
        <Footer />
      </Layout>
    </>
  )
}

export default LayoutDefault;