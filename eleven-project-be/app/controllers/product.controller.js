// CRUD for product controller

const {
  saveProduct,
  findAllProductByCategory,
  findOneProduct,
  updateProduct,
  deleteProduct,
} = require("../services/product.service");
const {
  findOneProductCategory,
} = require("../services/product_category.service");
const db = require("../models/init");
const { Transaction, where } = require("sequelize");
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  saveProduct(req, res);
};

exports.findAllProducts = async (req, res) => {
  const { page, size } = req.query;
  try {
    const result = await findAllProductByCategory(
      page,
      size,
      getFilter(req, ""),
      getOrder(req)
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.findAllProductByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { page, size } = req.query;
  try {
    const categoryData = await findOneProductCategory(categoryId);
    const result = await findAllProductByCategory(
      page,
      size,
      getFilter(req, categoryData.id),
      getOrder(req)
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await findOneProduct(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.update = (req, res) => {
  updateProduct(req, res);
};

exports.delete = (req, res) => {
  deleteProduct(req, res);
};

const getFilter = (req, category) => {
  let condition = category
    ? { categoryId: { [Op.like]: `%${category}%` } }
    : {};

  if (req.query.minPrice && req.query.maxPrice) {
    condition = {
      ...condition,
      price: {
        [Op.gte]: req.query.minPrice,
        [Op.lte]: req.query.maxPrice,
      },
    };
  }
  
  if (req.query.keywords) {
    condition = {
      ...condition,
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${req.query.keywords}%`,
          },
        },
        {
          description: {
            [Op.like]: `%${req.query.keywords}%`,
          },
        },
      ],
    };
  }
console.log(condition)
  return condition;
};

const getOrder = (req) => {
  let order = [];
  if (req.query.sortBy === "price") {
    order.push(["price", req.query.sortOrder || "ASC"]);
  } else if (req.query.sortBy === "createdAt") {
    order.push(["createdAt", req.query.sortOrder || "DESC"]);
  }
  return order;
};

exports.moveProduct = async (req, res) => {
  try {
    await db.sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
      },
      async (t) => {
        const { productId, warehouseId } = req.body;

        // Check if product exists
        const product = await db.products.findByPk(productId, {
          transaction: t,
        });

        if (!product) throw new Error("Product not found");

        if (product.warehouseId == warehouseId)
          throw new Error("Cannot move to the same warehouse");

        // Check if warehouse exists
        const currentWarehouse = await db.warehouses.findOne({
          where: {
            id: product.warehouseId,
          },
        });

        if (!currentWarehouse) throw new Error("Current warehouse not found");

        // Update current warehouse
        await currentWarehouse.decrement("volume", {
          by: product.quantityNumber,
          transaction: t,
        });

        await product.update({ warehouseId: warehouseId }, { transaction: t });

        const destinationWarehouse = await db.warehouses.findOne({
          where: {
            id: warehouseId,
          },
        });

        // Update destination warehouse
        await destinationWarehouse.increment("volume", {
          by: product.quantityNumber,
          transaction: t,
        });

        res.status(200).send({
          message: `Product was moved to ${product.warehouseId} successfully!`,
        });
      }
    );
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
