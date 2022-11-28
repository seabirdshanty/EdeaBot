(function() {

var fs = require('fs')
 , Log = require('log')
 , ini = require('ini')
 , custard = require("./tetsmod.js")


var talkFriend = 0;
var adminAcc = false;

module.exports.loadINI = function() {

	// load variables dependent on config
	adminAcc = config.discordini['adminperm'];
	talkFriend = config.persona['friendliness'];

	// display
	console.log('LOADING CONFIG...');
	if(adminAcc == true) { console.log('CONFIG [!] ADMIN COMMANDS ARE ON [!]') }
	console.log('CONFIG friendliness: ' + config.persona['friendliness'] + ' = VAR: ' + talkFriend);
	console.log("CONFIG file ./config.ini loaded.");
	console.log('-----');


	log.debug('LOADING CONFIG:');
	if(adminAcc == true) { log.debug('CONFIG ADMIN COMMANDS ARE ON') }
	log.debug('CONFIG friendliness: ' + config.persona['friendliness'] + ' = VAR: ' + talkFriend);
	log.debug("CONFIG file config.ini loaded.");

	config.updated.time = custard.itsSummerTime();
	config.updated.lastfor = 'startup';
	fs.writeFileSync('./config.ini', ini.stringify(config));

}

module.exports.getAdminPerm = function() { return adminAcc; }
module.exports.getTalkFriend = function() { return talkFriend; }


module.exports.INIUpdate = function() {

	//config.persona.friendliness = talkFriend;

	config.updated.time = custard.itsSummerTime();
	config.updated.lastfor = 'INIUpdate Command';
	fs.writeFileSync('./config.ini', ini.stringify(config))

	log.debug('INI updated');
	console.log('INI Updated');

}

}());
