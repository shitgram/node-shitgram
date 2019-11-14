// Declaring Session from "shitgram" library
const { Session } = require('../').Plugins;

// Declaring Session from "shitgram/plugins" library plugins path
const { Session } = require('../plugins');

Session(process.env.USERNAME, process.env.PASSWORD)
	.then(function(data) {
		// Handle success
		console.log(data);

		/*
			{	userID: '1234567890',
			 	csrfToken: 'k44Ha0E2cDxc5lBNz3tfd3tk1LgTlhFa',
			 	sessionID: '7565175908%3ARVdJQzLsBldS9G%3A20'	}
		 */

	})
	.catch(function(error) {
		// Handle error
		console.log(error);
	});