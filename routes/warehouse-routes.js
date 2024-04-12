const router = require("express").Router();
const warehouseController = require("../controllers/warehouse-controller");
const inventoryController = require("../controllers/inventory-controller");

router
  .route("/")
  .get(warehouseController.getWarehouses)
  .post(warehouseController.addWarehouse);
router
  .route("/:id/inventories")
  .get(inventoryController.getWarehouseInventories);

module.exports = router;
