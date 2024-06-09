const MongoClient = require('mongodb').MongoClient; 
const url =process.env.DB_URL
let client_m = MongoClient.connect(url)
module.exports = client_m;
