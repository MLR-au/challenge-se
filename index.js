require('app-module-path').addPath(`${__dirname}`);

const express = require('express');
const models = require('./src/models');
const routeHandlers = require('./src/routeHandlers');

models.sequelize
    .sync()
    .then(() => {
        console.log('Connection has been established successfully.');
        initialiseApplication();
    })
    .catch(e => {
        console.log(e);
    });

function initialiseApplication() {
    const app = express();
    app.post('/import', routeHandlers.post.ingest.processMarkedData);
    app.get(
        '/results/:test-id/aggregate',
        routeHandlers.get.results.getAggregateResults
    );

    app.listen(3000, () =>
        console.log('Markr micro-service listening on port 3000!')
    );
}
