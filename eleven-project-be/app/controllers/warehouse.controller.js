const { isProductContainsWarehouse } = require("../services/product.service");
const {
  saveWarehouse,
  findAllWarehouse,
  findOneWarehouse,
  deleteWarehouse,
  updateWarehouse,
} = require("../services/warehouse.service");

// Create and Save a new Tutorial
exports.create = (req, res) => {
  saveWarehouse(req, res);
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  findAllWarehouse(req, res);
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  findOneWarehouse(req, res);
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  updateWarehouse(req, res);
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  if (await isProductContainsWarehouse(id)) {
    res.status(400).send({
      message: "Warehouse cannot be deleted because it has products!",
    });
    return;
  }

  try {
    const data = await deleteWarehouse(id);

    if (data === 1) {
      res.status(200).send({ message: "Warehouse was deleted successfully!" });
    } else {
      res.status(404).json({ message: "Warehouse is not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
