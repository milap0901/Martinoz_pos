import React from "react";
import styles from "./Configuration.module.css";
import OrdersIcon from "../icons/ic_Orders.png";
import onlineOrderIcon from "../icons/ic_OnlineOrder.png";
import KOTsIcon from "../icons/ic_KOT.png";
import CustomersIcon from "../icons/ic_Customers.png";
import CashFlowIcon from "../icons/ic_cashflow.png";
import ExpenseIcon from "../icons/ic_Expense.png";
import WithdrawalIcon from "../icons/ic_withdrawal.png";
import CashTopUpIcon from "../icons/ic_cashflow.png";
import InventoryIcon from "../icons/ic_Inventory.png";
import NotificationIcon from "../icons/ic_notification.png";
import TableIcon from "../icons/ic_table.png";
import ManualSyncIcon from "../icons/ic_ManualSync.png";
import HelpIcon from "../icons/ic_help.png";
import LiveViewIcon from "../icons/ic_LiveView.png";
import DuePaymentIcon from "../icons/ic_DuePayment.png";
import LanguageProfileIcon from "../icons/ic_LanguageProfile.png";
import BillingUserProfileIcon from "../icons/ic_Billing_user_profile.png";
import CurrencyConversionIcon from "../icons/ic_currency_conversion.png";
import FeedbackIcon from "../icons/ic_feedback.png";
import DeliveryIcon from "../icons/ic_dmgt.png";
import LEDDisplayIcon from "../icons/ic_leddisplay.png";
import MenuIcon from "../icons/ic_menu.png";
import BilKotPrintIcon from "../icons/ic_bill-KOT-print.png";
import TaxIcon from "../icons/ic_tax.png";
import DiscountIcon from "../icons/ic_discount.png";
import BillingStationIcon from "../icons/ic_BillingScreen.png";
import SettingsIcon from "../icons/ic_Settings_small.png";
import OnlineOrderIcon from "../icons/ic_OnlineOrderConfiguration.png";
import MenuOnOffIcon from "../icons/ic_MenuItemOn-Off.png";
import OrderStatusIcon from "../icons/cust-order-config.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { v4 } from "uuid";

function Configuration() {
      const configOrderItems = [
            { name: "Orders", icon: OrdersIcon, navigateTo: "../LiveView/OrderView" },
            { name: "Online Orders", icon: onlineOrderIcon, navigateTo: "" },
            { name: "KOTs", icon: KOTsIcon, navigateTo: "../LiveView/KOTView" },
            { name: "Customers", icon: CustomersIcon, navigateTo: "" },
            { name: "Cash Flow", icon: CashFlowIcon, navigateTo: "" },
            { name: "Expense", icon: ExpenseIcon, navigateTo: "" },
            { name: "Withdrawal", icon: WithdrawalIcon, navigateTo: "" },
            { name: "Cash Top-up", icon: CashTopUpIcon, navigateTo: "" },
            { name: "inventory", icon: InventoryIcon, navigateTo: "" },
            { name: "Notification", icon: NotificationIcon, navigateTo: "" },
            { name: "Table", icon: TableIcon, navigateTo: "../tableView" },
            { name: "Manual Sync", icon: ManualSyncIcon, navigateTo: "" },
            { name: "Help", icon: HelpIcon, navigateTo: "" },
            { name: "Live View", icon: LiveViewIcon, navigateTo: "" },
            { name: "Due Payment", icon: DuePaymentIcon, navigateTo: "" },
            { name: "Language Profile", icon: LanguageProfileIcon, navigateTo: "" },
            { name: "Billing User Profile", icon: BillingUserProfileIcon, navigateTo: "" },
            { name: "Currency Conversion", icon: CurrencyConversionIcon, navigateTo: "" },
            { name: "Feedback", icon: FeedbackIcon, navigateTo: "" },
            { name: "Delivery", icon: DeliveryIcon, navigateTo: "" },
            { name: "LED Display", icon: LEDDisplayIcon, navigateTo: "" },
      ];

      const configRestaurantItems = [
            { name: "Menu", icon: MenuIcon, navigateTo: "../LiveView/OrderView" },
            { name: "Bill / KOT Print", icon: BilKotPrintIcon, navigateTo: "printerConfig" },
            { name: "Tax", icon: TaxIcon, navigateTo: "../LiveView/KOTView" },
            { name: "Discount", icon: DiscountIcon, navigateTo: "" },
            { name: "Billing Screen", icon: BillingStationIcon, navigateTo: "billingScreenConfig" },
            { name: "Settings", icon: SettingsIcon, navigateTo: "" },
            { name: "online config", icon: OnlineOrderIcon, navigateTo: "" },
            { name: "Menu Item ON/OFF", icon: MenuOnOffIcon, navigateTo: "" },
            { name: "Order Status", icon: OrderStatusIcon, navigateTo: "" },
      ];

      return (
            <motion.div className={styles.ConfigurationBody} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.1 }}>
                  <header className={styles.configHeader}>
                        <div className={styles.configInfo}>
                              <div>Configuration</div>
                              <div>Version : 1.0.0</div>
                        </div>
                        <div className={styles.configStationInfo}>
                              <div>Main Server</div>
                              <div>Master Billing Station</div>
                        </div>
                  </header>
                  <main className={styles.configMain}>
                        <div className={styles.configSupport}>
                              <div className={styles.contact}>985364466</div>
                              <div className={styles.contact}>emergingcoders9@gmail.com</div>
                        </div>
                        <div className={styles.configBody}>
                              <div className={styles.configOrderItems}>
                                    {configOrderItems.map((orderItem) => {
                                          return (
                                                <Link to={orderItem.navigateTo} key={v4()} className={styles.configItemLink}>
                                                      <img className={styles.itemIcon} src={orderItem.icon} />
                                                      <div>{orderItem.name}</div>
                                                </Link>
                                          );
                                    })}
                              </div>
                              <div className={styles.configRestaurantTitle}>Restaurant Configuration</div>
                              <div className={styles.configOrderItems}>
                                    {configRestaurantItems.map((orderItem) => {
                                          return (
                                                <Link to={orderItem.navigateTo} key={v4()} className={styles.configItemLink}>
                                                      <img className={styles.itemIcon} src={orderItem.icon} />
                                                      <div>{orderItem.name}</div>
                                                </Link>
                                          );
                                    })}
                              </div>
                        </div>
                  </main>
            </motion.div>
      );
}

export default Configuration;
