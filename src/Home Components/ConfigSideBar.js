import React, { useState, memo } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import styles from "./ConfigSidebar.module.css";
import billingIcon from "../icons/order.png";
import settingsIcon from "../icons/settings.png";
import liveIcon from "../icons/live_1.png";
import updateIcon from "../icons/update.png";
import logoutIcon from "../icons/left_nav_logout.svg";
import reportIcon from "../icons/left_nav_reports.svg";
import arrowDown from "../icons/arrow-down.png";
// import crown from "../icons/crown copy.svg";
import { Link } from "react-router-dom";
import SideBarReportsList from "./SideBarReportsList";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowRightLong, faCrown } from "@fortawesome/free-solid-svg-icons";
import SubscriptionCard from "./SubscriptionCard";
import DownloadProgress from "./DownloadProgress";
import notify from "../Feature Components/notify";


function ConfigSideBar({
  showConfigSideBar,
  setShowConfigSideBar,
  handleLogout,
}) {
  const [toggleReport, setToggleReport] = useState(false);

  const handleClose = () => {
    setShowConfigSideBar(false);
  };

  const checkForUpdate = async () => {
    const isOnline = navigator.onLine
    if(!isOnline){
      notify("err", "please enable internet")
      return
    }

    await window.apiKey.request("checkForUpdate");
    // setShowConfigSideBar(false);
  };

  return (
    <Offcanvas
      className={styles.ConfigSideBarMain}
      show={showConfigSideBar}
      onHide={handleClose}
      placement="start"
    >
      <Offcanvas.Header closeButton className={styles.ConfigSideBarHeader}>
        Settings
      </Offcanvas.Header>
      <Offcanvas.Body className={styles.ConfigSideBarBody}>
        <Link to="." className={styles.items} onClick={handleClose}>
          <img src={billingIcon} className={styles.itemIcon} alt="" />
          <div className={styles.itemName}>Billing</div>
        </Link>
        <Link to="configuration" className={styles.items} onClick={handleClose}>
          <img src={settingsIcon} className={styles.itemIcon} alt="" />
          <div className={styles.itemName}>Configurations</div>
        </Link>
        <div
          className={styles.items}
          onClick={() => setToggleReport((prev) => !prev)}
        >
          <img src={reportIcon} className={styles.itemIcon} alt="" />
          <div className={styles.itemName}>Reports</div>
          <img
            src={arrowDown}
            alt=""
            className={`${styles.arrow} ${
              toggleReport ? styles.arrowLeft : null
            }`}
          />
        </div>
        <SideBarReportsList
          toggleReport={toggleReport}
          handleClose={handleClose}
        />
        <Link
          to="liveView/OrderView"
          className={styles.items}
          onClick={handleClose}
        >
          <img src={liveIcon} className={styles.itemIcon} alt="" />
          <div className={styles.itemName}>Live View</div>
        </Link>
        <div className={styles.items} onClick={checkForUpdate}>
          <img src={updateIcon} className={styles.itemIcon} alt="" />
          <div className={styles.itemName}>Check update</div>
        </div>

        <Link className={styles.items} onClick={handleLogout}>
          <img src={logoutIcon} className={styles.itemIcon} alt="" />
          <div className={styles.itemName}>Log Out</div>
        </Link>
        <DownloadProgress />
        <SubscriptionCard />
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default memo(ConfigSideBar);
