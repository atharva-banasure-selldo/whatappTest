const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');


const client =new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('ready', () =>{
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
  qrcode.generate(qr, {small: true});
});

client.on('message_create', message => {
	if (message.body === '!ping') {
		// send back "pong" to the chat the message was sent in
		client.sendMessage(message.from, 'pong');
    console.log(message.body);
	}
});

// Start your client
client.initialize();