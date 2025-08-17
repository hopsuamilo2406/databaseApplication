const { isProductContainCategory } = require("../services/product.service");
const {
  createProductCategory,
  findAllProductCategory,
  findOneProductCategory,
  deleteProductCategory,
  updateProductCategory,
} = require("../services/product_category.service");

exports.create = (req, res) => {
  createProductCategory(req, res);
};

exports.findAll = (req, res) => {
  findAllProductCategory(req, res);
};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await findOneProductCategory(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const productCategory = await findOneProductCategory(id);
    const hasChildren = await isProductContainCategory(productCategory.id);

    if (hasChildren) {
      return res.status(400).json({
        message: "Product category cannot be update because it has children!",
      });
    }

    updateProductCategory(id, req.body);

    res
      .status(200)
      .json({ message: "Product category was update successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const productCategory = await findOneProductCategory(id);
    const hasChildren = await isProductContainCategory(productCategory.id);

    if (hasChildren) {
      return res.status(400).json({
        message: "Product category cannot be deleted because it has children!",
      });
    }

    await deleteProductCategory(req, res);

    res
      .status(200)
      .json({ message: "Product category was deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
