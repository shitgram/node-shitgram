<div align="center">
	<img src="https://a.kyouko.se/eUhh.png" width="200" height="200"><br>
	<b>Get instagram users and medias info</b>
	<br><br>
	<a href="https://npmjs.com/package/shitgram"><img src="https://img.shields.io/npm/v/shitgram?style=flat-square" alt="Version"></a>
	<img src="https://img.shields.io/node/v/shitgram?style=flat-square" alt="Node">
	<img src="https://img.shields.io/david/shitgram/node-shitgram?style=flat-square" alt="Dependencies">
	<a href="https://github.com/shitgram/node-shitgram/blob/master/LICENSE"><img src="https://img.shields.io/github/license/shitgram/node-shitgram?style=flat-square" alt="License"></a>
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

### new Shitgram(credentials) ⇒ [Constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor)

- **`credentials`** : [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) _(Optional)_
	- `username`<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Your instagram username
	- `password`<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Your instagram password
	- `sessionID`<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; An instagram session id. Will be used if you have not set `username` and `password`.

You will not need to set a session id if you have already set username and password.

### user(param, options) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get user details

- **`param`** : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `Username` or `link` for the user profile you want details about
- **`options`** : [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) _(Optional)_
	- `defaultResponse`<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Set `true` to return instagram default response, `false` is set to default.

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) —  Returned promise

### story(param, options) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get story details

- **`param`** : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `Username` or `link` for the user stories you want details about
- **`options`** : [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) _(Optional)_
	- `defaultResponse`<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Set `true` to return default response from storiesig.com, `false` is set to default.

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