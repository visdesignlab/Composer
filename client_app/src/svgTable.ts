/**
 * Created by saharmehrpour on 3/8/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll, event} from 'd3-selection';
import {values,keys,entries} from 'd3-collection';
//import {transition} from 'd3-transition';
import * as events from 'phovea_core/src/event';
import {Constants} from './constants';
import {scaleLinear} from 'd3-scale';
import {line} from 'd3-shape';

export class SvgTable {

  private $node;
  datasetId;
  private rows;

  private cols = Constants.cols;
  private header = Constants.header;

  constructor(parent: Element) {
    this.$node = select(parent)
      .append('div')
      .classed('tableDiv', true);
    this.attachListener();
  }

  async drawTable(datasetId) {
    this.datasetId = datasetId;

    this.drawHeader();

    const url = `/data_api/getAllRows/${this.datasetId}`;
    console.log("start loading init");
    this.getData(url).then((args) => {
      const dic = {'func': 'init', 'args': args, 'arg': 'rows'};
      this.drawRows(dic);
    });

  }

  /**
   * Draw the header of the table
   */
  private drawHeader() {

    const header = this.$node
      .selectAll('.header')
      .data([1]);

    header.enter().append('div')
      .classed('header', true)
      .merge(header)
      .selectAll('.headercells')
      .data(this.header[this.datasetId]) // changed!
      .enter().append('div')
      .classed('headercells', true)
      .classed('superWideCell', (g, i) => {
        return this.cols[this.datasetId].SuperWide.indexOf(i) !== -1;
      })
      .classed('wideCell', (g, i) => {
        return this.cols[this.datasetId].Wide.indexOf(i) !== -1;
      })
      .classed('mediumCell', (g, i) => {
        return this.cols[this.datasetId].Medium.indexOf(i) !== -1;
      })
      .html((g, i) => {
        if (this.cols[this.datasetId].SuperWide.indexOf(i) !== -1) {
          return g;
        }
        if (this.cols[this.datasetId].Wide.indexOf(i) !== -1) {
          return g;
        }
        if (this.cols[this.datasetId].Medium.indexOf(i) !== -1) {
          return g.slice(0, Math.min(10, g.length));
        }
        return g.slice(0, 4);
      })
      .on('mouseover', function (g) {
        select('.tooltip')
          .style('opacity', 1);
        select('.tooltip').html(() => {
          return g.split('_').join(' ');
        })
          .style('left', (event.pageX) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function () {
        select('.tooltip')
          .style('opacity', 0);
      });

  }

  /**
   * Draw the rows of the table
   * args = {data}
   * arg = rows
   * @param input dict= {'func': 'init'/'similar'/'all', 'args': {data}, 'arg': arg}
   * @returns {Promise<void>}
   */
  private drawRows(input) {

    console.log('Loading ' + this.datasetId);

    const data = (input.func === 'init') ? input.args[input.arg].slice(0, 20)
      : input.args[input.arg];

    const diff = (input.func === 'similar') ? input.args.difference : [];

    const rows = this.$node
      .selectAll('.rows')
      .data(data);

    const cells = rows.enter().append('div')
      .classed('rows', true)
      .merge(rows)
      .selectAll('.cells')
      .data((d,i) => {
        const ent = entries(d);
        ent.sort((a, b) => {
          return this.header[this.datasetId].indexOf(a.key)
            - this.header[this.datasetId].indexOf(b.key);
        });

        if (input.func === 'similar') {
          for (let j = 0; j < ent.length; j++) {
            ent[j]['diff'] = +diff[i][ent[j].key];
          }
        }
        return ent;
      });

    cells
      .enter().append('div')
      .classed('cells', true)
      .merge(cells)
      .classed('superWideCell', (g, i) => {
        return this.cols[this.datasetId].SuperWide.indexOf(i) !== -1;
      })
      .classed('wideCell', (g, i) => {
        return this.cols[this.datasetId].Wide.indexOf(i) !== -1;
      })
      .classed('mediumCell', (g, i) => {
        return this.cols[this.datasetId].Medium.indexOf(i) !== -1;
      })
      .classed('sameValue', (g) => {
        return input.func === 'similar' && g.diff === 0;
      })
      .classed('lowerValue', (g) => {
        return input.func === 'similar' && g.diff === -1;
      })
      .classed('higherValue', (g) => {
        return input.func === 'similar' && g.diff === +1;
      })
      .html((g) => {
        if (g.key === 'WEIGHT_KG') {
          return `<svg width='50' height='20'><path class=\'lineChart\' d></svg>` + g.value;
        }
        return g.value;
      });

    rows.exit().remove();

    if (input.func === 'latest') {
      this.drawLineChart(input.args.WEIGHT_KG);
    }

    console.log(this.datasetId + ' loaded');

  }

  private drawLineChart(data) {

    const scaleWeight = scaleLinear()
      .domain([31, 205])
      .range([0, 20]);

    const scaleX = scaleLinear()
      .domain([0, 10])
      .range([0, 50]);

    const lineFn = line()
      .x((d, i) => scaleX(i))
      .y((d) => scaleWeight(+d));

    this.$node
      .selectAll('.lineChart')
      .attr('d', (d, i) => lineFn(data[i]));

  }

  private attachListener() {
    events.on('update_table_all', (evt, item) => {
      const url = `/data_api/getPatInfo/${this.datasetId}/${item[1]}`;
      const args = this.getData(url);
      const dic = {'func': 'all', 'args': args, 'arg': 'rows'};
      this.drawRows(dic);
    });

    events.on('update_table_similar', (evt, item) => {
      if (this.datasetId === 'Demo') {
        const url = `/data_api/getSimilarRows/${item[1]}`;
        console.log("start loading similar");
        this.getData(url).then((args) => {
          const dic = {'func': 'similar', 'args': args, 'arg': 'rows'};
          console.log("start drawing similar");
          console.log(args);
          events.fire('similar_score_diagram', ['args', args]);
          this.drawRows(dic);
        });
      }
    });

    events.on('update_table_latest', () => {
      if (this.datasetId === 'Demo') {
        const url = `/data_api/getLatestInfo/${this.datasetId}`;
        this.getData(url).then((args) => {
          const dic = {'func': 'latest', 'args': args, 'arg': 'rows'};
          this.drawRows(dic);
        });
      }
    });

    events.on('update_table_init', () => {
      const url = `/data_api/getAllRows/${this.datasetId}`;
      this.getData(url).then((args) => {
        const dic = {'func': 'init', 'args': args, 'arg': 'rows'};
        this.drawRows(dic);
      });
    });
  }

  private async getData(URL) {
    return await ajax.getAPIJSON(URL);
  }

}

export function create(parent:Element) {
  return new SvgTable(parent);
}

