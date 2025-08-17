const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
const { Transaction } = require("sequelize");
mongoose.Promise = global.Promise;
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

// MongoDB
db.mongoDBUrl = dbConfig.mongoDBUrl;
db.product_categories = require("./product_category.model.js")(mongoose);

// MySQL
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.mongoose = mongoose;

db.order_items = require("./order_item.model.js")(sequelize, Sequelize);
db.products = require("./product.model.js")(sequelize, Sequelize);
db.orders = require("./order.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.warehouses = require("./warehouse.model.js")(sequelize, Sequelize);
db.carts = require("./cart.model.js")(sequelize, Sequelize);
db.cart_items = require("./cart_item.model.js")(sequelize, Sequelize);

// Order items

db.orders.hasMany(db.order_items, {
  foreignKey: {
    allowNull: false,
  },
});

db.order_items.belongsTo(db.orders);

// Orders
db.users.hasMany(db.orders, {
  foreignKey: {
    allowNull: false,
  },
});
db.orders.belongsTo(db.users);

// Warehouse
db.warehouses.hasMany(db.products, {
  foreignKey: {
    allowNull: false,
  },
});
db.products.belongsTo(db.warehouses);

// Cart
db.users.hasOne(db.carts, {
  foreignKey: {
    allowNull: false,
  },
});

db.carts.belongsTo(db.users);

db.carts.hasMany(db.cart_items, {
  foreignKey: {
    allowNull: false,
  },
});

db.cart_items.belongsTo(db.carts);

// Hooks
db.products.beforeCreate(async (product) => {
  // Add additional attributes from parent category
  const category = await db.product_categories.findById(product.categoryId);
  if (category.additional_attributes) {
    product.additional_attributes = category.additional_attributes;
  }

  // Increase quantity
  db.sequelize.transaction(
    {
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    },
    async (t) => {
      await db.warehouses.increment(
        { volume: product.quantityNumber },
        { where: { id: product.warehouseId }, transaction: t },
      );
    },
  );
});

db.order_items.afterCreate(async (orderItem) => {
  // Decrease quantity
  db.sequelize.transaction(
    {
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    },
    async (t) => {
      await db.products.decrement(
        { quantityNumber: orderItem.quantity },
        { where: { id: orderItem.productId }, transaction: t },
      );
      const warehouseId = await db.products.findOne({
        where: { id: orderItem.productId },
        attributes: ["warehouseId"],
        transaction: t,
      });
      await db.warehouses.decrement(
        { volume: orderItem.quantity },
        { where: { id: warehouseId.warehouseId }, transaction: t },
      );
    },
  );
});

module.exports = db;
