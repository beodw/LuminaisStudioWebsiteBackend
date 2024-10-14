"use strict";

// Import necessary services
const {
  sendDeluxeEmail,
  sendBuilderEmail,
  sendKickstarterEmail,
} = require("../services/emailService");
const emailValidator = require("email-validator");
const FormAnswer = require("../models/FormAnswer");
const connectDB = require("../services/database");

module.exports.updatePackageAndSendEmail = async (event) => {
  try {
    connectDB(); // Connect to the database

    const formData = JSON.parse(event.body);

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

      return searchEmail(data);
    };

    const UserEmail = extractEmail(formData.form);

    // Extract package, email, and submissionId from form data
    const selectedPackage = formData.package;
    const email = UserEmail;
    const subscriber = formData.subscriber;
    const recordId = formData.recordId; // Assume submissionId is passed from the frontend

    // Find the specific record for this email and submissionId
    const existingRecord = await FormAnswer.findById(recordId);

    if (!existingRecord) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Record not found for the provided email and submission ID",
        }),
      };
    }

    // Update the record with the selected package
    existingRecord.package = selectedPackage; // Save the selected package in the new `package` field

    await existingRecord.save(); // Save the updated record

    console.log(selectedPackage.toLowerCase());
    // Choose the email service based on the selected package
    switch (selectedPackage.toLowerCase()) {
      case "customer software deluxe":
        await sendDeluxeEmail(email, subscriber, "https://trello.com", "https://slack.com");
        break;
      case "custom software builder":
        await sendBuilderEmail(email, subscriber, "https://trello.com", "https://slack.com");
        break;
      case "mvp kickstarter":
        await sendKickstarterEmail(
          email,
          subscriber,
          "https://trello.com",
          "https://slack.com"
        );
        break;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "Invalid package selection",
          }),
        };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Package updated and email sent successfully",
      }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Headers": "Content-Type, Authorization", // Include required headers
        "Access-Control-Allow-Methods": "POST", // Allow POST method
      },
    };
  } catch (error) {
    console.error("Error updating package and sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
