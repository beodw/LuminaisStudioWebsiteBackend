"use strict";
const { sendEmail } = require("../services/emailService");

module.exports.sendEmail = async (event) => {
  console.log("Event body:", event.body);
  try {
    const { amount, currency, source, email } = JSON.parse(event.body);

    // Send email
    const result = await sendEmail(email, amount, currency, source);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
