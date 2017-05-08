/**
 * Created by saharmehrpour on 5/7/17.
 */
import * as tslib_1 from "tslib";
import * as ajax from 'phovea_core/src/ajax';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { transition } from 'd3-transition';
import { axisBottom } from 'd3-axis';
import { Constants } from './constants';
import * as events from 'phovea_core/src/event';
var StatHistogram = (function () {
    function StatHistogram(parent) {
        var _this = this;
        this.svgDimension = { width: 250, height: 150, title: 180, spacing: 2 };
        this.colorRangeSimilar = ['#8dbfff', '#0092ff'];
        this.similarColorScale = scaleLinear().domain([0, 100]).range(this.colorRangeSimilar);
        this.colorRangeAll = ['#adc9aa', '#05c95d'];
        this.allColorScale = scaleLinear().domain([0, 100]).range(this.colorRangeAll);
        this.$node = select(parent)
            .append('div')
            .classed('allHistogramDiv', true);
        this.xScale = scaleLinear()
            .domain([0, 100])
            .range([0, this.svgDimension.width / 2 - this.svgDimension.spacing]);
        this.getData('/data_api/getStat').then(function (args) {
            _this.allData = args;
            _this.attachListener();
            _this.drawHistogram('GENDER');
            _this.drawHistogram('BMI');
        });
    }
    /**
     * Draw the initial histogram for all data on the left of the mid line
     * @param hist
     */
    StatHistogram.prototype.drawHistogram = function (hist) {
        var _this = this;
        var svg = this.$node
            .append('div')
            .classed('histogramDiv', true)
            .append('svg')
            .classed('histogramSVG', true)
            .append('g')
            .attr('transform', "translate(5,0)")
            .attr('id', "histogram_" + hist);
        var midLine = svg
            .append('line')
            .classed('midLine', true)
            .attr('x1', this.svgDimension.width / 2)
            .attr('y1', 0)
            .attr('x2', this.svgDimension.width / 2)
            .attr('y2', this.svgDimension.height);
        var allData = [];
        switch (hist) {
            case 'GENDER':
                allData = this.allData['gender'];
                break;
            case 'BMI':
                allData = this.allData['bmi'];
                break;
        }
        var histogramRectAll = svg.selectAll('.histogramRectAll')
            .data(allData);
        histogramRectAll
            .enter()
            .append('rect')
            .classed('histogramRectAll', true)
            .attr('x', this.xScale(100))
            .attr('y', function (d, i) {
            return i * _this.svgDimension.height / allData.length + _this.svgDimension.spacing;
        })
            .attr('width', 0)
            .attr('height', function () {
            return _this.svgDimension.height / allData.length - _this.svgDimension.spacing;
        });
        var t = transition('t').duration(1000);
        histogramRectAll.enter()
            .merge(histogramRectAll)
            .selectAll('rect')
            .transition(t)
            .attr('x', function (d) {
            return _this.xScale(100) - _this.xScale(d / _this.allData['length'] * 100);
        })
            .attr('width', function (d) {
            return _this.xScale(d / _this.allData['length'] * 100);
        })
            .style('fill', function (d) {
            return _this.allColorScale(d / _this.allData['length'] * 100);
        });
        // labels
        svg.selectAll('.allLabels')
            .data(Constants.histogramLabels[hist])
            .enter()
            .append('text')
            .classed('allLabels', true)
            .attr('x', 0)
            .attr('y', function (d, i) {
            return i * _this.svgDimension.height / allData.length + _this.svgDimension.spacing
                + (_this.svgDimension.height / allData.length - _this.svgDimension.spacing) / 2;
        })
            .attr('text-anchor', 'start')
            .text(function (d) { return d; });
        // title
        svg.append('text')
            .attr('x', this.svgDimension.width / 2)
            .attr('y', this.svgDimension.title)
            .attr('text-anchor', 'middle')
            .text(hist);
        // axis
        svg.append('g')
            .attr('class', 'xAxis')
            .attr('transform', "translate(" + (this.svgDimension.width / 2 + 2) + "," + this.svgDimension.height + ")")
            .call(axisBottom(this.xScale)
            .ticks(5));
        var leftScale = scaleLinear()
            .domain([0, 100])
            .range([this.svgDimension.width / 2 - this.svgDimension.spacing, 0]);
        svg.append('g')
            .attr('class', 'xAxis')
            .attr('transform', "translate(0," + this.svgDimension.height + ")")
            .call(axisBottom(leftScale)
            .ticks(5));
    };
    /**
     * Draw/Update the histogram for similar patients
     * @param hist
     */
    StatHistogram.prototype.updateHistogram = function (hist) {
        var _this = this;
        var groups = [];
        var allData = [];
        switch (hist) {
            case 'GENDER':
                groups.push(this.similarData['rows'].filter(function (d) {
                    return d['PAT_GENDER'] == 'F';
                }));
                groups.push(this.similarData['rows'].filter(function (d) {
                    return d['PAT_GENDER'] == 'M';
                }));
                allData = this.allData['gender'];
                break;
            case 'BMI':
                groups.push(this.similarData['rows'].filter(function (d) {
                    return d['BMI'] == '';
                }));
                groups.push(this.similarData['rows'].filter(function (d) {
                    return +d['BMI'] <= 18 && d['BMI'];
                }));
                groups.push(this.similarData['rows'].filter(function (d) {
                    return +d['BMI'] > 18 && +d['BMI'] <= 21;
                }));
                groups.push(this.similarData['rows'].filter(function (d) {
                    return +d['BMI'] > 21 && +d['BMI'] <= 24;
                }));
                groups.push(this.similarData['rows'].filter(function (d) {
                    return +d['BMI'] > 24 && +d['BMI'] <= 27;
                }));
                groups.push(this.similarData['rows'].filter(function (d) {
                    return +d['BMI'] > 27 && +d['BMI'] <= 30;
                }));
                groups.push(this.similarData['rows'].filter(function (d) {
                    return +d['BMI'] > 30;
                }));
                allData = this.allData['bmi'];
                break;
        }
        var svg = this.$node.select("#histogram_" + hist);
        var histogramRectSimilar = svg.selectAll('.histogramRectSimilar')
            .data(groups);
        histogramRectSimilar
            .enter()
            .append('rect')
            .classed('histogramRectSimilar', true)
            .attr('x', function () {
            return _this.svgDimension.width / 2 + _this.svgDimension.spacing;
        })
            .attr('y', function (d, i) {
            return i * (_this.svgDimension.height) / groups.length + _this.svgDimension.spacing;
        })
            .attr('width', 0)
            .attr('height', function () {
            return _this.svgDimension.height / groups.length - _this.svgDimension.spacing;
        });
        var t = transition('t').duration(1000);
        histogramRectSimilar = svg.selectAll('.histogramRectSimilar')
            .attr('width', function () {
            return select(this).attr('width');
        })
            .transition(t)
            .attr('width', function (d) {
            return _this.xScale(d.length / _this.similarData['rows'].length * 100);
        })
            .style('fill', function (d) {
            return _this.similarColorScale(d.length / _this.similarData['rows'].length * 100);
        });
        //console.log(groups);
        //console.log(allData);
        //console.log(this.allData['test']);
        // proportion
        var histogramRectProportion = svg.selectAll('.histogramRectProportion')
            .data(groups);
        histogramRectProportion
            .enter()
            .append('rect')
            .classed('histogramRectProportion', true)
            .attr('x', function () {
            return _this.svgDimension.width / 2 - _this.svgDimension.spacing;
        })
            .attr('y', function (d, i) {
            return i * (_this.svgDimension.height) / groups.length + _this.svgDimension.spacing;
        })
            .attr('width', 0)
            .attr('height', function () {
            return _this.svgDimension.height / groups.length - _this.svgDimension.spacing;
        });
        histogramRectProportion = svg.selectAll('.histogramRectProportion')
            .attr('width', function () {
            return select(this).attr('width');
        })
            .transition(t)
            .attr('x', function (d, i) {
            return _this.xScale(100) - _this.xScale(d.length / allData[i] * 100);
        })
            .attr('width', function (d, i) {
            return _this.xScale(d.length / allData[i] * 100);
        })
            .style('fill', function (d, i) {
            return 'darkred';
            //return this.similarColorScale(allData[i] - d.length / this.similarData['rows'].length * 100)
        });
    };
    /**
     * Attaching listener
     */
    StatHistogram.prototype.attachListener = function () {
        var _this = this;
        events.on('update_similar', function (evt, item) {
            _this.similarData = item[1];
            _this.updateHistogram('GENDER');
            _this.updateHistogram('BMI');
        });
    };
    /**
     * get Data by API
     * @param URL
     * @returns {Promise<any>}
     */
    StatHistogram.prototype.getData = function (URL) {
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
    StatHistogram.prototype.setBusy = function (isBusy) {
        var status = select('.busy').classed('hidden');
        if (status == isBusy)
            select('.busy').classed('hidden', !isBusy);
    };
    return StatHistogram;
}());
export { StatHistogram };
export function create(parent) {
    return new StatHistogram(parent);
}
//# sourceMappingURL=statHistogram.js.map