const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser : true,
        useUnifiedTopology : true
    }).then(conn => {
        console.log(`Connected to MongoDB at ${conn.connection.host}`);
    }).catch(err => {
        console.log(`Error connecting to MongoDB: ${err}`);
    });
};

module.exports = connectDatabase;