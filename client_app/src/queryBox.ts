/**
 * Created by saharmehrpour on 3/8/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll} from 'd3-selection';
import {values,keys} from 'd3-collection'


export class QueryBox {

  private $node;
  private dataset_id;
  private items;

  constructor(parent:Element) {
    this.$node = select(parent)
      .append("div")
      .classed("queryDiv", true);
  }

  private getData(){
    return new Promise(resolve => {
      let URL = `/data_api/getCol/${this.dataset_id}/artist`;
      Promise.all([ajax.getAPIJSON(URL)])
        .then((args) => {
          this.items = args[0]['artist'];
          resolve(this);
        })
    });
  }

  async searchTable(dataset_id, svg_table){

    this.dataset_id = dataset_id;

    await this.getData();

    let ul = this.$node.append("ul");

    ul.selectAll("li")
      .data(values(this.items))
      .enter()
      .append("li")
      .html((d)=>d)
      .on("click", function (d) {
          svg_table.updateTable(d);
      });

  }


}

export function create(parent:Element) {
  return new QueryBox(parent);
}

