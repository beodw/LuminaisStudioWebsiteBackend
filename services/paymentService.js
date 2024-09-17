const axios = require("axios");

// Function to process payment using Monime API
const processPayment = async (
  amount,
  providerCode,
  accountId,
  financialAccountId,
  spaceId,
  accessToken
) => {
  const idempotencyKey = `${Date.now()}-${accountId}`; // Generate a unique idempotency key

  const options = {
    method: "POST",
    url: "https://api.monime.io/payouts",
    headers: {
      Authorization: `Bearer ${accessToken}`, // Add access token for authorization
      "Monime-Space-Id": spaceId,
      "Idempotency-Key": idempotencyKey,
      "Content-Type": "application/json",
    },
    data: {
      amount: {
        currency: "SLE", // Example currency, adjust as needed
        value: amount, // Use the passed amount
      },
      destination: {
        providerCode: providerCode, // Provider code for the payout (e.g., 'm17')
        accountId: accountId, // Recipient's account ID
      },
      source: {
        financialAccountId: financialAccountId, // The source financial account for the payment
      },
      metadata: {}, // You can pass any additional metadata if needed
    },
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.error(
      "Error during payment:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

module.exports = { processPayment };
