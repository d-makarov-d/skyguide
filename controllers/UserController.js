const express = require('express')
const path = require('path')
const MessageException = require('../utils/MessageException')
const conf = require('../config.json')
const utils = require('../utils/utils')

class UserController {
	/**
	 * @param {SkyService} skyService Service for sky excursions
	 */
	constructor(skyService) {
		this.skyService = skyService
		this.router = express.Router();

		this.router.get('/', async (req, res) => {
			const now = utils.onlyDate(new Date());
			const occupied = await this.skyService.occupied(now);
			res.render(
				path.resolve('public', 'layout', 'index'),
				{
					free: conf.skyPlaces - occupied,
					overall: conf.skyPlaces,
					today: now.toISOString().slice(0, 10)
				}
			)
		});

		this.router.post('/', async (req, res) => {
			try {
				const occupied = await this.skyService.newExcursion(req.body)
				res.status(200).send({ free: conf.skyPlaces - occupied })
			} catch (e) {
				if (e instanceof MessageException) {
					res.status(409).send(e.message)
				} else {
					res.sendStatus(500)
				}
			}
		});

		this.router.get('/occupied', async (req, res) => {
			try {
				const date = utils.onlyDate(new Date(req.query.date))
				const occupied = await this.skyService.occupied(date)
				res.status(200).send({ free: conf.skyPlaces - occupied })
			} catch (e) {
				res.sendStatus(500)
			}
		});
	}

	getRouter() {
		return this.router;
	}
}

module.exports = UserController
