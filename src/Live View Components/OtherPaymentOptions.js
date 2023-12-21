import React from "react";
import styles from "./OtherPaymentOptions.module.css";
import { Row } from "react-bootstrap";

function OtherPaymentOptions({handleChange,paymentType}) {
      const options = [
            { displayName: "Paytm", value: "upi_paytm" },
            { displayName: "Gpay", value: "upi_gpay" },
            { displayName: "PhonePe", value: "upi_phonepe" },
            { displayName: "UPI", value: "upi" },
      ];

      return (
            <Row className={styles.otherPaymentField}>
                  <select name="paymentType" className={styles.otherPaymentSelect} onChange={handleChange}   >
                  {options.map((option) => {
                        return <option key={option.value} className={styles.otherOption} value={option.value} >{option.displayName}</option>;
                  })}
                  </select>
            </Row>
      );
}

export default OtherPaymentOptions;
