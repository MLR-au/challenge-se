require('app-module-path').addPath(`${__dirname}`);

const express = require('express');
const models = require('./src/models');
const routeHandlers = require('./src/routeHandlers');
const bodyParser = require('body-parser');

return createApp().then(app => {
    return app.listen(3000, () =>
        console.log('Markr micro-service listening on port 3000!')
    );
    return app;
});

function createApp() {
    return models.sequelize
        .sync()
        .then(() => {
            console.log('DB connection has been established successfully.');
            const app = express();
            wireUpMiddleware(app);
            wireUpRoutes(app);
            return app;
        })
        .catch(e => {
            console.log("Couldn't initialise application.");
            process.exit(-1);
        });
}

function wireUpMiddleware(app) {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.text({type: 'text/xml+markr'}));
    app.use(bodyParser.json());
}

function wireUpRoutes(app) {
    app.post('/import', routeHandlers.post.ingest.processMarkedData);
    app.get(
        '/results/:testId/aggregate',
        routeHandlers.get.results.getAggregateResults
    );
}

module.exports = createApp;
