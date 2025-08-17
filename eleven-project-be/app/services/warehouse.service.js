const db = require("../models/init.js");
const Warehouse = db.warehouses;
const Product = db.products;
const Op = db.Sequelize.Op;

const saveWarehouse = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  const warehouse = {
    name: req.body.name,
    address: req.body.address,
  };

  Warehouse.create(warehouse)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Warehouse.",
      });
    });
};

const findAllWarehouse = (req, res) => {
  const name = req.query.name;
  let condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Warehouse.findAll({ where: condition })
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

const findOneWarehouse = (req, res) => {
  const id = req.params.id;

  Warehouse.findByPk(id).then((data) => {
    if (!data) {
      res.status(404).send({
        message: "Not found Warehouse with id " + id,
      });
    } else {
      res.send(data);
    }
  });
};

const updateWarehouse = (req, res) => {
  const id = req.params.id;

  Warehouse.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Warehouse was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Warehouse with id=${id}. Maybe Warehouse was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Warehouse with id=" + id,
      });
    });
};

const deleteWarehouse = async (id) => {
  try {
    let data = await Warehouse.destroy({
      where: { id: id },
    });
    return data;
  } catch (error) {
    throw new Error("Failed to delete warehouse: " + error.message);
  }
};

module.exports = {
  saveWarehouse,
  findAllWarehouse,
  findOneWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
