import {
    InsightDataset,
    InsightDatasetKind,
    InsightError,
    NotFoundError,
    ResultTooLargeError
} from "../../src/controller/IInsightFacade";
import InsightFacade from "../../src/controller/InsightFacade";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import {testFolder} from "@ubccpsc310/folder-test";
import {describe} from "mocha";

chai.use(chaiAsPromised);

type Input = any;
type Output = Promise<any[]>;
type Error = "InsightError" | "ResultTooLargeError";

let insightFacade: InsightFacade
describe("InsightFacade", function () {
    describe("addDataset", function () {
        beforeEach(function () {
            clearDatasets();
            addDataDirectory();
            insightFacade = new InsightFacade();
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
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                return insightFacade.addDataset("ubc",
                    convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                    InsightDatasetKind.Courses).then((result) => {
                    expect(result).to.be.an.instanceof(Array);
                    expect(result).to.be.of.length(2);
                    expect(result).to.have.deep.members(expectedStrings);
                });
            });
        });

        it("should add dataset containing an id that contains NOT ONLY whitespace", function () {

            return insightFacade.addDataset("ubc courses",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then((result) => {
                expect(result).to.be.an.instanceof(Array);
                expect(result).to.be.of.length(1);
                expect(result[0]).to.deep.equals("ubc courses");
            });
        });

        it("should add dataset if most courses are valid", function () {
            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/MostlyValidCoursesDataset/courses.zip"),
                InsightDatasetKind.Courses).then((result) => {
                expect(result).to.be.an.instanceof(Array);
                expect(result).to.be.of.length(1);
                expect(result[0]).to.deep.equals("ubc");
            });
        });

        it("should reject with InsightError when dataset has same id", function () {

            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses)
                .then(() => {
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
            return insightFacade.addDataset(" ",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
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
        });

        it("should reject with InsightError if dataset kind is Rooms", function () {
            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Rooms).then(() => {
                expect.fail("Failed to throw InsightError");
            }).catch((error) => {
                expect(error).to.be.instanceof(InsightError);
            });
        });

        it("should reject with InsightError if all courses in dataset are invalid", function () {
            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/AllCoursesInvalidDataset/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                expect.fail("Failed to throw InsightError");
            }).catch((error) => {
                expect(error).to.be.instanceof(InsightError);
            });
        });

    });

    describe("removeDataset", function () {
        beforeEach(function () {
            clearDatasets();
            addDataDirectory();
            insightFacade = new InsightFacade();
        });


        it("should identify and remove the correct dataset", function () {

            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                return insightFacade.removeDataset("ubc").then((result) => {
                    expect(result).to.deep.equals("ubc");
                });
            });
        });

        it("should identify and remove dataset containing id that has NOT ONLY whitespace", function () {

            return insightFacade.addDataset("ubc courses",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                return insightFacade.removeDataset("ubc courses").then((result) => {
                    expect(result).to.deep.equals("ubc courses");
                });
            });
        });

        it("should reject with NotFoundError for attempting to remove a dataset not added yet", function () {

            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                return insightFacade.addDataset("science",
                    convertToBase64("test/resources/archives/Dataset1/courses.zip"),
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
                    convertToBase64("test/resources/archives/Dataset1/courses.zip"),
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
                    convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                    InsightDatasetKind.Courses);
            }).then(() => {
                return insightFacade.removeDataset(" ");
            }).then(() => {
                expect.fail("Failed to throw InsightError");
            }).catch((error) => {
                expect(error).to.be.instanceof(InsightError);
            });
        });
    });

    describe("listDatasets", function () {
        beforeEach(function () {
            clearDatasets();
            addDataDirectory();
            insightFacade = new InsightFacade();
        });

        it("should return zero datasets", function () {
            return insightFacade.listDatasets().then((result) => {
                expect(result).to.be.an.instanceof(Array);
                expect(result).to.have.length(0);
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
                expect(result).to.deep.equals([expected]);
            });
        });

        it("should return multiple currently added datasets", function () {
            const expected: InsightDataset[] = [
                {
                    id: "ubc",
                    kind: InsightDatasetKind.Courses,
                    numRows: 64612
                },
                {
                    id: "science",
                    kind: InsightDatasetKind.Courses,
                    numRows: 64612
                }]


            return insightFacade.addDataset("ubc",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                return insightFacade.addDataset("science",
                    convertToBase64("test/resources/archives/Dataset1/courses.zip"), InsightDatasetKind.Courses);
            }).then(() => {
                return insightFacade.listDatasets();
            }).then((result) => {
                expect(result).to.have.deep.members(expected);
                expect(result).to.have.length(2);

            });
        });
    });

    describe("performQuery", function () {
        before(function () {
            clearDatasets();
            addDataDirectory();
            insightFacade = new InsightFacade();
            return insightFacade.addDataset("courses",
                convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                InsightDatasetKind.Courses).then(() => {
                return insightFacade.addDataset("ubc",
                    convertToBase64("test/resources/archives/Dataset1/courses.zip"),
                    InsightDatasetKind.Courses);
            });
        });

        function assertResult(expected: Output, actual: any): void {
            expect(actual).to.equal(expected);
        }

        function assertError(expected: Error, actual: any): void {
            if (expected === "InsightError") {
                expect(actual).to.be.an.instanceOf(InsightError);
            } else {
                expect(actual).to.be.an.instanceOf(ResultTooLargeError);
            }
        }

        testFolder<Input, Output, Error>(
            "performQuery Tests",                   // suiteName
            (input: Input): Output => {
                return insightFacade.performQuery(input)    // target
            },
            "./test/resources/queries",              // path
            {
                assertOnResult: assertResult,
                assertOnError: assertError,               // options
            });
    });
});

//Citation: https://stackoverflow.com/questions/28834835/readfile-in-base64-nodejs
function convertToBase64(filePath: string): string {
    const fs = require('fs-extra');
    return fs.readFileSync(filePath, {encoding: 'base64'});
}

function addDataDirectory() {
    const fs = require('fs-extra');
    fs.mkdir("data");
}

function clearDatasets(): void {
    const fs = require('fs-extra');
    fs.removeSync("data");

}


