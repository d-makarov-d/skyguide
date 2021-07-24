module.exports = {
	/**
	 * @param {Date} date
	 * @return {Date}
	 */
	onlyDate: (date) => {
		return new Date(new Date(date.toDateString()) + ' GMT +0');
	},
	/**
	 * Groups items by result of transform function
	 * @template T
	 * @template R
	 * @param items {Array<T>}
	 * @param transform {function(T):R}
	 * @return {Object<R, Array<T>>}
	 */
	groupBy: (items, transform) => {
		return items.reduce((acc, el) => {
			(acc[transform(el)] = acc[transform(el)] || []).push(el);
			return acc;
		}, {});
	},
}
