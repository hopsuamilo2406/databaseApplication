const mongoose = require("mongoose");
const { Schema } = mongoose;

module.exports = (mongoose) => {
  const ProductCategory = mongoose.model(
    "product_category",
    Schema({
      name: String,
      parent_id: { type: String },
      additional_attributes: Schema.Types.Mixed,
    }),
  );

  return ProductCategory;
};
