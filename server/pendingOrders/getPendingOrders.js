const { getDb } = require("../common/getDb");
const db2 = getDb();

const getPendingOrders = () =>{

    const rawPendingOrders = db2.prepare("SELECT * FROM pending_orders WHERE order_status = 'pending' ").all([])
    const pendingOrders = rawPendingOrders.map(order => ({...order,order_json:JSON.parse(order.order_json)}))


    return pendingOrders

}

module.exports = {getPendingOrders}