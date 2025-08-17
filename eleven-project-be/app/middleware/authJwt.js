const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/init.js");
const User = db.users;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};
isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    user.role !== "ADMIN"
      ? res.status(403).send({ message: "Require Admin Role!" })
      : next();
  });
};
isSeller = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    user.role !== "SELLER"
      ? res.status(403).send({ message: "Require Seller Role!" })
      : next();
  });
};

isCustomer = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    user.role !== "CUSTOMER"
      ? res.status(403).send({ message: "Require Customer Role!" })
      : next();
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isSeller: isSeller,
  isCustomer: isCustomer,
};
module.exports = authJwt;
