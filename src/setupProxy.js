const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/identity', { target: 'http://103.248.13.91:5000/' }));
    app.use(proxy('/key', { target: 'http://103.248.13.91:8774/' }))
};