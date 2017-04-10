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
  dataset_id;
  private rows;

  private cols = Constants.cols;
  private header = Constants.header;

  constructor(parent: Element) {
    this.$node = select(parent)
      .append("div")
      .classed("tableDiv", true);
    this.attachListener();
  }

  async drawTable(dataset_id) {
    this.dataset_id = dataset_id;

    this.drawHeader();

    let url = `/data_api/getAllRows/${this.dataset_id}`;
    let dic = {'func': 'init', 'URL': url, 'arg': 'rows'};
    await this.drawRows(dic);

  }

  /**
   * Draw the header of the table
   */
  private drawHeader() {

    let header = this.$node
      .selectAll(".header")
      .data([1]);

    header.enter().append("div")
      .classed("header", true)
      .merge(header)
      .selectAll(".headercells")
      .data(this.header[this.dataset_id]) // changed!
      .enter().append("div")
      .classed("headercells", true)
      .classed("superWideCell", (g, i) => {
        return this.cols[this.dataset_id]["SuperWide"].indexOf(i) != -1
      })
      .classed("wideCell", (g, i) => {
        return this.cols[this.dataset_id]["Wide"].indexOf(i) != -1
      })
      .classed("mediumCell", (g, i) => {
        return this.cols[this.dataset_id]["Medium"].indexOf(i) != -1
      })
      .html((g, i) => {
      if (this.cols[this.dataset_id]["SuperWide"].indexOf(i) != -1)
          return g;
        if (this.cols[this.dataset_id]["Wide"].indexOf(i) != -1)
          return g;
        if (this.cols[this.dataset_id]["Medium"].indexOf(i) != -1)
          return g.slice(0, Math.min(10, g.length));
        return g.slice(0, 4)
      })
      .on("mouseover", function (g) {
        select(".tooltip")
          .style("opacity", 1);
        select(".tooltip").html(() => {
          return g.split("_").join(" ")
        })
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function () {
        select(".tooltip")
          .style("opacity", 0);
      });

  }

  /**
   * Draw the rows of the table
   * url = `/data_api/getAllRows/${this.dataset_id}`
   * url = `/data_api/getClusterByIndex/${this.dataset_id}/${index}`
   * url = `/data_api/getSimilarRowsByIndex/${this.dataset_id}/${index}`
   * url = `/data_api/getInfoByColValue/${this.dataset_id}/${col_name}/${col_value}`
   * arg = cluster/similar_row/info_rows/rows/latest_info
   * @param input dict= {'func': 'init'/'similar'/'cluster'/'update', 'URL': url, 'arg': arg}
   * @returns {Promise<void>}
   */
  private async drawRows(input) {

    let args = await ajax.getAPIJSON(input['URL']);
    let data = (input['func'] == 'init') ? args[input['arg']].slice(0, 20)
      : args[input['arg']];

    let diff = (input['func'] == 'similar') ? args['difference'] : [];

    let rows = this.$node
      .selectAll(".rows")
      .data(data);

    let cells = rows.enter().append("div")
      .classed("rows", true)
      .merge(rows)
      .selectAll(".cells")
      .data((d, i) => {
        let ent = entries(d);
        ent.sort((a, b) => {
          return this.header[this.dataset_id].indexOf(a.key)
            - this.header[this.dataset_id].indexOf(b.key)
        });
        if (input['func'] == 'similar') {
          for (let j = 0; j < ent.length; j++) {
            ent[j]["diff"] = +diff[i][j];
          }
        }
        return ent;
      });

    cells
      .enter().append("div")
      .classed("cells", true)
      .merge(cells)
      .classed("superWideCell", (g, i) => {
        return this.cols[this.dataset_id]["SuperWide"].indexOf(i) != -1
      })
      .classed("wideCell", (g, i) => {
        return this.cols[this.dataset_id]["Wide"].indexOf(i) != -1
      })
      .classed("mediumCell", (g, i) => {
        return this.cols[this.dataset_id]["Medium"].indexOf(i) != -1
      })
      .classed("sameValue", (g) => {
        return input['func'] == 'similar' && g["diff"] == 0
      })
      .classed("lowerValue", (g) => {
        return input['func'] == 'similar' && g["diff"] == -1
      })
      .classed("higherValue", (g) => {
        return input['func'] == 'similar' && g["diff"] == +1
      })
      .html((g) => {
        if (g.key == 'WEIGHT_KG')
          return '<svg width="50" height="20"><path class=\'lineChart\' d></svg>' + g.value
        return g.value
      });

    rows.exit().remove();

    if(input['func'] == 'latest'){
      this.drawLineChart(args['weights'])
    }

  }

  private drawLineChart(data) {

    let scale_weight = scaleLinear()
      .domain([31, 205])
      .range([0, 20]);

    let scale_x = scaleLinear()
      .domain([0, 10])
      .range([0, 50]);

    let lineFn = line()
      .x((d, i) => scale_x(i))
      .y((d) => scale_weight(+d));

    this.$node
      .selectAll(".lineChart")
      .attr('d', (d, i) => lineFn(data[i]));

  }

  private attachListener() {
    events.on("update_table", (evt, item) => {
       let url = `/data_api/getInfoByColValue/${this.dataset_id}/${item[0]}/${item[1]}`;
       let dic = {'func': 'update', 'URL': url, 'arg': 'info_rows'};
       this.drawRows(dic)
    });

    events.on("update_table_similar", (evt, item) => {
      if(this.dataset_id == 'Demo') {
        let url = `/data_api/getSimilarRowsByIndex/${this.dataset_id}/${item[1]}`;
        let dic = {'func': 'similar', 'URL': url, 'arg': 'similar_row'};
        this.drawRows(dic)
      }
    });

    events.on("update_table_cluster", (evt, item) => {
      if(this.dataset_id == 'Demo') {
        let url = `/data_api/getClusterByIndex/${this.dataset_id}/${item[1]}`;
        let dic = {'func': 'cluster', 'URL': url, 'arg': 'cluster'};
        this.drawRows(dic)
      }
    });

    events.on("update_table_latest", () => {
      if(this.dataset_id == 'Demo') {
        let url = `/data_api/getLatestInfo/${this.dataset_id}`;
        let dic = {'func': 'latest', 'URL': url, 'arg': 'latest_info'};
        this.drawRows(dic);
      }
    });

    events.on("update_table_init", () => {
        let url = `/data_api/getAllRows/${this.dataset_id}`;
        let dic = {'func': 'init', 'URL': url, 'arg': 'rows'};
        this.drawRows(dic);
    })
  }

}

export function create(parent:Element) {
  return new SvgTable(parent);
}

