import React, { useState, useEffect } from "react";

function MinTimer({ startTime }) {
      const [timer, setTimer] = useState();

      const initialDate = new Date(startTime);
      const initalTime = initialDate.getTime();

      function getTimeDifference(initialTime) {
            const now = new Date();
            const difference = now - initialTime;
            const minutes = Math.floor(difference / 60000);
            const seconds = ((difference % 60000) / 1000).toFixed(0);
            const timer = `${minutes}`;
    
            setTimer(timer);
            
      }

      useEffect(() => {
            getTimeDifference(initalTime);

            const int = setInterval(() => {
                  getTimeDifference(initalTime);
            }, 60000);

            return () => {
                  clearInterval(int);
            };
      }, []);

      return <>{timer} Min</>;
}

export default MinTimer;
