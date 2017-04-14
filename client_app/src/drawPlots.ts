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

  run() {
    return new Promise((resolve) => {
      Promise.all([ajax.getAPIJSON('/iris_api/irisDataDecomposed'), ajax.getAPIJSON('/iris_api/irisClustered')])
        .then((args) => {
          const data = args[0];
          const result = args[1].clustered;

          const scatter1 = scatterPlot.create(this.$node.node(), data.data_01, result);
          scatter1.init();
          const scatter2 = scatterPlot.create(this.$node.node(), data.data_12, result);
          scatter2.init();
          const scatter3 = scatterPlot.create(this.$node.node(), data.data_23, result);
          scatter3.init();
          const scatter4 = scatterPlot.create(this.$node.node(), data.data_03, result);
          scatter4.init();

          resolve(this);
        });
    });

  }
}

export function create(parent:Element) {
  return new DrawPlots(parent);
}
