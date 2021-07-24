const express = require('express')

class SuperuserController {
	/**
	 * @param {AdminService} adminService
	 */
	constructor(adminService) {
		this.router = express.Router();

		this.router.post('/new', async (req, res) => {
			try {
				await adminService.newAdmin(req.body.login, req.body.password);
				res.sendStatus(200);
			}catch (e) {
				res.status(500).send(e.message);
			}
		})
	}

	getRouter() {
		return this.router;
	}
}

module.exports = SuperuserController
