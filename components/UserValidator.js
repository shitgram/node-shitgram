module.exports = (input) => {
	const filter = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)([A-Za-z0-9-_]+)/;
	if (input.match(filter)) {
		return input.match(filter)[1];
	}
	return input;
};