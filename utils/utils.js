module.exports = {
	/**
	 * @param {Date} date
	 * @return {Date}
	 */
	onlyDate: (date) => {
		return new Date(new Date(date.toDateString()) + ' GMT +0');
	}
}
