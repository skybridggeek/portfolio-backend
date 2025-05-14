// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Validate env vars before starting server
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  console.error("🚨 Missing EMAIL_USER or EMAIL_PASS in environment");
  process.exit(1);
}

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

// POST route to log IP and send email
app.post('/log-ip', async (req, res) => {
  const { ip } = req.body;

  try {
    // Get country info using IP-API
    const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
    const country = geoResponse.data.country || 'Unknown';

    console.log(`Visitor IP: ${ip}, Country: ${country}`);

    // Send email
    const mailOptions = {
      from: emailUser,
      to: emailUser,
      subject: `🌐 New Visitor: ${country}`,
      text: `Someone visited your portfolio!\n\nIP Address: ${ip}\nCountry: ${country}`
    };

    await transporter.sendMail(mailOptions);
    return res.sendStatus(200);
  } catch (error) {
    console.error('⚠️ Error sending email:', error.message);
    return res.status(500).send('Failed to send email');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});