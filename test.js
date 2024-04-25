const axios = require('axios');

// Function to send a single request with updated amount
async function sendRequest(amount) {
  const url = 'http://localhost:9000/api/v1/accounts/topup';
  const body = {
    currency: 'JPY',
    amount: amount,
  };

  try {
    const response = await axios.post(url, body);
    console.log(
      `Request sent with amount: ${amount}. Status: ${response.status}`
    );
  } catch (error) {
    console.error(
      `Error sending request with amount: ${amount}`,
      error.response.data
    );
  }
}

// Function to send multiple requests
async function sendMultipleRequests(numRequests) {
  for (let i = 1; i <= numRequests; i++) {
    // Update amount for each request
    const amount = 20000 + i; // You can modify this calculation as needed
    await sendRequest(amount);
  }
}

// Send 100,000 requests
const numRequests = 100000;
sendMultipleRequests(numRequests)
  .then(() => console.log('All requests sent successfully.'))
  .catch((error) => console.error('Error sending requests:', error));
