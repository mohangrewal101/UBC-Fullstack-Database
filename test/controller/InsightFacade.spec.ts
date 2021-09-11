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
            insightFacade.addDataset("BIO112", "test", InsightDatasetKind.Courses);
            const result = await insightFacade.listDatasets();

            expect(result.length).to.equals(1);

            expect(result[0].id).to.equals("BIO112");
            expect(result[0].numRows).to.equals(1);
            expect(result[0].kind).to.equals(InsightDatasetKind.Courses);

        });

        it("should return multiple currently added datasets", async function() {
            insightFacade.addDataset("BIO112", "test", InsightDatasetKind.Courses);
            insightFacade.addDataset("ANTH317A", "test2", InsightDatasetKind.Courses);
            const result = await insightFacade.listDatasets();

            expect(result.length).to.equals(2);

            expect(result[0].id).to.equals("BIO112");
            expect(result[0].numRows).to.equals(1);
            expect(result[0].kind).to.equals(InsightDatasetKind.Courses);

            expect(result[1].id).to.equals("ANTH317A");
            expect(result[1].numRows).to.equals(1);
            expect(result[1].kind).to.equals(InsightDatasetKind.Courses);
        });

    });
});