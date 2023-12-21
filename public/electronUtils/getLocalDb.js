const Database = require("better-sqlite3");

const getLocalDb = (destinationFile) =>{
    try{
    const db2 = new Database(destinationFile, {fileMustExist:true});
    return db2
}catch(err){
    console.log("database file not found :" , err  )
    return undefined
}
}

module.exports = {getLocalDb}