const { MongoClient } = require('mongodb');

const connectionString = "mongodb://localhost:27017";

function getDb(){
    return MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then((client) => {
        const db = client.db('ekaly')
        return db;
    })
}

module.exports = {getDb}