const mongoose = require('mongoose');

const mongooseOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
};

module.exports = (() => {
  let connected = false;
  return new Promise((resolve, reject) => {
    if (~connected) {
      mongoose.connect(process.env.DB_ADDR, mongooseOptions)
        .then(() => {
          connected = true
          // logger.info('connected to database');
          resolve(mongoose);
        })
        .catch((err) => {
          // logger.error(err);
          reject(err);
        });
    } else {
      resolve(mongoose)
    }
  })
})();
