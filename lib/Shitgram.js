'use strict'

const { Session } = require('../plugins')
const ExcludeType = require('../enums/EExcludeType.js')
const {
	GetEmails,
	RewriteObjects
} = require('../components')
const {
	UserValidator,
	StoryValidator,
	HighlightValidator,
	MediaValidator
} = require('../components/validators')

module.exports = class Shitgram {

	/**
	 *
	 * @param {Object} [settings] - Settings to generate a new session id or define an existing session
	 * @param {String} [settings.username] - Instagram username
	 * @param {String} [settings.password] - Instagram user password
	 * @param {String} [settings.sessionID] - Instagram session ID
	 * @param {String} [BASE_URL] - Instagram URL base
	 * @param {String} [API_URL] - Instagram API URL base
	 */
	constructor({
		username = false,
		password = false,
		sessionID = false,
	} = {}, BASE_URL = 'https://www.instagram.com', API_URL = 'https://i.instagram.com/api/v1') {
		this.username = username
		this.password = password
		this.sessionID = sessionID

		this.BASE_URL = BASE_URL
		this.API_URL = API_URL
	}

	/**
	 * Generate a new session id or return a defined sessionID
	 * @returns {Promise<String>} - Session id generated or returning from credentials
	 */
	async getSessionID() {
		if (this.username && this.password && !this.sessionID) {
			return Session(this.username, this.password)
				.then((data) => data.sessionID)
				.catch((error) => error)
		} else if (this.sessionID) {
			return this.sessionID
		} else {
			return
		}
	}

	/*
	 * @deprecated 1.4.2
	 */
	getUserDataWithSession(userID, sessionID) {
		return this.getUserData(userID, sessionID)
	}

	/**
	 * Get user data that is only available with a session id
	 * @param {String} userID
	 * @param {String} sessionID
	 * @returns {Promise<Object>} - User data obtained only in session
	 */
	getUserData(userID, sessionID) {
		if (typeof userID !== 'string' || typeof sessionID !== 'string') throw new TypeError(`Expected a string, got ${typeof userID !== 'string' ? typeof userID : typeof sessionID}`)

		return this._get(`${this.API_URL}/users/${userID}/info/`, {
			headers: {
				'Cookie': `sessionid=${sessionID}`
			}
		})
		.then((response) => response)
		.catch((error) => error)
	}

	/*
	 * @deprecated 1.4.2
	 */
	getUserStoriesWithSession(userID, sessionID) {
		return this.getUserStories(userID, sessionID)
	}

	/**
	 * Get user stories that is only available with a session id
	 * @param {String} userID
	 * @param {String} sessionID
	 * @returns {Promise<Object>} - User story data obtained in one session only
	 */
	getUserStories(userID, sessionID) {
		if (typeof userID !== 'string' || typeof sessionID !== 'string') throw new TypeError(`Expected a string, got ${typeof userID !== 'string' ? typeof userID : typeof sessionID}`)

		return this._get(`${this.API_URL}/feed/user/${userID}/reel_media/`, {
			headers: {
				'Cookie': `sessionid=${sessionID}`
			}
		})
		.then((response) => response)
		.catch((error) => error)
	}

	/*
	 * @deprecated 1.4.2
	 */
	getUserHighlightsWithSession(userID, sessionID) {
		return this.getUserHighlights(userID, sessionID)
	}

	/**
	 * Get user highlight that is only available with a session id
	 * @param {String} userID
	 * @param {String} sessionID
	 * @returns {Promise<Object>} - User Highlight data obtained in one session only
	 */
	getUserHighlights(userID, sessionID) {
		if (typeof userID !== 'string' || typeof sessionID !== 'string') throw new TypeError(`Expected a string, got ${typeof userID !== 'string' ? typeof userID : typeof sessionID}`)

		return this._get(`${this.API_URL}/highlights/${userID}/highlights_tray/`, {
			headers: {
				'Cookie': `sessionid=${sessionID}`
			}
		})
		.then((response) => response)
		.catch((error) => error)
	}

	/**
	 * Get user details
	 * @param {String} username - Username or link for the user profile you want details about
	 * @param {Object} [options] - Response settings
	 * @param {Boolean} [options.defaultResponse] - Default response from instagram
	 * @returns {Promise<Object>} - User data
	 */
	async user(username, { defaultResponse = false } = {}) {
		if (typeof username !== 'string') throw new TypeError(`Expected a string, got ${typeof username}`)

		username = UserValidator(username)

		try {
			const data = await this._get(`${this.BASE_URL}/${username}?__a=1`)
			const sessionID = await this.getSessionID()

			if (sessionID) {
				const data_ws = await this.getUserData(data.graphql.user.id, sessionID)

				if (defaultResponse) {
					return data
				} else {
					return Object.assign({}, objectUser(data), { avatarURL: data_ws.user.hd_profile_pic_url_info.url })
				}
			} else {
				if (defaultResponse) {
					return data
				} else {
					return objectUser(data)
				}
			}

			function objectUser(user) {
				const user = data.graphql.user

        return {
					id: user.id,
					avatarURL: user.profile_pic_url_hd,
					isPrivate: user.is_private,
					isVerified: user.is_verified,
					isBusiness: user.is_business_account,
					businessCategory: user.business_category_name,
					username: user.username,
					fullName: user.full_name,
					biography: user.biography,
					email: GetEmails(user.biography),
					website: user.external_url,
					highlights: user.highlight_reel_count,
					followers: user.edge_followed_by.count,
					following: user.edge_follow.count,
					posts: user.edge_owner_to_timeline_media.count
				}
			}
		} catch (error) {
			if (error.message === `Cannot read property 'user' of undefined`) {
				error.message = `User ${username} not found`
			}

			throw error
		}
	}

	/**
	 * Get story details
	 * @param {String} username - Username or link for the user stories you want details about
	 * @param {Object} [options] - Response settings
	 * @param {Boolean} [options.defaultResponse] - Default response from instagram
	 * @param {String} [options.exlude] - Type of file to be removed from the response
	 * @returns {Promise<Object>} - User story data
	 */
	async story(username, {
		defaultResponse = false,
		exclude = undefined
	} = {}) {
		if (typeof username !== 'string') throw new TypeError(`Expected a string, got ${typeof username}`)

		username = StoryValidator(username)

		try {
			const sessionID = await this.getSessionID()

			if (sessionID) {
				const { graphql: { user: { id: userID } } } = await this._get(`${this.BASE_URL}/${username}?__a=1`)
				const data_st = await this.getUserStories(userID, sessionID)
				const data_ws = await this.getUserData(userID, sessionID)

				if (defaultResponse) {
					return data_st
				} else {
					return RewriteObjects(objectStory(data_st), 'author.avatarURL', data_ws.user.hd_profile_pic_url_info.url)
				}
			} else {
				const data = await this._get(`https://api.storiesig.com/stories/${username}`)

				if (defaultResponse) {
					return data
				} else {
					return objectStory(data)
				}
			}

			function objectStory(data) {
				const stories = []

				for (let i = 0; i < data.items.length; i++) {
					const story = data.items[i]
					story.video_versions === undefined
					? stories.push({
						id: story.pk,
						shortcode: story.code,
						mediaURL: story.image_versions2.candidates[0].url,
						dimensions: {
							width: story.original_width,
							height: story.original_height
						},
						isVideo: false
					})
					: stories.push({
						id: story.pk,
						shortcode: story.code,
						mediaURL: story.video_versions[0].url,
						dimensions: {
							width: story.original_width,
							height: story.original_height
						},
						isVideo: true
					})
				}

				return {
					id: data.id,
					stories: exclude !== undefined ? stories.filter((story) => story.mediaURL.split('?')[0].indexOf(ExcludeType[exclude.toUpperCase()]) === -1) : stories,
					totalStories: data.media_count,
					author: {
						id: data.user.pk,
						avatarURL: data.user.profile_pic_url,
						isPrivate: data.user.is_private,
						isVerified: data.user.is_verified,
						username: data.user.username,
						fullName: data.user.full_name
					}
				}
			}
		} catch (error) {
			if (error.message === `Cannot read property 'length' of undefined`) {
				error.message = `User ${username} not have stories`
			}

			throw error
		}
	}

	/**
	 * Get highlight details
	 * @param {String} mediaID - Highlight id or link to it
	 * @param {Object} options - Response settings
	 * @param {Boolean} [options.defaultResponse] - Default response from instagram
	 * @param {String} [options.exclude] - Type of file to be removed from the response
	 * @returns {Promise<Object>} - User highlight data
	 */
	async highlight(mediaID, {
		defaultResponse = false,
		exlude = undefined
	} = {}) {
		if (typeof mediaID !== 'string') throw new TypeError(`Expected a string, got ${typeof mediaID}`)

		mediaID = HighlightValidator(mediaID)

		try {
			const { user: { id: userID } } = await this._get(`${this.BASE_URL}/stories/highlights/${mediaID}?__a=1`)

			const sessionID = await this.getSessionID()

			if (sessionID) {
				const data_hl = await this.getUserHighlights(userID, sessionID)
				const data_ws = await this.getUserData(userID, sessionID)

				if (defaultResponse) {
					return data_hl
				} else {
					return RewriteObjects(objectHighlight(data_hl), 'author.avatarURL', data_ws.user.hd_profile_pic_url_info.url)
				}
			} else {
				throw new Error('Malformed credentials')
			}

			function objectHighlight({ tray }) {
				let data

				tray.filter((highlight) => {
					if (highlight.id.split(':')[1] === mediaID && highlight.can_reshare) {
						let highlights = []

						for (let i = 0; i < highlight.items.length; i++) {
							const media = highlight.items[i]

							media.video_versions === undefined
							? highlights.push({
								mediaURL: media.image_versions2.candidates[0].url,
								isVideo: false
							})
							: highlights.push({
								mediaURL: media.video_versions.slice(-1)[0].url,
								isVideo: true
							})
						}

						data = dataHandler(highlight, highlights)
					} else if (highlight.id.split(':')[1] === mediaID) {
						data = dataHandler(highlight, [])
					}

					function dataHandler(data, highlights) {
						return {
							id: data.id.split(':')[1],
							title: data.title,
							canReshare: data.can_reshare,
							highlights: highlights ? exclude !== undefined ? highlights.filter((highlight) => highlight.mediaURL.split('?')[0].indexOf(ExcludeType[exclude.toUpperCase()]) === -1) : highlights : highlights,
							createdAt: data.created_at,
							totalMedias: data.media_count,
							author: {
								id: data.user.pk,
								avatarURL: data.user.profile_pic_url,
								isPrivate: data.user.is_private,
								isVerified: data.user.is_verified,
								username: data.user.username,
								fullName: data.user.full_name
							}
						}
					}
				})

				return data
			}
		} catch (error) {
			if (error.message === `Cannot destructure property \`shortcode_media\` of 'undefined' or 'null'.`) {
				error.message = `Highlight ${mediaID} not found`
			}

			throw error
		}
	}

	/**
	 * Get image post details
	 * @param {String} mediaCode - Post code or link to it
	 * @param {Object} options - Response settings
	 * @param {Boolean} [options.defaultResponse] - Default response from instagram
	 * @returns {Promise<Object>} - Image data
	 */
	async image(mediaCode, { defaultResponse = false } = {}) {
		if (typeof mediaCode !== 'string') throw new TypeError(`Expected a string, got ${typeof mediaCode}`)

		mediaCode = MediaValidator(mediaCode)

		try {
			const data = await this._get(`${this.BASE_URL}/p/${mediaCode}?__a=1`)
			const sessionID = await this.getSessionID()

			if (sessionID) {
				const data_ws = await this.getUserData(data.graphql.shortcode_media.owner.id, sessionID)

				if (defaultResponse) {
					return data
				} else {
					return RewriteObjects(objectImage(data), 'author.avatarURL', data_ws.user.hd_profile_pic_url_info.url)
				}
			} else {
				if (defaultResponse) {
					return data
				} else {
					return objectImage(data)
				}
			}

			function objectImage({ graphql: { shortcode_media: media }}) {
				return {
					id: media.id,
					shortcode: media.shortcode,
					imageURL: media.display_resources.slice(-1)[0].src,
					description: media.edge_media_to_caption.edges.length > 0 ? media.edge_media_to_caption.edges[0].node.text : '',
					caption: media.accessibility_caption,
					dimensions: {
						width: media.dimensions.width,
						height: media.dimensions.height
					},
					likes: media.edge_media_preview_like.count,
					comments: media.edge_media_preview_comment.count,
					isVideo: media.is_video,
					createdAt: media.taken_at_timestamp,
					author: {
						id: media.owner.id,
						avatarURL: media.owner.profile_pic_url,
						isPrivate: media.owner.is_private,
						isVerified: media.owner.is_verified,
						username: media.owner.username,
						fullName: media.owner.full_name
					}
				}
			}
		} catch (error) {
			if (error.message === `Cannot destructure property \`shortcode_media\` of 'undefined' or 'null'.`) {
				error.message = `Media ${mediaCode} not found`
			}

			throw error
		}
	}

	/**
	 * Get video post details
	 * @param {String} mediaCode - Post code or link to it
	 * @param {Object} options - Response settings
	 * @param {Boolean} [options.defaultResponse] - Default response from instagram
	 * @returns {Promise<Object>} - Video data
	 */
	async video(mediaCode, { defaultResponse = false } = {}) {
		if (typeof mediaCode !== 'string') throw new TypeError(`Expected a string, got ${typeof mediaCode}`)

		mediaCode = MediaValidator(mediaCode)

		try {
			const data = await this._get(`${this.BASE_URL}/p/${mediaCode}?__a=1`)
			const sessionID = await this.getSessionID()

			if (sessionID) {
				const data_ws = await this.getUserData(data.graphql.shortcode_media.owner.id, sessionID)

				if (defaultResponse) {
					return data
				} else {
					return RewriteObjects(objectVideo(data), 'author.avatarURL', data_ws.user.hd_profile_pic_url_info.url)
				}
			} else {
				if (defaultResponse) {
					return data
				} else {
					return objectVideo(data)
				}
			}

			function objectVideo({ graphql: { shortcode_media: media }}) {
				return {
					id: media.id,
					shortcode: media.shortcode,
					videoURL: media.video_url,
					description: media.edge_media_to_caption.edges.length > 0 ? media.edge_media_to_caption.edges[0].node.text : '',
					dimensions: {
						width: media.dimensions.width,
						height: media.dimensions.height
					},
					views: media.video_view_count,
					likes: media.edge_media_preview_like.count,
					comments: media.edge_media_to_parent_comment.count,
					isVideo: media.is_video,
					createdAt: media.taken_at_timestamp,
					author: {
						id: media.owner.id,
						avatarURL: media.owner.profile_pic_url,
						isPrivate: media.owner.is_private,
						isVerified: media.owner.is_verified,
						username: media.owner.username,
						fullName: media.owner.full_name
					}
				}
			}
		} catch (error) {
			if (error.message === `Cannot destructure property \`shortcode_media\` of 'undefined' or 'null'.`) {
				error.message = `Media ${mediaCode} not found`
			}

			throw error
		}
	}

	/**
	 * Get album post details
	 * @param {String} albumCode - Album post code or link to it
	 * @param {Object} options - Response settings
	 * @param {Boolean} [options.defaultResponse] - Default response from instagram
	 * @param {String} [options.exclude] - Type of file to be removed from the response
	 * @returns {Promise<Object>} - Album data
	 */
	async album(albumCode, {
		defaultResponse = false,
		exclude = undefined
	} = {}) {
		if (typeof albumCode !== 'string') throw new TypeError(`Expected a string, got ${typeof albumCode}`)

		albumCode = MediaValidator(albumCode)

		try {
			const data = await this._get(`${this.BASE_URL}/p/${albumCode}?__a=1`)
			const sessionID = await this.getSessionID()

			if (sessionID) {
				const data_ws = await this.getUserData(data.graphql.shortcode_media.owner.id, sessionID)

				if (defaultResponse) {
					return data
				} else {
					return RewriteObjects(objectAlbum(data), 'author.avatarURL', data_ws.user.hd_profile_pic_url_info.url)
				}
			} else {
				if (defaultResponse) {
					return data
				} else {
					return objectAlbum(data)
				}
			}

			function objectAlbum(data) {
				const post = data.graphql.shortcode_media
				const album = post.edge_sidecar_to_children.edges
				let medias = []

				for (let i = 0; i < album.length; i++) {
					const media = album[i].node

					!media.is_video
					? medias.push({
						id: media.id,
						shortcode: media.shortcode,
						mediaURL: media.display_resources.slice(-1)[0].src,
						caption: media.accessibility_caption,
						dimensions: {
							width: media.dimensions.width,
							height: media.dimensions.height
						},
						isVideo: media.is_video
					})
					: medias.push({
						id: media.id,
						shortcode: media.shortcode,
						mediaURL: media.video_url,
						caption: null,
						dimensions: {
							width: media.dimensions.width,
							height: media.dimensions.height
						},
						views: media.video_view_count,
						isVideo: media.is_video
					})
				}

				return {
					id: post.id,
					shortcode: post.shortcode,
					medias: exclude !== undefined ? medias.filter((media) => media.mediaURL.split('?')[0].indexOf(ExcludeType[exclude.toUpperCase()]) === -1) : medias,
					totalMedias: medias.length,
					likes: post.edge_media_preview_like.count,
					comments: post.edge_media_to_parent_comment.count,
					createdAt: post.taken_at_timestamp,
					author: {
						id: post.owner.id,
						avatarURL: post.owner.profile_pic_url,
						isPrivate: post.owner.is_private,
						isVerified: post.owner.is_verified,
						username: post.owner.username,
						fullName: post.owner.full_name
					}
				}
			}
		} catch (error) {
			if (error.message === `Cannot read property 'shortcode_media' of undefined`) {
				error.message = `Album ${albumCode} not found`
			} else if (error.message === `Cannot read property 'edges' of undefined`) {
        error.message = `${albumCode} does not contain multiple medias`
      }

			throw error
		}
	}

	_get(url, { headers = {} } = {}) {
		headers['User-Agent'] = 'Mozilla/5.0 (Linux; Android 8.1.0; motorola one Build/OPKS28.63-18-3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.80 Mobile Safari/537.36 Instagram 72.0.0.21.98 Android (27/8.1.0; 320dpi; 720x1362; motorola; motorola one; deen_sprout; qcom; pt_BR; 132081645)'

		return require('node-fetch')(url, { headers }).then((response) => response.json()).catch((error) => error)
	}
}