
export const getItemsByStatus = (orderCart) =>{

    return orderCart.reduce((statusType,item)=>{
        if(["new","updated","removed"].includes(item.itemStatus)){
            statusType.modified.push(item)
        }
        
        if( ["updated","removed"].includes(item.itemStatus)){
            statusType.updated.push(item)
        }

        if(item.itemStatus === "new"){
            statusType.new.push(item)
        }
        else{
         statusType.old.push(item)
        }

        return statusType
    
    
    },{modified:[], new:[],updated:[],old:[]} )

} 


