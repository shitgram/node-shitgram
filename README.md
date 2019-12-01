<p align="center">
	<img src="https://a.kyouko.se/eUhh.png" width="200" height="200"><br>
	<b>A JavaScript library to make requests to Instagram</b>
	<br><br>
	<a href="https://npmjs.com/package/shitgram"><img src="https://img.shields.io/npm/v/shitgram?style=flat-square" alt="Version"></a>
	<img src="https://img.shields.io/node/v/shitgram?style=flat-square" alt="Node">
	<img src="https://img.shields.io/david/shitgram/node-shitgram?style=flat-square" alt="Dependencies">
	<a href="https://github.com/shitgram/node-shitgram/blob/master/LICENSE"><img src="https://img.shields.io/github/license/shitgram/node-shitgram?style=flat-square" alt="License"></a>
</p>

## Contents

- [Installation](#installation)
- [Example](#example)
- [Documentation](#documentation)
- [Plugins](#plugins)

## Installation

```
$ yarn add shitgram
```

## Example

```js
const Shitgram = require('shitgram');

const shitgram = new Shitgram();

shitgram.user('tenasatupitsyn')
	.then((data) => {
		// Handle success
		console.log(data);

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
	.catch((error) => {
		// Handle error
		console.log(error);
	});
```

## Documentation

### new Shitgram(credentials) ⇒ [Constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor)

- **`credentials`** : [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) _(Optional)_
	- `username` : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Instagram account username
	- `password` : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Instagram account password
	- `sessionID` : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; An instagram session id. Will be used if you have not set `username` and `password`.

You will not need to set a session id if you have already set username and password.

### getSessionID ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Generate a new session id or return a defined sessionID

If username and password are set, a new session id will always be generated. So that a unique session id will be returned set property sessionID in the credentials.

It is possible to get the session ID without the builder by using [plug-in](#plugins).

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> —  Session id generated or returning from credentials

### getUserDataWithSession(userID, sessionID) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get user data that is only available with a session id

- `userID` : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_
- `sessionID` : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> —  User data obtained only in session

### getUserStoriesWithSession(userID, sessionID) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get user stories that is only available with a session id

- `userID` : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_
- `sessionID` : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> —  User story data obtained in one session only

### getUserHighlightsWithSession(userID, sessionID) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get user highlight that is only available with a session id

- `userID` : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_
- `sessionID` : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> —  User Highlight data obtained in one session only

### user(param[, options]) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get user details

- **`param`** : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `Username` or `link` for the user profile you want details about
- **`options`** : [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) _(Optional)_
	- `defaultResponse` : [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Set `true` to return instagram default response, `false` is set to default.

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> —  User data

### story(param[, options]) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get story details

- **`param`** : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `Username` or `link` for the user stories you want details about
- **`options`** : [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) _(Optional)_
	- `defaultResponse` : [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Set `true` to return default response from storiesig.com or if you have set credentials the response will be from instagram.com, `false` is set to default.
	- `exclude` : [ExcludeType](#excludetype--enumstring)<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The file type to [exclude](https://github.com/shitgram/node-shitgram/blob/master/enums/EExcludeType.js) from the response, will not exclude if **defaultResponse** is `true`.

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> —  User story data

### highlight(param[, options]) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get highlight details

- **`param`** : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `Highlight id` or `link` to it
- **`options`** : [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) _(Optional)_
	- `defaultResponse` : [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Set `true` to return instagram default response, `false` is set to default.
	- `exclude` : [ExcludeType](#excludetype--enumstring)<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The file type to [exclude](https://github.com/shitgram/node-shitgram/blob/master/enums/EExcludeType.js) from the response, will not exclude if **defaultResponse** is `true`.

Highlights will be returned if they have been set by the author to be shared, check availability of highlights in the `canReshare` property; if null, highlights will be an empty array.

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> —  User highlight data

### image(param[, options]) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get image post details

- **`param`** : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `Post code` or `link` to it
- **`options`** : [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) _(Optional)_
	- `defaultResponse` : [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Set `true` to return instagram default response, `false` is set to default.

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> —  Image data

### video(param[, options]) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get video post details

- **`param`** : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `Post code` or `link` to it
- **`options`** : [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) _(Optional)_
	- `defaultResponse` : [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Set `true` to return instagram default response, `false` is set to default.

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> —  Video data

### album(param[, options]) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Get album post details

- **`param`** : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Album `post code` or `link` to it
- **`options`** : [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) _(Optional)_
	- `defaultResponse` : [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Set `true` to return instagram default response, `false` is set to default.
	- `exclude` : [ExcludeType](#excludetype--enumstring)<br>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The file type to [exclude](https://github.com/shitgram/node-shitgram/blob/master/enums/EExcludeType.js) from the response, will not exclude if **defaultResponse** is `true`.

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> —  Album data

### ExcludeType : _enum<[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>_
File type to exclude from response

Available properties: `IMAGE` - `VIDEO`

## Plugins

### Session(username, password) ⇒ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
Generate a new csrfToken and sessionID from Instagram username and password

- `username` : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Instagram account username
- `password` : [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) _(Required)_<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Instagram account password

A brief example of use [here](https://github.com/shitgram/node-shitgram/blob/master/examples/generate_session.example.js)

**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)> —  New session info

<p align="center">
	<a href="#readme">BACK TO TOP</a>
</p>