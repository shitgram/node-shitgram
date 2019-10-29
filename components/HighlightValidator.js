module.exports = (input) => {
	const filter = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/(?:stories\/highlights\/))((\w|-){17})(?:\S+)?$/;
	if (input.match(filter)) {
		return input.match(filter)[1];
	}
	return input;
};