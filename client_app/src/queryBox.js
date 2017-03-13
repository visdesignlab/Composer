/**
 * Created by saharmehrpour on 3/8/17.
 */
import * as tslib_1 from "tslib";
import * as ajax from 'phovea_core/src/ajax';
import { select } from 'd3-selection';
import { values } from 'd3-collection';
var QueryBox = (function () {
    function QueryBox(parent) {
        this.$node = select(parent)
            .append("div")
            .classed("queryDiv", true);
    }
    QueryBox.prototype.getData = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var URL = "/data_api/getCol/" + _this.dataset_id + "/artist";
            Promise.all([ajax.getAPIJSON(URL)])
                .then(function (args) {
                _this.items = args[0]['artist'];
                resolve(_this);
            });
        });
    };
    QueryBox.prototype.searchTable = function (dataset_id, svg_table) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ul;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.dataset_id = dataset_id;
                        return [4 /*yield*/, this.getData()];
                    case 1:
                        _a.sent();
                        ul = this.$node.append("ul");
                        ul.selectAll("li")
                            .data(values(this.items))
                            .enter()
                            .append("li")
                            .html(function (d) { return d; })
                            .on("click", function (d) {
                            svg_table.updateTable(d);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return QueryBox;
}());
export { QueryBox };
export function create(parent) {
    return new QueryBox(parent);
}
//# sourceMappingURL=queryBox.js.map