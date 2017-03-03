/**
 * Created by saharmehrpour on 3/3/17.
 */


import {select} from 'd3-selection';
import * as scatterPlot from './scatterPlot';
import * as ajax from 'phovea_core/src/ajax';

export class DrawPlots {

  private $node;

  constructor(parent: Element) {
    this.$node = select(parent);
  }

  run(){
    return new Promise(resolve => {
      Promise.all([ajax.getAPIJSON('/iris_api/irisDataDecomposed'), ajax.getAPIJSON('/iris_api/irisClustered')])
        .then((args) => {
          let data = args[0];
          let result = args[1]['clustered'];

          let scatter_1 = scatterPlot.create(this.$node.node(), data['data_01'], result);
          scatter_1.init();
          let scatter_2 = scatterPlot.create(this.$node.node(), data['data_12'], result);
          scatter_2.init();
          let scatter_3 = scatterPlot.create(this.$node.node(), data['data_23'], result);
          scatter_3.init();
          let scatter_4 = scatterPlot.create(this.$node.node(), data['data_03'], result);
          scatter_4.init();

          resolve(this);
        });
    });

  }
}

export function create(parent:Element) {
  return new DrawPlots(parent);
}
