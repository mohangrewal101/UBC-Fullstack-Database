"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InsightFacade {
    addDataset(id, content, kind) {
        return Promise.resolve(["ubc"]);
    }
    removeDataset(id) {
        return Promise.resolve(id);
    }
    performQuery(query) {
        return Promise.reject();
    }
    listDatasets() {
        return Promise.reject();
    }
}
exports.default = InsightFacade;
