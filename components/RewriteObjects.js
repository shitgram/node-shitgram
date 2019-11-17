module.exports = class RewriteObjects {
	/**
	 * Rewrite property of an object
	 * @param {Object} object - Object to be rewritten
	 * @param {String} property - Object property to rewrite
	 * @param {} value - New value that will be assigned to property
	 * @returns {Object} - Rewritten Object
	 */
	static index(object, property, value) {
		return property.split('.').reduce((result, part, index, array) => {
			if (index === array.length - 1) {
				result[part] = value;
				return object;
			}

			return result[part];
		}, object);
	}
};