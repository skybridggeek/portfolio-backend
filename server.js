// server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',        // Replace with your email
    pass: process.env.EMAIL_PASS || 'your-app-password'           // Replace with your App Password
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
      from: transporter.options.auth.user,
      to: transporter.options.auth.user,
      subject: 'New Visitor Logged In',
      text: `Someone visited your site!\n\nIP Address: ${ip}\nCountry: ${country}`
    };

    await transporter.sendMail(mailOptions);
    return res.sendStatus(200);
  } catch (error) {
    console.error('Error sending email:', error.message);
    return res.status(500).send('Failed to send email');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});