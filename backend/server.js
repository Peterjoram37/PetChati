const express = require('express');
const app = express();
const paymentRoutes = require('./routes/payments');

// Routes
app.use('/api/payments', paymentRoutes);
