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

  runDemo(){
    const demo = dataExplorations.create();
    return demo.demoDatasets(null);

  }

  runRemove() {

    return new Promise(resolve => {

      // print TCGA data in console
      Promise.all([ajax.getAPIJSON('/tcga_api/removeDataSet')])
        .then(() => {

          Promise.all([ajax.getAPIJSON('/tcga_api/getAllDatasets')])
            .then((args) => {
              let datasets = args[0]['data'];

              console.log("==========");
              console.log("After removing a dataset");
              console.log("==========");

              console.log("----> All datasets:");
              console.log(datasets);

              resolve(this);
            })
        });

    })
  }
}

export function create() {
  return new PrintLogs();
}
