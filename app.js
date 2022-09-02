const express = require('express');
const app = express();

const dotenv = require('dotenv');

const connectDatabase = require('./config/database');

dotenv.config({ path: './config/config.env' });

connectDatabase();

const jobs = require('./routes/jobs.routes')

app.use(jobs);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server stated on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});
