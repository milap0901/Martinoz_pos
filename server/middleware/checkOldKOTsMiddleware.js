const { checkOldKOTs } = require("../KOT/checkOldKOTs");

const checkOldKOTsMiddleware = (req, res, next) => {
  try {
    if (req.body.finalOrder.orderType === "dine_in") {
      const isOldKOTsExist = checkOldKOTs(req.body.finalOrder.tableNumber);
      if (isOldKOTsExist) {
        res.status(200).json({
          status: true,
          message: "kot update success",
          data: { isOldKOTsExist, order: {}, isOldOrderExist: false },
          error: false,
        });
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "kot update Failed",
      data: undefined,
      error,
    });
  }
};

module.exports = { checkOldKOTsMiddleware };
