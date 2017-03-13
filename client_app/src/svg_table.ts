/**
 * Created by saharmehrpour on 3/8/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll} from 'd3-selection';
import {values,keys,entries} from 'd3-collection'


export class SvgTable {

  private $node;
  private dataset_id;
  private rows;
  private columns;

  constructor(parent: Element) {
    this.$node = select(parent)
      .append("div")
      .classed("tableDiv", true);
  }

  // TODO find the problem!
  private getData() {
    return new Promise(resolve => {
      let URL = `/data_api/getAllRows/${this.dataset_id}`;
      //let URL2 = `/data_api/getColTitles/${this.dataset_id}`;
      Promise.all([ajax.getAPIJSON(URL)//,ajax.getAPIJSON(URL2)
      ])
        .then((args) => {

        //console.log(args[0]);

          this.rows = args[0]['aslist'];
          this.columns = keys(args[0]['aslist'][0]);//args[1]['columns'];
          resolve(this);
        })
    });
  }

  async drawTable(dataset_id) {
    this.dataset_id = dataset_id;

    await this.getData();

    let header = this.$node
      .selectAll(".header")
      .data([1]);

    header.enter().append("div")
      .classed("header", true)
      .merge(header)
      .selectAll(".headercells")
      .data(this.columns)
      .enter().append("div")
      .classed("headercells", true)
      .html((g) => g);

    let rows = this.$node
      .selectAll(".rows")
      .data(this.rows);

    rows.enter().append("div")
      .classed("rows", true)
      .merge(rows)
      .on("click", (d) => {
         this.findSimilar(d['index']);
        //console.log(d);
      })
      .selectAll(".cells")
      .data((d) => {
        return values(d);
      })
      .enter().append("div")
      .classed("cells", true)
      .html((g) => g);

  }

  async updateTable(artist_name: string) {
    let URL = `/data_api/getRowByColValue/${this.dataset_id}/${'artist'}/${artist_name}`;
    Promise.all([ajax.getAPIJSON(URL)])
      .then((args) => {

      //console.log(args[0]["similar_rows"]);

        let rows = this.$node
          .selectAll(".rows")
          .data(args[0]["similar_rows"]);

        let cells = rows.enter().append("div")
          .classed("rows", true)
          .merge(rows)
          .selectAll(".cells")
          .data((d) => entries(d));

        cells
          .enter().append("div")
          .classed("cells", true)
          .merge(cells)
          .html((g) => g.value);

        rows.exit().remove();

      })
  }

  async findSimilar(index) {
      let URL = `/data_api/getSimilarRowsByIndex/${this.dataset_id}/${index}`;
    Promise.all([ajax.getAPIJSON(URL)])
      .then((args) => {

      console.log(args[0]["similar_rows"]);
      console.log(args[0]['cols']);

        let rows = this.$node
          .selectAll(".rows")
          .data(args[0]["similar_rows"]);

        let cells = rows.enter().append("div")
          .classed("rows", true)
          .merge(rows)
          .selectAll(".cells")
          .data((d) => entries(d));

        cells
          .enter().append("div")
          .classed("cells", true)
          .merge(cells)
          .html((g) => g.value);

        rows.exit().remove();

      })
  }

}

export function create(parent:Element) {
  return new SvgTable(parent);
}

