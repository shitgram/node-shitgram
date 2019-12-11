module.exports = {
	Session(username, password) {
		return require('./Session.js').sessionID(username, password)
	}
}