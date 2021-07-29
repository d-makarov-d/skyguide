const express = require('express');
const helmet = require('helmet');
const cookieSession = require('cookie-session');
const mongooseLoader = require('./loaders/MongooseLoader');
const path = require('path');
const https = require('https');
const fs = require('fs');
const sky = require('./models/Sky');
const admin = require('./models/Admin');
const SkyService = require('./services/SkyService')
const AdminService = require('./services/AdminService');
const UserController = require('./controllers/UserController')
const AdminController = require('./controllers/AdminController')
const SuperuserController = require('./controllers/SuperuserController');

const app = express();
const appOptions = {
    key: fs.readFileSync(process.env.USERS_KEY),
    cert: fs.readFileSync(process.env.USERS_CERT),
}
const adminApp = express();
const adminOptions = {
    key: fs.readFileSync(process.env.ADMIN_KEY),
    cert: fs.readFileSync(process.env.ADMIN_CERT),
    ca: fs.readFileSync(process.env.ADMIN_CA),
    requestCert: true,
    rejectUnauthorized: true,
};

(async () => {
    const mongoose = await mongooseLoader;

    const skyModel = sky(mongoose);
    const adminModel = admin(mongoose);
    const skyService = new SkyService(skyModel);
    const adminService = new AdminService(adminModel, skyModel);
    const userController = new UserController(skyService);

    const adminController = new AdminController(adminService)

    app.use(cookieSession({
        name: 'session',
        keys: ['1cf51ee69b7fdbe400dcf1792e5607ca', '8a25f16cf50763b2287d9e2030c7f9b6'],
    }));
    app.set('view engine', 'ejs');

    // app.use(helmet()); // while without sll cert
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static(path.resolve(process.env.PWD, 'public')));

    app.use('/', userController.getRouter());
    app.use('/admin', adminController.getRouter());

    const appServer = https.createServer(appOptions, app);
    appServer.listen(process.env.PORT, () => {
        console.log(`Main https server at ${process.env.PORT}`);
    });
    console.log(process.env.ENABLE_HTTP === 'true')
    if (process.env.ENABLE_HTTP) {
        app.listen(process.env.HTTP_PORT, () => {
            console.log(`Main http server at ${process.env.HTTP_PORT}`);
        });
    }

    adminApp.use(helmet())
    adminApp.use(express.urlencoded({ extended: true }));
    adminApp.use(express.json());
    const superuserController = new SuperuserController(adminService)
    adminApp.use('/', superuserController.getRouter());

    const adminServer = https.createServer(adminOptions, adminApp);
    adminServer.listen(process.env.SU_PORT, () => {});
})();
