module.exports = (sequelize) => {
  const Cart = sequelize.define("cart", {});

  return Cart;
};
