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

    let URL = `/general_api/getData/${this.dataset_id}`;
    let args = await ajax.getAPIJSON(URL);

    // print data in console
    console.log("==========");
    console.log("Retrieved by phovea_server/src/dataset.py");
    console.log("==========");

    console.log("----> /general_api/getData/" + this.dataset_id + " :");
    console.log(args[0]['data']);

    console.log("----> /general_api/phoveaServerDataFunctions :");
    console.log(args[1]);

  }

  runDemo() {
    const demo = dataExplorations.create();
    return demo.demoDatasets(null);

  }

  async showInfo() {

    let URL = `/general_api/getDatasetInfoByFunctions/${this.dataset_id}`;
    let args = await ajax.getAPIJSON(URL);

    console.log("==========");
    console.log("dataset: " + this.dataset_id);
    console.log("Information retrieved from functions in ");
    console.log("phovea_server/dataset_csv.py#L341");
    console.log("==========");

    console.log("----> /general_api/getDatasetInfoByFunctions/" + this.dataset_id + ":");
    console.log(args);

  }
}

export function create(dataset_id) {
  return new PrintLogs(dataset_id);
}
