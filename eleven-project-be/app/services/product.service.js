const db = require("../models/init.js");
const Product = db.products;
const Op = db.Sequelize.Op;

// Create and Save a new Product
exports.saveProduct = (req, res) => {
  // Validate request
  if (!req.body.title || !req.body.categoryId || !req.body.warehouseId) {
    res.status(400).send({
      message: "Title or categoryId or warehouseId can not be empty!",
    });
    return;
  }

  // Create a Product
  const product = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    quantityNumber: req.body.quantityNumber,
    dimension: req.body.dimension,
    image: req.body.image,
    warehouseId: req.body.warehouseId,
    categoryId: req.body.categoryId,
  };

  // Save Product in the database
  Product.create(product)
    .then((data) => {
      res.send({
        message: "Product was created successfully!",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Product.",
      });
    });
};

exports.findAllProductByCategory = async (page, size, filters, orders) => {
  const { limit, offset } = getPagination(page, size);

  try {
    let data = await Product.findAndCountAll({
      where: filters,
      order: orders,
      limit,
      offset,
    });

    return getPagingData(data, page, limit);
  } catch (err) {
    throw new Error("Failed to fetch product: " + err.message);
  }
};

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: products } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, products, totalPages, currentPage };
};

// Find a single Product with an id
exports.findOneProduct = async (id) => {
  try {
    let data = await Product.findByPk(id);
    if (!data) {
      throw new Error("Document not found");
    }
    return data;
  } catch (err) {
    throw new Error("Failed to fetch product: " + err.message);
  }
};

exports.isProductContainsWarehouse = async (id) => {
  try {
    const count = await Product.count({
      where: {
        warehouseId: id,
      }
    });

    return count !== 0;
  } catch (error) {
    throw new Error("Failed to fetch product: " + error.message);
  }
};

exports.isProductContainCategory = async (categoryId) => {
  try {
    const { count, rows } = await Product.findAndCountAll({
      where: {
        categoryId: categoryId,
      },
    });
    return count !== 0 && rows !== 0 ? true : false;
  } catch (error) {
    throw new Error("Failed to fetch product: " + error.message);
  }
};

// Update a Product by the id in the request
exports.updateProduct = (req, res) => {
  const id = req.params.id;

  Product.update(req.body, {
    where: {
      id: id,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Product was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Product with id=" + id,
      });
    });
};

// Delete a Product with the specified id in the request
exports.deleteProduct = (req, res) => {
  const id = req.params.id;

  Product.destroy({
    where: {
      id: id,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Product was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Product with id=${id}. Maybe Product was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Product with id=" + id,
      });
    });
};
