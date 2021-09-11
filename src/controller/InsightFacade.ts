import {IInsightFacade, InsightDataset, InsightDatasetKind} from "./IInsightFacade";

export default class InsightFacade implements IInsightFacade{

    addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
    return Promise.reject();
    }

    removeDataset(id: string): Promise<string> {
    return Promise.reject();
    }

    performQuery(query: any): Promise<any[]> {
    return Promise.reject();
    }

    listDatasets(): Promise<InsightDataset[]> {
    return Promise.reject();
    }

}