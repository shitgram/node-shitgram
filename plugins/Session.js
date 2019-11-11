'use strict'

const axios = require('axios');

module.exports = class Session {
	/**
	 * Requesting csrftoken
	 * @returns {Promise} - Returned promise
	 */
	static async csrfToken() {
		let csrfToken;

		const { headers } = await axios({
			method: 'GET',
			url: 'https://www.instagram.com/accounts/login/'
		});

		for (const k in headers['set-cookie']) {
			if (headers['set-cookie'][k].match('^csrftoken=')) {
				csrfToken = headers['set-cookie'][k].split(';')[0].split('=')[1];
			}
		}

		return csrfToken;
	}

	/**
	 * Generating new session ID
	 * @param {String} username - Instagram account username
	 * @param {String} password - Instagram account password
	 * @returns {Promise} - Returned promise
	 */
	static async sessionID(username, password) {
		const csrfToken = await this.csrfToken();
		let sessionID;

		try {
			const { headers, body } = await this.request({
				method: 'POST',
				url: 'https://www.instagram.com/accounts/login/ajax/',
				form: {
					username,
					password
				},
				headers: {
					'X-CSRFToken': csrfToken
				}
			});

			const { userId: userID, authenticated } = JSON.parse(body);

			if (authenticated) {
				for (const k in headers['set-cookie']) {
					if (headers['set-cookie'][k].match('^sessionid=')) {
						sessionID = headers['set-cookie'][k].split(';')[0].split('=')[1];
					}
				}

				return {
					userID,
					csrfToken,
					sessionID
				}
			} else {
				return 'Username or password is incorrect. Please check and try again';
			}
		} catch (error) {
			throw error;
		}
	}

	static request(data) {
		return new Promise(function(resolve, reject) {
			require('request')(data, function(error, response, body) {
				if (!error) {
					resolve(response);
				} else {
					reject(error);
				}
			});
		});
	}
};