const express = require('express')
const path = require('path')
const MessageException = require('../utils/MessageException')
const utils = require('../utils/utils')

/**
 * Ensures admin authorised
 * @param {Request} req Express Request object
 * @param {Request} res Express Response object
 * @return boolean Is authorised
 */
function ensureAuthorised(req,res) {
	if (!req.session.loggedIn) {
		res.status(401).send('Unauthorised');
		return false
	}
	return true
}

class AdminController {
	/**
	 * @param {AdminService} adminService
	 */
	constructor(adminService) {
		this.router = express.Router();

		this.router.get('/sky', async (req, res) => {
			let date;
			if (req.query.date) {
				date = utils.onlyDate(new Date(req.query.date))
			} else {
				date = utils.onlyDate(new Date())
			}
			const regs = await adminService.regsOn(date)
			if (ensureAuthorised(req, res)) {
				res.render(path.resolve(process.env.PWD, 'public', 'admin_table'), {
					today: date.toISOString().slice(0, 10),
					regs
				})
			}
		});

		this.router.get('/allsky', async (req, res) => {
			const date = utils.onlyDate(new Date())
			const grouped = await adminService.regsAfter(date)
			if (ensureAuthorised(req, res)) {
				res.render(path.resolve(process.env.PWD, 'public', 'admin_all_table'), {
					grouped
				})
			}
		});

		this.router.get('/login', (req, res) => {
			if (req.session.loggedIn) {
				res.send('already logged in');
			} else {
				res.sendFile(path.resolve(process.env.PWD, 'public', 'admin_login.html'));
			}
		});

		this.router.post('/login', async (req, res) => {
			if (req.session.loggedIn) {
				res.sendStatus(200);
			} else {
				try {
					await adminService.handleAuth(req);
					req.session.loggedIn = true;
					res.sendStatus(200);
				} catch (e) {
					if (e instanceof MessageException) {
						res.status(401).send(e.message)
					} else {
						res.sendStatus(500)
					}
				}
			}
		});
	}

	getRouter() {
		return this.router;
	}
}

module.exports = AdminController
