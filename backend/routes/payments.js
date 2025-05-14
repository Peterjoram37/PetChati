const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

// Airtel API Credentials
const API_KEY = process.env.AIRTEL_API_KEY;
const API_SECRET = process.env.AIRTEL_API_SECRET;
const CALLBACK_URL = process.env.AIRTEL_CALLBACK_URL;

// Get Access Token
const getAccessToken = async () => {
  try {
    const response = await axios.post('https://openapi.airtel.africa/auth/oauth2/token', {
      client_id: API_KEY,
      client_secret: API_SECRET,
      grant_type: 'client_credentials',
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.response.data);
    throw new Error('Failed to get access token');
  }
};

// Initiate Payment
router.post('/pay', async (req, res) => {
  const { amount, customerNumber, transactionId } = req.body;

  try {
    const accessToken = await getAccessToken();

    const paymentResponse = await axios.post(
      'https://openapi.airtel.africa/merchant/v1/payments/',
      {
        reference: transactionId,
        subscriber: {
          country: 'TZ',
          currency: 'TZS',
          msisdn: customerNumber,
        },
        transaction: {
          amount: amount,
          country: 'TZ',
          currency: 'TZS',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(200).json({
      message: 'Payment initiation successful',
      data: paymentResponse.data,
    });
  } catch (error) {
    console.error('Error initiating payment:', error.response.data);
    res.status(500).json({
      message: 'Failed to initiate payment',
      error: error.response.data,
    });
  }
});

// Callback URL for Payment Status
router.post('/callback', (req, res) => {
  console.log('Payment Callback:', req.body);

  // Process the callback response here (update database, etc.)
  res.status(200).json({ message: 'Callback received' });
});

module.exports = router;
