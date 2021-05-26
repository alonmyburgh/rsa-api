const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../api/routes/rsa');
const { logs } = require('./vars');
const error = require('../api/middlewares/error');

/**
* Express instance
* @public
*/
const app = express();

// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// lets you use HTTP verbs
app.use(methodOverride());

// secure apps HTTP headers
app.use(helmet());

// enable CORS
app.use(cors());

// mount api rsa routes
app.use('/rsa', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler
app.use(error.handler);

module.exports = app;
