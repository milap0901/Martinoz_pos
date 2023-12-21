import React from "react";

const orderTypeMap = {
  pick_up: "Pick Up",
  dine_in: "Dine in",
  delivery: "Delivery",
};

const styles = {
  mainDiv: {
    display: "flex",
    flexDirection: "column",
    fontFamily: "Roboto",
    paddingRight: "10px",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
  },
  shop: {
    fontWeight: "700",
    textAlign: "center",
    fontSize: "15px",
    fontFamily: "Roboto",
  },
  hr: {
    width: "100%",
    margin: "2px 0 0 0",
  },
  customerDetails: {
    textAlign: "left",
    fontSize: "13px",
    margin: "0 0 0 5px",
    fontFamily: "Roboto",
  },
  orderDetail: {
    display: "flex",
    fontSize: "13px",
    margin: "0 0 0 5px",
    flexDirection: "row",
  },
  bold: {
    fontWeight: "bold",
  },
  orderDetailMariginLeft: {
    marginLeft: "auto",
  },
  table: {
    fontFamily: "Roboto",
  },
  tableHead: {
    borderBottom: "1px solid",
    fontFamily: "Roboto",
  },
  tableRow: {
    border: "none",
    fontFamily: "Roboto",
  },
  tableCell: {
    textAlign: "left",
    padding: "2px 2px",
    border: "none",
    fontFamily: "Roboto",
    // whiteSpace: "nowrap",
  },
  amount: {
    textAlign: "right",
    padding: "2px 2px",
    border: "none",
    whiteSpace: "nowrap",
    fontFamily: "Roboto",
  },
  footer: {
    textAlign: "center",
    fontWeight: "bold",
  },
};

function Invoice({ order, defaultSettings }) {
  let itemTotalQty = order.items.reduce(
    (total, item) => (total += item.quantity),
    0
  );
  console.log("online order id", order.online_order_id);
  console.log("order", order);

  let itemDiscount = 0;

  return (
    <div style={styles.mainDiv}>
      {order.bill_paid ? <div style={{ ...styles.footer }}>Paid</div> : ""}

      <div style={styles.header}>
        <div style={styles.shop}>
          {defaultSettings.name}({defaultSettings.branch})
        </div>
        <div style={styles.shop}>{defaultSettings.address}</div>
        <div style={styles.shop}>Mob. No. {defaultSettings.contact}</div>
        <div style={styles.shop}>GST NO. : {defaultSettings.gstin}</div>
      </div>

      <hr style={styles.hr} />

      <div>
        <div style={styles.customerDetails}>
          Name : {order.customer_name || ""}
        </div>
        <div style={styles.customerDetails}>
          Mobile : {order.phone_number || ""}
        </div>
        <div style={styles.customerDetails}>
          Add : {order.complete_address || ""}
        </div>
      </div>

      <hr style={styles.hr} />

      <div>
        <div style={styles.orderDetail}>
          <div>Date : {order?.created_at.split(" ")[0]}</div>
          <div style={{ ...styles.orderDetailMariginLeft, ...styles.bold }}>
            {orderTypeMap[order.order_type]}
          </div>
        </div>
        <div style={styles.orderDetail}>
          <div>Time : {order?.created_at.split(" ")[1]}</div>
          <div style={styles.orderDetailMariginLeft}>
            Bill No : {order.bill_no}
          </div>
        </div>
        <div style={styles.orderDetail}>
          <div>Cashier : {order.biller_name}</div>
          <div style={{ ...styles.orderDetailMariginLeft, ...styles.bold }}>
            Token No : {order.KOTDetail.map((i) => i.token_no).join(",")}
          </div>
        </div>
      </div>

      <hr style={styles.hr} />

      <table style={styles.table}>
        <thead style={styles.tableHead}>
          <tr style={styles.tableRow}>
            <th style={{ ...styles.tableCell, maxWidth: "120px" }}>Item</th>
            <th style={{ textAlign: "right" }}>QTY</th>
            <th style={{ textAlign: "right" }}>Price</th>
            <th style={{ textAlign: "right" }}>Amount</th>
          </tr>
        </thead>

        <tbody style={{ borderCollapse: "unset", marginTop: "2px" }}>
          {order.items.map((item) => (
            <>
              <tr
                key={item.id}
                style={{ ...styles.tableRow, marginTop: "3px" }}
              >
                <td
                  style={{
                    ...styles.tableCell,
                    fontSize: "13px",
                    maxWidth: "120px",
                  }}
                >{`${item.item_name} ${
                  item.variation_name ? `[${item.variation_name}]` : ""
                }`}</td>
                <td style={styles.amount}>⨉ {item.quantity}</td>
                <td style={styles.amount}>{item.price.toFixed(2)}</td>
                <td style={styles.amount}>
                  {(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
              {item.itemAddons &&
                item.itemAddons.map((i) => (
                  <tr key={i.id} style={styles.tableRow}>
                    <td
                      colSpan="4"
                      style={{
                        ...styles.tableCell,
                        paddingLeft: "20px",
                        fontSize: "12px",
                      }}
                    >
                      {i.name}[topping]: {i.quantity} × {i.price} =
                      {i.quantity * i.price}
                    </td>
                  </tr>
                ))}
              {item.discount_detail.map((discount) => {
                if (
                  (discount.type === "offer" && discount.discount) ||
                  (discount.type === "promo" &&
                    discount.discount === item.price)
                ) {
                  // Accumulate the discount for each item
                  itemDiscount += discount.discount;
                  return (
                    <tr key={discount.id} style={styles.tableRow}>
                      <td style={{ ...styles.tableCell, textAlign: "left" }}>
                        Discount ({discount.d_name})
                      </td>
                      <td style={styles.tableCell}></td>
                      <td style={styles.tableCell}></td>
                      <td style={{ ...styles.tableCell, textAlign: "right" }}>
                        -{discount.discount.toFixed(2)}
                      </td>
                    </tr>
                  );
                } else {
                  return null;
                }
              })}
            </>
          ))}

          <tr
            style={{
              borderTop: "1px solid",
              borderBottom: "0px",
            }}
          >
            <td
              colSpan="2"
              style={{ paddingBottom: "0px", textAlign: "right" }}
            >
              Item Qty : {itemTotalQty}
            </td>
            <td style={{ paddingBottom: "0px", textAlign: "right" }}>
              {" "}
              Total :
            </td>
            <td style={{ paddingBottom: "0px", textAlign: "right" }}>
              {" "}
              {(order.item_total - itemDiscount).toFixed(2)}
            </td>
          </tr>
          {/* data.discount - individualItemsDiscount > 0 */}
          {order.total_discount - itemDiscount > 0 && (
            <tr style={styles.tableRow}>
              <td
                colSpan="3"
                style={{
                  ...styles.amount,
                  textAlign: "right",
                  maxWidth: "120px",
                }}
              >
                Discount({order.promo_code}) :
                {/* Discount({order.promo_code}) : */}
              </td>
              <td style={{ ...styles.tableCell, textAlign: "right" }}>
                - {(order.total_discount - itemDiscount).toFixed(2)}
              </td>
            </tr>
          )}
          {order.tax_details.map((tax) => {
            return (
              <tr key={tax.td} style={styles.tableRow}>
                <td
                  colSpan="3"
                  style={{ ...styles.amount, textAlign: "right" }}
                >
                  {tax.name}({tax.tax_percent}%) :
                </td>
                <td style={{ ...styles.tableCell, textAlign: "right" }}>
                  {tax.tax.toFixed(2)}
                </td>
              </tr>
            );
          })}
          <tr
            style={{
              borderTop: "1px solid",
              borderBottom: "0px",
            }}
          >
            <td
              colSpan="3"
              style={{
                ...styles.bold,
                paddingBottom: "0px",
                textAlign: "right",
              }}
            >
              Grand Total :
            </td>
            <td
              style={{
                ...styles.bold,
                textAlign: "right",
                paddingBottom: "0px",
                whiteSpace: "nowrap",
              }}
            >
              {" "}
              ₹ {order.total.toFixed(2)}
            </td>
          </tr>
          <tr style={styles.tableRow}>
            <td
              colSpan="4"
              style={{
                textAlign: "left",
                fontSize: "13px",
                margin: "0 0 0 5px",
                padding: "0px",
                fontFamily: "Roboto",
                ...styles.bold,
              }}
            >
              {order.online_order_id
                ? order.payment_type === "cod"
                  ? "Cash on Delivery"
                  : "Paid Online"
                : ""}
            </td>
          </tr>
        </tbody>
      </table>

      <hr style={styles.hr} />

      <div>
        {defaultSettings.fssai && (
          <div style={{ ...styles.footer, marginTop: "5px" }}>
            FSSAI Lic NO. {defaultSettings.fssai}
          </div>
        )}
        <div style={styles.footer}>{defaultSettings.invoice_f_m}</div>
      </div>
    </div>
  );
}

export default Invoice;

// import React from "react";
// import Style from "./invoice.css";

// const orderTypeMap = {
//   pick_up: "Pick Up",
//   dine_in: "Dine in",
//   delivery: "Delivery",
// };

// function Invoice({ order, defaultSettings }) {
//   console.log("order", order);
//   const mainDiv = {
//     display: "flex",
//     flexDirection: "column",
//   };

//   const header = {
//     alignItems: "center",
//     justifyContent: "center",
//   };

//   const shop = {
//     fontWeight: "700",
//     textAlign: "center",
//     fontSize: "15px",
//     fontFamily: "Roboto",
//   };

//   const hr = {
//     width: "100%",
//   };

//   const customerDetails = {
//     textAlign: "left",
//     fontSize: "13px",
//     margin: "0 0 0 5px",
//     fontFamily: "Roboto",
//   };

//   const orderDetail = {
//     display: "flex",
//     flexDirection: "row",
//   };

//   const bold = {
//     fontWeight: "bold",
//   };

//   const orderDetailMariginLeft = {
//     marginLeft: "auto",
//   };

//   return (
//     <div style={mainDiv}>
//       {/* {defaultSettings.bill_paid ? <div>Paid</div> : ""} */}
//       <div style={header}>
//         <div style={shop}>
//           {defaultSettings.name}({defaultSettings.branch})
//         </div>
//         <div style={shop}>{defaultSettings.address}</div>
//         <div style={shop}>Mob. No. {defaultSettings.contact}</div>
//         <div style={shop}>GST NO. : {defaultSettings.gstin}</div>
//       </div>
//       <hr style={hr} />
//       <div>
//         <div style={customerDetails}>Name : {order.customer_name || ""}</div>
//         <div style={customerDetails}>Mobile : {order.phone_number || ""}</div>
//         <div style={customerDetails}>Add : {order.complete_address || ""}</div>
//       </div>
//       <hr style={hr} />
//       <div>
//         <div style={orderDetail}>
//           <div>Date : {order?.created_at.split(" ")[0]}</div>
//           <div style={{ ...orderDetailMariginLeft, ...bold }}>
//             {orderTypeMap[order.order_type]}
//           </div>
//         </div>
//         <div style={orderDetail}>
//           <div>Time : {order?.created_at.split(" ")[1]}</div>
//           <div style={orderDetailMariginLeft}>Bill No : {order.bill_no}</div>
//         </div>
//         <div style={orderDetail}>
//           <div>Cashier : {order.biller_name}</div>
//           <div style={{ ...orderDetailMariginLeft, ...bold }}>
//             Token No : {order.KOTDetail.map((i) => i.token_no).join(",")}
//           </div>
//         </div>
//       </div>
//       <hr style={hr} />
//       <table style={{ fontFamily: "Roboto" }}>
//         <thead style={{ borderBottom: "1px solid" }}>
//           <tr style={{ borderBottom: "1px solid" }}>
//             <th style={{ textAlign: "left", padding: "4px 2px" }}>Item</th>
//             <th>QTY</th>
//             <th style={{ textAlign: "right" }}>Price</th>
//             <th style={{ textAlign: "right" }}>Amount</th>
//           </tr>
//         </thead>

//         <tbody style={{ borderCollapse: "unset" }}>
//           {order.items.map((item) => (
//             <>
//               {" "}
//               <tr key={item.id} style={{ border: "none" }}>
//                 <td
//                   style={{
//                     textAlign: "left",
//                     padding: "2px 2px",
//                     maxWidth: "130px",
//                     border: "none",
//                   }}
//                 >{`${item.item_name} ${
//                   item.variation_name ? `[${item.variation_name}]` : ""
//                 }`}</td>
//                 <td style={{ border: "none", padding: "2px 2px" }}>
//                   ⨉{item.quantity}
//                 </td>
//                 <td
//                   style={{
//                     textAlign: "right",
//                     border: "none",
//                     padding: "2px 2px",
//                   }}
//                 >
//                   {item.price}
//                 </td>
//                 <td
//                   style={{
//                     textAlign: "right",
//                     border: "none",
//                     padding: "2px 2px",
//                   }}
//                 >
//                   {item.price * item.quantity}
//                 </td>
//               </tr>
//               {item.itemAddons &&
//                 item.itemAddons.map((i) => (
//                   <tr key={i.id} style={{ border: "none" }}>
//                     <td
//                       style={{
//                         textAlign: "left",
//                         padding: "0px",
//                         border: "none",
//                         padding: "0px 0px 0px 20px",
//                       }}
//                     >
//                       {i.name}[topping]:
//                     </td>
//                     <td
//                       style={{
//                         padding: "0px",
//                         textAlign: "left",
//                         border: "none",
//                       }}
//                     >
//                       {i.quantity} ⨉ {i.price}
//                     </td>
//                     <td
//                       style={{
//                         padding: "0px",
//                         textAlign: "left",
//                         border: "none",
//                       }}
//                     >
//                       {"\u00A0"} = {i.quantity * i.price}
//                     </td>
//                     <td
//                       style={{
//                         padding: "0px",
//                         textAlign: "left",
//                         border: "none",
//                       }}
//                     ></td>
//                   </tr>
//                 ))}
//               {item.discount_detail.map((discount) => {
//                 return (discount.type === "offer" && discount.discount) ||
//                   (discount.type === "promo" &&
//                     discount.discount === item.itemTotal) ? (
//                   <tr key={discount.id} style={{ border: "none" }}>
//                     <td
//                       style={{
//                         padding: "0px",
//                         border: "none",
//                         textAlign: "left",
//                       }}
//                     >
//                       discount({discount.d_name})
//                     </td>
//                     <td style={{ padding: "0px", border: "none" }}></td>
//                     <td style={{ padding: "0px", border: "none" }}></td>
//                     <td
//                       style={{
//                         padding: "0px",
//                         textAlign: "right",
//                         border: "none",
//                       }}
//                     >
//                       -{discount.discount}
//                     </td>
//                   </tr>
//                 ) : null;
//               })}
//             </>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Invoice;
