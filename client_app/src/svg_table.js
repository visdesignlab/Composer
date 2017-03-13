/**
 * Created by saharmehrpour on 3/8/17.
 */
import * as tslib_1 from "tslib";
import * as ajax from 'phovea_core/src/ajax';
import { select } from 'd3-selection';
import { values, keys, entries } from 'd3-collection';
var SvgTable = (function () {
    function SvgTable(parent) {
        this.$node = select(parent)
            .append("div")
            .classed("tableDiv", true);
    }
    // TODO find the problem!
    SvgTable.prototype.getData = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var URL = "/data_api/getAllRows/" + _this.dataset_id;
            //let URL2 = `/data_api/getColTitles/${this.dataset_id}`;
            Promise.all([ajax.getAPIJSON(URL) //,ajax.getAPIJSON(URL2)
            ])
                .then(function (args) {
                //console.log(args[0]);
                _this.rows = args[0]['aslist'];
                _this.columns = keys(args[0]['aslist'][0]); //args[1]['columns'];
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
                            .data(this.columns)
                            .enter().append("div")
                            .classed("headercells", true)
                            .html(function (g) { return g; });
                        rows = this.$node
                            .selectAll(".rows")
                            .data(this.rows);
                        rows.enter().append("div")
                            .classed("rows", true)
                            .merge(rows)
                            .on("click", function (d) {
                            _this.findSimilar(d['index']);
                            //console.log(d);
                        })
                            .selectAll(".cells")
                            .data(function (d) {
                            return values(d);
                        })
                            .enter().append("div")
                            .classed("cells", true)
                            .html(function (g) { return g; });
                        return [2 /*return*/];
                }
            });
        });
    };
    SvgTable.prototype.updateTable = function (artist_name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var URL;
            return tslib_1.__generator(this, function (_a) {
                URL = "/data_api/getRowByColValue/" + this.dataset_id + "/" + 'artist' + "/" + artist_name;
                Promise.all([ajax.getAPIJSON(URL)])
                    .then(function (args) {
                    //console.log(args[0]["similar_rows"]);
                    var rows = _this.$node
                        .selectAll(".rows")
                        .data(args[0]["similar_rows"]);
                    var cells = rows.enter().append("div")
                        .classed("rows", true)
                        .merge(rows)
                        .selectAll(".cells")
                        .data(function (d) { return entries(d); });
                    cells
                        .enter().append("div")
                        .classed("cells", true)
                        .merge(cells)
                        .html(function (g) { return g.value; });
                    rows.exit().remove();
                });
                return [2 /*return*/];
            });
        });
    };
    SvgTable.prototype.findSimilar = function (index) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var URL;
            return tslib_1.__generator(this, function (_a) {
                URL = "/data_api/getSimilarRowsByIndex/" + this.dataset_id + "/" + index;
                Promise.all([ajax.getAPIJSON(URL)])
                    .then(function (args) {
                    console.log(args[0]["similar_rows"]);
                    console.log(args[0]['cols']);
                    var rows = _this.$node
                        .selectAll(".rows")
                        .data(args[0]["similar_rows"]);
                    var cells = rows.enter().append("div")
                        .classed("rows", true)
                        .merge(rows)
                        .selectAll(".cells")
                        .data(function (d) { return entries(d); });
                    cells
                        .enter().append("div")
                        .classed("cells", true)
                        .merge(cells)
                        .html(function (g) { return g.value; });
                    rows.exit().remove();
                });
                return [2 /*return*/];
            });
        });
    };
    return SvgTable;
}());
export { SvgTable };
export function create(parent) {
    return new SvgTable(parent);
}
//# sourceMappingURL=svg_table.js.map