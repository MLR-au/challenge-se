'use strict';

const convert = require('xml-js');
const lodash = require('lodash');
const changeCase = require('change-case');
const models = require('src/models');

module.exports = {
    processMarkedDataCtrl,
    convertToJS,
    createOrUpdateResultRecord,
    extractMcqTestResult,
    extractMcqTestResults
};

function processMarkedDataCtrl(xmlData) {
    const doc = convertToJS(xmlData);
    if (doc.elements) {
        let results = extractMcqTestResults(doc.elements);
        results.map(result => createOrUpdateResultRecord(result));
        return Promise.resolve();
    }
}

function createOrUpdateResultRecord(newResult) {
    return models.result
        .findOrCreate({
            where: {
                id: newResult.studentNumber,
                testId: newResult.testId
            },
            defaults: newResult
        })
        .then(oldResult => {
            oldResult = oldResult[0];
            let update = Object.assign({}, oldResult.get());
            if (
                oldResult.summaryMarksAvailable <
                newResult.summaryMarksAvailable
            ) {
                update.summaryMarksAvailable = newResult.summaryMarksAvailable;
            }
            if (
                oldResult.summaryMarksObtained < newResult.summaryMarksObtained
            ) {
                update.summaryMarksObtained = newResult.summaryMarksObtained;
            }
            return oldResult.update(update);
        })
        .then(result => result.get());
}

function convertToJS(xmlData) {
    return convert.xml2js(xmlData, {compact: false});
}

function extractMcqTestResults(mcqResults) {
    const processedResults = mcqResults.map(result => {
        if (result.name !== 'mcq-test-results') {
            console.log(
                'Unable to process the submitted document - root element not "mcq-test-results"'
            );
            return;
        }
        return result.elements.map(result => {
            return extractMcqTestResult(result);
        });
    });
    return lodash.flattenDeep(processedResults);
}

function extractMcqTestResult(mcqResult) {
    if (mcqResult.name !== 'mcq-test-result') {
        console.log(
            `Unable to process this result - root element not "mcq-test-result": ${JSON.stringify(
                mcqResult,
                null,
                2
            )}`
        );
        return;
    }
    mcqResult = mcqResult.elements.map(element => {
        switch (element.name) {
            case 'student-number':
                return extractStudentNumber(element);
                break;
            case 'first-name':
                return extractFirstName(element);
                break;
            case 'last-name':
                return extractLastName(element);
                break;
            case 'test-id':
                return extractTestId(element);
                break;
            case 'summary-marks':
                return extractSummaryMarks(element);
                break;
        }
    });

    let result;
    mcqResult.map(r => {
        result = Object.assign({}, result, r);
    });
    return verifyResult(result);

    function extractStudentNumber(element) {
        return {studentNumber: element.elements[0].text};
    }
    function extractFirstName(element) {
        return {firstName: element.elements[0].text};
    }
    function extractLastName(element) {
        return {lastName: element.elements[0].text};
    }
    function extractTestId(element) {
        return {testId: element.elements[0].text};
    }
    function extractSummaryMarks(element) {
        return {
            summaryMarksAvailable: parseInt(element.attributes.available),
            summaryMarksObtained: parseInt(element.attributes.obtained)
        };
    }

    function verifyResult(result) {
        let verifiedResult = true;
        try {
            verifiedResult = result.firstName ? true : false;
            verifiedResult = result.lastName ? true : false;
            verifiedResult = result.studentNumber ? true : false;
            verifiedResult = result.testId ? true : false;
            verifiedResult = result.summaryMarksAvailable ? true : false;
            verifiedResult = result.summaryMarksObtained ? true : false;
        } catch (e) {
            verifiedResult = false;
        }
        if (!verifiedResult) {
            console.log(
                `Unable to process: ${JSON.stringify(result, null, 2)}`
            );
        }
        return verifiedResult ? result : null;
    }
}
