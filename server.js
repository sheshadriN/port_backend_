const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const cors=require('cors');
require('dotenv').config();

const app = express();
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:false}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve the HTML file

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = twilio(accountSid, authToken);

app.post('/send-message', (req, res) => {
  const { name, email, number, message } = req.body;

  // Check if any of the required fields are undefined
  if (!name || !email || !number || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const recipientNumber = '+919047131391';
  const smsBody = `some one viewed your portfolio:\nName: ${name}\nEmail: ${email}\nNumber: ${number}\nMessage: ${message}`;

  twilioClient.messages
    .create({
      from: '+14706881851',
      to: recipientNumber,
      body: smsBody
    })
    .then(message => {
      console.log('Message sent:', message.sid);
      res.status(200).json({ message: 'Message sent successfully' });
    })
    .catch(error => {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
