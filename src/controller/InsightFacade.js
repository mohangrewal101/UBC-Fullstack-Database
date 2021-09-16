"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IInsightFacade_1 = require("./IInsightFacade");
class InsightFacade {
    addDataset(id, content, kind) {
        return Promise.resolve([""]);
    }
    removeDataset(id) {
        return Promise.reject();
    }
    performQuery(query) {
        return Promise.reject();
    }
    listDatasets() {
        const dataset1 = {
            id: "ubc",
            kind: IInsightFacade_1.InsightDatasetKind.Courses,
            numRows: 64612
        };
        const dataset2 = {
            id: "science",
            kind: IInsightFacade_1.InsightDatasetKind.Courses,
            numRows: 3
        };
        return Promise.resolve([dataset2, dataset1]);
    }
}
exports.default = InsightFacade;
