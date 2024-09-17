"use strict";

const { processPayment } = require("./controllers/paymentController");
const { storeForm } = require("./controllers/formController");

module.exports.processPayment = processPayment;
module.exports.storeForm = storeForm;
