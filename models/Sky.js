module.exports = (() => {
	let model;
	return (mongoose) => {
		const schema = new mongoose.Schema({
			date: {
				type: Date,
				required: true,
			},
			phone: {
				type: String,
				required: true
			},
			name: {
				type: String,
				required: true
			},
			people: {
				type: Number,
				required: true,
			}
		});

		if (model !== undefined) return model;
		/* eslint-disable new-cap */
		model = new mongoose.model('Sky', schema);
		/* eslint-enable new-cap */
		return model;
	};
})();
