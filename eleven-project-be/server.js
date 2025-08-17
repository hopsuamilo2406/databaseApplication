const express = require("express");
var cors = require('cors')
require("dotenv").config();

const app = express();

// Help Web to see API
app.use(
  cors({
    origin: "*",
  })
);

const mongoose = require("mongoose");
const db = require("./app/models/init");
const { seedToDB, seedAcount } = require("./app/config/seed.config");

app.use(express.json());

require("./app/routes/warehouse.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/product_category.routes")(app);
require("./app/routes/cart.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/order.routes")(app);
app.post("/api/seed", (req, res) => {
  seedToDB();
  res.status(200).json("Seeding data to DB");
});

app.post("/api/seed/account", (req, res) => {
  seedAcount();
  res.status(200).json("Seeding account to DB");
});

mongoose
  .connect(db.mongoDBUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

db.sequelize
  .sync()
  .then(() => console.log("MySQL connected"))
  .catch((err) => console.log("Failed to sync db: " + err.message));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
