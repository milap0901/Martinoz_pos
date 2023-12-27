var jwt = require("jsonwebtoken");

const getServerData = (db2, SECRET) => {
  try {
    console.log("getServerData ran");
    const startUpData = db2.prepare("SELECT * FROM startup_config").all();
    let resultObject = {};
    for (const item of startUpData) {
      resultObject[item.name] = item.value || null;
    }
    try {
      const subscriptionStatus = jwt.verify(resultObject.JWT, SECRET);
      resultObject = { ...resultObject, subscriptionStatus };
    } catch {
      resultObject = { ...resultObject, subscriptionStatus: false };
    }

    return resultObject;
  } catch (err) {
    console.log("serverData not found :", err);
    return undefined;
  }
};

module.exports = { getServerData };
