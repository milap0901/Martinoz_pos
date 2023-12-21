import React, { useEffect, useRef, useState } from "react";
import styles from "./PaymentBreakdown.module.css";
import { useSelector, useDispatch } from "react-redux";
import { modifyCartData } from "../Redux/finalOrderSlice";
import DiscountModal from "./DiscountModal";

function PaymentBreakdown({ showPaymentBreakdown, setShowPaymentBreakdown }) {
     //   add/remove css showBreakdown class based on showPaymentBreakdown state coming from parent component

     const [showDiscountModal,setShowDiscountModal] = useState(false)

     let showBreakdown = showPaymentBreakdown
          ? `${styles.showBreakdown} ${styles.paymentBreakdown}`
          : `${styles.paymentBreakdown}`;

     //  to get finalOrder state from redux store

     const finalOrder = useSelector((state) => state.finalOrder);
     const dispatch = useDispatch();

     // close the breakdown when clicked outside the div

     const outsideRef = useRef();
     
     useEffect(() => {
          const handleOusideClick = (e) => {
               // set setShowPaymentBreakdown to false if click event occure outside the div with ref outsideRef (PaymentBreakdown)
               if (outsideRef.current && !outsideRef.current.contains(e.target) && e.target.name !== "toggleBreakdown") {
               setShowPaymentBreakdown(false)    
               }
          };

          //   bind full document for listening click
          document.addEventListener("mousedown", handleOusideClick);

          return () => {
               // Unbind the event listener on clean up
               document.removeEventListener("mousedown", handleOusideClick);
          };
     }, [outsideRef, setShowPaymentBreakdown]);

     const handleChange = (e) => {
          let { name, value } = e.target;
          dispatch(modifyCartData({ [name]: value }));
     };

     return (
          <div className={showBreakdown} ref={outsideRef}>
               <button className={styles.breakDownHideBtn} onClick={() => setShowPaymentBreakdown(false)}>
                    {" "}
                    &#8964;
               </button>
               <div className={`${styles.breakDownItem} d-flex justify-content-between`}>
                    <div className="ms-4">Sub Total</div>
                    <div className="me-4">{finalOrder.subTotal.toFixed(2)}</div>
               </div>
               <div className={`${styles.breakDownItem} d-flex justify-content-between`}>
                    <div className="ms-4">Discount</div>
                    <div  className={styles.discountBtn} onClick={()=>setShowDiscountModal(true)}>Add Discount</div>
                    <div className="me-4">{finalOrder.discount.toFixed(2)}</div>
               </div>
               <div className={`${styles.breakDownItem} d-flex justify-content-between py-1 align-items-center`}>
                    <div className="ms-4">Delivery Charge</div>
                    <input className="me-4" type="number" min={0} onChange={handleChange} name="deliveryCharge" value={finalOrder.deliveryCharge || ""} placeholder="0" />
               </div>
               <div className={`${styles.breakDownItem} d-flex justify-content-between py-1 align-items-center`}>
                    <div className="ms-4">Containe Charge</div>
                    <input className="me-4" type="number" min={0} onChange={handleChange} name="packagingCharge" value={finalOrder.packagingCharge || ""} placeholder="0"/>
               </div>
               <div className={`${styles.breakDownItem} d-flex justify-content-between`}>
                    <div className="ms-4">Tax</div>
                    <div className="me-4">{finalOrder.tax.toFixed(2)}</div>
               </div>
               <div className={`${styles.breakDownItem} d-flex justify-content-between`}>
                    <div className="ms-4">Round Of</div>
                    <div className="me-4">0.00</div>
               </div>
               <div className={`${styles.breakDownItem} d-flex justify-content-between py-1 align-items-center`}>
                    <div className="ms-4">Customer Paid</div>
                    <input className="me-4" defaultValue="0" />
               </div>
               <div className={`${styles.breakDownItem} d-flex justify-content-between`}>
                    <div className="ms-4">Return to Customer</div>
                    <div className="me-4">0.00</div>
               </div>
               <div className={`${styles.breakDownItem} d-flex justify-content-between py-1 align-items-center`}>
                    <div className="ms-4">Tip</div>
                    <input className="me-4" defaultValue="0" />
               </div>
               <DiscountModal show={showDiscountModal} hide={() => setShowDiscountModal(false)}/>
          </div>
     );
}

export default PaymentBreakdown;
