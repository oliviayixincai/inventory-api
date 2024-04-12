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
      message: "Please provide complete information for the warehouse",
    });
  }

  //validate the email
  if (!validator.validate(req.body.contact_email)) {
    return res.status(400).json({
      message: "Please provide a correct email address for the warehouse",
    });
  }

  //validate the phone number
  const regExp = new RegExp(
    /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
    "i"
  );
  if (!regExp.test(req.body.contact_phone)) {
    return res.status(400).json({
      message: "Please provide a correct phone number for the warehouse",
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

module.exports = {
  getWarehouses,
  addWarehouse,
};
