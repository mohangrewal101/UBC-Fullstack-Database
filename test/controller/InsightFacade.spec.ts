import {InsightDatasetKind} from "../../src/controller/IInsightFacade";
import InsightFacade from "../../src/controller/InsightFacade";
import {expect} from "chai";

describe("InsightFacade", function() {
    describe("addDataset", function() {
    });

    describe("removeDataset", function() {

    });

    describe("performQuery", function() {
    });

    describe("listDatasets", function() {

        let insightFacade: InsightFacade;
        beforeEach(function () {
            insightFacade = new InsightFacade();
        });

        it("should return zero datasets", function() {
            insightFacade.listDatasets().then((result) => {
                expect.fail("Failed to Not Return Zero Datasets");
                return;
            });
        })
        it("should return one currently added dataset", function() {
            insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"), InsightDatasetKind.Courses);
            insightFacade.listDatasets().then((result) => {
                expect(result.length).to.equals(1);

                expect(result[0].id).to.equals("ubc");
                //expect(result[0].numRows).to.equals(1);
                expect(result[0].kind).to.equals(InsightDatasetKind.Courses);
                return;
            }, expect.fail("Failed to Return One Dataset"));

        });

        it("should return multiple currently added datasets",  function() {
            insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"), InsightDatasetKind.Courses);
            insightFacade.addDataset("science",
                convertToBase64("test/resources/archives/Dataset2/courses.zip"), InsightDatasetKind.Courses);

            insightFacade.listDatasets().then((result) => {
                expect(result.length).to.equals(2);

                expect(result[0].id).to.equals("ubc");
                //expect(result[0].numRows).to.equals(1);
                expect(result[0].kind).to.equals(InsightDatasetKind.Courses);

                expect(result[1].id).to.equals("science");
                //expect(result[1].numRows).to.equals(1);
                expect(result[1].kind).to.equals(InsightDatasetKind.Courses);
                return;
            }, expect.fail("Failed to Return Multiple Datasets"));
        });

    });
});

//Citation: https://stackoverflow.com/questions/28834835/readfile-in-base64-nodejs
function convertToBase64(filePath: string) : string {
    const fs = require('fs');
    return fs.readFileSync(filePath, {encoding: 'base64'});
}


