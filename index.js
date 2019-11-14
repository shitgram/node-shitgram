const Shitgram = require('./lib/Shitgram.js');

Shitgram.ExcludeType = require('./enums/EExcludeType.js');
Shitgram.Plugins = {
	Session: require('./plugins').Session
};

module.exports = Shitgram;