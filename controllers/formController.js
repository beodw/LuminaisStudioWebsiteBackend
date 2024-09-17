// controllers/formController.js

"use strict";
const { storeFormData } = require("../services/formStorageService");

module.exports.storeForm = async (event) => {
  try {
    const formData = JSON.parse(event.body); // Parse incoming JSON body

    // Store the form data using the service
    const response = await storeFormData(formData);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all domains, adjust this as per your needs
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: response.message,
      }),
    };
  } catch (error) {
    console.error("Error storing form data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
