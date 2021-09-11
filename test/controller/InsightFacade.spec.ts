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

        it("should return one currently added dataset", async function() {
            insightFacade.addDataset("1", "test", InsightDatasetKind.Courses);
            const result = await insightFacade.listDatasets();
            expect(result.length).to.equals(1);

        });

        it("should return multiple currently added datasets", async function() {
            insightFacade.addDataset("1", "test", InsightDatasetKind.Courses);
            insightFacade.addDataset("2", "test2", InsightDatasetKind.Courses);
            insightFacade.addDataset("3", "test3", InsightDatasetKind.Courses);
            const result = await insightFacade.listDatasets();
            expect(result.length).to.equals(3);
        });

    });
});