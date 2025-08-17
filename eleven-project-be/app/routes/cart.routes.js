const authJwt = require("../middleware/authJwt.js");

module.exports = (app) => {
  const carts = require("../controllers/cart.controller.js");

  var router = require("express").Router();

  router.post(
    "/add",
    [authJwt.verifyToken, authJwt.isCustomer],
    carts.addToCart
  );
  router.get("/", [authJwt.verifyToken, authJwt.isCustomer], carts.getCart);
  router.delete(
    "/cart_items",
    [authJwt.verifyToken, authJwt.isCustomer],
    carts.deleteCartItems
  );

  app.use("/api/carts", router);
};
