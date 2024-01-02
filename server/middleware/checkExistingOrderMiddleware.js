const { checkExistingOrder } = require("../orders/checkExistingOrder");

const checkExistingOrderMiddleware = (req, res, next) => {
  try {
    const isOrderExist = checkExistingOrder(req.body);
    // console.log(JSON.stringify(req.body));
    // console.log(isOrderExist);
    if (!isOrderExist) {
      next();
    } else {
      res.status(200).json({
        status: false,
        message: "kot create success",
        data: { isOrderExist, kotTokenNo: undefined },
        error: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "kot create Failed",
      data: undefined,
      error,
    });
  }
};

module.exports = { checkExistingOrderMiddleware };
