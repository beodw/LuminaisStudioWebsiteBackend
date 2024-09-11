"use strict";
const axios = require("axios");
require('dotenv').config();

const MONIME_API_BASE_URL = "https://api.monime.com"; // Replace with actual Monime API base URL

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
      },
      null,
      2
    ),
  };
};

module.exports.processPayment = async (event) => {
  console.log('Event body:', event.body); // Log the incoming request
  try {
    const { amount, currency, source } = JSON.parse(event.body);

    const response = await axios.post(
      `${MONIME_API_BASE_URL}/payments`,
      {
        amount,
        currency,
        source,
        description: "Payment for order",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MONIME_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error processing payment:', error); // Log error details
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
