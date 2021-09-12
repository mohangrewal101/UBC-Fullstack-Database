import {InsightDatasetKind} from "../../src/controller/IInsightFacade";
import InsightFacade from "../../src/controller/InsightFacade";
import {assert, expect} from "chai";
import {rejects} from "assert";

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

        it("should return one currently added dataset", function() {
            insightFacade.addDataset("BIO112", "test", InsightDatasetKind.Courses);
            insightFacade.listDatasets().then((result) => {
                expect(result.length).to.equals(1);

                expect(result[0].id).to.equals("BIO112");
                expect(result[0].numRows).to.equals(1);
                expect(result[0].kind).to.equals(InsightDatasetKind.Courses);
                return;
            });
            assert.fail("Failed to Return One Dataset");

        });

        it("should return multiple currently added datasets",  function() {
            insightFacade.addDataset("BIO112", "test", InsightDatasetKind.Courses);
            insightFacade.addDataset("ANTH317A", "test2", InsightDatasetKind.Courses);

            insightFacade.listDatasets().then((result) => {
                expect(result.length).to.equals(2);

                expect(result[0].id).to.equals("BIO112");
                expect(result[0].numRows).to.equals(1);
                expect(result[0].kind).to.equals(InsightDatasetKind.Courses);

                expect(result[1].id).to.equals("ANTH317A");
                expect(result[1].numRows).to.equals(1);
                expect(result[1].kind).to.equals(InsightDatasetKind.Courses);
                return;
            });
            assert.fail("Failed to Return Multiple Datasets");
        });

    });
});