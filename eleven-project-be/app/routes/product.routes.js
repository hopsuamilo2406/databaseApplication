module.exports = (app) => {
  const products = require("../controllers/product.controller.js");
  const authJwt = require("../middleware/authJwt.js");

  var router = require("express").Router();

  router.post("/", [authJwt.verifyToken, authJwt.isSeller], products.create);
  router.get("/", products.findAllProducts);
  router.get("/category/:categoryId", products.findAllProductByCategory);
  router.get("/:id", [authJwt.verifyToken, authJwt.isSeller], products.findOne);
  router.put("/:id", [authJwt.verifyToken, authJwt.isSeller], products.update);
  router.delete("/:id", [authJwt.verifyToken, authJwt.isSeller], products.delete);
  router.post("/move", [authJwt.verifyToken, authJwt.isAdmin], products.moveProduct);

  app.use("/api/products", router);
};
