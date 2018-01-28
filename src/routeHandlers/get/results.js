'use strict';

const {getAggregateResultsCtrl} = require('src/controllers/result');

module.exports = {
    getAggregateResults
};

function getAggregateResults(req, res, next) {
    return getAggregateResultsCtrl(req.params.testId)
        .then(resp => {
            res.status(200).send(resp);
        })
        .catch(error => {
            return res.status(404).send(error.message);
        });
}
