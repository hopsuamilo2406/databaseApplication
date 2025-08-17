module.exports = (sequelize, DataTypes) => {
  const Warehouse = sequelize.define("warehouse", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.JSON,
    },
    volume: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
  });

  return Warehouse;
};
