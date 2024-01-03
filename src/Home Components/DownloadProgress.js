import React, { useEffect } from "react";

function DownloadProgress() {
	useEffect(() => {
		window.apiKey.renderedOn("updateProgress", payload => {
			console.log(payload);
		});

        window.apiKey.renderedOn("updateAwailaible",payload =>{
            console.log(payload)
        })

        window.apiKey.renderedOn("updateNotAwailaible",payload =>{
            console.log(payload)
        })

		return () => {
			window.apiKey.rendereOff("updateProgress");
		};
	}, []);

	return <div>DownloadProgress</div>;
}

export default DownloadProgress;
