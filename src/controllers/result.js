'use strict';

const percentile = require('percentile');
const lodash = require('lodash');
const models = require('src/models');

module.exports = {
    getAggregateResultsCtrl
};

function getAggregateResultsCtrl(testId) {
    return models.result
        .findAndCountAll({
            where: {testId: testId},
            order: [['summaryMarksObtained', 'ASC']]
        })
        .then(results => {
            if (results.count === 0) {
                throw new Error(`No results found for ${testId}`);
            }
            return aggregateData(
                results.count,
                results.rows.map(result => result.get())
            );
        });
}

function aggregateData(count, data) {
    const resultSet = data.map(d => d.summaryMarksObtained);
    const mean = lodash.mean(resultSet);
    const p25 = percentile(25, resultSet);
    const p50 = percentile(50, resultSet);
    const p75 = percentile(75, resultSet);
    return {
        mean: mean,
        count: count,
        p25: p25,
        p50: p50,
        p75: p75
    };
}
