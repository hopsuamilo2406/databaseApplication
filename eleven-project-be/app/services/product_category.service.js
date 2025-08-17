const db = require("../models/init.js");
const ProductCategory = db.product_categories;
const Product = db.products;

exports.createProductCategory = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const product_category = new ProductCategory({
    name: req.body.name,
    parent_id: req.body.parent_id,
    additional_attributes: req.body.additional_attributes,
  });

  product_category
    .save(product_category)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};
exports.findAllProductCategory = (req, res) => {
  const title = req.query.name;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  ProductCategory.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.findOneProductCategory = async (id) => {
  try {
    let data = await ProductCategory.findById(id);
    if (!data) {
      throw new Error("Document not found");
    }
    return data;
  } catch (err) {
    throw new Error("Failed to fetch product category: " + err.message);
  }
};

exports.updateProductCategory = async (id, body) => {
  try {
    const data = await ProductCategory.findByIdAndUpdate(id, body, {
      useFindAndModify: false,
    });
    
    if (!data) {
      throw new Error("Document not found");
    } else {
      return data;
    }
  } catch (error) {
    throw new Error("Failed to update product category: " + error.message);
  }
};

exports.deleteProductCategory = async (req, res) => {
  const id = req.params.id;
  try {
    await ProductCategory.findByIdAndRemove(id);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
