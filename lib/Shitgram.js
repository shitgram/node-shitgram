'use strict'

const GetEmails = require('../components/GetEmails.js');
const UserValidator = require('../components/UserValidator.js');
const StoryValidator = require('../components/StoryValidator.js');
const MediaValidator = require('../components/MediaValidator.js');
const axios = require('axios');

module.exports = class Shitgram {
	constructor() {
		
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
			if (options.defaultResponse) {
				return data;
			} else {
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

		username = StoryValidator(username);

		try {
			const { data } = await axios.get(`https://api.storiesig.com/stories/${username}`);
			if (options.defaultResponse) {
				return data;
			} else {
				const stories = [];

				for (let i = 0; i < data.items.length; i++) {
					const story = data.items[i];
					story.video_versions === undefined
					? stories.push({
						id: story.pk,
						shortcode: story.code,
						storyURL: story.image_versions2.candidates[0].url,
						dimensions: {
							width: story.original_width,
							height: story.original_height
						},
						isVideo: false
					})
					: stories.push({
						id: story.pk,
						shortcode: story.code,
						storyURL: story.video_versions[0].url,
						dimensions: {
							width: story.original_width,
							height: story.original_height
						},
						isVideo: true
					});
				}

				return {
					id: data.id,
					stories: [ ...stories ],
					totalStories: data.media_count,
					author: {
						id: data.user.pk,
						url: `https://www.instagram.com/${data.user.username}`,
						avatarURL: data.user.profile_pic_url,
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
			if (options.defaultResponse) {
				return data;
			} else {
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
			if (options.defaultResponse) {
				return data;
			} else {
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
					likes: media.edge_media_preview_like.count,
					comments: media.edge_media_to_parent_comment.count,
					isVideo: media.is_video,
					createdAt: media.taken_at_timestamp,
					author: {
						id: media.owner.id,
						url: `https://www.instagram.com/${media.owner.username}`,
						avatarURL: media.owner.profile_pic_url,
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

		albumCode = MediaValidator(albumCode);

		try {
			const { data } = await axios.get(`https://www.instagram.com/p/${albumCode}?__a=1`);
			if (options.defaultResponse) {
				return data;
			} else {
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
						isVideo: media.is_video
					});
				}

				return {
					id: post.id,
					shortcode: post.shortcode,
					likes: post.edge_media_preview_like.count,
					comments: post.edge_media_to_parent_comment.count,
					createdAt: post.taken_at_timestamp,
					medias: [ ...medias ],
					author: {
						id: post.owner.id,
						url: `https://www.instagram.com/${post.owner.username}`,
						avatarURL: post.owner.profile_pic_url,
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