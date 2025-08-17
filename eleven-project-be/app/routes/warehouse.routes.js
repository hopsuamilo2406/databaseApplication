module.exports = (app) => {
  const warehouses = require("../controllers/warehouse.controller.js");
  const authJwt = require("../middleware/authJwt.js");

  var router = require("express").Router();

  router.post("/", [authJwt.verifyToken, authJwt.isAdmin], warehouses.create);
  router.get("/", [authJwt.verifyToken, authJwt.isAdmin], warehouses.findAll);
  router.get(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    warehouses.findOne
  );
  router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], warehouses.update);
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    warehouses.delete
  );

  app.use("/api/warehouses", router);
};
