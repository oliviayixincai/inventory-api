const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// basic home route
app.get("/api", (req, res) => {
  res.send("Welcome to my API");
});

const warehouseRoutes = require("./routes/warehouse-routes");
const inventoryRoutes = require("./routes/inventory-routes");

app.use("/api/warehouses", warehouseRoutes);
app.use("/api/inventories", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
