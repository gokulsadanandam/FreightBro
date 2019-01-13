var express = require('express'),
    app = express(),
    bodyparser = require('body-parser'),
    cluster = require('cluster'),
    os = require('os');

if (cluster.isMaster) {
    let cores = os.cpus().length
    for (var i = 0; i < cores; i++) {
        cluster.fork()
    }
} else {

    app.use(bodyparser.json());

    app.use('/assets', express.static(__dirname + '/client/assets'))
    app.use('/', express.static(__dirname + '/client'))

    require('./app/routes.js')(app);

    app.listen(process.env.PORT || 8080)

}