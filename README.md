<p align="center">
	<h1>Shitgram</h1>
	<p>Get instagram users or medias info.</p>
</p>

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)

## Installation

```
$ yarn add shitgram
```

## Usage

```js
const Shitgram = require('shitgram');

Shitgram.user('tenasatupitsyn')
	.then(function(user) {
		// Handle success
		console.log(user);

		/*
			{	id: '7661979279',
			 	url: 'https://www.instagram.com/tenasatupitsyn',
			 	avatarURL: 'https://instagram.frec8-1.fna.fbcdn.net/vp/d5...',
				isPrivate: false,
				isVerified: false,
				isBusiness: true,
				businessCategory: 'Creators & Celebrities',
				username: 'tenasatupitsyn',
				fullName: 'Tenasa M. Tupitsyn',
				biography: '',
				email: null,
				website: null,
				followers: 0,
				following: 0,
				posts: 0	}
		*/

	})
	.catch(function(error) {
		// Handle error
		console.log(error);
	});
```

## Documentation

### user(params, options)

- `params [string]` - A `username` or `profile link`
- `options [object]`
	- `defaultResponse` - Set `true` to return instagram default response, `false` is set to default.

### image(params, options)

- `params [string]` - A `post code` or `link` to it
- `options [object]`
	- `defaultResponse` - Set `true` to return instagram default response, `false` is set to default.

### video(params, options)

- `params [string]` - A `post code` or `link` to it
- `options [object]`
	- `defaultResponse` - Set `true` to return instagram default response, `false` is set to default.

[BACK TO TOP](#contents)