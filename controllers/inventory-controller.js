const { get } = require("../routes/warehouse-routes");

const knex = require("knex")(require("../knexfile"));

const getWarehouseInventories = async (req, res) => {
  const warehouseId = req.params.id;
  try {
    const data = await knex("inventories").where("warehouse_id", warehouseId);
    const customizedData = data.map((item) => {
      return {
        id: item.id,
        item_name: item.item_name,
        category: item.category,
        status: item.status,
        quantity: item.quantity,
      };
    });
    res.status(200).json(customizedData);
  } catch (err) {
    res.status(400).send(`Error retrieving Inventories: ${err}`);
  }
};

const getAllInventories = async (req, res) => {
  try {
    const data = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(`Unable to retrieve inventory data: ${err}`);
  }
};

const getInventory = async (req, res) => {
  const inventoryId = req.params.id;
  try {
    const data = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .where("inventories.id", inventoryId)
      .first();
    if (!data) {
      return res.status(404).json({ message: "Inventory ID not found" });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(`Unable to retrieve inventory data: ${err}`);
  }
};

const addInventory = async (req, res) => {
  const { warehouse_name, item_name, description, category, status, quantity } =
    req.body;
  if (
    !warehouse_name ||
    !item_name ||
    !description ||
    !category ||
    !status
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (isNaN(quantity)) {
    return res
      .status(400)
      .json({ message: "warehouse_id and quantity must be numbers" });
  }
  try {
    const warehouse = await knex("warehouses")
      .where("warehouse_name", warehouse_name)
      .first();
    if (!warehouse) {
      return res.status(400).json({ message: "warehouse_name does not exist" });
    }
    const [newInventory] = await knex("inventories")
      .insert({
        warehouse_id: warehouse.id,
        item_name,
        description,
        category,
        status,
        quantity,
      })
      .returning("*");

    res.status(201).json(newInventory[0]);
  } catch (err) {
    console.error("Error adding inventory:", err);
    res.status(500).send("Internal Server Error");
  }
};

const deleteInventory = async (req, res) => {
  const inventoryId = req.params.id;
  try {
    const count = await knex("inventories").where("id", inventoryId).del();
    if (!count) {
      return res.status(404).json({ message: "Inventory ID not found" });
    }
    res.status(204).json();
  } catch (err) {
    res.status(500).send(`Unable to delete inventory data: ${err}`);
  }
};

const updateInventory = async (req, res) => {
  const { item_name, description, category, status, quantity } = req.body;
  const inventoryId = req.params.id;

  // Check if all required fields are present
  if (!item_name || !description || !category || !status || !quantity) {
    return res
      .status(400)
      .json({ message: "All fields are required to fill out." });
  }

  // Validate if quantity is a number
  if (isNaN(quantity)) {
    return res.status(400).json({ message: "Quantity must be a number." });
  }

  try {
    // Check if the inventory ID exists
    const inventoryExists = await knex("inventories")
      .where({ id: inventoryId })
      .first();
    if (!inventoryExists) {
      return res.status(404).json({ message: "Inventory ID not found" });
    }

    // Check if warehouse_id exists in the warehouses table
    const warehouseExists = await knex("warehouses")
      .where({ id: inventoryExists.warehouse_id })
      .first();
    if (!warehouseExists) {
      return res.status(400).json({ message: "warehouse_id does not exist." });
    }

    // Update inventory details
    await knex("inventories").where({ id: inventoryId }).update({
      item_name,
      description,
      category,
      status,
      quantity: status === "Out of Stock" ? 0 : quantity,
    });

    // Retrieve the updated inventory item
    const updatedInventory = await knex("inventories")
      .where({ id: inventoryId })
      .first();
    res.status(200).json(updatedInventory);
  } catch (err) {
    console.error("Error updating inventory:", err);
    res
      .status(500)
      .send("Unable to update inventory details due to an internal error.");
  }
};

module.exports = {
  getWarehouseInventories,
  getAllInventories,
  getInventory,
  addInventory,
  deleteInventory,
  updateInventory,
};
