// server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',        // Replace with your email
    pass: 'your-app-password'            // Replace with your app password
  }
});

// POST route to log IP and send email
app.post('/log-ip', (req, res) => {
  const { ip } = req.body;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'your-email@gmail.com',
    subject: 'New Visitor Logged In',
    text: `Someone visited your site! IP Address: ${ip}`
  };

  transporter.sendMail(mailOptions, error => {
    if (error) return res.status(500).send('Failed to send email');
    res.sendStatus(200);
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});