import React from "react";
import Style from "./SubscriptionPlans.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCrown } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";

const SubscriptionPlans = ({ theme }) => {
  return (
    <div className={Style.mianDiv} style={{ background: theme }}>
      <div className={Style.header}>
        <div className={Style.crown}>
          <FontAwesomeIcon icon={faCrown} />
        </div>
        <div className={Style.Plan_Section}>
          <div style={{ fontSize: "21px" }}>Silver Plan</div>
          <div style={{ right: "0", position: "absolute", fontSize: "32px" }}>
            ₹ 3059
          </div>
        </div>
        <div className={Style.TimePeriod}>
          <div style={{ display: "inline-flex" }}>
            <div className={Style.year}>1 YEAR</div>
            <div className={Style.year}>DESKTOP + MOBILE</div>
          </div>
          <div className={Style.oldPrice}>₹ 4999</div>
        </div>
        <div style={{ width: "100%", marginTop: "24px" }}>
          <Button variant="outline-danger" style={{ width: "100%" }}>
            Buy Now
          </Button>
        </div>
      </div>
      <div className={Style.body}>
        <div className={Style.Line}>
          <FontAwesomeIcon icon={faCheck} />
          <div className={Style.SubLineText}>Sync data across devices</div>
          {/* <FontAwesomeIcon icon={faCircleInfo} style={{ marginLeft: "2px" }} /> */}
        </div>
        <div className={Style.Line}>
          <FontAwesomeIcon icon={faCheck} />
          <div className={Style.SubLineText}>Sync data across devices</div>
          {/* <FontAwesomeIcon icon={faCircleInfo} style={{ marginLeft: "2px" }} /> */}
        </div>
        <div className={Style.Line}>
          <FontAwesomeIcon icon={faCheck} />
          <div className={Style.SubLineText}>Sync data across devices</div>
          {/* <FontAwesomeIcon icon={faCircleInfo} style={{ marginLeft: "2px" }} /> */}
        </div>
        <div className={Style.Line}>
          <FontAwesomeIcon icon={faCheck} />
          <div className={Style.SubLineText}>Sync data across devices</div>
          {/* <FontAwesomeIcon icon={faCircleInfo} style={{ marginLeft: "2px" }} /> */}
        </div>
        <div className={Style.Line}>
          <FontAwesomeIcon icon={faCheck} />
          <div className={Style.SubLineText}>Sync data across devices</div>
          {/* <FontAwesomeIcon icon={faCircleInfo} style={{ marginLeft: "2px" }} /> */}
        </div>
        <div className={Style.Line}>
          <FontAwesomeIcon icon={faCheck} />
          <div className={Style.SubLineText}>Sync data across devices</div>
          {/* <FontAwesomeIcon icon={faCircleInfo} style={{ marginLeft: "2px" }} /> */}
        </div>
        <div className={Style.Line}>
          <FontAwesomeIcon icon={faCheck} />
          <div className={Style.SubLineText}>Sync data across devices</div>
          {/* <FontAwesomeIcon icon={faCircleInfo} style={{ marginLeft: "2px" }} /> */}
        </div>
        <div className={Style.Line}>
          <FontAwesomeIcon icon={faCheck} />
          <div className={Style.SubLineText}>Sync data across devices</div>
          {/* <FontAwesomeIcon icon={faCircleInfo} style={{ marginLeft: "2px" }} /> */}
        </div>
        <div className={Style.Line}>
          <FontAwesomeIcon icon={faCheck} />
          <div className={Style.SubLineText}>Sync data across devices</div>
          {/* <FontAwesomeIcon icon={faCircleInfo} style={{ marginLeft: "2px" }} /> */}
        </div>
        <div className={Style.Line}>
          <FontAwesomeIcon icon={faCheck} />
          <div className={Style.SubLineText}>Sync data across devices</div>
          {/* <FontAwesomeIcon icon={faCircleInfo} style={{ marginLeft: "2px" }} /> */}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
