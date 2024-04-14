const knex = require("knex")(require("../knexfile"));
const validator = require("email-validator");

const getWarehouses = async (_req, res) => {
  try {
    const data = await knex("warehouses");
    const customizedData = data.map((item) => {
      return {
        id: item.id,
        warehouse_name: item.warehouse_name,
        address: item.address,
        city: item.city,
        country: item.country,
        contact_name: item.contact_name,
        contact_position: item.contact_position,
        contact_phone: item.contact_phone,
        contact_email: item.contact_email,
      };
    });
    res.status(200).json(customizedData);
  } catch (err) {
    res.status(400).send(`Error retrieving Warehouses: ${err}`);
  }
};

const getOneWarehouse = async (req, res) => {
  try {
    const warehouseFound = await knex("warehouses")
      .where({
        id: req.params.id,
      })
      .first();

    if (!warehouseFound) {
      return res.status(404).json({
        message: `Warehouse ID ${req.params.id} not found`,
      });
    }

    res.status(200).json(warehouseFound);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve Warehouse ID ${req.params.id}`,
    });
  }
};

const addWarehouse = async (req, res) => {
  if (
    !req.body.warehouse_name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.contact_name ||
    !req.body.contact_position ||
    !req.body.contact_phone ||
    !req.body.contact_email
  ) {
    return res.status(400).json({
      message: "Please provide complete information",
    });
  }

  //validate the phone number
  const regExp = new RegExp(
    /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
    "i"
  );
  if (!regExp.test(req.body.contact_phone)) {
    return res.status(400).json({
      type: "phone",
      message: "Please provide a correct phone number",
    });
  }

  //validate the email
  if (!validator.validate(req.body.contact_email)) {
    return res.status(400).json({
      type: "email",
      message: "Please provide a correct email address",
    });
  }

  try {
    const result = await knex("warehouses").insert(req.body);
    const createdWarehouseID = result[0];
    const createdWarehouse = await knex("warehouses")
      .where({
        id: createdWarehouseID,
      })
      .first();
    const customizedData = {
      id: createdWarehouse.id,
      warehouse_name: createdWarehouse.warehouse_name,
      address: createdWarehouse.address,
      city: createdWarehouse.city,
      country: createdWarehouse.country,
      contact_name: createdWarehouse.contact_name,
      contact_position: createdWarehouse.contact_position,
      contact_phone: createdWarehouse.contact_phone,
      contact_email: createdWarehouse.contact_email,
    };
    res.status(201).json(customizedData);
  } catch (err) {
    res.status(400).send(`Error retrieving Warehouses: ${err}`);
  }
};

const deleteWarehouse = async (req, res) => {
  const warehouseId = req.params.id;

  try {
    const count = await knex("warehouses").where("id", warehouseId).del();

    if (!count) {
      return res.status(404).json({ message: "Warehouse ID not found" });
    }

    res.status(204).json();
  } catch (err) {
    res.status(500).send(`Error deleting Warehouse: ${err}`);
  }
};

module.exports = {
  getWarehouses,
  addWarehouse,
  deleteWarehouse,
  getOneWarehouse,
};
