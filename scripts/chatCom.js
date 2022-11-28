(function() {
var Discordie = require('discordie');
const client = new Discordie();

module.exports.sendOutB = function(replay, type) {
		this.replay = replay;
		this.type = type;
		// or get a channel from guild:
		var guild = client.Guilds.find(g => g.name == "JellyFish Yet Again");
		// guild.textChannels is an array
		var channel = guild.textChannels.find(c => c.name == "botchill");
		//console.log(this.replay);
		if(type == 0) {
			return channel.sendMessage(talkback.reply("local-user", replay));
		} else if(type == 1) {
			return channel.sendMessage(":cherry_blossom: " + talkback.reply("local-user", replay));
		} else if(type == 2) {
			return channel.sendMessage(":fork_and_knife: " + talkback.reply("local-user", replay));
		}
}

})();

