const db = require("../models/init.js");
const crypto = require("crypto");
const Cart = db.carts;
const CartItem = db.cart_items;

exports.findOrCreateCart = async (userId) => {
  try {
    return await Cart.findOrCreate({
      where: { userId: userId },
    });
  } catch (err) {
    throw new Error("Failed to create cart: " + err.message);
  }
};

exports.createCartItem = async (cartId, productId, productDetail, quantity) => {
  try {
    const [cartItem, created] = await CartItem.findOrCreate({
      where: { productId: productId },
      defaults: {
        cartId: cartId,
        productId: productId,
        itemDetail: productDetail,
        quantity: quantity,
      },
    });
    if (!created) {
      throw new Error("Item already exists in cart");
      return;
    }

    return cartItem;
  } catch (err) {
    throw new Error("Failed to create cart item: " + err.message);
  }
};

exports.getCart = async (userId) => {
  try {
    return await Cart.findOne({
      where: {
        userId: userId,
      },
      include: [
        {
          model: CartItem,
          as: "cart_items",
        },
      ],
    });
  } catch (err) {
    throw new Error("Failed to get cart: " + err.message);
  }
};

exports.getCartItem = async (userId, cartItemId) => {
  try {
    const cart = await Cart.findOne({
      where: {
        userId: userId,
      },
    });
    return await CartItem.findOne({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });
  } catch (err) {
    throw new Error("Failed to get cart item: " + err.message);
  }
};
