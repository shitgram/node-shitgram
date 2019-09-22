module.exports = (string) => {
	const emails = string.match(EmailRegex());
	return new Set(emails ? emails.map((email) => email.trim()) : []);

	function EmailRegex({ exact } = {}) {
		const filter = '[^\\.\\s@:](?:[^\\s@:]*[^\\s@:\\.])?@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*';
		exact ? new RegExp(`^${filter}$`) : new RegExp(filter, 'g');
	}
};