const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const config = require('config');

const {bindUserWithRequest} = require('./authMiddleware');
const {setLocals} = require('./setLocals');

const MONGODB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@cluster1.0hf8p.mongodb.net/barik-enterprise`;

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'session',
    expires: 1000 * 60 * 60 * 2
  });


const middleware = [
    morgan('dev'), // setup as logger
    express.static('public'), // setup public directory to serve publically 
    express.urlencoded({extended: true}),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        store: store
    }),
    bindUserWithRequest(),
    setLocals(),
    flash()
];

module.exports = MONGODB_URI;

module.exports = app => {
    middleware.forEach(middleware => {
        app.use(middleware);
    });
}