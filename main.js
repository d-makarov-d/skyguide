const express = require('express');
const userRouter = require('./routes/UserRouter');
const mongooseLoader = require('./loaders/MongooseLoader');
const path = require('path')

const app = express();

(async () => {
    const mongoose = await mongooseLoader

    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(express.static(path.resolve(process.env.PWD, 'public')));

    app.use('/', userRouter);

    app.listen(process.env.PORT, () => {
        console.log(`listening at ${process.env.PORT}`);
    })
})();
