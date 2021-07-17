const Customer = require("../models/customer.model");

exports.savecustomer = async (details) => {
  try {
    const customer = new Customer(details);

    await customer.save();

    return customer;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.retrievecustomer = async (query) => {
  try {
    const customer = Customer.findOne(query);

    if (!customer) {
      return false;
    }

    return customer;
  } catch (error) {
    console.log(error);
  }
};
exports.deletecustomer = async (query) => {
  try {
    const customer = Customer.findOneAndDelete(query);

    if (!customer) {
      return false;
    }

    return customer;
  } catch (error) {
    console.log(error);
  }
};
exports.findcustomerandupdate = async (query, update, type = "set") => {
  try {
    const result = await Customer.findOneAndUpdate(
      query,
      {
        [`$${type}`]: update,
      },
      {
        new: true,
      }
    );

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
};
