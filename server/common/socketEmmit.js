import { getLiveKOT } from "../KOT/getLiveKOT";
import { getLiveOrders } from "../orders/getLiveOrders";


export const socketEmmit = (io) =>{

    const orders = getLiveOrders();
	io.emit("orders", orders);
	const liveKOTs = getLiveKOT();
	io.emit("KOTs", liveKOTs);
}