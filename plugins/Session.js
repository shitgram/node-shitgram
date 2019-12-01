'use strict';

const axios = require('axios');

module.exports = class Session {
	/**
	 * Requesting csrftoken
	 * @returns {Promise<String>} - New csrf token
	 */
	static async csrfToken() {
		try {
			let csrfToken;

			const { headers } = await axios({
				method: 'GET',
				url: 'https://www.instagram.com/accounts/login/'
			});

			for (const item in headers['set-cookie']) {
				if (headers['set-cookie'][item].match('^csrftoken=')) {
					csrfToken = headers['set-cookie'][item].split(';')[0].split('=')[1];
				}
			}

			return csrfToken;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Generating new session ID
	 * @param {String} username - Instagram account username
	 * @param {String} password - Instagram account password
	 * @returns {Promise<Object>} - New session info
	 */
	static async sessionID(username, password) {
		if (typeof username !== 'string' || typeof password !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof username !== 'string' ? typeof username : typeof password}`);
		}

		try {
			const csrfToken = await this.csrfToken();
			let sessionID;

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
				for (const item in headers['set-cookie']) {
					if (headers['set-cookie'][item].match('^sessionid=')) {
						sessionID = headers['set-cookie'][item].split(';')[0].split('=')[1];
					}
				}

				return {
					userID,
					csrfToken,
					sessionID
				};
			} else {
				throw new Error('Username or password is incorrect. Please check and try again');
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