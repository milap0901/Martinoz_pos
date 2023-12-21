import React, { useCallback, useMemo, useState } from 'react'
import styles from './SalesSummary.module.css'
import { useGetOrderSummaryQuery } from '../Utils/customQueryHooks';
import Loading from '../Feature Components/Loading';
import { getToday, getTomrrow } from '../Utils/getDate';
import ReportFilters from '../OrderSummary Components/ReportFilters';
import SalesTotals from '../SalesSummary Components/SalesTotals';
import SalesReport from '../SalesSummary Components/SalesReport';
import ReportPeriod from '../OrderSummary Components/ReportPeriod';

const today = getToday();
const tomrrow = getTomrrow();
const filtersMap = [
  { name: "from", displayName: "From", type: "date"},
  { name: "to", displayName: "To", type: "date" },
  {
    name: "order_type",
    displayName: "Order Type",
    type: "select",
    options: [
              { name: "All", value: "all" },
      { name: "Dine In", value: "dine_in" },
      { name: "Delivery", value: "delivery" },
      { name: "Pick Up", value: "pick_up" },
    ],
  },
] 

function SalesSummary() {

  const [filters, setFilters] = useState({ from: today, to: tomrrow, payment_type: "all", order_type: "all" });

	const { data: orders, isLoading, refetch } = useGetOrderSummaryQuery(filters);

  const fetchOrders = useCallback(() => {
		refetch();
	}, []);

  if(isLoading || !orders ){
		return <div className={styles.orderSummaryPage}> <Loading/></div>
	}
  return (
    <div className={styles.salesSummaryPage}>
      <header className={styles.pageHeader}> Sales Report </header>
      <ReportFilters filters={filters} setFilters={setFilters} fetchOrders={fetchOrders} filtersMap={filtersMap} />
      <ReportPeriod duration={orders?.duration}/>
      <SalesTotals salesTotalSummary={orders?.orderSummary||{}}/>
      <SalesReport salesTotalSummary={orders?.orderSummary||{}} />
    
  </div>
  )
}

export default SalesSummary