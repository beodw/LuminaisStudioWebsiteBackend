"use strict";

// Import necessary services
const { processPayment } = require("../services/paymentService");
const { sendEmail } = require("../services/emailService");
const FormAnswer = require("../models/FormAnswer");
const emailValidator = require("email-validator");
const connectDB = require("../services/database");

module.exports.processPayment = async (event) => {
  try {
    connectDB(); // Connect to the database

    const formData = JSON.parse(event.body); // Parse incoming JSON body

    // Function to extract email from form data
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

    const email = extractEmail(formData);

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "No valid email address found in form data",
        }),
      };
    }

    // // Dummy values for Monime API
    // const amount = 100; // Fixed amount for now, in USD
    // const providerCode = "m17"; // Example provider code
    // const accountId = "+23278000000"; // Example account ID
    // const financialAccountId = "1234567890"; // Example financial account ID
    // const spaceId = process.env.MONIME_SPACE_ID; // Your Monime space ID
    // const accessToken = process.env.MONIME_ACCESS_TOKEN; // Your Monime access token

    // // Process payment
    // const paymentResponse = await processPayment(
    //   amount,
    //   providerCode,
    //   accountId,
    //   financialAccountId,
    //   spaceId,
    //   accessToken
    // );

    // Save form data in MongoDB
    const formAnswer = new FormAnswer({
      formAnswers: formData,
      email,
      payment: true, // Assuming payment is successful
    });

    await formAnswer.save();

    // Send confirmation email
    await sendEmail(email, 1000, "SLE", "Monime.io");

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Payment processed and form data saved successfully!",
        // paymentResponse,
      }),
    };
  } catch (error) {
    console.error("Error processing payment:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
