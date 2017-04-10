/**
 * Created by saharmehrpour on 4/3/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll, event} from 'd3-selection';
import {values,keys,entries} from 'd3-collection';
import {type} from 'os';
//import {transition} from 'd3-transition';

export class SideBar {

  private $node;

  private header = {
    "Demo": ["PAT_BIRTHDATE", "PAT_GENDER", "PAT_ETHNICITY", "D_ETHNICITY_DESC",
      "PAT_RACE", "D_RACE_DESC", "PAT_MARITAL_STAT", "PAT_DEATH_IND", "BMI",
      "HEIGHT_CM", "WEIGHT_KG", "ADM_DATE", "DSCH_DATE", "TOBACCO_USER",
      "ALCOHOL_USER", "ILLICIT_DRUG_USER"]
  };

  constructor(parent: Element) {
    this.$node = select(parent);
  }

  async init() {

    let URL = `/data_api/getWeights/Demo`;
    let args = await ajax.getAPIJSON(URL);
    let weights = args["weights"];

    this.$node.selectAll(".item").data(this.header["Demo"])
      .enter()
      .append("div")
      .classed("item", true);

    this.$node.selectAll(".item")
      .html((d) => {
        return `<input type="text" placeholder="Weight" size="8" id="weight_` + d
          + `" value="` + weights[d] + `">`
          + `&nbsp;` + d
      });

    this.$node.append("input")
      .attr("type", "button")
      .attr("value", "Update")
      .on("click", () => this.updateWeights());
  }

  async updateWeights() {

    let temp_value = (<HTMLInputElement>document.getElementById("weight_PAT_GENDER"))
      .value;

    if (isNaN(+temp_value)) {
      console.log("error in weight_PAT_GENDER");
      return
    }

    let temp_weights = (+temp_value).toString();

    for (let counter = 1; counter < this.header["Demo"].length; counter++) {
      let temp_id = "weight_" + this.header["Demo"][counter];
      temp_value = (<HTMLInputElement>document.getElementById(temp_id)).value;

      if (isNaN(+temp_value)) {
        console.log("error in " + temp_id);
        return
      }

      temp_weights = temp_weights + `+` + (+temp_value.toString())
    }

    let URL = `/data_api/updateWeights/Demo/` + temp_weights;
    let args = await ajax.getAPIJSON(URL);
    let weights = args["weights"];

    console.log(URL);
    console.log("Weights are updated.")

  }

}

export function create(parent:Element) {
  return new SideBar(parent);
}

