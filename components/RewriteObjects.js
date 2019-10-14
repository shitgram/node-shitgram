module.exports = (object, prop, value) => {
	return prop.split('.').reduce(function(result, part, index, array) {
		if (index === array.length - 1) {
			result[part] = value;
			return object;
		}
		return result[part];
	}, object);
};