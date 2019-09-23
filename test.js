const Shitgram = require('./');

Shitgram.user('tenasatupitsyn')
	.then(function(user) {
		console.log(user);
	})
	.catch(function(error) {
		console.log(error);
	});