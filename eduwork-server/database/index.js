const mongoose = require("mongoose");
const { dbAtlas } = require("../app/config");

// mongoose.connect(
//   `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`
// );
mongoose.connect(`${dbAtlas}`);

const db = mongoose.connection;

module.exports = db;
