import { io } from "socket.io-client";
import store from "../Redux/store";

const getSocket =  () => {

      const state = store.getState()  
      const ipAddress = state.serverConfig.IPAddress
      
      const socket = io(`http://${ipAddress}:3001`); // Replace with your server URL
      return socket;
};

export default getSocket;
