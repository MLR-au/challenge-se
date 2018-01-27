'use strict';

const convert = require('xml-js');
const lodash = require('lodash');
const changeCase = require('change-case');

module.exports = {
    processMarkedDataCtrl,
    convertToJS,
    extractMcqTestResult,
    extractMcqTestResults
};

function processMarkedDataCtrl(xmlData) {
    const doc = convertToJS(xmlData);
    if (doc.elements) {
        let results = extractMcqTestResults(doc.elements);
    }
}

function convertToJS(xmlData) {
    return convert.xml2js(xmlData, {compact: false});
}

function extractMcqTestResults(mcqResults) {
    const processedResults = mcqResults.map(result => {
        if (result.name !== 'mcq-test-results') {
            return;
        }
        return result.elements.map(result => {
            return extractMcqTestResult(result);
        });
    });
}

function extractMcqTestResult(mcqResult) {
    if (mcqResult.name !== 'mcq-test-result') {
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
            summaryMarks: {
                obtained: parseInt(element.attributes.obtained),
                available: parseInt(element.attributes.available)
            }
        };
    }

    function verifyResult(result) {
        let verifiedResult = true;
        verifiedResult = result.firstName ? true : false;
        verifiedResult = result.lastName ? true : false;
        verifiedResult = result.studentNumber ? true : false;
        verifiedResult = result.testId ? true : false;
        verifiedResult = result.summaryMarks.available ? true : false;
        verifiedResult = result.summaryMarks.obtained ? true : false;
        return verifiedResult ? result : null;
    }
}
