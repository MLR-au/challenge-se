require('app-module-path').addPath(`${__dirname}`);

const express = require('express');
const routeHandlers = require('./src/routeHandlers');

const app = express();

app.post('/import', routeHandlers.post.ingest.processMarkedData);
app.get(
    '/results/:test-id/aggregate',
    routeHandlers.get.results.getAggregateResults
);

app.listen(3000, () =>
    console.log('Markr micro-service listening on port 3000!')
);
