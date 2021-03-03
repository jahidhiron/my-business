const upload = require('../middleware/uploadMiddleware');
const authRoute = require('./authRoute');
const dashboardRoute = require('./dashboardRoute');
const uploadRoute = require('./uploadRoute');
const staffRoute = require('./staffRoute');
const labourRoute = require('./labourRoute');
const productRoute = require('./productRoute');
const paddyStockRoute = require('./paddyStockRoute');
const paddyTraderRoute = require('./paddyTraderRoute');
const bagTraderRoute = require('./bagTraderRoute');
const bagStockRoute = require('./bagStockRoute');
const riceStockRoute = require('./riceStockRoute');
const otherStockRoute = require('./otherStockRoute');
const settingRoute = require('./settingRoute');
const customerRoute = require('./customerRoute');
const searchRoute = require('./searchRoute');
const tagdaRoute = require('./tagdaRoute');
const onCash = require('./onCashRoute');
const costRoute = require('./costRoute');
const productRecieveRoute = require('./productRecieveRoute');
const calculationRoute = require('./calculationRoute');
const sellRoute = require('./sellRoute');

const routes = [
    {
        path: '/auth',
        handaler: authRoute
    },
    {
        path: '/uploads',
        handaler: uploadRoute
    },
    {
        path: '/dashboard',
        handaler: staffRoute
    },
    {
        path: '/dashboard',
        handaler: labourRoute
    },
    {
        path: '/dashboard',
        handaler: productRoute
    },
    {
        path: '/dashboard',
        handaler: paddyStockRoute
    },
    {
        path: '/dashboard',
        handaler: paddyTraderRoute
    },
    {
        path: '/dashboard',
        handaler: bagTraderRoute
    },
    {
        path: '/dashboard',
        handaler: bagStockRoute
    },
    {
        path: '/dashboard',
        handaler: riceStockRoute
    },
    {
        path: '/dashboard',
        handaler: otherStockRoute
    },
    {
        path: '/dashboard',
        handaler: dashboardRoute
    },
    {
        path: '/dashboard',
        handaler: customerRoute
    },
    {
        path: '/dashboard',
        handaler: searchRoute
    },
    {
        path: '/dashboard',
        handaler: tagdaRoute
    },
    {
        path: '/dashboard',
        handaler: onCash
    },
    {
        path: '/dashboard',
        handaler: costRoute
    },
    {
        path: '/dashboard',
        handaler: productRecieveRoute
    },
    {
        path: '/dashboard',
        handaler: calculationRoute
    },
    {
        path: '/dashboard',
        handaler: calculationRoute
    },
    {
        path: '/dashboard',
        handaler: sellRoute
    },
    {
        path: '/',
        handaler: (req, res) => {
            res.json({
                message: 'Hello Barik Enterprise'
            });
        }
    }
];

module.exports = app => {
    routes.forEach(route => {
        if(route.path === '/'){
            app.get(route.path, route.handaler);
        }else{
            app.use(route.path, route.handaler);
        }
    })
}