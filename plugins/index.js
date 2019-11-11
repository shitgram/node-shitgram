module.exports = {
	Session: function(username, password) {
		return require('./Session.js').sessionID(username, password);
	}
};