import React, { useEffect, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import styles from "./DownloadProgress.module.css";

function DownloadProgress() {
  const [showData, setShowData] = useState(false);
  const [progressBar, setProgressbar] = useState({ show: false, progress: 0 });
  const [checking, setChecking] = useState(false);
  const [noUpdate, setNoUpdate] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);

  const quitAndUpdate = async () => {
    await window.apiKey.request("quitAndRestart", {});
  };

  useEffect(() => {
    let timeout;

    window.apiKey.renderedOn("checking", (payload) => {
      console.log("checking");
      setUpdateComplete(false);
      setShowData(true);
      setChecking(true);
    });

    window.apiKey.renderedOn("updateAwailaible", (payload) => {
      setUpdateComplete(false);
      setShowData(true);
      setChecking(false);
      setNoUpdate(false);
      setProgressbar((prev) => ({ ...prev, show: true }));
    });

    window.apiKey.renderedOn("updateProgress", (payload) => {
      setUpdateComplete(false);
      setShowData(true);
      setChecking(false);
      setNoUpdate(false);
      setProgressbar((prev) => ({ ...prev, progress: payload?.percent }));
    });

    window.apiKey.renderedOn("updateNotAwailaible", (payload) => {
      setUpdateComplete(false);
      setShowData(true);
      setChecking(false);
      setProgressbar({ show: false, progress: 0 });
      setNoUpdate(true);

      timeout = setTimeout(() => {
        setShowData(false);
      }, 20000);
    });

    window.apiKey.renderedOn("updateDownloaded", (payload) => {
      setShowData(true);
      setChecking(false);
      setProgressbar({ show: false, progress: 100 });
      setNoUpdate(false);
      setUpdateComplete(true);
    });

    

    return () => {
      window.apiKey.rendereOff("updateProgress");
      window.apiKey.rendereOff("Checking");
      window.apiKey.rendereOff("updateAwailaible");
      window.apiKey.rendereOff("updateNotAwailaible");
      window.apiKey.rendereOff("updateDownloaded");
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  if (!showData) return null;

  if (checking)
    return (
      <div className={styles.progressTitle}> checking for update.....</div>
    );

  if (noUpdate)
    return (
      <div className={styles.progressTitle}>
        {" "}
        Your Application is already running latest version{" "}
      </div>
    );

  if (progressBar.show) {
    return (
      <div>
        <div className={styles.progressTitle}>
          {" "}
          <div> Update In Progress...</div>
          <div> {Math.round(progressBar.progress)} %</div>
        </div>
        <ProgressBar
          className={styles.progressBar}
          animated
          now={progressBar.progress}
          variant="danger"
        />
      </div>
    );
  }

  if (updateComplete) {
    return (
      <div className={styles.container}>
        <div className={styles.progressTitle}>
          {" "}
          <div> Update Downloaded please Restart.</div>
        </div>
        <button className={styles.restart} onClick={quitAndUpdate}>
          Restart
        </button>
      </div>
    );
  }
}

export default DownloadProgress;
