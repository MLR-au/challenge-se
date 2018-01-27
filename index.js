require('app-module-path').addPath(`${__dirname}`);

const express = require('express');
const models = require('./src/models');
const routeHandlers = require('./src/routeHandlers');

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
            wireUpRoutes(app);
            return app;
        })
        .catch(e => {
            // console.log(e);
        });
}

function wireUpRoutes(app) {
    app.post('/import', routeHandlers.post.ingest.processMarkedData);
    app.get(
        '/results/:test-id/aggregate',
        routeHandlers.get.results.getAggregateResults
    );
}

module.exports = createApp;
