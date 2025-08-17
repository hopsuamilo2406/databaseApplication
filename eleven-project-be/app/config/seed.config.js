const { get } = require("mongoose");
const bcrypt = require("bcryptjs");
const db = require("../models/init.js");
const Warehouse = db.warehouses;
const Product = db.products;
const ProductCategory = db.product_categories;
const User = db.users;
const Cart = db.carts;
const CartItem = db.cart_items;
const Order = db.orders;
const OrderItem = db.order_items;

const { faker } = require("@faker-js/faker");

const getRandomWarehouse = () => {
  return {
    name: faker.company.name(),
    address: faker.location.streetAddress(),
  };
};

getRandomProductCategory = () => {
  return {
    name: faker.commerce.department(),
    additional_attributes: {
      color: faker.color.rgb(),
      size: faker.number.bigInt(),
    },
  };
};

const getRandomProduct = (warehouseId, productCategoryId) => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    quantityNumber: 10,
    dimension: faker.number.float(),
    image: faker.image.urlLoremFlickr({ category: 'fashion' }),
    warehouseId: warehouseId,
    categoryId: productCategoryId,
  };
};

const getRandomUser = () => {
  return {
    username: "william1",
    passwordHash: bcrypt.hashSync("123456", 8),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(["CUSTOMER"]),
  };
};

const getRandomCart = (userId) => {
  return {
    userId: userId,
  };
};

const getRandomCartItem = (cartId, productId, productDetail) => {
  return {
    cartId: cartId,
    productId: productId,
    itemDetail: productDetail,
    quantity: 3,
  };
};

const getRandomOrder = (userId) => {
  return {
    userId: userId,
    status: "pending",
  };
};

const getRandomOrderItem = (orderId, productId, itemDetail, quantity) => {
  return {
    orderId: orderId,
    productId: productId,
    quantity: quantity,
    itemDetail: itemDetail,
  };
};
exports.seedAcount = async () => {
  try {
    await User.create({
      username: "test",
      passwordHash: bcrypt.hashSync("123456", 8),
      email: faker.internet.email(),
      role: "CUSTOMER",
    });
    console.log("success seed");
  } catch (err) {
    console.log("failure seed" + err.message);
  }
};

exports.seedToDB = async () => {
  try {
    const warehouse = await Warehouse.create(getRandomWarehouse());
    const productCategory = await ProductCategory.create(
      getRandomProductCategory()
    );
    const product1 = await Product.create(
      getRandomProduct(warehouse.id, productCategory.id)
    );
    const product2 = await Product.create(
      getRandomProduct(warehouse.id, productCategory.id)
    );
    const product3 = await Product.create(
      getRandomProduct(warehouse.id, productCategory.id)
    );

    const user = await User.create(getRandomUser());

    const cart = await Cart.create(getRandomCart(user.id));

    const cartItem1 = await CartItem.create(
      getRandomCartItem(cart.id, product1.id, {
        title: product1.title,
        quantityNumber: product1.quantityNumber,
      })
    );

    const cartItem2 = await CartItem.create(
      getRandomCartItem(cart.id, product2.id, {
        title: product2.title,
        quantityNumber: product2.quantityNumber,
      })
    );

    const cartItem3 = await CartItem.create(
      getRandomCartItem(cart.id, product3.id, {
        title: product3.title,
        quantityNumber: product3.quantityNumber,
      })
    );

    const order = await Order.create(getRandomOrder(user.id));

    const orderItem1 = await OrderItem.create(
      getRandomOrderItem(
        order.id,
        product1.id,
        cartItem1.itemDetail,
        cartItem1.quantity
      )
    );

    const orderItem2 = await OrderItem.create(
      getRandomOrderItem(
        order.id,
        product2.id,
        cartItem2.itemDetail,
        cartItem1.quantity
      )
    );

    const orderItem3 = await OrderItem.create(
      getRandomOrderItem(
        order.id,
        product3.id,
        cartItem3.itemDetail,
        cartItem1.quantity
      )
    );

    console.log("success seed");
  } catch (err) {
    console.log("failure seed" + err.message);
  }
};
