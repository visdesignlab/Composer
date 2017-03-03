/**
 * Added by saharmehrpour on 3/1/17. Created by Alex.
 */

import {ITable} from 'phovea_core/src/table';
import {list as listData, getFirstByName, get as getById} from 'phovea_core/src/data';


export default class DataExplorations {

  table: ITable;

  /**
   *
   * This function demonstrates the use of a heterogeneous table.
   *
   * The relevant Phovea Classes:
   *
   * Accessing datasets using various functions:
   * https://github.com/phovea/phovea_core/blob/develop/src/data.ts
   * The phovea table interface:
   * https://github.com/phovea/phovea_core/blob/develop/src/table.ts
   *
   * The phovea vector:
   * https://github.com/phovea/phovea_core/blob/develop/src/vector/IVector.ts
   *
   */

  public async demoDatasets(table: ITable) {

    console.log('=============================');
    console.log('RETRIEVING DATA');
    console.log('=============================');


    // this is true in the server case, when we don't want to pass a dataset into this.
    if (table == null) {
      // listData() returns a list of all datasets loaded by the server
      // notice the await keyword - you'll see an explanation below
      const allDatasets = await listData();
      console.log('All loaded datasets:');
      console.log(allDatasets);

      // we could use those dataset to filter them based on their description and pick the one(s) we're interested in

      // here we pick the first dataset and cast it to ITable - by default the datasets are returned as IDataType
      table = <ITable> allDatasets[0];

      // retrieving a dataset by name
      table = <ITable> await getFirstByName('big-decent-clipped-38');
      //console.log('artists dataset retrieved by name:');

      console.log('big-decent-clipped-38 dataset retrieved by name:');
      console.log(table);


    } else {
      console.log('The Table as passed via parameter:');
      console.log(table);
    }

    console.log('=============================');
    console.log('ACCESSING METADATA');
    console.log('=============================');

    // Accessing the description of the dataset:
    console.log('Table description:');
    console.log(table.desc);
    // Printing the name
    console.log('Table Name: ' + table.desc.name);

    console.log('Artist Table description:');
    console.log(table.desc);
    // Printing the name
    console.log('Table Name: ' + table.desc.name);



    console.log('=============================');
    console.log('ACCESSING COLUMNS/VECTORS');
    console.log('=============================');

    // Here we retrieve the first vector from the table.
    const vector = table.col(0);
    console.log('The first vector:');
    console.log(vector);
    console.log('Length:' + vector.length);
    console.log('IDType:' + vector.idtype);

    // TODO: retrieve a vector by name

    // Access the data of a vector by name:

    console.log('Accessing RelativeID column by name from big-decent-clipped-38 dataset:');
    console.log(await table.colData('RelativeID'));

  }

}

/**
 * Method to create a new graphData instance
 * @returns {graphData}
 */
export function create() {

  return new DataExplorations();
}
