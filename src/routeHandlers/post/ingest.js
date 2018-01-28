'use strict';

const {processMarkedDataCtrl} = require('src/controllers/ingest');

module.exports = {
    processMarkedData
};

function processMarkedData(req, res, next) {
    if (req.headers['content-type'] !== 'text/xml+markr') {
        return res.status(403).send('Unable to process this type of request.');
    }
    try {
        processMarkedDataCtrl(req.body).then(result => {
            return res.sendStatus(200);
        });
    } catch (error) {
        res.status(400).send(error);
    }
}
