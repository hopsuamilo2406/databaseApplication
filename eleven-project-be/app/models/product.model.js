module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "product",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      quantityNumber: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      dimension: {
        type: DataTypes.JSON,
      },
      image: {
        type: DataTypes.STRING,
      },
      additional_attributes: {
        type: DataTypes.JSON,
      },
      categoryId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          fields: ["categoryId"],
        },
        {
          fields: ["price"],
        },
        {
          fields: ["title", "description"],
        },
      ],
    }
  );

  return Product;
};
