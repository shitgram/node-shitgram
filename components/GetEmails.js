module.exports = class GetEmails {
	/**
	 * Filters all emails contained in a string
	 * @param {String} input - Text containing emails to be filtered
	 * @returns {Array} - Filtered emails
	 */
	static index(input, filter = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g) {
		return input.match(filter);
	}
};