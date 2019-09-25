'use strict';

const GetEmails = require('./components/GetEmails.js');
const UserValidator = require('./components/UserValidator.js');
const MediaValidator = require('./components/MediaValidator.js');
const axios = require('axios');

module.exports = {
	user: async function(username, options) {
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
				error.message = `User "${username}" not found`;
			}
			throw {
				method: error.config.method.toUpperCase(),
				statusCode: error.response.status,
				message: error.message
			};
		}
	},
	image: async function(mediaID, options) {
		if (typeof mediaID !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof mediaID}`);
		}

		options = options || {};
		options.defaultResponse = options.defaultResponse || false;

		mediaID = MediaValidator(mediaID);

		try {
			const { data } = await axios.get(`https://www.instagram.com/p/${mediaID}?__a=1`);
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
				error.message = `Media "${mediaID}" not found`;
			}
			throw {
				method: error.config.method.toUpperCase(),
				statusCode: error.response.status,
				message: error.message
			};
		}
	},
	video: async function(mediaID, options) {
		if (typeof mediaID !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof mediaID}`);
		}

		options = options || {};
		options.defaultResponse = options.defaultResponse || false;

		mediaID = MediaValidator(mediaID);

		try {
			const { data } = await axios.get(`https://www.instagram.com/p/${mediaID}?__a=1`);
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
				error.message = `Media "${mediaID}" not found`;
			}
			throw {
				method: error.config.method.toUpperCase(),
				statusCode: error.response.status,
				message: error.message
			};
		}
	}
};