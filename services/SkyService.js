const conf = require('../config.json')
const MessageException = require('../utils/MessageException')
const utils = require('../utils/utils')

/**
 * Service, responsible for interacting with sky excursion appointments
 */
class SkyService {
	/**
	 * @param { Model } model Database model for sky excursion
	 */
	constructor(model) {
		this.model = model
	}

	/**
	 * Register new excursion
	 * @param {Object} data Data about excursion
	 * @return Number Number of occupied places
	 */
	async newExcursion(data) {
		let date;
		try {
			date = utils.onlyDate(new Date(data.date));
		} catch (e) {
			throw new MessageException('Invalid date');
		}

		const session = await this.model.startSession()
		session.startTransaction()
		try {
			const registered = await this.model.find({ date })
			if (registered.length >= conf.skyPlaces) {
				throw new MessageException('No places available')
			}

			const obj = this.model({
				date,
				phone: data.phone,
				name: data.name,
				people: data.people
			})
			await obj.save()

			await session.commitTransaction()
			session.endSession()
			return await this.occupied(date)
		} catch (e) {
			await session.abortTransaction()
			session.endSession()
			throw e
		}
	}

	/**
	 * Get occupied places number
	 * @param {Date} time Date
	 * @return Number Number of occupied places
	 */
	async occupied(time) {
		const date = utils.onlyDate(time)
		const registered = await this.model.find({ date })
		return registered.length
	}
}

module.exports = SkyService;
