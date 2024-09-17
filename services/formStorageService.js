// services/formStorageService.js

"use strict";
const FormAnswer = require("../models/FormAnswer");
const connectDB = require("./database"); // Import database connection service
const emailValidator = require("email-validator");

// Function to store form data in MongoDB
const storeFormData = async (formData) => {
  try {
    connectDB(); // Ensure the database is connected

    // Extract email from form data (if needed, similar to the other service)
    const extractEmail = (data) => {
      const searchEmail = (obj) => {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            if (typeof value === "object" && !Array.isArray(value)) {
              const nestedEmail = searchEmail(value);
              if (nestedEmail) return nestedEmail;
            }

            if (typeof value === "string" && emailValidator.validate(value)) {
              return value;
            }
          }
        }
        return null;
      };

      return searchEmail(data); // Start searching from the root object
    };

    const email = extractEmail(formData) || "unknown"; // Use "unknown" if no email is found

    // Save the form data in MongoDB
    const formAnswer = new FormAnswer({
      formAnswers: formData,
      email,
      payment: false, // No payment for this service
    });

    await formAnswer.save();
    return { message: "Form data saved successfully!" };
  } catch (error) {
    console.error("Error storing form data:", error);
    throw new Error("Failed to store form data: " + error.message);
  }
};

module.exports = { storeFormData };
