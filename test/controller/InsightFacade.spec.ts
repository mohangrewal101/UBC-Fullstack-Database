import {InsightDatasetKind, InsightError, NotFoundError} from "../../src/controller/IInsightFacade";
import InsightFacade from "../../src/controller/InsightFacade";
import {expect} from "chai";

describe("InsightFacade", function() {
    describe("addDataset", function() {
        let insightFacade: InsightFacade;
        beforeEach(function () {
            insightFacade = new InsightFacade();
        });

        it("should add first dataset and return array ONLY containing its id", function() {
            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then((result) => {
                    expect(result).to.be.an.instanceof(Array);
                    expect(result).to.be.of.length(1);
                    expect(result[0]).to.equals("ubc");
            });
        });

        it("should add dataset when list contains datasets and return array with ids", function() {
            let expectedStrings = ["science", "ubc"];
            insightFacade.addDataset("science",
                convertToBase64("test/resources/archives/Dataset2/courses.zip"), InsightDatasetKind.Courses);
            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then((result) => {
                    expect(result).to.be.an.instanceof(Array);
                    expect(result).to.be.of.length(2);
                    expect(result).to.have.deep.members(expectedStrings);
            });
        });

        it("should reject with InsightError when dataset has same id", function () {
            insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset2/courses.zip"), InsightDatasetKind.Courses);
            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                    expect.fail("Failed to throw InsightError");
            }).catch((error) => {
                expect(error).to.equals(InsightError);
            });
        });

        it("should reject with InsightError when dataset has an underscore id", function () {
            return insightFacade.addDataset("_ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                expect.fail("Failed to throw InsightError");
            }).catch((error) => {
                expect(error).to.equals(InsightError);
            });
        });

        it("should reject with InsightError when dataset has an whitespace id", function () {
            insightFacade.addDataset("",
                convertToBase64("test/resources/archives/Dataset2/courses.zip"), InsightDatasetKind.Courses);
            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                expect.fail("Failed to throw InsightError");
            }).catch((error) => {
                expect(error).to.equals(InsightError);
            });
        });

        it("should reject with InsightError if content could not be found/invalid", function () {
            return insightFacade.addDataset("ubc",
                "FakeDatasetPath",
                InsightDatasetKind.Courses).then(() => {
                expect.fail("Failed to throw InsightError");
            }).catch((error) => {
                expect(error).to.equals(InsightError);
            });
        })

    });

    describe("removeDataset", function() {
        let insightFacade: InsightFacade;
        beforeEach(function () {
            insightFacade = new InsightFacade();
        });

        it("should identify and remove the correct dataset",  function() {
            insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"), InsightDatasetKind.Courses);
            insightFacade.addDataset("science",
                convertToBase64("test/resources/archives/Dataset2/courses.zip"), InsightDatasetKind.Courses);

            return insightFacade.removeDataset("ubc").then((result) => {
                expect(result).to.equals("ubc");
            });
        });

        it("should reject with NotFoundError for attempting to remove a dataset not added yet", function() {
            insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"), InsightDatasetKind.Courses);
            insightFacade.addDataset("science",
                convertToBase64("test/resources/archives/Dataset2/courses.zip"), InsightDatasetKind.Courses);

            return insightFacade.removeDataset("arts").then((result) => {
                expect.fail("Failed to throw NotFoundError");
            }).catch((error) => {
                expect(error).to.equals(NotFoundError);
            });
        });

        it("should reject with NotFoundError for attempting to remove dataset when list is empty", function () {
            return insightFacade.removeDataset("ubc").then((result) => {
                expect.fail("Failed to throw NotFoundError");
            }).catch((error) => {
                expect(error).to.equals(NotFoundError);
            });
        });

        it("should reject with InsightError for underscore invalid ID",  function() {
            insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"), InsightDatasetKind.Courses);
            insightFacade.addDataset("science",
                convertToBase64("test/resources/archives/Dataset2/courses.zip"), InsightDatasetKind.Courses);

            return insightFacade.removeDataset("ubc_").then((result) => {
                expect.fail("Failed to throw InsightError");
            }).catch((error) => {
                expect(error).to.equals(InsightError);
            });
        });

        it("should reject with InsightError for whitespace invalid ID",  function() {
            insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"), InsightDatasetKind.Courses);
            insightFacade.addDataset("science",
                convertToBase64("test/resources/archives/Dataset2/courses.zip"), InsightDatasetKind.Courses);

            return insightFacade.removeDataset("").then((result) => {
                expect.fail("Failed to throw InsightError");
            }).catch((error) => {
                expect(error).to.equals(InsightError);
            });
        });


    });

    describe("performQuery", function() {
    });

    describe("listDatasets", function() {

        let insightFacade: InsightFacade;
        beforeEach(function () {
            insightFacade = new InsightFacade();
        });

        it("should return zero datasets", function() {
            return insightFacade.listDatasets().then((result) => {
                expect.fail("Failed to Not Return Zero Datasets");
            });
        })
        it("should return one currently added dataset", function() {
            insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"), InsightDatasetKind.Courses);
            return insightFacade.listDatasets().then((result) => {
                expect(result).to.be.an.instanceof(Array);
                expect(result).to.have.length(1);

                expect(result[0].id).to.equals("ubc");
                expect(result[0].numRows).to.equals(64612);
                expect(result[0].kind).to.equals(InsightDatasetKind.Courses);
            });

        });

        it("should return multiple currently added datasets",  function() {
            insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"), InsightDatasetKind.Courses);
            insightFacade.addDataset("science",
                convertToBase64("test/resources/archives/Dataset2/courses.zip"), InsightDatasetKind.Courses);

            return insightFacade.listDatasets().then((result) => {
                expect(result).to.be.an.instanceof(Array);
                expect(result).to.have.length(2);

                expect(result[0].id).to.equals("ubc");
                expect(result[0].numRows).to.equals(64612);
                expect(result[0].kind).to.equals(InsightDatasetKind.Courses);

                expect(result[1].id).to.equals("science");
                expect(result[1].numRows).to.equals(3);
                expect(result[1].kind).to.equals(InsightDatasetKind.Courses);
            });
        });

    });
});

//Citation: https://stackoverflow.com/questions/28834835/readfile-in-base64-nodejs
function convertToBase64(filePath: string) : string {
    const fs = require('fs');
    return fs.readFileSync(filePath, {encoding: 'base64'});
}


