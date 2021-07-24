const express = require('express');
const cookieSession = require('cookie-session');
const mongooseLoader = require('./loaders/MongooseLoader');
const path = require('path')
const sky = require('./models/Sky');
const admin = require('./models/Admin');
const SkyService = require('./services/SkyService')
const AdminService = require('./services/AdminService');
const UserController = require('./controllers/UserController')
const AdminController = require('./controllers/AdminController')
const SuperuserController = require('./controllers/SuperuserController');

const app = express();
const adminApp = express();

(async () => {
    const mongoose = await mongooseLoader;

    const skyModel = sky(mongoose);
    const adminModel = admin(mongoose);
    const skyService = new SkyService(skyModel);
    const adminService = new AdminService(adminModel);
    const userController = new UserController(skyService);

    const adminController = new AdminController(adminService)

    app.use(cookieSession({
        name: 'session',
        keys: ['1cf51ee69b7fdbe400dcf1792e5607ca', '8a25f16cf50763b2287d9e2030c7f9b6'],
    }));
    app.set('view engine', 'ejs');

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static(path.resolve(process.env.PWD, 'public')));

    app.use('/', userController.getRouter());
    app.use('/admin', adminController.getRouter());

    app.listen(process.env.PORT, () => {
        console.log(`listening at ${process.env.PORT}`);
    });

    adminApp.use(express.urlencoded({ extended: true }));
    adminApp.use(express.json());
    const superuserController = new SuperuserController(adminService)
    adminApp.use('/', superuserController.getRouter());

    adminApp.listen(process.env.SU_PORT, () => {});
})();
