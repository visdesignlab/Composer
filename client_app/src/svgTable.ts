/**
 * Created by saharmehrpour on 3/8/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll, event} from 'd3-selection';
import {values,keys,entries} from 'd3-collection';
//import {transition} from 'd3-transition';
import * as events from 'phovea_core/src/event';

export class SvgTable {

  private $node;
  dataset_id;
  private rows;
  private cols = {
    "Demo": {"Wide": [5, 7, 16, 17, 19, 20, 21], "Medium": [0, 1, 2, 8, 10, 15]},
    "PRO": {"Wide": [3, 5], "Medium": [0, 1, 2, 6]},
    "PT": {"Wide": [2, 4], "Medium": [0, 1, 3]},
    "VAS": {"Wide": [], "Medium": [0, 1, 2, 3]},
    "Codes": {"Wide": [], "Medium": [0]}
  };
  private header = {
    "Demo": ["PAT_ID", "VISIT_NO", "PAT_BIRTHDATE", "PAT_GENDER", "PAT_ETHNICITY",
      "D_ETHNICITY_DESC", "PAT_RACE", "D_RACE_DESC", "PAT_ZIP", "PAT_MARITAL_STAT",
      "PAT_DEATH_DATE", "PAT_DEATH_IND", "BMI", "HEIGHT_CM", "WEIGHT_KG", "VISIT_NO_1",
      "ADM_DATE", "DSCH_DATE", "ATT_PROV_ID", "ATT_PROV_FULLNAME", "INS_PAY_CAT",
      "INS_PAY_GRP", "TOBACCO_USER", "ALCOHOL_USER", "ILLICIT_DRUG_USER"],
    "PRO": ["PAT_ID", "VISIT_NO", "ASSESSMENT_ID", "ASSESSMENT_START_DTM", "FORM_ID",
      "FORM", "SCORE"],
    "PT": ["PAT_ID", "VISIT_NO", "ADM_DATE", "PAT_UNIT", "UNIT_NAME"],
    "VAS": ["PAT_ID", "VISIT_NO", "FSD_ID", "RECORDED_TIME", "VAS_NECK", "VAS_ARM"],
    "Codes": ["PAT_ID", "VISIT_NO", "PROC_DTM", "DM_CODE", "INJ_CODE", "SURGERY_CODE",
      "ICD_1", "ICD_2", "ICD_3", "ICD_4", "ICD_5", "ICD_6", "ICD_7", "ICD_8", "ICD_9",
      "ICD_10", "CPT_1", "CPT_2", "CPT_3", "CPT_4", "CPT_5", "CPT_6", "CPT_7", "CPT_8",
      "CPT_9", "CPT_10",]
  };

  constructor(parent: Element) {
    this.$node = select(parent)
      .append("div")
      .classed("tableDiv", true);
    this.attachListener();
  }

  private getData() {
    return new Promise(resolve => {
      let URL = `/data_api/getAllRows/${this.dataset_id}`;
      Promise.all([ajax.getAPIJSON(URL)])
        .then((args) => {
          this.rows = args[0]['rows'].slice(0, 20);
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
      .data(this.header[this.dataset_id]) // changed!
      .enter().append("div")
      .classed("headercells", true)
      .classed("wideCell", (g, i) => {
        return this.cols[this.dataset_id]["Wide"].indexOf(i) != -1
      })
      .classed("mediumCell", (g, i) => {
        return this.cols[this.dataset_id]["Medium"].indexOf(i) != -1
      })
      .html((g, i) => {
        if (this.cols[this.dataset_id]["Wide"].indexOf(i) == -1) {
          if (this.cols[this.dataset_id]["Medium"].indexOf(i) == -1)
            return g.slice(0, 4);
          return g.slice(0, Math.min(10, g.length));
        }
        return g
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

    let rows = this.$node
      .selectAll(".rows")
      .data(this.rows);

    rows.enter().append("div")
      .classed("rows", true)
      .merge(rows)
      .selectAll(".cells")
      .data((d) => {
        let ent = entries(d);
        ent.sort((a, b) => {
          return this.header[this.dataset_id].indexOf(a.key)
            - this.header[this.dataset_id].indexOf(b.key)
        });
        return ent;
      })
      .enter().append("div")
      .classed("cells", true)
      .classed("wideCell", (g, i) => {
        return this.cols[this.dataset_id]["Wide"].indexOf(i) != -1
      })
      .classed("mediumCell", (g, i) => {
        return this.cols[this.dataset_id]["Medium"].indexOf(i) != -1
      })
      .html((g) => g.value);

  }

  async updateTableCluster(index) {
    let URL = `/data_api/getClusterByIndex/${this.dataset_id}/${index}`;
    let args = await ajax.getAPIJSON(URL);
    console.log(args);

    let rows = this.$node
      .selectAll(".rows")
      .data(args["cluster"]);

    let cells = rows.enter().append("div")
      .classed("rows", true)
      .merge(rows)
      .selectAll(".cells")
      .data((d) => {
        let ent = entries(d);
        ent.sort((a, b) => {
          return this.header[this.dataset_id].indexOf(a.key)
            - this.header[this.dataset_id].indexOf(b.key)
        });
        return ent;
      });

    cells
      .enter().append("div")
      .classed("cells", true)
      .merge(cells)
      .classed("wideCell", (g, i) => {
        return this.cols[this.dataset_id]["Wide"].indexOf(i) != -1
      })
      .classed("mediumCell", (g, i) => {
        return this.cols[this.dataset_id]["Medium"].indexOf(i) != -1
      })
      .classed("sameValue", false)
      .classed("lowerValue", false)
      .classed("higherValue", false)
      .html((g) => g.value);

    rows.exit().remove();
  }

  async updateTableSimilar(index) {
    let URL = `/data_api/getSimilarRowsByIndex/${this.dataset_id}/${index}`;

    let args = await ajax.getAPIJSON(URL);
    console.log(args);
    let diff = args['difference'];

    let rows = this.$node
      .selectAll(".rows")
      .data(args["similar_rows"]);

    let cells = rows.enter().append("div")
      .classed("rows", true)
      .merge(rows)
      .selectAll(".cells")
      .data((d, i) => {
        let dd = entries(d);
        dd.sort((a, b) => {
          return this.header[this.dataset_id].indexOf(a.key)
            - this.header[this.dataset_id].indexOf(b.key)
        });
        for (let j = 0; j < dd.length; j++) {
          dd[j]["diff"] = +diff[i][j];
        }
        return dd
      });

    cells
      .enter().append("div")
      .classed("cells", true)
      .merge(cells)
      .classed("wideCell", (g, i) => {
        return this.cols[this.dataset_id]["Wide"].indexOf(i) != -1
      })
      .classed("mediumCell", (g, i) => {
        return this.cols[this.dataset_id]["Medium"].indexOf(i) != -1
      })
      .classed("sameValue", (g) => {
        return g["diff"] == 0
      })
      .classed("lowerValue", (g) => {
        return g["diff"] == -1
      })
      .classed("higherValue", (g) => {
        return g["diff"] == +1
      })
      .html((g) => g.value);

    rows.exit().remove();
  }

  async updateTableInfo(col_name, col_value) {

    console.log("loading "+ this.dataset_id);

    let URL = `/data_api/getInfoByColValue/${this.dataset_id}/${col_name}/${col_value}`;

    let args = await ajax.getAPIJSON(URL);
    //console.log(args);

    let rows = this.$node
      .selectAll(".rows")
      .data(args["info_rows"]);

    let cells = rows.enter().append("div")
      .classed("rows", true)
      .merge(rows)
      .selectAll(".cells")
      .data((d) => {
        let ent = entries(d);
        ent.sort((a, b) => {
          return this.header[this.dataset_id].indexOf(a.key)
            - this.header[this.dataset_id].indexOf(b.key)
        });
        return ent;
      });

    cells
      .enter().append("div")
      .classed("cells", true)
      .merge(cells)
      .classed("wideCell", (g, i) => {
        return this.cols[this.dataset_id]["Wide"].indexOf(i) != -1
      })
      .classed("mediumCell", (g, i) => {
        return this.cols[this.dataset_id]["Medium"].indexOf(i) != -1
      })
      .classed("sameValue", false)
      .classed("lowerValue", false)
      .classed("higherValue", false)
      .html((g) => g.value);

    rows.exit().remove();

  }

  private attachListener() {
    events.on("update_table", (evt, item) => {
      this.updateTableInfo(item[0], item[1]);
    })
  }

}

export function create(parent:Element) {
  return new SvgTable(parent);
}

