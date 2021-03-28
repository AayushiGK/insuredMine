var app;
const appRoot = require("app-root-path");
module.exports = function (arrg) {
    app = startApp(arrg);
    return {
        app
    };
};

function startApp(arrg) {
    var express = require("express");
    var cors = require("cors");
    var path = require("path");
    var compression = require("compression");
    var methodOverride = require("method-override");

    app = express();
    var https = require("http").Server(app);
    var server = https.listen(process.env.PORT || arrg.config.server.port, () => {
        console.log(`Listening on ${server.address().address}:${server.address().port}`);
    });

    var statusMonitor = require('express-status-monitor')();
    app.use(statusMonitor);
    app.get('/status', statusMonitor.pageRoute);

    
    app.use(cors());
    app.use(compression());
    app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
    app.use(methodOverride());
    app.use(express.static('dist'));
    if (process.env.NODE_ENV != "production") {
        app.use((req, res, next) => {
            console.log(`${req.method}: ${req.url}  \n${JSON.stringify(req.body)}`, '\n');
            next();
        });
    }

    app.use("/", require("./Task_1")(arrg));
    app.use("/", require("./Task_2")(arrg));



    app.get('/*.*', function (req, res) {
        p = path.join(appRoot.toString(), '/dist', req.path.toString());
        res.sendFile(path.join(p));
    });

    app.get('/*', function (req, res) {
        p = path.join(appRoot.toString(), 'index.html');
        res.sendFile(path.join(p));
    });
    arrg.app = app;

    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        // render the error page
        res.status(err.status || 500);
        res.send('error');
    });
    return app;
}