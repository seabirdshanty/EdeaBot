// npm run test
// -


var Discordie = require('discordie')
 , fs = require('fs')
 , ini = require('ini')

const DisEvents = Discordie.Events;
const client = new Discordie();

console.log('Token Test; Uses Token in the INI file');

//----------------- TOKEN LOAD

var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

client.connect({
	token: config.discordini['token']
});

console.log('Connecting with token:\n --[' + config.discordini['token'] + ']');

//----------------- LOAD DISCORDIE THINGS

client.Dispatcher.on(DisEvents.GATEWAY_READY, e => {

	if(client.User.username != "undefined") {
		console.log('Connection success!');
	} else {
		console.log('Connection error.');
	}

	console.log('Connected as: ' + client.User.username);

});

// BEGIN PROCESS

client.Dispatcher.on(DisEvents.MESSAGE_CREATE, e => {

	if(e.message.content == ';ping') {
		e.message.channel.sendMessage('pong!');
	}


});

//*/

