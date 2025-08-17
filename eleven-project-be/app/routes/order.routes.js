const authJwt = require("../middleware/authJwt.js");

module.exports = (app) => {
  const orders = require("../controllers/order.controller.js");

  var router = require("express").Router();

  router.post("/", [authJwt.verifyToken, authJwt.isCustomer], orders.create);

  router.get("/:userId", [authJwt.verifyToken, authJwt.isCustomer], orders.findOrderByUserId);

  router.put("/status/:id", [authJwt.verifyToken, authJwt.isCustomer], orders.updateOrderStatus);

  app.use("/api/orders", router);
};
