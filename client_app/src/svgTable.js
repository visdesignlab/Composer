/**
 * Created by saharmehrpour on 3/8/17.
 */
import * as tslib_1 from "tslib";
import * as ajax from 'phovea_core/src/ajax';
import { select, event } from 'd3-selection';
import { entries } from 'd3-collection';
//import {transition} from 'd3-transition';
import * as events from 'phovea_core/src/event';
var SvgTable = (function () {
    function SvgTable(parent) {
        this.cols = {
            "Demo": { "Wide": [5, 7, 16, 17, 19, 20, 21], "Medium": [0, 1, 2, 8, 10, 15] },
            "PRO": { "Wide": [3, 5], "Medium": [0, 1, 2, 6] },
            "PT": { "Wide": [2, 4], "Medium": [0, 1, 3] },
            "VAS": { "Wide": [], "Medium": [0, 1, 2, 3] },
            "Codes": { "Wide": [], "Medium": [0] }
        };
        this.header = {
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
        this.$node = select(parent)
            .append("div")
            .classed("tableDiv", true);
        this.attachListener();
    }
    SvgTable.prototype.getData = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var URL = "/data_api/getAllRows/" + _this.dataset_id;
            Promise.all([ajax.getAPIJSON(URL)])
                .then(function (args) {
                _this.rows = args[0]['rows'].slice(0, 20);
                resolve(_this);
            });
        });
    };
    SvgTable.prototype.drawTable = function (dataset_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var header, rows;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.dataset_id = dataset_id;
                        return [4 /*yield*/, this.getData()];
                    case 1:
                        _a.sent();
                        header = this.$node
                            .selectAll(".header")
                            .data([1]);
                        header.enter().append("div")
                            .classed("header", true)
                            .merge(header)
                            .selectAll(".headercells")
                            .data(this.header[this.dataset_id]) // changed!
                            .enter().append("div")
                            .classed("headercells", true)
                            .classed("wideCell", function (g, i) {
                            return _this.cols[_this.dataset_id]["Wide"].indexOf(i) != -1;
                        })
                            .classed("mediumCell", function (g, i) {
                            return _this.cols[_this.dataset_id]["Medium"].indexOf(i) != -1;
                        })
                            .html(function (g, i) {
                            if (_this.cols[_this.dataset_id]["Wide"].indexOf(i) == -1) {
                                if (_this.cols[_this.dataset_id]["Medium"].indexOf(i) == -1)
                                    return g.slice(0, 4);
                                return g.slice(0, Math.min(10, g.length));
                            }
                            return g;
                        })
                            .on("mouseover", function (g) {
                            select(".tooltip")
                                .style("opacity", 1);
                            select(".tooltip").html(function () {
                                return g.split("_").join(" ");
                            })
                                .style("left", (event.pageX) + "px")
                                .style("top", (event.pageY - 28) + "px");
                        })
                            .on("mouseout", function () {
                            select(".tooltip")
                                .style("opacity", 0);
                        });
                        rows = this.$node
                            .selectAll(".rows")
                            .data(this.rows);
                        rows.enter().append("div")
                            .classed("rows", true)
                            .merge(rows)
                            .selectAll(".cells")
                            .data(function (d) {
                            var ent = entries(d);
                            ent.sort(function (a, b) {
                                return _this.header[_this.dataset_id].indexOf(a.key)
                                    - _this.header[_this.dataset_id].indexOf(b.key);
                            });
                            return ent;
                        })
                            .enter().append("div")
                            .classed("cells", true)
                            .classed("wideCell", function (g, i) {
                            return _this.cols[_this.dataset_id]["Wide"].indexOf(i) != -1;
                        })
                            .classed("mediumCell", function (g, i) {
                            return _this.cols[_this.dataset_id]["Medium"].indexOf(i) != -1;
                        })
                            .html(function (g) { return g.value; });
                        return [2 /*return*/];
                }
            });
        });
    };
    SvgTable.prototype.updateTableCluster = function (index) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var URL, args, rows, cells;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        URL = "/data_api/getClusterByIndex/" + this.dataset_id + "/" + index;
                        return [4 /*yield*/, ajax.getAPIJSON(URL)];
                    case 1:
                        args = _a.sent();
                        console.log(args);
                        rows = this.$node
                            .selectAll(".rows")
                            .data(args["cluster"]);
                        cells = rows.enter().append("div")
                            .classed("rows", true)
                            .merge(rows)
                            .selectAll(".cells")
                            .data(function (d) {
                            var ent = entries(d);
                            ent.sort(function (a, b) {
                                return _this.header[_this.dataset_id].indexOf(a.key)
                                    - _this.header[_this.dataset_id].indexOf(b.key);
                            });
                            return ent;
                        });
                        cells
                            .enter().append("div")
                            .classed("cells", true)
                            .merge(cells)
                            .classed("wideCell", function (g, i) {
                            return _this.cols[_this.dataset_id]["Wide"].indexOf(i) != -1;
                        })
                            .classed("mediumCell", function (g, i) {
                            return _this.cols[_this.dataset_id]["Medium"].indexOf(i) != -1;
                        })
                            .classed("sameValue", false)
                            .classed("lowerValue", false)
                            .classed("higherValue", false)
                            .html(function (g) { return g.value; });
                        rows.exit().remove();
                        return [2 /*return*/];
                }
            });
        });
    };
    SvgTable.prototype.updateTableSimilar = function (index) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var URL, args, diff, rows, cells;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        URL = "/data_api/getSimilarRowsByIndex/" + this.dataset_id + "/" + index;
                        return [4 /*yield*/, ajax.getAPIJSON(URL)];
                    case 1:
                        args = _a.sent();
                        console.log(args);
                        diff = args['difference'];
                        rows = this.$node
                            .selectAll(".rows")
                            .data(args["similar_rows"]);
                        cells = rows.enter().append("div")
                            .classed("rows", true)
                            .merge(rows)
                            .selectAll(".cells")
                            .data(function (d, i) {
                            var dd = entries(d);
                            dd.sort(function (a, b) {
                                return _this.header[_this.dataset_id].indexOf(a.key)
                                    - _this.header[_this.dataset_id].indexOf(b.key);
                            });
                            for (var j = 0; j < dd.length; j++) {
                                dd[j]["diff"] = +diff[i][j];
                            }
                            return dd;
                        });
                        cells
                            .enter().append("div")
                            .classed("cells", true)
                            .merge(cells)
                            .classed("wideCell", function (g, i) {
                            return _this.cols[_this.dataset_id]["Wide"].indexOf(i) != -1;
                        })
                            .classed("mediumCell", function (g, i) {
                            return _this.cols[_this.dataset_id]["Medium"].indexOf(i) != -1;
                        })
                            .classed("sameValue", function (g) {
                            return g["diff"] == 0;
                        })
                            .classed("lowerValue", function (g) {
                            return g["diff"] == -1;
                        })
                            .classed("higherValue", function (g) {
                            return g["diff"] == +1;
                        })
                            .html(function (g) { return g.value; });
                        rows.exit().remove();
                        return [2 /*return*/];
                }
            });
        });
    };
    SvgTable.prototype.updateTableInfo = function (col_name, col_value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var URL, args, rows, cells;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("loading " + this.dataset_id);
                        URL = "/data_api/getInfoByColValue/" + this.dataset_id + "/" + col_name + "/" + col_value;
                        return [4 /*yield*/, ajax.getAPIJSON(URL)];
                    case 1:
                        args = _a.sent();
                        rows = this.$node
                            .selectAll(".rows")
                            .data(args["info_rows"]);
                        cells = rows.enter().append("div")
                            .classed("rows", true)
                            .merge(rows)
                            .selectAll(".cells")
                            .data(function (d) {
                            var ent = entries(d);
                            ent.sort(function (a, b) {
                                return _this.header[_this.dataset_id].indexOf(a.key)
                                    - _this.header[_this.dataset_id].indexOf(b.key);
                            });
                            return ent;
                        });
                        cells
                            .enter().append("div")
                            .classed("cells", true)
                            .merge(cells)
                            .classed("wideCell", function (g, i) {
                            return _this.cols[_this.dataset_id]["Wide"].indexOf(i) != -1;
                        })
                            .classed("mediumCell", function (g, i) {
                            return _this.cols[_this.dataset_id]["Medium"].indexOf(i) != -1;
                        })
                            .classed("sameValue", false)
                            .classed("lowerValue", false)
                            .classed("higherValue", false)
                            .html(function (g) { return g.value; });
                        rows.exit().remove();
                        return [2 /*return*/];
                }
            });
        });
    };
    SvgTable.prototype.attachListener = function () {
        var _this = this;
        events.on("update_table", function (evt, item) {
            _this.updateTableInfo(item[0], item[1]);
        });
    };
    return SvgTable;
}());
export { SvgTable };
export function create(parent) {
    return new SvgTable(parent);
}
//# sourceMappingURL=svgTable.js.map