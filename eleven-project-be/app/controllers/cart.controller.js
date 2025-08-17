const {
  findOrCreateCart,
  createCartItem,
  getCart,
  getCartItem,
} = require("../services/cart.service");

exports.addToCart = async (req, res) => {
  const { userId, productTitle, productQuantity, productId, price } = req.body;

  if (!userId || !productTitle || !productQuantity || !productId || !price) {
    res.status(400).send({ message: "Fields is required" });
    return;
  }

  try {
    const [cart, created] = await findOrCreateCart(userId);

    const cartItem = await createCartItem(
      cart.id,
      productId,
      { title: productTitle, quantityNumber: productQuantity, price: price },
      productQuantity,
    );
    res.status(200).send(cartItem);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).send({ message: "User id is required" });
    return;
  }

  try {
    const cart = await getCart(userId);
    if (!cart) {
      res.status(404).send({ message: "Cart not found" });
      return;
    }

    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteCartItems = async (req, res) => {
  const { userId, cartItemId } = req.body;

  if (!userId) {
    res.status(400).send({ message: "User id is required" });
    return;
  }

  try {
    const cartItem = await getCartItem(userId, cartItemId);
    await cartItem.destroy();
    res.status(200).send({ message: "Cart was deleted successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
