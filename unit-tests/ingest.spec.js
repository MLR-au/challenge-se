'use strict';

const chakram = require('chakram');
const expect = chakram.expect;

const {
    processMarkedDataCtrl,
    convertToJS,
    extractMcqTestResults,
    extractMcqTestResult
} = require('src/controllers/ingest');

const wellFormedResult = `
	<mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
		<first-name>KJ</first-name>
		<last-name>Alysander</last-name>
		<student-number>002299</student-number>
		<test-id>9863</test-id>
		<answer question="0" marks-available="1" marks-awarded="1">D</answer>
		<summary-marks available="1" obtained="1" />
	</mcq-test-result>
`;

const notWellFormedResult = `
	<mcq-testing-result scanned-on="2017-12-04T12:12:10+11:00">
	</mcq-testing-result>
`;

const resultWithDataMissing = `
	<mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
		<first-name>KJ</first-name>
		<last-name>Alysander</last-name>
		<student-number>002299</student-number>
	</mcq-test-result>
`;

const wellFormedDocument = `
<mcq-test-results>
	<mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
		<first-name>KJ</first-name>
		<last-name>Alysander</last-name>
		<student-number>002299</student-number>
		<test-id>9863</test-id>
		<answer question="0" marks-available="1" marks-awarded="1">D</answer>
		<answer question="1" marks-available="1" marks-awarded="1">D</answer>
		<answer question="2" marks-available="1" marks-awarded="1">D</answer>
		<answer question="3" marks-available="1" marks-awarded="0">C</answer>
		<answer question="4" marks-available="1" marks-awarded="1">B</answer>
		<answer question="5" marks-available="1" marks-awarded="0">D</answer>
		<answer question="6" marks-available="1" marks-awarded="0">A</answer>
		<answer question="7" marks-available="1" marks-awarded="1">A</answer>
		<answer question="8" marks-available="1" marks-awarded="1">B</answer>
		<answer question="9" marks-available="1" marks-awarded="1">D</answer>
		<answer question="10" marks-available="1" marks-awarded="1">A</answer>
		<answer question="11" marks-available="1" marks-awarded="1">B</answer>
		<answer question="12" marks-available="1" marks-awarded="0">A</answer>
		<answer question="13" marks-available="1" marks-awarded="0">B</answer>
		<answer question="14" marks-available="1" marks-awarded="1">B</answer>
		<answer question="15" marks-available="1" marks-awarded="1">A</answer>
		<answer question="16" marks-available="1" marks-awarded="1">C</answer>
		<answer question="17" marks-available="1" marks-awarded="0">B</answer>
		<answer question="18" marks-available="1" marks-awarded="1">A</answer>
		<answer question="19" marks-available="1" marks-awarded="0">B</answer>
		<summary-marks available="20" obtained="13" />
	</mcq-test-result>
</mcq-test-results>
`;

describe('verify xml import route working as expected', () => {
    it('should be able to process a well formed result', () => {
        const doc = convertToJS(wellFormedResult);
        let result = extractMcqTestResult(doc.elements[0]);

        expect(result.firstName).to.equal('KJ');
        expect(result.lastName).to.equal('Alysander');
        expect(result.studentNumber).to.equal('002299');
        expect(result.testId).to.equal('9863');
        expect(result.summaryMarksObtained).to.equal(1);
    });
    it('should fail on a result with an incorrect root element', () => {
        const doc = convertToJS(notWellFormedResult);
        let result = extractMcqTestResult(doc.elements[0]);
        expect(result).to.equal(undefined);
    });
    it('should fail on a result with missing fields', () => {
        const doc = convertToJS(resultWithDataMissing);
        let result = extractMcqTestResult(doc.elements[0]);
        expect(result).to.equal(null);
    });
    it('should be able to process a well formed document', () => {
        const results = processMarkedDataCtrl(wellFormedDocument);
        expect(results.length).to.equal(1);
    });
});
