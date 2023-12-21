import React from 'react'
import styles from './SalesTotals.module.css'
import TotalTiles from './TotalTiles'

function SalesTotals({salesTotalSummary}) {
  return (
    <div className={styles.salesTotalContainer}>
        <TotalTiles title={"My Amount"} amount={salesTotalSummary?.totalMyAmount?.total} bgColor={"#121736"}/> 
        <TotalTiles title={"Tax"} amount={salesTotalSummary?.totalTax} bgColor={"#062e14"}/>
        <TotalTiles title={"Total"} amount={salesTotalSummary?.totalSettleAmount.total} bgColor={"#2e2b06"}/>
        <TotalTiles title={"Tip"} amount={salesTotalSummary?.totalTip} bgColor={"#2e0606"}/>

       
    </div>
  )
}

export default SalesTotals