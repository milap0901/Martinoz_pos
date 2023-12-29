const { authenticateBiller } = require("../biller/authenticateBiller");

const authenticateBillerMiddleware = async (req, res, next) => {
  try {
    if (req.body.finalOrder.order_status === "cancelled") {
      const billerCred = req.body.finalOrder.billerCred;
      const isValid = await authenticateBiller(billerCred);
      if (isValid) {
        next();
      } else {
        res.status(401).json({
          status: true,
          data: undefined,
          message: "invalid password",
          error: false,
        });
      }
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "order update Failed",
      data: undefined,
      error,
    });
  }
};

module.exports = { authenticateBillerMiddleware };
