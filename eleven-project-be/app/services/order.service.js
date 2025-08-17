const db = require("../models/init.js");
const Cart = db.carts;
const CartItem = db.cart_items;

exports.checkWarehouseAvaliable = async (cartId) => {
  try {
    const cart = await Cart.findOne({
      where: {
        id: cartId,
      },
    });

    const cartItems = await CartItem.findAll({
      where: {
        cartId: cart.id,
      },
    });

    for (let i = 0; i < cartItems.length; i++) {
      const cartItem = cartItems[i];
      const product = cartItem.itemDetail;
      if (product.quantity < cartItem.quantity) {
        throw new Error("Product " + product.name + " is out of stock");
      }
    }
  } catch (err) {
    throw new Error("Failed to check warehouse: " + err.message);
  }
};

exports.createOrder = async (userId, cartId) => {
  try {
    return await db.orders.create({
      userId: userId,
      cartId: cartId,
      status: "pending",
    });
  } catch (err) {
    throw new Error("Failed to create order: " + err.message);
  }
};
