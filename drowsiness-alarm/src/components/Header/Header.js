import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Space } from "antd";
import clsx from "clsx";

import { faChartLine, faHome, faVideoCamera, faWarning } from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";

function Header() {

  return (
    <header className={styles.header}>
      <div className={clsx([styles.menuWrapper, "container"])}>

        <div className={styles.logo}>
          <Link
            to="/"
            className={styles.logoWrapper}
          >
            <div className={styles.wrapLogoImage}>
              <img className={styles.logoImage} src="/logo.png" alt="Drowsiness Warning Logo" />
            </div>
            <div className={styles.logoName}>Drowsiness Warning</div>
          </Link>
        </div>

        <ul className={styles.unorderList}>
          <li className={styles.list}>
            <Link
              className={styles.anchor}
              to="/"
            >
              <Space size={6} align="center">
                <FontAwesomeIcon icon={faHome} className={styles.icon} />
                Home
              </Space>
            </Link>
          </li>
          <li className={styles.list}>
            <Link className={styles.anchor} to='/live-video'>
              <Space size={6} align="center">
                <FontAwesomeIcon icon={faVideoCamera} className={styles.icon} />
                Live Video
              </Space>
            </Link>
          </li>
          <li className={styles.list}>
            <Link className={styles.anchor} to='/warn-history'>
              <Space size={6} align="center">
                <FontAwesomeIcon icon={faWarning} className={styles.icon} />
                Warning History
              </Space>
            </Link>
          </li>
          <li className={styles.list}>
            <Link className={styles.anchor} to='/statistical'>
              <Space size={6} align="center">
                <FontAwesomeIcon icon={faChartLine} className={styles.icon} />
                Statistical
              </Space>
            </Link>
          </li>
        </ul>
      </div>
    </header >
  )
}

export default Header;