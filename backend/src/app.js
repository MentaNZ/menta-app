const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const api = require('./api');
const middlewares = require('./middlewares');

require('dotenv').config();

const dbUrl = 'mongodb://localhost:27017/admin';
mongoose.connect(
  dbUrl,
).then(() => console.log('Connected to DB!'));
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
