import { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import clsx from "clsx";
import moment from "moment/moment";

import styles from "./WarningHistory.module.css";
import Picker from "../../components/Picker/Picker";
import Items from "../../components/Items/Items";

function WarningHistory() {

  const [warns, setWarns] = useState(null);
  const [loading, setLoading] = useState(false);
  const datePick = useRef(moment().format("DD-MM-YYYY"));
  const startPick = useRef("00:00:00");
  const endPick = useRef("23:59:59");

  const handleViewHistory = () => {
    setLoading(true);
    fetch(`http://localhost:8080/histories?date=${datePick.current}&start=${startPick.current}&end=${endPick.current}`)
      .then(response => response.json())
      .then(data => {
        setWarns(data);
        setLoading(false);
      })
  }

  useEffect(() => {
    console.log("WarningHistory re-render");
    document.title = "Lịch sử cảnh báo";
    
    fetch(`http://localhost:8080/histories?date=${datePick.current}&start=${startPick.current}&end=${endPick.current}`)
      .then(response => response.json())
      .then(data => setWarns(data))
  }, [])

  return (
    <div className={styles.warningHistory}>
      <div className={clsx([styles.wrapperWarningHistory, "container"])}>
        <Picker 
          datePick={datePick}
          startPick={startPick}
          endPick={endPick}
        />

        <div>
          <Button 
            className={styles.findBtn} 
            type="primary" 
            loading={loading}
            onClick={handleViewHistory}
          >Xem lịch sử</Button>
        </div>

        <div className={styles.warning}>
          <Items warns={warns}/>
        </div>
      </div>
    </div>
  )
}

export default WarningHistory;