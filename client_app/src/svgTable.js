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
        this.display = { from: 0, to: 20 }; // TODO
        this.cols = Constants.cols;
        this.header = Constants.header;
        this.$node = select(parent)
            .append('div')
            .classed('tableDiv', true);
        this.attachListener();
    }
    SvgTable.prototype.drawTable = function (datasetId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var arrowSpan, url;
            return tslib_1.__generator(this, function (_a) {
                this.datasetId = datasetId;
                arrowSpan = select("#" + this.datasetId + "_arrow");
                arrowSpan.append("image")
                    .attr("xlink:href", "img/back.png")
                    .attr('width', 20)
                    .attr('height', 20)
                    .on('click', function () { });
                arrowSpan.append("image")
                    .attr("xlink:href", "img/back.png")
                    .attr('width', 20)
                    .attr('height', 20)
                    .on('click', function () { });
                this.drawHeader();
                url = "/data_api/getAllRows/" + this.datasetId;
                console.log("start loading init");
                this.getData(url).then(function (args) {
                    var dic = { 'func': 'init', 'args': args, 'arg': 'rows' };
                    _this.drawRows(dic);
                });
                return [2 /*return*/];
            });
        });
    };
    /**
     * Draw the header of the table
     */
    SvgTable.prototype.drawHeader = function () {
        var _this = this;
        var header = this.$node
            .selectAll('.header')
            .data([1]);
        header.enter().append('div')
            .classed('header', true)
            .merge(header)
            .selectAll('.headercells')
            .data(this.header[this.datasetId])
            .enter().append('div')
            .classed('headercells', true)
            .classed('superWideCell', function (g, i) {
            return _this.cols[_this.datasetId].SuperWide.indexOf(i) !== -1;
        })
            .classed('wideCell', function (g, i) {
            return _this.cols[_this.datasetId].Wide.indexOf(i) !== -1;
        })
            .classed('mediumCell', function (g, i) {
            return _this.cols[_this.datasetId].Medium.indexOf(i) !== -1;
        })
            .html(function (g, i) {
            if (_this.cols[_this.datasetId].SuperWide.indexOf(i) !== -1) {
                return g;
            }
            if (_this.cols[_this.datasetId].Wide.indexOf(i) !== -1) {
                return g;
            }
            if (_this.cols[_this.datasetId].Medium.indexOf(i) !== -1) {
                return g.slice(0, Math.min(10, g.length));
            }
            return g.slice(0, 4);
        })
            .on('mouseover', function (g) {
            select('.tooltip')
                .style('opacity', 1);
            select('.tooltip').html(function () {
                return g.split('_').join(' ');
            })
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
            .on('mouseout', function () {
            select('.tooltip')
                .style('opacity', 0);
        });
    };
    /**
     * Draw the rows of the table
     * args = {data}
     * arg = rows
     * @param input dict= {'func': 'init'/'similar'/'all', 'args': {data}, 'arg': arg}
     * @returns {Promise<void>}
     */
    SvgTable.prototype.drawRows = function (input) {
        var _this = this;
        console.log('Loading ' + this.datasetId);
        var data = (input.func === 'init' || input.func === 'latest') ? input.args[input.arg].slice(0, 20)
            : input.args[input.arg];
        var diff = (input.func === 'similar') ? input.args.difference : [];
        var rows = this.$node
            .selectAll('.rows')
            .data(data);
        var cells = rows.enter().append('div')
            .classed('rows', true)
            .merge(rows)
            .selectAll('.cells')
            .data(function (d, i) {
            var ent = entries(d);
            ent.sort(function (a, b) {
                return _this.header[_this.datasetId].indexOf(a.key)
                    - _this.header[_this.datasetId].indexOf(b.key);
            });
            if (input.func === 'similar') {
                for (var j = 0; j < ent.length; j++) {
                    ent[j]['diff'] = +diff[i][ent[j].key];
                }
            }
            return ent;
        });
        cells
            .enter().append('div')
            .classed('cells', true)
            .merge(cells)
            .classed('superWideCell', function (g, i) {
            return _this.cols[_this.datasetId].SuperWide.indexOf(i) !== -1;
        })
            .classed('wideCell', function (g, i) {
            return _this.cols[_this.datasetId].Wide.indexOf(i) !== -1;
        })
            .classed('mediumCell', function (g, i) {
            return _this.cols[_this.datasetId].Medium.indexOf(i) !== -1;
        })
            .classed('sameValue', function (g) {
            return input.func === 'similar' && g.diff === 0;
        })
            .classed('lowerValue', function (g) {
            return input.func === 'similar' && g.diff === -1;
        })
            .classed('higherValue', function (g) {
            return input.func === 'similar' && g.diff === +1;
        })
            .html(function (g) {
            if (g.key === 'WEIGHT_KG') {
                return "<svg width='50' height='20'><path class='lineChart' d></svg>" + g.value;
            }
            return g.value;
        });
        rows.exit().remove();
        if (input.func === 'latest') {
            this.drawLineChart(input.args.WEIGHT_KG);
        }
        console.log(this.datasetId + ' loaded');
    };
    /**
     * Drawing the changes in the weight in the table
     * @param data
     */
    SvgTable.prototype.drawLineChart = function (data) {
        var scaleWeight = scaleLinear()
            .domain([31, 205])
            .range([0, 20]);
        var scaleX = scaleLinear()
            .domain([0, 10])
            .range([0, 50]);
        var lineFn = line()
            .x(function (d, i) { return scaleX(i); })
            .y(function (d) { return scaleWeight(+d); });
        this.$node
            .selectAll('.lineChart')
            .attr('d', function (d, i) { return lineFn(data[i]); });
    };
    SvgTable.prototype.attachListener = function () {
        var _this = this;
        events.on('update_all_info', function (evt, item) {
            var url = "/data_api/getPatInfo/" + _this.datasetId + "/" + item[1];
            _this.setBusy(true);
            _this.getData(url).then(function (args) {
                var dic = { 'func': 'all', 'args': args, 'arg': 'rows' };
                _this.drawRows(dic);
                _this.setBusy(false);
            });
        });
        events.on('update_similar', function (evt, item) {
            if (_this.datasetId === 'Demo') {
                var dic = { 'func': 'similar', 'args': item[1], 'arg': 'rows' };
                _this.drawRows(dic);
            }
        });
        events.on('update_latest', function () {
            if (_this.datasetId === 'Demo') {
                var url = "/data_api/getLatestInfo/" + _this.datasetId;
                _this.setBusy(true);
                _this.getData(url).then(function (args) {
                    var dic = { 'func': 'latest', 'args': args, 'arg': 'rows' };
                    _this.drawRows(dic);
                    _this.setBusy(false);
                });
            }
        });
        events.on('update_init', function () {
            var url = "/data_api/getAllRows/" + _this.datasetId;
            _this.setBusy(true);
            _this.getData(url).then(function (args) {
                var dic = { 'func': 'init', 'args': args, 'arg': 'rows' };
                _this.drawRows(dic);
                _this.setBusy(false);
            });
        });
    };
    SvgTable.prototype.getData = function (URL) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ajax.getAPIJSON(URL)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Show or hide the application loading indicator
     * @param isBusy
     */
    SvgTable.prototype.setBusy = function (isBusy) {
        var status = select('.busy').classed('hidden');
        if (status == isBusy)
            select('.busy').classed('hidden', !isBusy);
    };
    return SvgTable;
}());
export { SvgTable };
export function create(parent) {
    return new SvgTable(parent);
}
//# sourceMappingURL=svgTable.js.map