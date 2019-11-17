module.exports = class StoryValidator {
	static index(input, filter = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/stories\/)([A-Za-z0-9-_]+)/) {
		if (input.match(filter)) {
			return input.match(filter)[1];
		}
		
		return input;
	}
};