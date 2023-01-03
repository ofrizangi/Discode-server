const mongoose = require('mongoose');

const mongoString = process.env.DATABASE_URL;

// exports = export the function connect (calling it on index.js)
exports.connect = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoString);
    const database = mongoose.connection;

    // throw an error if the connection to the DB failed
    database.on('error', (error) => {
        console.log(error)
    })
    // once - the command wil run only on time. If we were able to connect it will print 'Database Connected'
    database.once('connected', () => {
        console.log('Database Connected');
    })
}