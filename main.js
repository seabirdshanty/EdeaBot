/*
EDEABOT 0.0.7a
by seabirdshanty / freakmoch / BP / whathaveyou

to add to server: 
	-URL Removed for GitHub Repo-

DECLARED GLOBALS:
- log (ln 32)
- config (ln 38)

TABLE OF CONTENTS
	1. Modules
	2. Variables n Stuff
	3. Load
	|--- i.		logging
	|--- ii.	ini load
	|--- iii.	token load
	|--- iv.	rivescript load
	|--- v.		discordie load
	4. Message Proccessing
	|--- i.		Variables and Functions
	|--- ii.	Regular Commands
	|--- iii.	Dice Script
	|--- iv.	Rivescript Chatbot [Proccessing]
	|----------- a.	tiddie anger flag
	|----------- b.	tomo anger flag
	|--- v.		Admin Scripts

*/

///////////////////////////////////////////////
// 1. Modules
//////////////////////////////////////////////

var Discordie = require('discordie');
var RiveScript = require('rivescript');
var fs = require('fs')
 , Log = require('log')
 , ini = require('ini')
 , custard = require("./scripts/tetsmod.js")
 , iniUp = require("./scripts/iniupdate.js")
 , droll = require('droll');

const DisEvents = Discordie.Events;
const client = new Discordie();
const talkback = new RiveScript();

///////////////////////////////////////////////
// 2. Variables n Stuff
//////////////////////////////////////////////

var botName = "<@237304198394413058> "; //Lets you @ the bot
var talkTomo = 0;
var talkAnger = 0;
var comTrigN = "e]";
var comTrigAdm = "e]#"
var standardDice = ['d2','d3','d4','d6','d8','d10','d12','d20','d100']
, diced = ''
, dresult = 0

///////////////////////////////////////////////
// 3. Load
//////////////////////////////////////////////

console.log('WELCOME TO EDEA BOT!');
console.log('ver. 0.0.7a');

//----------------- logging

var edealog = './logs/edea_'+ custard.itsSummerTime() +'.log';
var fd = fs.openSync(edealog, 'w');
global.log = new Log('debug', fs.createWriteStream(edealog))
console.log('Debug log saved in ' + edealog);
console.log('-----');

//----------------- ini load

global.config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))
iniUp.loadINI();
var talkFriend = iniUp.getTalkFriend();
var adminPerms = iniUp.getAdminPerm();

//----------------- TOKEN LOAD

console.log('Discord App Token: ' + config.discordini['token'] +'\n-----'); // only displayed in console log.
client.connect({
	token: config.discordini['token']
});

//----------------- RIVESCRIPT LOAD

talkback.loadFile("./rive/commands.rive", loading_done, loading_error);
talkback.loadFile("./rive/hello.rive", loading_done, loading_error);

function loading_done (batch_num) {
    console.log("RIVE: Batch #" + batch_num + " has finished loading!");
    log.debug("RIVE: Batch #" + batch_num + " has finished loading!");
    talkback.sortReplies();
    var reply = talkback.reply("local-user", "com load");
    console.log("The bot says: " + reply);
    log.debug("The bot says: " + reply);
}

function loading_error (error) {
	console.log("Error when loading files: " + error);
	log.debug("Error when loading files: " + error);
}

//----------------- DISCORDIE LOAD

client.Dispatcher.on(DisEvents.GATEWAY_READY, e => {
	console.log('-----');
	log.debug('Connected as: ' + client.User.username);
	console.log('Connected as: ' + client.User.username);
	client.User.setGame("Metal Gear: Revengence");
	console.log('Nothing Else will appear here unless %sleep is invoked.');

});

client.Dispatcher.on(Discordie.Events.DISCONNECTED, (e) => {
	log.debug("Discord (disconnected): " + e.error);
    console.log("Discord (disconnected): " + e.error);
});


///////////////////////////////////////////////
// 4. Message Processing
//////////////////////////////////////////////
// probably your best bet to put everything 
// above this, its a HUGE code block.

client.Dispatcher.on(DisEvents.MESSAGE_CREATE, e => {

	///////////////////////////////////////////////
	// i. Variables and Functions
	//////////////////////////////////////////////

	var talkToMe = e.message.content;
	var member = e.message.member;
	var nickNamu = member.mention;
	var nickNamuy = member.name;


	function sendOut(replay, type) {
		this.replay = replay;
		this.type = type;
		//console.log(this.replay);
		if(type == 0) {
			return e.message.channel.sendMessage(talkback.reply("local-user", replay));
		} else if(type == 1) {
			return e.message.channel.sendMessage(":cherry_blossom: " + talkback.reply("local-user", replay));
		} else if(type == 2) {
			return e.message.channel.sendMessage(":fork_and_knife: " + talkback.reply("local-user", replay));
		}
	}

	if(talkToMe.includes(comTrigN) == false && talkToMe.includes(comTrigAdm) == false && talkToMe.includes(botName) == false) { return; } else {

	///////////////////////////////////////////////
	// ii. Regular commands
	//////////////////////////////////////////////


	if(talkToMe == comTrigN + 'ping') { log.debug('Running command: ' + talkToMe); sendOut("com ping", 0); }
	else if(talkToMe == comTrigN +  'help') { log.debug('Running command: ' + talkToMe); sendOut("com helpme", 0); }
	else if(talkToMe == comTrigN + 'help ex') { log.debug('Running command: ' + talkToMe); sendOut("com helpmeexpanded", 0); }
	else if(talkToMe == comTrigN + 'hello') { log.debug('Running command: ' + talkToMe); sendOut("hello", 0); }
	else if(talkToMe == comTrigN + 'mrgrgr') { log.debug('Running command: ' + talkToMe); sendOut("com mrgrgr", 0); }
	else if(talkToMe == comTrigN + 'music') { log.debug('Running command: ' + talkToMe); sendOut("com goodmusic", 0); }

	///////////////////////////////////////////////
	// iii. Dice Script
	///////////////////////////////////////////////
	
	else if(talkToMe.includes(comTrigN + 'roll ') == true) { if(talkToMe.includes('<diceformat>') == false) {

		diced = talkToMe.replace('e]roll ',''); diced = diced.replace(' ', '');  // <===========================
		
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
			e.message.channel.sendMessage(":game_die: **" + nickNamuy + "'s** rolled the following dice:" + multiRollsPlz + "\n\n **Die Roll Total:** `"+ multiDieTotal + "`.");
		}
		else {
			rollOutDice(); //run script as norm
			if(dresult.total > -1) { // if no errors, print
				 e.message.channel.sendMessage(":game_die: **" + nickNamuy + "** rolled a `" + diced + "` and got `" + dresult + "`"); 
			}
		}


	}}


	///////////////////////////////////////////////
	// iv. process the rivescript chatbot
	//////////////////////////////////////////////

	else if(talkToMe.includes(botName) == true) {

     		talkFriend++;

     			//////////////////////////////
     			log.debug('-- Muffy, someone talked to me! (' + talkFriend + ') They said: ' + talkToMe);
     			//////////////////////////////

               var talkToMeToo = talkToMe.replace(botName,'').toLowerCase();  // <===========================
                    talkToMeToo = talkToMeToo.replace(/[^a-zA-Z0-9 ]/g, "");

     			//////////////////////////////
     			log.debug('-- I saw: ' + talkToMeToo);
     			//////////////////////////////

     		var replied = talkback.reply("local-user", talkToMeToo);
     		// e.message.channel.sendMessage(replied);
			sendOut(talkToMeToo, 1);

     			//////////////////////////////
     			log.debug('-- I said: ' + replied);
     			log.debug('-----');
     			//////////////////////////////


		}

     			
  }

	///////////////////////////////////////////////
	// v. Admin scripts
	//////////////////////////////////////////////

	if(adminPerms == true) { // boolean from ini
		if(talkToMe == comTrigAdm + 'sleep') {
			log.debug('Running command: ' + talkToMe + '; Goodnight Muffy!');
			iniUp.INIUpdate();
			e.message.channel.sendMessage("Goodnight!");
			custard.knockOutThreeAM();
		}

		else if(talkToMe == comTrigAdm + 'update') { log.debug('Running command: ' + talkToMe + ''); iniUp.INIUpdate(); }

		else if(talkToMe.includes(comTrigAdm + 'setgame ') == true) {
			log.debug('Running command: ' + talkToMe + '');
			var gameSet = talkToMe.replace(comTrigAdm + 'esetgame ','');  // <===========================
			client.User.setGame(gameSet);
			e.message.channel.sendMessage("Set game status to *Playing " + gameSet +"*.");
		}
	}

}// KEEP ALL CODE UP ABOVE THIS


// fuck the police commin straight from the underground
	
function rollOutDice() {

	if(droll.validate(diced) == true) {		

		var checkDie = diced.split("d"); checkDie[1] = 'd' + checkDie[1];
				
		//for standard dice check, remove plus or minuses
		if(checkDie[1].includes('+') == true) { 
				var checkDieP = checkDie[1]; checkDieP = checkDieP.split('+'); checkDie[1] = checkDieP[0];
			}
			else if(checkDie[1].includes('-') == true) {
				var checkDieM = checkDie[1]; checkDieM = checkDieM.split('-'); checkDie[1] = checkDieM[0];
		}
		
		if (standardDice.indexOf(checkDie[1]) > -1) {
			multiDiceLegit = true; 
			console.log('Rolling Dice for ' + nickNamuy + ': ' + diced + ',' + droll.validate(diced));
			dresult = droll.roll(diced);
			console.log('==> Result: ' + dresult); 
				
		} else {  console.log('ERR (2): not a standard die'); sendOut("com dicefailtwo", 0); dresult.total = -1; } //throw error 
				
	} else { console.log('ERR (1): not a die roll'); sendOut("com dicefail", 0); dresult.total = -1; } //throw error
}



});
