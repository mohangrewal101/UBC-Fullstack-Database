"use strict";
/*

 * This is the primary high-level API for the project. In this folder there should be:

 * A class called InsightFacade, this should be in a file called InsightFacade.ts.

 * You should not change this interface at all or the test suite will not work.

 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultTooLargeError = exports.NotFoundError = exports.InsightError = exports.InsightDatasetKind = void 0;
var InsightDatasetKind;
(function (InsightDatasetKind) {
    InsightDatasetKind["Courses"] = "courses";
    InsightDatasetKind["Rooms"] = "rooms";
})(InsightDatasetKind = exports.InsightDatasetKind || (exports.InsightDatasetKind = {}));
class InsightError extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, InsightError);
    }
}
exports.InsightError = InsightError;
class NotFoundError extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, NotFoundError);
    }
}
exports.NotFoundError = NotFoundError;
class ResultTooLargeError extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, ResultTooLargeError);
    }
}
exports.ResultTooLargeError = ResultTooLargeError;
