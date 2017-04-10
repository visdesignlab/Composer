/**
 * Created by saharmehrpour on 3/8/17.
 */
import * as tslib_1 from "tslib";
import * as ajax from 'phovea_core/src/ajax';
import { select, event } from 'd3-selection';
import { entries } from 'd3-collection';
//import {transition} from 'd3-transition';
import * as events from 'phovea_core/src/event';
import { Constants } from './constants';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
var SvgTable = (function () {
    function SvgTable(parent) {
        this.cols = Constants.cols;
        this.header = Constants.header;
        this.$node = select(parent)
            .append("div")
            .classed("tableDiv", true);
        this.attachListener();
    }
    SvgTable.prototype.drawTable = function (dataset_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url, dic;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.dataset_id = dataset_id;
                        this.drawHeader();
                        url = "/data_api/getAllRows/" + this.dataset_id;
                        dic = { 'func': 'init', 'URL': url, 'arg': 'rows' };
                        return [4 /*yield*/, this.drawRows(dic)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Draw the header of the table
     */
    SvgTable.prototype.drawHeader = function () {
        var _this = this;
        var header = this.$node
            .selectAll(".header")
            .data([1]);
        header.enter().append("div")
            .classed("header", true)
            .merge(header)
            .selectAll(".headercells")
            .data(this.header[this.dataset_id]) // changed!
            .enter().append("div")
            .classed("headercells", true)
            .classed("superWideCell", function (g, i) {
            return _this.cols[_this.dataset_id]["SuperWide"].indexOf(i) != -1;
        })
            .classed("wideCell", function (g, i) {
            return _this.cols[_this.dataset_id]["Wide"].indexOf(i) != -1;
        })
            .classed("mediumCell", function (g, i) {
            return _this.cols[_this.dataset_id]["Medium"].indexOf(i) != -1;
        })
            .html(function (g, i) {
            if (_this.cols[_this.dataset_id]["SuperWide"].indexOf(i) != -1)
                return g;
            if (_this.cols[_this.dataset_id]["Wide"].indexOf(i) != -1)
                return g;
            if (_this.cols[_this.dataset_id]["Medium"].indexOf(i) != -1)
                return g.slice(0, Math.min(10, g.length));
            return g.slice(0, 4);
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
    };
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
    SvgTable.prototype.drawRows = function (input) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var args, data, diff, rows, cells;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ajax.getAPIJSON(input['URL'])];
                    case 1:
                        args = _a.sent();
                        data = (input['func'] == 'init') ? args[input['arg']].slice(0, 20)
                            : args[input['arg']];
                        diff = (input['func'] == 'similar') ? args['difference'] : [];
                        rows = this.$node
                            .selectAll(".rows")
                            .data(data);
                        cells = rows.enter().append("div")
                            .classed("rows", true)
                            .merge(rows)
                            .selectAll(".cells")
                            .data(function (d, i) {
                            var ent = entries(d);
                            ent.sort(function (a, b) {
                                return _this.header[_this.dataset_id].indexOf(a.key)
                                    - _this.header[_this.dataset_id].indexOf(b.key);
                            });
                            if (input['func'] == 'similar') {
                                for (var j = 0; j < ent.length; j++) {
                                    ent[j]["diff"] = +diff[i][j];
                                }
                            }
                            return ent;
                        });
                        cells
                            .enter().append("div")
                            .classed("cells", true)
                            .merge(cells)
                            .classed("superWideCell", function (g, i) {
                            return _this.cols[_this.dataset_id]["SuperWide"].indexOf(i) != -1;
                        })
                            .classed("wideCell", function (g, i) {
                            return _this.cols[_this.dataset_id]["Wide"].indexOf(i) != -1;
                        })
                            .classed("mediumCell", function (g, i) {
                            return _this.cols[_this.dataset_id]["Medium"].indexOf(i) != -1;
                        })
                            .classed("sameValue", function (g) {
                            return input['func'] == 'similar' && g["diff"] == 0;
                        })
                            .classed("lowerValue", function (g) {
                            return input['func'] == 'similar' && g["diff"] == -1;
                        })
                            .classed("higherValue", function (g) {
                            return input['func'] == 'similar' && g["diff"] == +1;
                        })
                            .html(function (g) {
                            if (g.key == 'WEIGHT_KG')
                                return '<svg width="50" height="20"><path class=\'lineChart\' d></svg>' + g.value;
                            return g.value;
                        });
                        rows.exit().remove();
                        if (input['func'] == 'latest') {
                            this.drawLineChart(args['weights']);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SvgTable.prototype.drawLineChart = function (data) {
        var scale_weight = scaleLinear()
            .domain([31, 205])
            .range([0, 20]);
        var scale_x = scaleLinear()
            .domain([0, 10])
            .range([0, 50]);
        var lineFn = line()
            .x(function (d, i) { return scale_x(i); })
            .y(function (d) { return scale_weight(+d); });
        this.$node
            .selectAll(".lineChart")
            .attr('d', function (d, i) { return lineFn(data[i]); });
    };
    SvgTable.prototype.attachListener = function () {
        var _this = this;
        events.on("update_table", function (evt, item) {
            var url = "/data_api/getInfoByColValue/" + _this.dataset_id + "/" + item[0] + "/" + item[1];
            var dic = { 'func': 'update', 'URL': url, 'arg': 'info_rows' };
            _this.drawRows(dic);
        });
        events.on("update_table_similar", function (evt, item) {
            if (_this.dataset_id == 'Demo') {
                var url = "/data_api/getSimilarRowsByIndex/" + _this.dataset_id + "/" + item[1];
                var dic = { 'func': 'similar', 'URL': url, 'arg': 'similar_row' };
                _this.drawRows(dic);
            }
        });
        events.on("update_table_cluster", function (evt, item) {
            if (_this.dataset_id == 'Demo') {
                var url = "/data_api/getClusterByIndex/" + _this.dataset_id + "/" + item[1];
                var dic = { 'func': 'cluster', 'URL': url, 'arg': 'cluster' };
                _this.drawRows(dic);
            }
        });
        events.on("update_table_latest", function () {
            if (_this.dataset_id == 'Demo') {
                var url = "/data_api/getLatestInfo/" + _this.dataset_id;
                var dic = { 'func': 'latest', 'URL': url, 'arg': 'latest_info' };
                _this.drawRows(dic);
            }
        });
        events.on("update_table_init", function () {
            var url = "/data_api/getAllRows/" + _this.dataset_id;
            var dic = { 'func': 'init', 'URL': url, 'arg': 'rows' };
            _this.drawRows(dic);
        });
    };
    return SvgTable;
}());
export { SvgTable };
export function create(parent) {
    return new SvgTable(parent);
}
//# sourceMappingURL=svgTable.js.map