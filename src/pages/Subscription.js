import React from "react";
import Style from "./Subscription.module.css";
import SubscriptionPlans from "../Subscription Components/SubscriptionPlans";

const Subscription = () => {
  return (
    <div className={Style.mainDiv}>
      <div className={Style.header}>
        <div className={Style.heading}>Plans & Pricing</div>
        <div className={Style.sub_heading}>
          Choose a plan that suits for your business
        </div>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "16px",
          textAlign: "left",
          gap: "20px",
          flexGrow: "1",
          alignItems: "center",
          width: "80%",
          justifyContent: "center",
        }}
      >
        <SubscriptionPlans theme="linear-gradient(180deg, #e2e7ed 0%, rgba(226, 230, 234, 0) 100%)" />
        <SubscriptionPlans theme="linear-gradient(180deg, #FFE3BB 0%, rgba(234, 198, 146, 0) 100%)" />
      </div>
    </div>
  );
};

export default Subscription;
