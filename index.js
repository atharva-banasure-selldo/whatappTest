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
  // console.log(message);
	if (message.body === 'ping') {
		// send back "pong" to the chat the message was sent in
		client.sendMessage(message.from, 'pong');
    console.log('My message: pong');
    // console.log(message.body);
	}
});

client.on("message_create",async (message) => {
  if(message.body === 'history') {

    const chat = message.getChat(); //chat object
    
    const messages = await (await chat).fetchMessages({limit: 40}); 

    console.log('previous messages:');

    messages.forEach(msg => {
      console.log(`[${msg.fromMe ? 'Me' : 'Other'}] ${msg.body}`);
    });

    client.sendMessage(message.from, 'Fetched previous messages, check logs.');
  }
})

// Start your client
client.initialize();