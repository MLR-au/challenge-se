'use strict';

const chakram = require('chakram');
const expect = chakram.expect;

const {
    processMarkedDataCtrl,
    convertToJS,
    extractMcqTestResults,
    extractMcqTestResult
} = require('src/controllers/ingest');

const wellFormedDocument = `
	<mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
		<first-name>KJ</first-name>
		<last-name>Alysander</last-name>
		<student-number>002299</student-number>
		<test-id>9863</test-id>
		<answer question="0" marks-available="1" marks-awarded="1">D</answer>
		<summary-marks available="1" obtained="1" />
	</mcq-test-result>
`;

describe('verify xml import route working as expected', () => {
    it('should be able to process a well formed document', () => {
        const doc = convertToJS(wellFormedDocument);
        let result = extractMcqTestResult(doc.elements[0]);

        expect(result.firstName).to.equal('KJ');
        expect(result.lastName).to.equal('Alysander');
        expect(result.studentNumber).to.equal('002299');
        expect(result.testId).to.equal('9863');
        expect(result.summaryMarks.obtained).to.equal(1);
    });
});
