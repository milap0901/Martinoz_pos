import React from 'react'
import styles from "./BackButton.module.css"

function BackButton({onClick}) {
  return (
    <button className={styles.backButton} onClick={() => onClick()}>
    {" "}
    <span> &larr; </span> Back
</button>
  )
}

export default BackButton