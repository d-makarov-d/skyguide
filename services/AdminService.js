const crypto = require('crypto');
const MessageException = require('../utils/MessageException');
const utils = require('../utils/utils');

const failMsg = 'Wrong login or password';

class AdminService {
	/**
	 * @param { Model } model Database model for admin
	 * @param { Model } skies Mongoose model for sky excursion registrations
	 */
	constructor(model, skies) {
		this.model = model;
		this.skies = skies;
	}

	/**
	 * Returns registrations for provided date
	 * @param {Date} date
	 * @return {Promise<Array>}
	 */
	async regsOn(date) {
		const onlyDate = utils.onlyDate(date);
		return this.skies.find({date: onlyDate});
	}

	/**
	 * Returns registrations after provided date, grouped by date
	 * @param {Date} date
	 * @return {Promise<Array>}
	 */
	async regsAfter(date) {
		const onlyDate = utils.onlyDate(date);
		const all = await this.skies.find({date: { $gte: onlyDate } });
		return utils.groupBy(all, (el) => el.date)
	}

	/**
	 * Handles authorisation of admin and throws error if something wrong
	 * @param {Request} req Express Request object
	 * @return {Promise<void>}
	 */
	async handleAuth(req) {
		if (!req.session.authorised) {
			const admin = await this.model.findOne({login: req.body.login})
			if (!admin) throw new MessageException(failMsg);

			const hash = crypto.createHash('sha256');
			const hashed = hash.update(req.body.password + admin.password.salt).digest('hex');

			if (hashed !== admin.password.pass) throw new MessageException(failMsg);
		}
	}

	async newAdmin(login, password) {
		const hash = crypto.createHash('sha256');
		const salt = crypto.randomBytes(16).toString();
		const pass = hash.update(password + salt).digest('hex');

		const obj = this.model({
			login,
			password: {
				pass,
				salt
			}
		});

		await obj.save();
	}
}

module.exports = AdminService
