const { getDb } = require("../common/getDb")
const db2 = getDb()

const updatePrintCount = (orderId,printCount) =>{
 
    try {
        db2.transaction(()=>{
            db2.prepare("UPDATE pos_orders SET print_count =?, sync = 0, updated_at = datetime('now', 'localtime') WHERE id =?").run([printCount,orderId])
        })()
        
    } catch (error) {
        console.log(error)
    }

}

module.exports = {updatePrintCount}