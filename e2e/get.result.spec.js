const chakram = require('chakram');
const expect = chakram.expect;
const models = require('../src/models');

describe('verify aggregate get route working as expected', () => {
    before(async function() {
        this.timeout(5000);
        // await models.result.destroy({where: {}});
        let url = 'http://localhost:3000/import';
        await chakram.post(url, getTestData().wellFormedDocument, {
            json: false,
            headers: {
                'content-type': 'text/xml+markr'
            }
        });
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve();
            }, 4000);
        });
    });

    it('should get a 200 response from the get endpoint', () => {
        let url = 'http://localhost:3000/results/9863/aggregate';
        return chakram.get(url).then(resp => {
            expect(resp.response.statusCode).to.equal(200);
            expect(resp.response.body.mean).to.equal(10.5);
            expect(resp.response.body.p25).to.equal(8);
            expect(resp.response.body.count).to.equal(2);
        });
    });

    it('should get a 403 response from the get endpoint', () => {
        let url = 'http://localhost:3000/results/2000/aggregate';
        return chakram.get(url).then(resp => {
            expect(resp.response.statusCode).to.equal(404);
        });
    });
}).timeout(10000);

function getTestData() {
    return {
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
				<mcq-test-result scanned-on="2017-12-04T12:13:10+11:00">
					<first-name>KJ</first-name>
					<last-name>Jim</last-name>
					<student-number>2300</student-number>
					<test-id>9863</test-id>
					<answer question="0" marks-available="1" marks-awarded="0">C</answer>
					<answer question="1" marks-available="1" marks-awarded="0">B</answer>
					<answer question="2" marks-available="1" marks-awarded="0">D</answer>
					<answer question="3" marks-available="1" marks-awarded="1">A</answer>
					<answer question="4" marks-available="1" marks-awarded="1">C</answer>
					<answer question="5" marks-available="1" marks-awarded="0">C</answer>
					<answer question="6" marks-available="1" marks-awarded="0">C</answer>
					<answer question="7" marks-available="1" marks-awarded="0">B</answer>
					<answer question="8" marks-available="1" marks-awarded="0">C</answer>
					<answer question="9" marks-available="1" marks-awarded="1">C</answer>
					<answer question="10" marks-available="1" marks-awarded="0">C</answer>
					<answer question="11" marks-available="1" marks-awarded="0">B</answer>
					<answer question="12" marks-available="1" marks-awarded="0">B</answer>
					<answer question="13" marks-available="1" marks-awarded="0">B</answer>
					<answer question="14" marks-available="1" marks-awarded="1">B</answer>
					<answer question="15" marks-available="1" marks-awarded="0">C</answer>
					<answer question="16" marks-available="1" marks-awarded="1">C</answer>
					<answer question="17" marks-available="1" marks-awarded="1">A</answer>
					<answer question="18" marks-available="1" marks-awarded="1">C</answer>
					<answer question="19" marks-available="1" marks-awarded="1">D</answer>
					<summary-marks available="20" obtained="8" />
				</mcq-test-result>
			</mcq-test-results>
		`
    };
}
