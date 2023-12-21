import Echo from "laravel-echo";
import io from "socket.io-client";
window.io = io; 

const echo = new Echo({
  broadcaster: "socket.io",
  host: "http://192.168.1.92:6001", 
//   transports: ["websocket", "polling", "flashsocket"],
  client: io,
});

export default echo;