import React from "react";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import styles from "./CaptionConnect.module.css";

const CaptionConnect = () => {
  const IPAddress = useSelector((state) => state.serverConfig.IPAddress);
  const apiEndPoint = `${IPAddress}:3001`;

  if (!IPAddress) {
    return <div>Sorry IPAddress Not Found Please Reload The App</div>;
  }

  return (
    <div className={styles.mainDiv}>
      <div>
        <div className={styles.landing_title}>Use POS on your mobile</div>
        <div style={{ height: "28px" }}></div>
        <div className={styles.text}>1. Open Caption on your phone</div>
        <div className={styles.text}>
          2. Tap <strong>Menu ⁝</strong> or <strong>Settings </strong> and
          select <strong>Linked Devide</strong>
        </div>
        <div className={styles.text}>
          3. Tap on <strong>Link on Device</strong>
        </div>
        <div className={styles.text}>
          4. Point your phone to this screen to capture the QR code
        </div>
      </div>

      <div
        style={{
          maxWidth: "250px",
        }}
      >
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={apiEndPoint}
          viewBox={`0 0 256 256`}
        />
        <div className={styles.text}>IP Adress : {apiEndPoint}</div>
      </div>
    </div>
  );
};

export default CaptionConnect;
