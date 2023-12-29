import React from "react";
import { Link } from "react-router-dom";
import crown from "../icons/crown copy.svg";
import bomb from "../icons/bomb.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import styles from "./SubscriptionCard.module.css";
import { useSelector } from "react-redux";

const getTheme = (subscription) => {
  if (subscription.is_licence) {
    const differenceInMilliseconds =
      new Date(subscription.license_end_date) - new Date();
    const daysRemaining = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    if (daysRemaining < 10) {
      return {
        color: "rgb(0 141 69 / 38%)",
        upperText: `Plan expires in ${daysRemaining} Days`,
        lowerText: "Gold Plan",
        license_end_date: subscription.license_end_date,
        daysRemaining,
      };
    }
    return {
      color: "rgb(0 141 69 / 38%)",
      upperText: "Active Plan ",
      lowerText: "Gold Plan",
      license_end_date: subscription.license_end_date,
      daysRemaining,
    };
  }

  if (subscription.is_free_trial) {
    const differenceInMilliseconds =
      new Date(subscription.trial_end_date) - new Date();
    const daysRemaining = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    if (daysRemaining < 10) {
      return {
        color: "rgb(141 0 0 / 51%)",
        upperText: `Trial expires in ${daysRemaining} Days`,
        lowerText: "See Plan",
        license_end_date: subscription.license_end_date,
        daysRemaining,
      };
    }
    return {
      color: "rgb(207 191 0 / 40%)",
      upperText: "Trial Plan Activated",
      lowerText: "See Plan",
      license_end_date: subscription.license_end_date,
      daysRemaining,
    };
  } else {
    return {
      color: "rgb(141 0 0 / 51%)",
      upperText: `Plan expired...`,
      lowerText: "Buy plan immediately",
      license_end_date: subscription.license_end_date,
      daysRemaining: 0,
    };
  }
};

const SubscriptionCard = () => {
  const subscription = useSelector((state) => state.serverConfig.subscription);

  const subscriptionData = getTheme(subscription);

  return (
    <Link
      to="../subscription"
      className={styles.footer}
      style={{ backgroundColor: subscriptionData.color }}
    >
      {subscriptionData.daysRemaining <= 0 ? (
        <img src={bomb} className={styles.bomb} />
      ) : (
        <img src={crown} className={styles.crown} />
      )}
      <div className={styles.subscription}>
        <div className={styles.upper}>{subscriptionData?.upperText}</div>
        <div className={styles.lower}>
          {subscriptionData?.lowerText}
          <FontAwesomeIcon
            className={styles.arrowRight}
            icon={faArrowRightLong}
          />
        </div>
      </div>
    </Link>
  );
};

export default SubscriptionCard;
