/**
 * Created by saharmehrpour on 3/8/17.
 */

//import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll} from 'd3-selection';
//import {values,keys} from 'd3-collection'
import * as events from 'phovea_core/src/event';

export class QueryBox {

  private $node;
  private dataset_id;
  private svg_table1;
  private svg_table2;
  private svg_table3;
  private svg_table4;
  private $text;

  constructor(parent: Element, dataset_id) {

    this.dataset_id = dataset_id;

    this.$node = select(parent)
      .append("div")
      .classed("queryDiv", true);

    this.$text = this.$node.append("input")
      .attr("type", "text")
      .attr("placeholder", "Search Index")
      .attr("id", "text");

    this.$node.append("input")
      .attr("type", "button")
      .attr("value", "cluster")
      .on("click", () => this.updateTableCluster());

    this.$node.append("input")
      .attr("type", "button")
      .attr("value", "similar")
      .on("click", () => this.updateTableSimilar());

    this.$text = this.$node.append("input")
      .attr("type", "text")
      .attr("placeholder", "Search PAT_ID")
      .attr("id", "text_pat_id");

    this.$node.append("input")
      .attr("type", "button")
      .attr("value", "All Info")
      .on("click", () => this.updateTableInfo());

    this.$node.append("p")
      .text("A good example is 6790018");

  }

  async updateTableCluster() {

    let value = (<HTMLInputElement>document.getElementById("text")).value;
    if (!isNaN(+value)) {
      this.setBusy(true);
      await this.svg_table1.updateTableCluster(value);
      this.setBusy(false);
    }
    else
      console.log("Not a Number");

  }

  async updateTableSimilar() {

    let value = (<HTMLInputElement>document.getElementById("text")).value;
    if (!isNaN(+value)) {
      this.setBusy(true);
      await this.svg_table1.updateTableSimilar(value);
      this.setBusy(false);
    }
    else
      console.log("Not a Number");

  }

  updateTableInfo() {
    let value = (<HTMLInputElement>document.getElementById("text_pat_id")).value;
    if (!isNaN(+value))
      events.fire('update_table', ['PAT_ID', value]);
    else
      console.log("Not a Number");
  }

  set_svg_table(svg_table1, svg_table2, svg_table3, svg_table4) {
    this.svg_table1 = svg_table1;
    this.svg_table2 = svg_table2;
    this.svg_table3 = svg_table3;
    this.svg_table4 = svg_table4;
  }

  setBusy(isBusy : boolean) {
    select('.busy').classed('hidden', !isBusy);
  }

}

export function create(parent:Element, dataset_id) {
  return new QueryBox(parent, dataset_id);
}

