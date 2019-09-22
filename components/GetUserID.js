'use strict';

const axios = require('axios');

module.exports = async (username) => {
	try {
		const { data } = await axios.get(`https://www.instagram.com/${username}?__a=1`);
		return data.graphql.user.id;
	} catch (error) {
		throw error;
	}
};