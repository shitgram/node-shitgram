'use strict'

const axios = require('axios');

module.exports = async (username, password) => {
	let csrfToken;
	let sessionID;

	const { headers: getHeaders } = await axios.get('https://www.instagram.com/accounts/login/');

	for (const k in getHeaders['set-cookie']) {
		if (getHeaders['set-cookie'][k].match('^csrftoken=')) {
			csrfToken = getHeaders['set-cookie'][k].split(';')[0].split('=')[1];
		}
	}

	const { headers, body } = await request({
		method: 'POST',
		url: 'https://www.instagram.com/accounts/login/ajax/',
		form: {
			username, password
		},
		headers: {
			'X-CSRFToken': csrfToken
		}
	});

	if (JSON.parse(body).authenticated) {
		for (const k in headers['set-cookie']) {
			if (headers['set-cookie'][k].match('^sessionid=')) {
				sessionID = headers['set-cookie'][k].split(';')[0].split('=')[1];
			}
		}

		return {
			userID: JSON.parse(body).userId,
			csrfToken,
			sessionID
		}
	} else {
		return 'Username or password is incorrect. Please check and try again';
	}	
};

function request(data) {
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