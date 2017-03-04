/**
 * Created by saharmehrpour on 3/3/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import * as dataExplorations from './dataExplorations';


export class PrintLogs {

  constructor() {
  }

  runLogs() {
    return new Promise(resolve => {

      // print TCGA data in console
      Promise.all([ajax.getAPIJSON('/tcga_api/getTCGAData'), ajax.getAPIJSON('/tcga_api/getAllDatasets')])
        .then((args) => {
          let data = args[0]['data'];
          let datasets = args[1]['data'];

          console.log("==========");
          console.log("Retrieved by phovea_server/src/dataset.py");
          console.log("==========");

          console.log("----> All datasets:");
          console.log(datasets);

          console.log("----> TCGA data:");
          console.log(data);

          Promise.all([ajax.getAPIJSON('/tcga_api/phoveaServerDataFunction')])
            .then((args) => {
              console.log("----> Phovea Server Functions:");
              console.log(args[0]);

              resolve(this);
            })
        });

    })
  }

  runDemo() {
    const demo = dataExplorations.create();
    return demo.demoDatasets(null);

  }

  runRemove() {
    return new Promise(resolve => {

      // print TCGA data in console
      Promise.all([ajax.getAPIJSON('/tcga_api/removeDataSet')])
        .then((args) => {

          let datasets = args[0];

          console.log("==========");
          console.log("After removing a dataset");
          console.log("==========");

          console.log("----> All datasets and the Result:");
          console.log(datasets);

          resolve(this);

        });

    })
  }

  showRow() {
    return new Promise(resolve => {

      const rowIndex = 1;
      let URL = `/tcga_api/getRow/${rowIndex}`;

      // print TCGA data in console
      Promise.all([ajax.getAPIJSON(URL)])
        .then((args) => {

          let row = args[0];

          console.log("==========");
          console.log("Get Row 1 of TCGA dataset from a server");
          console.log("==========");

          console.log("----> Row 1:");
          console.log(row);

          resolve(this);

        });
    })
  }

  showInfo() {
    return new Promise(resolve => {

      let URL = `/tcga_api/getInfoByFunctions`;

      // print TCGA data in console
      Promise.all([ajax.getAPIJSON(URL)])
        .then((args) => {

          let info = args[0];

          console.log("==========");
          console.log("dataset big-decent-clipped-38");
          console.log("Information retrieved from functions in ");
          console.log("phovea_server/dataset_csv.py#L341");
          console.log("==========");

          console.log("----> Info:");
          console.log(info);

          resolve(this);

        });
    })
  }
}

export function create() {
  return new PrintLogs();
}
