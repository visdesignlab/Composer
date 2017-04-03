/**
 * Created by saharmehrpour on 3/3/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import * as dataExplorations from './dataExplorations';


export class PrintLogs {

  private dataset_id;

  constructor(dataset_id) {
    this.dataset_id = dataset_id;
  }

  async runLogs() {

    let URL = `/data_api/getData/${this.dataset_id}`;
    let args = await ajax.getAPIJSON(URL);

    // print data in console
    console.log("==========");
    console.log("Retrieved by phovea_server/src/dataset.py");
    console.log("==========");

    console.log("----> /data_api/getData/" + this.dataset_id + " :");
    console.log(args[0]['data']);

    console.log("----> /data_api/phoveaServerDataFunction :");
    console.log(args[1]);

  }

  runDemo() {
    const demo = dataExplorations.create();
    return demo.demoDatasets(null);

  }

  async runRemove(id) {

    let URL = `/data_api/removeDataSet/${id}`;
    let args = await ajax.getAPIJSON(URL);

    console.log("==========");
    console.log("After removing a dataset");
    console.log("==========");
    console.log(args[0]);

  }

  async showInfo() {

    let URL = `/data_api/getDatasetInfoByFunctions/${this.dataset_id}`;
    let args = await ajax.getAPIJSON(URL);

    console.log("==========");
    console.log("dataset: " + this.dataset_id);
    console.log("Information retrieved from functions in ");
    console.log("phovea_server/dataset_csv.py#L341");
    console.log("==========");

    console.log("----> /data_api/getDatasetInfoByFunctions/" + this.dataset_id + ":");
    console.log(args[0]);

  }
}

export function create(dataset_id) {
  return new PrintLogs(dataset_id);
}
