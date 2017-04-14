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
    const dic = {'func': 'init', 'URL': url, 'arg': 'rows'};
    await this.drawRows(dic);

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
   * url = `/data_api/getAllRows/${this.datasetId}`
   * url = `/data_api/getClusterByIndex/${this.datasetId}/${index}`
   * url = `/data_api/getSimilarRowsByIndex/${this.datasetId}/${index}`
   * url = `/data_api/getInfoByColValue/${this.datasetId}/${col_name}/${col_value}`
   * arg = cluster/similar_row/info_rows/rows/latest_info
   * @param input dict= {'func': 'init'/'similar'/'cluster'/'update', 'URL': url, 'arg': arg}
   * @returns {Promise<void>}
   */
  private async drawRows(input) {

    console.log('Loading ' + this.datasetId);

    const args = await ajax.getAPIJSON(input.URL);
    const data = (input.func === 'init') ? args[input.arg].slice(0, 20)
      : args[input.arg];

    const diff = (input.func === 'similar') ? args.difference : [];

    const rows = this.$node
      .selectAll('.rows')
      .data(data);

    const cells = rows.enter().append('div')
      .classed('rows', true)
      .merge(rows)
      .selectAll('.cells')
      .data((d, i) => {
        const ent = entries(d);
        ent.sort((a, b) => {
          return this.header[this.datasetId].indexOf(a.key)
            - this.header[this.datasetId].indexOf(b.key);
        });
        if (input.func === 'similar') {
          for (let j = 0; j < ent.length; j++) {
            ent[j]['diff'] = +diff[i][j];
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
      this.drawLineChart(args.weights);
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
    events.on('update_table', (evt, item) => {
       const url = `/data_api/getInfoByColValue/${this.datasetId}/${item[0]}/${item[1]}`;
       const dic = {'func': 'update', 'URL': url, 'arg': 'info_rows'};
       this.drawRows(dic);
    });

    events.on('update_table_similar', (evt, item) => {
      if(this.datasetId === 'Demo') {
        const url = `/data_api/getSimilarRowsByIndex/${this.datasetId}/${item[1]}`;
        const dic = {'func': 'similar', 'URL': url, 'arg': 'similar_rows'};
        this.drawRows(dic);
      }
    });

    events.on('update_table_cluster', (evt, item) => {
      if(this.datasetId === 'Demo') {
        const url = `/data_api/getClusterByIndex/${this.datasetId}/${item[1]}`;
        const dic = {'func': 'cluster', 'URL': url, 'arg': 'cluster'};
        this.drawRows(dic);
      }
    });

    events.on('update_table_latest', () => {
      if(this.datasetId === 'Demo') {
        const url = `/data_api/getLatestInfo/${this.datasetId}`;
        const dic = {'func': 'latest', 'URL': url, 'arg': 'latest_info'};
        this.drawRows(dic);
      }
    });

    events.on('update_table_init', () => {
        const url = `/data_api/getAllRows/${this.datasetId}`;
        const dic = {'func': 'init', 'URL': url, 'arg': 'rows'};
        this.drawRows(dic);
    });
  }

}

export function create(parent:Element) {
  return new SvgTable(parent);
}

