const authJwt = require("../middleware/authJwt.js");

module.exports = (app) => {
  const product_categories = require("../controllers/product_category.controller.js");
  var router = require("express").Router();

  router.post(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin],
    product_categories.create
  );
  router.get(
    "/",
    product_categories.findAll
  );
  router.get(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    product_categories.findOne
  );
  router.put(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    product_categories.update
  );
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    product_categories.delete
  );

  app.use("/api/categories", router);
};
