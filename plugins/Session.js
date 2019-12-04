'use strict';

module.exports = class Session {
	/**
	 * Requesting csrftoken
	 * @returns {Promise<String>} - New csrf token
	 */
	static async csrfToken() {
		try {
			const { headers } = await this._get('https://www.instagram.com/accounts/login/');

			return String(headers.get('set-cookie').match(/csrftoken=([A-Za-z0-9]+)/g)).slice(10);
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
			const { headers, body } = await this._post({
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
				const sessionID = String(headers['set-cookie'].join(' ').match(/sessionid=([A-Za-z0-9]+.*)/g)).split(';')[0].slice(10);

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

	static _get(options) {
		return require('node-fetch')(options).then((response) => response).catch((error) => error);
	}

	static _post(data) {
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