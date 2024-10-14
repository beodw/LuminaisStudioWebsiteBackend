"use strict";

const { FormSubmission } = require("./controllers/formController");
const {
  updatePackageAndSendEmail,
} = require("./controllers/packageController");

module.exports.processForm = FormSubmission;
module.exports.processPackage = updatePackageAndSendEmail;
