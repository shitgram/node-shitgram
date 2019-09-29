<div>
	<h1>Shitgram</h1>
	<p>Get instagram users and medias info</p>
</div>

## Contents

- [Installation](#installation)
- [Example](#example)
- [Documentation](#documentation)

## Installation

```
$ yarn add shitgram
```

## Example

```js
const Shitgram = require('shitgram');

const shitgram = new Shitgram();

shitgram.user('tenasatupitsyn')
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
				biography: 'YuGi TeNaSa 1010.\nLara/VE 🇻🇪',
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

### *new Client()*

### user(param, options) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get user details

- **`param`** : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `Username` or `link` for the user profile you want details about
- **`options`** : [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) _(Optional)_
	- `defaultResponse`<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Set `true` to return instagram default response, `false` is set to default.

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) —  Returned promise

### image(param, options) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get image post details

- **`param`** : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `Post code` or `link` to it
- **`options`** : [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) _(Optional)_
	- `defaultResponse`<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Set `true` to return instagram default response, `false` is set to default.

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) —  Returned promise

### video(param, options) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get video post details

- **`param`** : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `Post code` or `link` to it
- **`options`** : [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) _(Optional)_
	- `defaultResponse`<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Set `true` to return instagram default response, `false` is set to default.

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) —  Returned promise

### album(param, options) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get album post details

- **`param`** : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Album `post code` or `link` to it
- **`options`** : [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) _(Optional)_
	- `defaultResponse`<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Set `true` to return instagram default response, `false` is set to default.

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) —  Returned promise

[BACK TO TOP](#contents)
