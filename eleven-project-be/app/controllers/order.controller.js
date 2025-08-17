const {
  checkWarehouseAvaliable,
  createOrder,
} = require("../services/order.service");
const { getCart } = require("../services/cart.service");
const { findOneProduct } = require("../services/product.service");
const db = require("../models/init");
const { Transaction, where } = require("sequelize");
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  const { userId } = req.body;
  try {
    await db.sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
      },
      async (t) => {
        const cart = await getCart(userId);

        for (const cartItem of cart.cart_items) {
          const product = await findOneProduct(cartItem.productId);
          console.log(product.quantityNumber, cartItem.quantity);
          if (product.quantityNumber < cartItem.quantity) {
            throw new Error("Product " + product.title + " is out of stock");
          }
        }

        const result = await createOrder(userId, cart.id);

        res.status(200).send(result);
      },
    );
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.findOrderByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await db.orders.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: db.order_items,
          as: "order_items",
        },
      ],
    });
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, orderId } = req.body;
  try {
    const order = await db.orders.findByPk(orderId);
    if (!order) throw new Error("Order not found");

    if (order.status != "pending")
      throw new Error("Order status must be pending to change status");

    if (status == "accept") {
      const cart = await getCart(id);

      for (const cartItem of cart.cart_items) {
        await db.order_items.create({
          orderId: order.id,
          productId: cartItem.productId,
          itemDetail: cartItem.itemDetail,
          quantity: cartItem.quantity,
        });
      }
      await order.update({ status: status });

      await cart.destroy();

      res
        .status(200)
        .send({ message: "Order was updated to accept successfully!" });
    } else if (status == "reject") {
      await order.update({ status: status });
      res
        .status(200)
        .send({ message: "Order was updated to reject successfully!" });
    } else {
      throw new Error("Status must be accept or reject");
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
