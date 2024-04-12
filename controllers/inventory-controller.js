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

module.exports = {
  getWarehouseInventories,
};
