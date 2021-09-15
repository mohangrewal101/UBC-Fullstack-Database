import {IInsightFacade, InsightDataset, InsightDatasetKind, InsightError, NotFoundError} from "./IInsightFacade";

export default class InsightFacade implements IInsightFacade{

    addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
    return Promise.resolve(["ubc"]);
    }

    removeDataset(id: string): Promise<string> {
    return Promise.resolve(id);
    }

    performQuery(query: any): Promise<any[]> {
    return Promise.reject();
    }

    listDatasets(): Promise<InsightDataset[]> {
    return Promise.reject();
    }

}