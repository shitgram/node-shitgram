'use strict'

const session = require('../session');
const ExcludeType = require('../enums/EExcludeType.js');
const GetEmails = require('../components/GetEmails.js');
const UserValidator = require('../components/UserValidator.js');
const StoryValidator = require('../components/StoryValidator.js');
const HighlightValidator = require('../components/HighlightValidator.js');
const MediaValidator = require('../components/MediaValidator.js');
const RewriteObjects = require('../components/RewriteObjects.js');
const axios = require('axios');

module.exports = class Shitgram {

	/**
	 *
	 * @param {Object} settings - Settings to generate a new session id or define an existing session
	 */
	constructor(settings) {
		this.settings = settings || {};
		this.settings.username = this.settings.username || false;
		this.settings.password = this.settings.password || false;
		this.settings.sessionID = this.settings.sessionID || false;
	}

	/**
	 * Generate a new session id or return a defined sessionID
	 * @returns {Promise} - Returned promise
	 */
	async getSessionID() {
		if (this.settings.username && this.settings.password && !this.settings.sessionID) {
			return session(
				this.settings.username,
				this.settings.password
			)
			.then((data) => ( data.sessionID ));
		} else if (this.settings.sessionID) {
			return this.settings.sessionID;
		} else {
			return;
		}
	}

	/**
	 * Get user data that is only available with a session id.
	 * @param {String} userID -
	 * @param {String} sessionID -
	 * @returns {Promise} - Returned promise
	 */
	getUserDataWithSession(userID, sessionID) {
		if (typeof userID !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof userID}`);
		}

		if (typeof sessionID !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof sessionID}`);
		}

		return axios({
			method: 'GET',
			url: `https://i.instagram.com/api/v1/users/${userID}/info/`,
			headers: {
				'Cookie': `sessionid=${sessionID}`,
				'User-Agent': 'Instagram 9.5.1 (iPhone9,2; iOS 10_0_2; en_US; en-US; scale=2.61; 1080x1920) AppleWebKit/420+'
			}
		})
		.then((response) => ( response ))
		.catch((error) => ( error ));
	}

	/**
	 * Get user stories that is only available with a session id.
	 * @param {String} userID -
	 * @param {String} sessionID -
	 * @returns {Promise} - Returned promise
	 */
	getUserStoriesWithSession(userID, sessionID) {
		if (typeof userID !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof userID}`);
		}

		if (typeof sessionID !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof sessionID}`);
		}

		return axios({
			method: 'GET',
			url: `https://i.instagram.com/api/v1/feed/user/${userID}/reel_media/`,
			headers: {
				'Cookie': `sessionid=${sessionID}`,
				'User-Agent': 'Instagram 9.5.1 (iPhone9,2; iOS 10_0_2; en_US; en-US; scale=2.61; 1080x1920) AppleWebKit/420+'
			}
		})
		.then((response) => ( response ))
		.catch((error) => ( error ));
	}

	/**
	 * Get user highlight that is only available with a session id.
	 * @param {String} userID -
	 * @param {String} sessionID -
	 * @returns {Promise} - Returned promise
	 */
	getUserHighlightsWithSession(userID, sessionID) {
		if (typeof userID !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof userID}`);
		}

		if (typeof sessionID !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof sessionID}`);
		}

		return axios({
			method: 'GET',
			url: `https://i.instagram.com/api/v1/highlights/${userID}/highlights_tray/`,
			headers: {
				'Cookie': `sessionid=${sessionID}`,
				'User-Agent': 'Instagram 9.5.1 (iPhone9,2; iOS 10_0_2; en_US; en-US; scale=2.61; 1080x1920) AppleWebKit/420+'
			}
		})
		.then((response) => ( response ))
		.catch((error) => ( error ));
	}

	/**
	 * Get user details.
	 * @param {String} username - Username or link for the user profile you want details about
	 * @param {Object} options - Response settings
	 * @returns {Promise} - Returned promise
	 */
	async user(username, options) {
		if (typeof username !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof username}`);
		}

		options = options || {};
		options.defaultResponse = options.defaultResponse || false;

		username = UserValidator(username);

		try {
			const { data } = await axios.get(`https://www.instagram.com/${username}?__a=1`);
			const sessionID = await this.getSessionID();

			if (sessionID) {
				const { data: data_ws } = await this.getUserDataWithSession(data.graphql.user.id, sessionID);

				if (options.defaultResponse) {
					return data;
				} else {
					return Object.assign({}, objectUser(data), { avatarURL: data_ws.user.hd_profile_pic_url_info.url });
				}
			} else {
				if (options.defaultResponse) {
					return data;
				} else {
					return objectUser(data);
				}
			}

			function objectUser(data) {
				const user = data.graphql.user;
				return {
					id: user.id,
					url: `https://www.instagram.com/${user.username}`,
					avatarURL: user.profile_pic_url_hd,
					isPrivate: user.is_private,
					isVerified: user.is_verified,
					isBusiness: user.is_business_account,
					businessCategory: user.business_category_name,
					username: user.username,
					fullName: user.full_name,
					biography: user.biography,
					email: GetEmails(user.biography).values().next.value || null,
					website: user.external_url,
					followers: user.edge_followed_by.count,
					following: user.edge_follow.count,
					posts: user.edge_owner_to_timeline_media.count
				};
			}
		} catch (error) {
			if (error.response.status === 404) {
				error.message = `User ${username} not found`;
			}
			throw {
				method: error.config.method.toUpperCase(),
				statusCode: error.response.status,
				message: error.message
			};
		}
	}

	/**
	 * Get story details.
	 * @param {String} username - Username or link for the user stories you want details about
	 * @param {Object} options - Response settings
	 * @returns {Promise} - Returned promise
	 */
	async story(username, options) {
		if (typeof username !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof username}`);
		}

		options = options || {};
		options.defaultResponse = options.defaultResponse || false;
		options.exclude = options.exclude || undefined;

		username = StoryValidator(username);

		try {
			const sessionID = await this.getSessionID();

			if (sessionID) {
				const { data: { graphql: { user: { id: userID } } } } = await axios.get(`https://www.instagram.com/${username}?__a=1`);
				const { data: data_st } = await this.getUserStoriesWithSession(userID, sessionID);
				const { data: data_ws } = await this.getUserDataWithSession(userID, sessionID);

				if (options.defaultResponse) {
					return data_st;
				} else {
					return RewriteObjects(objectStory(data_st), 'author.avatarURL', data_ws.user.hd_profile_pic_url_info.url);
				}
			} else {
				const { data } = await axios.get(`https://api.storiesig.com/stories/${username}`);

				if (options.defaultResponse) {
					return data;
				} else {
					return objectStory(data);
				}
			}

			function objectStory(data) {
				const stories = [];

				for (let i = 0; i < data.items.length; i++) {
					const story = data.items[i];
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
					});
				}

				return {
					id: data.id,
					stories: options.exclude !== undefined ? stories.filter((story) => story.mediaURL.split('?')[0].indexOf(ExcludeType[options.exclude.toUpperCase()]) === -1) : stories,
					totalStories: data.media_count,
					author: {
						id: data.user.pk,
						url: `https://www.instagram.com/${data.user.username}`,
						avatarURL: data.user.profile_pic_url,
						isPrivate: data.user.is_private,
						isVerified: data.user.is_verified,
						username: data.user.username,
						fullName: data.user.full_name
					}
				};
			}
		} catch (error) {
			if (error.response.status === 404) {
				error.message = `User ${username} not have stories`;
			}
			throw {
				method: error.config.method.toUpperCase(),
				statusCode: error.response.status,
				message: error.message
			};
		}
	}

	/**
	 * Get highlight details.
	 * @param {String} mediaID - Highlight id or link to it
	 * @param {Object} options - Response settings
	 * @returns {Promise} - Returned promise
	 */
	async highlight(mediaID, options) {
		if (typeof mediaID !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof mediaID}`);
		}

		options = options || {};
		options.defaultResponse = options.defaultResponse || false;

		mediaID = HighlightValidator(mediaID);

		try {
			const { data: { user: { id: userID } } } = await axios.get(`https://www.instagram.com/stories/highlights/${mediaID}?__a=1`);
			const sessionID = await this.getSessionID();

			if (sessionID) {
				const { data: data_hl } = await this.getUserHighlightsWithSession(userID, sessionID);
				const { data: data_ws } = await this.getUserDataWithSession(userID, sessionID);

				if (options.defaultResponse) {
					return data_hl;
				} else {
					return RewriteObjects(objectHighlight(data_hl), 'author.avatarURL', data_ws.user.hd_profile_pic_url_info.url);
				}
			} else {
				throw new Error('Malformed credentials');
			}

			function objectHighlight({ tray }) {
				let data;

				tray.filter(function(highlight) {
					if (highlight.id.split(':')[1] === mediaID && highlight.can_reshare) {
						let highlights = [];

						for (let i = 0; i < highlight.items.length; i++) {
							const media = highlight.items[i];

							media.video_versions === undefined
							? highlights.push({
								mediaURL: media.image_versions2.candidates[0].url,
								isVideo: false
							})
							: highlights.push({
								mediaURL: media.video_versions.slice(-1)[0].url,
								isVideo: true
							});
						}

						data = dataHandler(highlight, highlights);
					} else if (highlight.id.split(':')[1] === mediaID) {
						data = dataHandler(highlight, []);
					}

					function dataHandler(data, highlights) {
						return {
							id: data.id.split(':')[1],
							title: data.title,
							canReshare: data.can_reshare,
							highlights: highlights !== undefined ? [ ...highlights ] : highlights,
							createdAt: data.created_at,
							totalMedias: data.media_count,
							author: {
								id: data.user.pk,
								url: `https://www.instagram.com/${data.user.username}`,
								avatarURL: data.user.profile_pic_url,
								isPrivate: data.user.is_private,
								isVerified: data.user.is_verified,
								username: data.user.username,
								fullName: data.user.full_name
							}
						};
					}
				});

				return data;
			}
		} catch (error) {
			if (error.response.status === 404) {
				error.message = `Highlight ${mediaID} not found`;
			}
			throw {
				method: error.config.method.toUpperCase(),
				statusCode: error.response.status,
				message: error.message
			};
		}
	}

	/**
	 * Get image post details.
	 * @param {String} mediaCode - Post code or link to it
	 * @param {Object} options - Response settings
	 * @returns {Promise} - Returned promise
	 */
	async image(mediaCode, options) {
		if (typeof mediaCode !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof mediaCode}`);
		}

		options = options || {};
		options.defaultResponse = options.defaultResponse || false;

		mediaCode = MediaValidator(mediaCode);

		try {
			const { data } = await axios.get(`https://www.instagram.com/p/${mediaCode}?__a=1`);
			const sessionID = await this.getSessionID();

			if (sessionID) {
				const { data: data_ws } = await this.getUserDataWithSession(data.graphql.shortcode_media.owner.id, sessionID);

				if (options.defaultResponse) {
					return data;
				} else {
					return RewriteObjects(objectImage(data), 'author.avatarURL', data_ws.user.hd_profile_pic_url_info.url);
				}
			} else {
				if (options.defaultResponse) {
					return data;
				} else {
					return objectImage(data);
				}
			}

			function objectImage(data) {
				const media = data.graphql.shortcode_media;
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
						url: `https://www.instagram.com/${media.owner.username}`,
						avatarURL: media.owner.profile_pic_url,
						isPrivate: media.owner.is_private,
						isVerified: media.owner.is_verified,
						username: media.owner.username,
						fullName: media.owner.full_name
					}
				};
			}
		} catch (error) {
			if (error.response.status === 404) {
				error.message = `Media ${mediaCode} not found`;
			}
			throw {
				method: error.config.method.toUpperCase(),
				statusCode: error.response.status,
				message: error.message
			};
		}
	}

	/**
	 * Get video post details.
	 * @param {String} mediaCode - Post code or link to it
	 * @param {Object} options - Response settings
	 * @returns {Promise} - Returned promise
	 */
	async video(mediaCode, options) {
		if (typeof mediaCode !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof mediaCode}`);
		}

		options = options || {};
		options.defaultResponse = options.defaultResponse || false;

		mediaCode = MediaValidator(mediaCode);

		try {
			const { data } = await axios.get(`https://www.instagram.com/p/${mediaCode}?__a=1`);
			const sessionID = await this.getSessionID();

			if (sessionID) {
				const { data: data_ws } = await this.getUserDataWithSession(data.graphql.shortcode_media.owner.id, sessionID);

				if (options.defaultResponse) {
					return data;
				} else {
					return RewriteObjects(objectVideo(data), 'author.avatarURL', data_ws.user.hd_profile_pic_url_info.url);
				}
			} else {
				if (options.defaultResponse) {
					return data;
				} else {
					return objectVideo(data);
				}
			}

			function objectVideo(data) {
				const media = data.graphql.shortcode_media;
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
						url: `https://www.instagram.com/${media.owner.username}`,
						avatarURL: media.owner.profile_pic_url,
						isPrivate: media.owner.is_private,
						isVerified: media.owner.is_verified,
						username: media.owner.username,
						fullName: media.owner.full_name
					}
				};
			}
		} catch (error) {
			if (error.response.status === 404) {
				error.message = `Media ${mediaCode} not found`;
			}
			throw {
				method: error.config.method.toUpperCase(),
				statusCode: error.response.status,
				message: error.message
			};
		}
	}

	/**
	 * Get album post details.
	 * @param {String} albumCode - Album post code or link to it
	 * @param {Object} options - Response settings
	 * @returns {Promise} - Returned promise
	 */
	async album(albumCode, options) {
		if (typeof albumCode !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof albumCode}`);
		}

		options = options || {};
		options.defaultResponse = options.defaultResponse || false;
		options.exclude = options.exclude || undefined;

		albumCode = MediaValidator(albumCode);

		try {
			const { data } = await axios.get(`https://www.instagram.com/p/${albumCode}?__a=1`);
			const sessionID = await this.getSessionID();

			if (sessionID) {
				const { data: data_ws } = await this.getUserDataWithSession(data.graphql.shortcode_media.owner.id, sessionID);

				if (options.defaultResponse) {
					return data;
				} else {
					return RewriteObjects(objectAlbum(data), 'author.avatarURL', data_ws.user.hd_profile_pic_url_info.url);
				}
			} else {
				if (options.defaultResponse) {
					return data;
				} else {
					return objectAlbum(data);
				}
			}

			function objectAlbum(data) {
				const post = data.graphql.shortcode_media;
				const album = post.edge_sidecar_to_children.edges;
				let medias = [];

				for (let i = 0; i < album.length; i++) {
					const media = album[i].node;

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
					});
				}

				return {
					id: post.id,
					shortcode: post.shortcode,
					medias: options.exclude !== undefined ? medias.filter((media) => media.mediaURL.split('?')[0].indexOf(ExcludeType[options.exclude.toUpperCase()]) === -1) : medias,
					totalMedias: medias.length,
					likes: post.edge_media_preview_like.count,
					comments: post.edge_media_to_parent_comment.count,
					createdAt: post.taken_at_timestamp,
					author: {
						id: post.owner.id,
						url: `https://www.instagram.com/${post.owner.username}`,
						avatarURL: post.owner.profile_pic_url,
						isPrivate: post.owner.is_private,
						isVerified: post.owner.is_verified,
						username: post.owner.username,
						fullName: post.owner.full_name
					}
				};
			}
		} catch (error) {
			if (error) {
				error.message = `${albumCode} does not contain multiple medias`;
			}
			throw {
				method: 'GET',
				statusCode: 400,
				message: error.message
			};
		}
	}
};