import React, { useState } from "react";
import styles from "./ServerConfig.module.css";
import { useSelector, useDispatch } from "react-redux";
import { setSystem } from "../Redux/serverConfigSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "react-query";
import { modifyCartData } from "../Redux/finalOrderSlice";
import Loading from "../Feature Components/Loading";

function ServerConfig() {

  //redux server config state
  const { systemType, IPAddress } = useSelector((state) => state.serverConfig);

  //loading and error state 
  //todo : make call using rect-query remove manual error and loading state
  const [clientLoading, setClientLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const getServerStatus = async () => {
    const { data } = await axios.get(
      `http://${IPAddress}:3001/defaultScreenData`,
      { timeout: 5000 }
    );
    // console.log(data)
    return data;
  };


  //onchange handler for input fields
  const handleChange = (e) => {
    let { name, value } = e.target;

    //if selected systemType is server set ipaddress as "localhost" as it will send all api call to "localhost"
    if(name === "systemType" && value === "server"){
      // redux servercofig slice state change
      dispatch(setSystem({name:"IPAddress",value:"localhost"}))
    }

    dispatch(setSystem({ name, value }));
  };


 // mutation for checking server status 
// if system type is "client" it will make api call to that server via ip address provided 
// this mutation checks weather server is running or not 
  const {
    mutate: serverMutation,
    isLoading,
    isError,
  } = useMutation({
    mutationKey: "serverStatus",
    mutationFn: getServerStatus,
    cacheTime: 0,
    onSuccess: async (data) => {
       
      // in case server is running success will fire
      // make ipc call to electron which will store ip address and sever data in local database as it will be needed in next time app starts
      await window.apiKey.request("storeServerData", {
        IPAddress,
        systemType,
      });

      
      // this mutation also returns default data to set as well as check server status
      // set default data to final order slice
      dispatch(
        modifyCartData({ orderType: data.default_order_type || "delivery" })
      );
      dispatch(
        modifyCartData({ paymentMethod: data.default_payment_type || "cash" })
      );

      // navigate to next page for biller login

      navigate("../login");

      
    },
    onError: () => {

      //in case server dint respond set error message
      setClientLoading(false);
      setErrorMsg("server is not responding");
    },
    onSettled: () => {
      setClientLoading(false);
    },
  });


  // onclick handler 
  const handleClick = async (system) => {

    setClientLoading(true);

    // if system type selected is "server" make ipc call to electron to start server on local system
    if (system === "server") {
      try {
        // let res = await window.apiKey.request("setup", system);
        await window.apiKey.request("setup", system);
      } catch (err) {
        setErrorMsg("Server did not start");
      }
    }

    // make api call (mutation ) to that server
    // this mutation will handle success or error state of server response as above
    serverMutation();
  };


  if (isLoading || clientLoading) {
    return (
      <div className={styles.serverConfig}>
        <Loading />
      </div>
    );
  } else {
    return (
      <div className={styles.serverConfig}>
        <form className={styles.main}>
          <div>
            <input
              className={styles.radio}
              id="server"
              type="radio"
              name="systemType"
              value="server"
              checked={systemType === "server"}
              onChange={handleChange}
            />
            <label htmlFor="server">setup as server </label>
          </div>

          <div>
            <input
              className={styles.radio}
              id="client"
              type="radio"
              name="systemType"
              value="client"
              checked={systemType === "client"}
              onChange={handleChange}
            />
            <label htmlFor="client"> setup as client </label>
          </div>
          <div>
            <label>Server IP Address :</label>
            <input
              type="text"
              className={styles.ipAddress}
              name="IPAddress"
              value={IPAddress}
              placeholder="192.168.1.208"
              onChange={handleChange}
              disabled = {systemType === "server"}

            />
          </div>
          {isError && <div className={styles.err}> {errorMsg} </div>}
          <button
            className={styles.btn}
            onClick={() => handleClick(systemType)}
            disabled={systemType.length === 0 || IPAddress.trim().length === 0}
          >
            {isLoading ? "loading..." : "next"}
          </button>
        </form>
      </div>
    );
  }
}

export default ServerConfig;
