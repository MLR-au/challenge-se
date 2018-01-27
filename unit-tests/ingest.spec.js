'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const models = require('src/models');

const {
    processMarkedDataCtrl,
    convertToJS,
	createOrUpdateResultRecord,
    extractMcqTestResults,
    extractMcqTestResult
} = require('src/controllers/ingest');

describe('verify xml import route working as expected', () => {
	afterEach(() => {
		return models.result.destroy({ where: {}});
	})

    it('should be able to process a well formed result', () => {
        const doc = convertToJS(getTestData().wellFormedResult);
        let result = extractMcqTestResult(doc.elements[0]);

        expect(result.firstName).to.equal('KJ');
        expect(result.lastName).to.equal('Alysander');
        expect(result.studentNumber).to.equal('002299');
        expect(result.testId).to.equal('9863');
        expect(result.summaryMarksObtained).to.equal(1);
    });
    it('should ignore a result with an incorrect root element', () => {
        const doc = convertToJS(getTestData().notWellFormedResult);
        let result = extractMcqTestResult(doc.elements[0]);
        expect(result).to.equal(undefined);
    });
    it('should report a result with missing fields', () => {
        const doc = convertToJS(getTestData().resultWithDataMissing);
        let result = extractMcqTestResult(doc.elements[0]);
        expect(result).to.equal(null);
    });
    it('should be able to process a well formed document', () => {
        const results = processMarkedDataCtrl(getTestData().wellFormedDocument);
        expect(results.length).to.equal(1);
    });
	it('should override a previous lower result', () => {
		let doc = convertToJS(getTestData().wellFormedResult);
		let result = extractMcqTestResult(doc.elements[0]);
		return createOrUpdateResultRecord(result)
		.then(result => {
			expect(result.summaryMarksObtained).to.equal(1);
			return Promise.resolve();
		})
		.then(() => {
			doc = convertToJS(getTestData().duplicateWellFormedResult);
			result = extractMcqTestResult(doc.elements[0]);
			return createOrUpdateResultRecord(result);
		})
		.then(result => {
			expect(result.summaryMarksObtained).to.equal(2);
		});
	})
	it('should not override a previous higher result', () => {
		let doc = convertToJS(getTestData().duplicateWellFormedResult);
		let result = extractMcqTestResult(doc.elements[0]);
		return createOrUpdateResultRecord(result)
		.then(result => {
			expect(result.summaryMarksObtained).to.equal(2);
			return Promise.resolve();
		})
		.then(() => {
			doc = convertToJS(getTestData().wellFormedResult);
			result = extractMcqTestResult(doc.elements[0]);
			return createOrUpdateResultRecord(result);
		})
		.then(result => {
			expect(result.summaryMarksObtained).to.equal(2);
		});
	})

});


function getTestData() {

    return {
        wellFormedResult: `
            <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
                <first-name>KJ</first-name>
                <last-name>Alysander</last-name>
                <student-number>002299</student-number>
                <test-id>9863</test-id>
                <answer question="0" marks-available="1" marks-awarded="1">D</answer>
                <answer question="0" marks-available="1" marks-awarded="0">D</answer>
                <summary-marks available="2" obtained="1" />
            </mcq-test-result>
        `,
		duplicateWellFormedResult: `
			<mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
				<first-name>KJ</first-name>
				<last-name>Alysander</last-name>
				<student-number>002299</student-number>
				<test-id>9863</test-id>
				<answer question="0" marks-available="1" marks-awarded="1">D</answer>
				<answer question="0" marks-available="1" marks-awarded="1">D</answer>
				<summary-marks available="2" obtained="2" />
			</mcq-test-result>
		`,
		notWellFormedResult: `
			<mcq-testing-result scanned-on="2017-12-04T12:12:10+11:00">
			</mcq-testing-result>
		`,
		resultWithDataMissing: `
			<mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
				<first-name>KJ</first-name>
				<last-name>Alysander</last-name>
				<student-number>002299</student-number>
			</mcq-test-result>
		`,
		wellFormedDocument: `
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
		`
    }
}
