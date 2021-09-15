import {InsightDataset, InsightDatasetKind, InsightError, NotFoundError} from "../../src/controller/IInsightFacade";
import InsightFacade from "../../src/controller/InsightFacade";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import {testFolder} from "@ubccpsc310/folder-test";

chai.use(chaiAsPromised);

type Input = any;
type Output = Promise<any[]>;
type Error = any;

let insightFacade: InsightFacade
describe("InsightFacade", function () {
    describe("addDataset", function () {
        beforeEach(function () {
            insightFacade = new InsightFacade();
        });

        afterEach(function () {
            clearDatasets();
        });

        it("should add first dataset and return array ONLY containing its id", function () {
            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then((result) => {
                expect(result).to.be.an.instanceof(Array);
                expect(result).to.be.of.length(1);
                expect(result[0]).to.deep.equals("ubc");
            });
        });

        it("should add dataset when list contains datasets and return array with ids", function () {
            let expectedStrings = ["science", "ubc"];
            return insightFacade.addDataset("science",
                convertToBase64("test/resources/archives/Dataset2/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                insightFacade.addDataset("ubc",
                    convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                    InsightDatasetKind.Courses).then((result) => {
                    expect(result).to.be.an.instanceof(Array);
                    expect(result).to.be.of.length(2);
                    expect(result).to.have.deep.members(expectedStrings);
                });
            });
        });

        it("should reject with InsightError when dataset has same id", function () {
            
            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset2/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                return insightFacade.addDataset("ubc",
                    convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                    InsightDatasetKind.Courses);
            }).then(() => {
                expect.fail("Failed to throw InsightError");
            }).catch((error) => {
                expect(error).to.be.instanceof(InsightError);
            });

        });

        it("should reject with InsightError when dataset has an underscore id", function () {
            return insightFacade.addDataset("_ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                expect.fail("Failed to throw InsightError");
            }).catch((error) => {
                expect(error).to.be.instanceof(InsightError);
            });
        });

        it("should reject with InsightError when dataset has an whitespace id", function () {
            return insightFacade.addDataset("data set",
                convertToBase64("test/resources/archives/Dataset2/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                expect.fail("Failed to throw InsightError");
            }).catch((error) => {
                expect(error).to.be.instanceof(InsightError);
            });
        });

        it("should reject with InsightError if content could not be found/invalid", function () {
            return insightFacade.addDataset("ubc",
                "FakeDatasetPath",
                InsightDatasetKind.Courses).then(() => {
                expect.fail("Failed to throw InsightError");
            }).catch((error) => {
                expect(error).to.be.instanceof(InsightError);
            });
        })

    });

    describe("removeDataset", function () {
        beforeEach(function () {
            insightFacade = new InsightFacade();
        });

        afterEach(function () {
            clearDatasets();
        });

        it("should identify and remove the correct dataset", function () {

            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                return insightFacade.addDataset("science",
                    convertToBase64("test/resources/archives/Dataset2/courses.zip"),
                    InsightDatasetKind.Courses);
            }).then(() => {
                return insightFacade.removeDataset("ubc");
            }).then((result) => {
                expect(result).to.deep.equals("ubc");
            });
        });

        it("should reject with NotFoundError for attempting to remove a dataset not added yet", function () {

            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                return insightFacade.addDataset("science",
                    convertToBase64("test/resources/archives/Dataset2/courses.zip"),
                    InsightDatasetKind.Courses);
            }).then(() => {
                return insightFacade.removeDataset("arts");
            }).then(() => {
                expect.fail("Failed to throw NotFoundError");
            }).catch((error) => {
                expect(error).to.be.instanceof(NotFoundError);
            });
        });

        it("should reject with NotFoundError for attempting to remove dataset when list is empty", function () {
            return insightFacade.removeDataset("ubc").then(() => {
                expect.fail("Failed to throw NotFoundError");
            }).catch((error) => {
                expect(error).to.be.instanceof(NotFoundError);
            });
        });

        it("should reject with InsightError for underscore invalid ID", function () {

            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                return insightFacade.addDataset("science",
                    convertToBase64("test/resources/archives/Dataset2/courses.zip"),
                    InsightDatasetKind.Courses);
            }).then(() => {
                return insightFacade.removeDataset("ubc_");
            }).then(() => {
                expect.fail("Failed to throw InsightError");
            }).catch((error) => {
                expect(error).to.be.instanceof(InsightError);
            });
        });

        it("should reject with InsightError for whitespace invalid ID", function () {

            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                return insightFacade.addDataset("science",
                    convertToBase64("test/resources/archives/Dataset2/courses.zip"),
                    InsightDatasetKind.Courses);
            }).then(() => {
                return insightFacade.removeDataset("data set");
            }).then(() => {
                expect.fail("Failed to throw InsightError");
            }).catch((error) => {
                expect(error).to.be.instanceof(InsightError);
            });
        });
    });

    describe("performQuery", function () {
        beforeEach(function () {
            insightFacade = new InsightFacade();
        });

        afterEach(function () {
            clearDatasets();
        });


    });

    describe("listDatasets", function () {
        beforeEach(function () {
            insightFacade = new InsightFacade();
        });

        afterEach(function () {
            clearDatasets();
        });

        it("should return zero datasets", function () {
            return insightFacade.listDatasets().then(() => {
                expect.fail("Failed to Not Return Zero Datasets");
            });
        })

        it("should return one currently added dataset", function () {
            const expected: InsightDataset = {
                id: "ubc",
                kind: InsightDatasetKind.Courses,
                numRows: 64612
            }

            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                return insightFacade.listDatasets();
            }).then((result) => {
                expect(result).to.be.an.instanceof(Array);
                expect(result).to.have.length(1);

                expect(result[0]).to.deep.equals(expected);
            });
        });

        it("should return multiple currently added datasets", function () {
            const dataset1: InsightDataset = {
                id: "ubc",
                kind: InsightDatasetKind.Courses,
                numRows: 64612
            }

            const dataset2: InsightDataset = {
                id: "science",
                kind: InsightDatasetKind.Courses,
                numRows: 3
            }

            const expected = [dataset1, dataset2];


            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                return insightFacade.addDataset("science",
                    convertToBase64("test/resources/archives/Dataset2/courses.zip"), InsightDatasetKind.Courses);
            }).then(() => {
                return insightFacade.listDatasets();
            }).then((result) => {
                expect(result).to.be.an.instanceof(Array);
                expect(result).to.have.length(2);

                expect(result).to.deep.equals(expected);

            });
        });
    });
});

//Citation: https://stackoverflow.com/questions/28834835/readfile-in-base64-nodejs
function convertToBase64(filePath: string): string {
    const fs = require('fs-extra');
    return fs.readFileSync(filePath, {encoding: 'base64'});
}

function clearDatasets(): void {
    const fs = require('fs-extra');
    fs.removeSync("data");
}

testFolder<Input, Output, Error>(
    "Add Dynamic Tests",
    (input: Input): Output => {
        const insightFacade = new InsightFacade();
        return insightFacade.performQuery(input);
    },
    "test/resources/queries")


