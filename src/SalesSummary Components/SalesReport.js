import React from 'react'
import styles from './SalesReport.module.css'
import SalesOrdersStatusTable from './SalesOrdersStatusTable'
import SalesPaymentTable from './SalesPaymentTable'

function SalesReport({salesTotalSummary}) {
  return (
    <div className={styles.reportContainer}>
        <SalesOrdersStatusTable salesTotalSummary={salesTotalSummary}/>
        <SalesPaymentTable salesTotalSummary={salesTotalSummary}/>
    </div>
  )
}

export default SalesReport