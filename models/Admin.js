module.exports = (() => {
	let model;
	return (mongoose) => {
		const schema = new mongoose.Schema({
			login: {
				type: String,
				required: true,
				unique: true,
			},
			password: {
				pass: {
					type: String,
					required: true
				},
				salt: {
					type: String,
					required: true
				}
			}
		});

		if (model !== undefined) return model;
		/* eslint-disable new-cap */
		model = new mongoose.model('Admin', schema);
		/* eslint-enable new-cap */
		return model;
	};
})();
