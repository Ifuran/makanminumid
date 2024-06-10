const mongoose = require("mongoose");
const { mongoCluster } = require("../app/config");

// mongoose.connect(
//   `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`
// );

mongoose.connect(`${mongoCluster}`);

const db = mongoose.connection;

module.exports = db;
