/**
 * Created by saharmehrpour on 3/8/17.
 */
import * as tslib_1 from "tslib";
//import * as ajax from 'phovea_core/src/ajax';
import { select } from 'd3-selection';
//import {values,keys} from 'd3-collection'
import * as events from 'phovea_core/src/event';
var QueryBox = (function () {
    function QueryBox(parent, dataset_id) {
        var _this = this;
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
            .on("click", function () { return _this.updateTableCluster(); });
        this.$node.append("input")
            .attr("type", "button")
            .attr("value", "similar")
            .on("click", function () { return _this.updateTableSimilar(); });
        this.$text = this.$node.append("input")
            .attr("type", "text")
            .attr("placeholder", "Search PAT_ID")
            .attr("id", "text_pat_id");
        this.$node.append("input")
            .attr("type", "button")
            .attr("value", "All Info")
            .on("click", function () { return _this.updateTableInfo(); });
        this.$node.append("p")
            .text("A good example is 6790018");
    }
    QueryBox.prototype.updateTableCluster = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var value;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        value = document.getElementById("text").value;
                        if (!!isNaN(+value)) return [3 /*break*/, 2];
                        this.setBusy(true);
                        return [4 /*yield*/, this.svg_table1.updateTableCluster(value)];
                    case 1:
                        _a.sent();
                        this.setBusy(false);
                        return [3 /*break*/, 3];
                    case 2:
                        console.log("Not a Number");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    QueryBox.prototype.updateTableSimilar = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var value;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        value = document.getElementById("text").value;
                        if (!!isNaN(+value)) return [3 /*break*/, 2];
                        this.setBusy(true);
                        return [4 /*yield*/, this.svg_table1.updateTableSimilar(value)];
                    case 1:
                        _a.sent();
                        this.setBusy(false);
                        return [3 /*break*/, 3];
                    case 2:
                        console.log("Not a Number");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    QueryBox.prototype.updateTableInfo = function () {
        var value = document.getElementById("text_pat_id").value;
        if (!isNaN(+value))
            events.fire('update_table', ['PAT_ID', value]);
        else
            console.log("Not a Number");
    };
    QueryBox.prototype.set_svg_table = function (svg_table1, svg_table2, svg_table3, svg_table4) {
        this.svg_table1 = svg_table1;
        this.svg_table2 = svg_table2;
        this.svg_table3 = svg_table3;
        this.svg_table4 = svg_table4;
    };
    QueryBox.prototype.setBusy = function (isBusy) {
        select('.busy').classed('hidden', !isBusy);
    };
    return QueryBox;
}());
export { QueryBox };
export function create(parent, dataset_id) {
    return new QueryBox(parent, dataset_id);
}
//# sourceMappingURL=queryBox.js.map