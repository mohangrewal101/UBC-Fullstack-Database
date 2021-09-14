"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IInsightFacade_1 = require("./IInsightFacade");
class InsightFacade {
    addDataset(id, content, kind) {
        return Promise.reject();
    }
    removeDataset(id) {
        return Promise.reject(new IInsightFacade_1.InsightError());
    }
    performQuery(query) {
        return Promise.reject();
    }
    listDatasets() {
        return Promise.reject();
    }
}
exports.default = InsightFacade;
