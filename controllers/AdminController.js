const express = require('express')
const path = require('path')
const MessageException = require('../utils/MessageException')

/**
 * Ensures admin authorised
 * @param {Request} req Express Request object
 * * @param {Request} res Express Response object
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
			if (ensureAuthorised(req, res)) {

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
