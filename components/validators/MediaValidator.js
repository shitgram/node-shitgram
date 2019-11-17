module.exports = class MediaValidator {
	static index(input, filter = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/(?:p\/))((\w|-){11})(?:\S+)?$/) {
		if (input.match(filter)) {
			return input.match(filter)[1];
		}

		return input;
	}
};