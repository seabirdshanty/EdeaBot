// npm run test
// -

var Discordie = require('discordie')
 , fs = require('fs')
 , ini = require('ini')
 , droll = require('droll');

const DisEvents = Discordie.Events;
const client = new Discordie();

var standardDice = ['d2','d3','d4','d6','d8','d10','d12','d20','d100']
, diced = ''
, dnd = 0 
, dresult = 0;

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
	
	var talkToMe = e.message.content;
	// var member = e.message.member;
	//var nickNamuy = member.name;

	if(e.message.content == ';ping') {
		e.message.channel.sendMessage('pong!');
	}

	else if(talkToMe.includes(';roll ') == true) { 
	
		diced = talkToMe.replace(';roll ',''); diced = diced.replace(' ', '');

		if(talkToMe.includes('&&') == true) { // checks for multiple dice rolls ie 1d4 && 1d12+5
			var multiDieTotal = 0;
			var multiRollsPlz = []; 
			var checkDieAm = diced.split('&& '); // splits all roll commands into an array
			for (var dnd = 0; dnd < checkDieAm.length; dnd++) { // for loop to check each roll
				diced = checkDieAm[dnd].replace(' ', '');  // remove spaces for best dice
				rollOutDice(); // call dice check & roll function

				if(dresult.total > -1) { // if no errors
				 	multiDieTotal = multiDieTotal + parseInt(dresult.total); // pushes current die total to complete die total
					multiRollsPlz.push("\n`(" + (multiRollsPlz.length + 1) + ") " + dresult + "`"); //push results into printed array
				 }
				 
			}
			e.message.channel.sendMessage(":game_die: You rolled the following dice:" + multiRollsPlz + "\n\n **Die Roll Total:** `"+ multiDieTotal + "`.");
		}
		else {
			rollOutDice(); //run script as norm
			if(dresult.total > -1) { // if no errors, print
				 e.message.channel.sendMessage(":game_die: You rolled a `" + diced + "` and got `" + dresult + "`"); 
			}
		}


	}
	
function rollOutDice() {

		if(droll.validate(diced) == true) {		

			var checkDie = diced.split("d"); checkDie[1] = 'd' + checkDie[1];
	
				///////////////////////////////////
				console.log(checkDie[1]);
				//////////////////////////////////
				
				if(checkDie[1].includes('+') == true) {
						console.log('plus');
						var checkDieP = checkDie[1]; checkDieP = checkDieP.split('+'); checkDie[1] = checkDieP[0];
						console.log(checkDie[1]);
				}
				else if(checkDie[1].includes('-') == true) {
						console.log('minus');
						var checkDieM = checkDie[1]; checkDieM = checkDieM.split('-'); checkDie[1] = checkDieM[0];
						console.log(checkDie[1]);
				}
				else {
					console.log('neither');
				}
		
				if (standardDice.indexOf(checkDie[1]) > -1) {  
			
						console.log('Rolling Dice: ' + diced + ',' + droll.validate(diced));
						dresult = droll.roll(diced);
						console.log('==> Result: ' + dresult); 
					
			} else {  console.log('ERR (2): not a standard die'); dresult.total = -1; } //throw error 
				
		} else { console.log('ERR (1): not a die roll'); dresult.total = -1; } //throw error
	}

});

//*/

