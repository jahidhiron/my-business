require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');
const log = console.log;
const config = require('config');

const generalConsole = require('debug')('app:general');
const dbConsole = require('debug')('app:db');

generalConsole("This is general console");
dbConsole("This is db condole");

// import routes
const setRoutes = require('./routes/route');

// set middlware
const setMiddleware = require('./middleware/middleware');

// create server
const app = express();

// setup view engine
app.set('view engine', 'ejs');
app.set('views', 'views' ); // setup views as view directory

// PORT
const PORT = process.env.PORT || 7070;

// connection string
const MONGODB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@cluster1.0hf8p.mongodb.net/barik-enterprise`;

// set middleware
setMiddleware(app);

// set routes
setRoutes(app);

app.use((req, res, next) => {
    let error = new Error('404, Page Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    if(error.status === 404){
        log(chalk.bgRed(error));
        return res.render('pages/error/404', {flashMessage: {}});
    }
    log(chalk.bgRed(error));
    res.render('pages/error/500', {flashMessage: {}});
})

// MONGODB connection
mongoose.connect(MONGODB_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true

    }).then(() => {
        app.listen(PORT, () => {
            log(chalk.white.bgBlue('Database Connected'));
            log(chalk.white.bgBlue(`Server is Running on PORT ${PORT}`));
        });
    }).catch(error => {
        return console.log(error);
    });