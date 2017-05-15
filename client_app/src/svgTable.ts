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

    let arrowSpan = select(`#${this.datasetId}_arrow`);


    arrowSpan.append("image")
      .attr("xlink:href", "img/back.png")
      .attr('width', 20)
      .attr('height', 20)
      .on('click', ()=>{});
    arrowSpan.append("image")
      .attr("xlink:href", "img/back.png")
      .attr('width', 20)
      .attr('height', 20)
      .on('click', ()=>{});


    this.drawHeader();

    const url = `/data_api/getAllRows/${this.datasetId}`;
    console.log(`loading ${this.datasetId}`);
    this.getData(url).then((args) => {
      const dic = {'func': 'init', 'data': args[this.datasetId]};
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
      .data(this.header[this.datasetId])
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
   * data = {data} list of objects (rows of the files)
   * arg = rows
   * @param input dict= {'func': 'init'/'similar'/'all'/'latest', 'data': {data}}
   * @returns {Promise<void>}
   */
  private drawRows(input) {

    console.log('Loading ' + this.datasetId);

    let data = (input.func === 'init' || input.func === 'latest') ? input['data'].slice(0, 20)
      : input.data;

    data = (input.func === 'all') ? input['data'].slice(0, 25) : data;

    const rows = this.$node
      .selectAll('.rows')
      .data(data);

    const cells = rows.enter().append('div')
      .classed('rows', true)
      .merge(rows)
      .selectAll('.cells')
      .data((d) => {
        const ent = entries(d).filter((d)=> d.key != 'diff');
        ent.sort((a, b) => {
          return this.header[this.datasetId].indexOf(a.key)
            - this.header[this.datasetId].indexOf(b.key);
        });
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
      .html((g) => {
        if (g.key === 'WEIGHT_KG') {
          return `<svg width='50' height='20'><path class=\'lineChart\' d></svg>` + g.value;
        }
        return g.value;
      });

    rows.exit().remove();

    if (input.func === 'latest') {
      this.drawLineChart(input.data.WEIGHT_KG);
    }

    console.log(this.datasetId + ' loaded');

  }

  /**
   * Drawing the changes in the weight in the table
   * @param data
   */
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

    // item: pat_id, DATA
    events.on('update_all_info', (evt, item) => {
      const dic = {'func': 'all', 'data': item[1][this.datasetId][Number(item[0])]};
      this.drawRows(dic);
    });

    // item: pat_id, number of similar patients, DATA
    events.on('update_similar', (evt, item) => {
      if (this.datasetId === 'Demo') {
        let rawData = entries(item[2]['similar_Demo']);
        let data = rawData.map(function (d) {
          return d.value[0];
        });

        const dic = {'func': 'similar', 'data': data};
        this.drawRows(dic);
      }
    });
    /*
    events.on('update_latest', () => { //TODO
      if (this.datasetId === 'Demo') {
        const url = `/data_api/getLatestInfo/${this.datasetId}`;
        this.setBusy(true);
        this.getData(url).then((args) => {
          const dic = {'func': 'latest', 'data': args, 'arg': 'rows'};
          this.drawRows(dic);
          this.setBusy(false);
        });
      }
    });
    */

    events.on('update_init', () => {

      const url = `/data_api/getAllRows/${this.datasetId}`;
      console.log(`loading ${this.datasetId}`);
      this.getData(url).then((args) => {
        const dic = {'func': 'init', 'data': args[this.datasetId]};
        this.drawRows(dic);
      });
    });
  }

  private async getData(URL) {
    this.setBusy(true);
    const res = await ajax.getAPIJSON(URL);
    this.setBusy(false);
    return res;
  }

  /**
   * Show or hide the application loading indicator
   * @param isBusy
   */
  setBusy(isBusy: boolean) {
    let status = select('.busy').classed('hidden');
    if (status == isBusy)
      select('.busy').classed('hidden', !isBusy);
  }

}

export function create(parent:Element) {
  return new SvgTable(parent);
}

