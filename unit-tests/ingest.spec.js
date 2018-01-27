'use strict';

const chakram = require('chakram');
const expect = chakram.expect;

const processMarkedDataCtrl = require('src/controllers/ingest')
    .processMarkedDataCtrl;

const wellFormedDocument = `
<mcq-test-results>
	<mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">
		<first-name>KJ</first-name>
		<last-name>Alysander</last-name>
		<student-number>002299</student-number>
		<test-id>9863</test-id>
		<answer question="0" marks-available="1" marks-awarded="1">D</answer>
		<summary-marks available="1" obtained="1" />
	</mcq-test-result>
</mcq-test-results>
`;

describe('verify xml import route working as expected', () => {
    it('should accept a well formed xml document', () => {
        // const result = processMarkedDataCtrl(wellFormedDocument);
        // expect(processMarkedDataCtrl(wellFormedDocument)).to.be('ok');
    });
});
