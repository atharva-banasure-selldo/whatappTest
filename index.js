const { Client, RemoteAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const mongoose = require('mongoose');
const { MongoStore } = require('wwebjs-mongo');
const connectDB = require('./db');
const Message = require('./models/message_model');


async function initializeClient() {
  try {
    await connectDB(); 
    const store = new MongoStore({ mongoose: mongoose });
    
    const client = new Client({
      authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: 300000, // 5 minutes
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    // Event handlers
    client.on('ready', () => {
      console.log('Client is ready!');
    });

    client.on('qr', (qr) => {
      qrcode.generate(qr, {small: true});
      console.log('QR RECEIVED', qr);
    });

    client.on('remote_session_saved', () => {
      console.log('Session saved to MongoDB!');
    });

    client.on("message_create", async (message) => {
      try {
        const {
          from,
          fromMe,
          body,
          timestamp
        } = message;

        const newMessage = new Message({
          chatId: from,
          sender: fromMe ? 'me' : from,
          message: body,
          timestamp: timestamp.toString()
        });
        
        await newMessage.save();
        console.log('Message saved to MongoDB:', message.body);
      
        // Format the timestamp from WhatsApp
        const date = new Date(timestamp * 1000); //milliseconds
        const formattedTime = date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        console.log('Formatted Time:', formattedTime);
        
        if (message.body.toLowerCase() === 'ping') {
          client.sendMessage(message.from, 'pong');
        }
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    await client.initialize();
    
  } catch (error) {
    console.error('Failed to initialize WhatsApp client:', error);
  }
}

// Start the client
initializeClient();