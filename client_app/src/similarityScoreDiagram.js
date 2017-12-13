/**
 * Created by saharmehrpour on 4/20/17.
 */
import * as tslib_1 from "tslib";
import * as ajax from 'phovea_core/src/ajax';
import { select, event } from 'd3-selection';
import { nest, entries } from 'd3-collection';
import * as events from 'phovea_core/src/event';
import { scaleLinear } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import { timeParse } from 'd3-time-format';
import { max, ascending } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { transition } from 'd3-transition';
import { brushY } from 'd3-brush';
import * as dataCalc from './dataCalculations';
var similarityScoreDiagram = (function() {
    function similarityScoreDiagram(parent, diagram) {
        var _this = this;
        this.getClassAssignment = dataCalc.getClassAssignment;
        this.height = 400;
        this.width = 600;
        this.promisDimension = { height: 400, width: 600 };
        this.margin = { x: 80, y: 40 };
        this.sliderWidth = 10;
        this.similarBar = { width: 4, height: 10 };
        this.diagram = diagram;
        this.$node = select(parent)
            .append('div')
            .classed('diagramDiv', true);
        this.svg = this.$node.append('svg')
            .attr('height', this.promisDimension.height)
            .attr('width', this.promisDimension.width);
        // scales
        this.timeScale = scaleLinear()
            .range([0, this.promisDimension.width - 2 * this.margin.x])
            .clamp(true);
        this.scoreScale = scaleLinear()
            .domain([100, 0])
            .range([0, this.promisDimension.height - 3 * this.margin.y]);
        // axis
        this.svg.append('g')
            .attr('class', 'xAxis')
            .attr('transform', "translate(" + this.margin.x + "," + (this.promisDimension.height - 2 * this.margin.y) + ")");

        this.svg.append('g')
            .attr('class', 'yAxis')
            .attr('transform', "translate(" + (this.margin.x - this.sliderWidth) + "," + this.margin.y + ")")
            .call(axisLeft(this.scoreScale));
        // -----
        var slider = this.svg.append('g')
            .attr('class', 'slider')
            .attr('transform', "translate(" + (this.margin.x - this.sliderWidth + 2) + "," + this.margin.y + ")");
        this.brush = brushY()
            .extent([
                [0, 0],
                [this.sliderWidth - 2, this.scoreScale.range()[1]]
            ])
            .on("end", function() {
                var start = event.selection[0];
                var end = event.selection[1];
                _this.updateSlider(start, end);
            });
        slider.call(this.brush)
            .call(this.brush.move, this.scoreScale.range());
        // -----
        this.svg.append('text')
            .text("" + this.diagram)
            .attr('text-anchor', 'middle')
            .attr('transform', "translate(" + this.margin.x / 4 + "," + this.promisDimension.height * 0.5 + ") rotate(-90)");
        this.svg.append('g')
            .attr('class', 'grid')
            .attr('transform', "translate(" + this.margin.x + "," + this.margin.y + ")")
            .call(axisLeft(this.scoreScale)
                .tickSize(-(this.promisDimension.width - this.margin.x)))
            .selectAll('text').remove();
        this.svg.append('g')
            .attr('id', 'pat_score');
        this.svg.append('g')
            .attr('id', 'similar_score');
        this.svg.append('g')
            .attr('id', 'pat_orders');
        this.svg.append('g')
            .attr('id', 'similar_orders');
        this.attachListener();
    }
    /**
     * Attach listeners
     */
    similarityScoreDiagram.prototype.attachListener = function() {
        var _this = this;
        // item: pat_id, number of similar patients, DATA
        events.on('update_similar', function(evt, item) {
            _this.svg.select('.slider') // reset slider
                .call(_this.brush)
                .call(_this.brush.move, _this.scoreScale.range());
            _this.targetPatientProInfo = item[2]['pat_PRO'][item[0]].slice();
            _this.similarPatientsProInfo = entries(item[2]['similar_PRO']);
            _this.clearDiagram();
            _this.drawDiagram();
            _this.addSimilarOrderPoints(item[2]['pat_Orders'][item[0]].slice(), entries(item[2]['similar_Orders']));
        });
        // item: pat_id, DATA
        events.on('update_all_info', function(evt, item) {
            _this.svg.select('.slider') // reset slider
                .call(_this.brush)
                .call(_this.brush.move, _this.scoreScale.range());
            _this.targetPatientProInfo = item[1]['PRO'][item[0]];
            _this.similarPatientsProInfo = [];
            _this.clearDiagram();
            _this.drawDiagram();
            _this.addOrderSquares(item[1]['Orders'][item[0]]);
        });
    };
    /**
     * Draw the diagram with the given data from getSimilarRows
     * @param args
     */
    similarityScoreDiagram.prototype.drawDiagram = function() {
        // ----- add diff days to the data
        var _this = this;
        var maxDiff = 0;
        var minPatDate = this.findMinDate(this.targetPatientProInfo);
        this.targetPatientProInfo.forEach(function(d) {
            d.diff = Math.ceil((_this.parseTime(d['ASSESSMENT_START_DTM'], null).getTime() - minPatDate.getTime()) / (1000 * 60 * 60 * 24));
            maxDiff = d.diff > maxDiff ? d.diff : maxDiff;
        });
        this.targetPatientProInfo.sort(function(a, b) { return ascending(a.diff, b.diff); });
        this.similarPatientsProInfo.forEach(function(g) {
            var minDate = _this.findMinDate(g.value);
            g.value.forEach(function(d) {
                try {
                    d.diff = Math.ceil((_this.parseTime(d['ASSESSMENT_START_DTM'], null).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
                    maxDiff = d.diff > maxDiff ? d.diff : maxDiff;
                } catch (TypeError) {
                    d.diff = -1;
                }
            });
        });
        var patData = this.targetPatientProInfo.filter(function(d) {
            return d['FORM'] == _this.diagram;
        });
        var similarData = this.similarPatientsProInfo.map(function(d) {
            var res = d.value.filter(function(g) {
                return g['FORM'] == _this.diagram;
            });
            res.sort(function(a, b) { return ascending(a.diff, b.diff); });
            return res;
        });
        // -----  set domains and axis
        // time scale
        this.timeScale.domain([-1, maxDiff]);
        this.svg.select('.xAxis')
            .call(axisBottom(this.timeScale));
        // -------  define line function
        var lineFunc = line()
            .curve(curveMonotoneX)
            .x(function(d) {
                return _this.timeScale(d['diff']);
            })
            .y(function(d) {
                return _this.scoreScale(+d['SCORE']);
            });
        // ------- draw
        var patScoreGroup = this.svg.select('#pat_score');
        var patLine = patScoreGroup
            .append('g')
            .attr('transform', function() {
                return "translate(" + _this.margin.x + "," + _this.margin.y + ")";
            })
            .selectAll('.patLine')
            .data([patData])
            .enter()
            .append('path')
            .attr('class', 'patLine')
            .attr('d', function(d) { return lineFunc(d); })
            .on('click', function(d) { return console.log(d); });
        var medScoreGroup = this.svg.select('#similar_score');
        medScoreGroup.selectAll('.med_group')
            .data(similarData)
            .enter()
            .append('g')
            .attr('transform', function() {
                return "translate(" + _this.margin.x + "," + _this.margin.y + ")";
            })
            .each(function(d) {
                var currGroup = select(this);
                currGroup.append('g')
                    .append('path')
                    .attr('class', 'proLine') // TODO later after getting classification
                    .attr('d', function() { return lineFunc(d); });
            })
            .on('click', function(d) { return console.log(d); });
    };
    /**
     * Utility method
     * @param start
     * @param end
     */
    similarityScoreDiagram.prototype.updateSlider = function(start, end) {
        var lowScore = this.scoreScale.invert(end);
        var highScore = this.scoreScale.invert(start);
        var pro = this.svg.select('#pro_score')
            .selectAll('path')
            .style('opacity', 0);
        pro.filter(function(d) {
            if (!d.length)
                return false;
            return d[0].SCORE <= highScore && d[0].SCORE >= lowScore;
        }).style('opacity', 1);
        var med = this.svg.select('#similar_score')
            .selectAll('path')
            .style('opacity', 0);
        med.filter(function(d) {
            if (!d.length)
                return false;
            return d[0].SCORE <= highScore && d[0].SCORE >= lowScore;
        }).style('opacity', 1);
    };
    /**
     * add small squares for orders of one (target) patient
     * @param ordersInfo
     */
    similarityScoreDiagram.prototype.addOrderSquares = function(ordersInfo) {
        var _this = this;
        var minDate = this.findMinDate(this.targetPatientProInfo);
        ordersInfo.forEach(function(d) {
            var time = _this.parseTime(d['ORDER_DTM'], minDate).getTime();
            d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
        });
        var self = this;
        var nestedData = nest()
            .key(function(d) {
                return (Math.floor(d['diff'] / 60) * 100).toString();
            })
            .entries(ordersInfo);
        nestedData.forEach(function(d) {
            d.values = d.values.sort(function(a, b) { return ascending(a.diff, b.diff); });
            // rollup was not successful
            d['sumUp'] = nest().key(function(g) { return g['diff']; }).entries(d.values); // TODO visualize collapsible squares
        });
        console.log(nestedData);
        this.svg.select('#pat_orders').selectAll('g').remove();
        this.svg.select('#pat_orders')
            .append('g')
            .attr('transform', function() {
                return "translate(" + _this.margin.x + ",0)"; // If there is a label for the x-axis change 0
            })
            .selectAll('.patOrder')
            .data(nestedData)
            .enter()
            .append('g')
            .attr('transform', function(d) { return "translate(0," + (_this.promisDimension.height - 50) + ")"; })
            .classed('patOrder', true)
            .selectAll('rect')
            .data(function(d) { return d.values; })
            .enter()
            .append('rect')
            .attr('class', this.getClassAssignment('ORDER_CATALOG_TYPE'))
            .attr('class', this.getClassAssignment('ORDER_STATUS'))
            .attr('x', function(g) { return _this.timeScale(g.diff); })
            .attr('y', function(g, i) { return i * _this.timeScale(25); })
            .attr('width', this.timeScale(20))
            .attr('height', this.timeScale(20))
            .on('click', function(d) {
                if (!select(this).classed('selectedOrder')) {
                    select(this).classed('selectedOrder', true);
                    select(this.parentNode.parentNode.parentNode)
                        .append('line')
                        .classed('selectedLine', true)
                        .attr('id', "orderLine_" + d['VISIT_NO'])
                        .attr('x1', self.timeScale(d['diff']) + self.margin.x)
                        .attr('x2', self.timeScale(d['diff']) + self.margin.x)
                        .attr('y1', self.scoreScale(100) + self.margin.y)
                        .attr('y2', self.scoreScale(0) + self.margin.y)
                        .on('click', function() { return console.log(d); });
                    console.log(d);
                } else {
                    select(this).classed('selectedOrder', false);
                    select("#orderLine_" + d['VISIT_NO']).remove();
                }
            })
            .on("mouseover", function(d) {
                var t = transition('t').duration(500);
                select(".tooltip")
                    .html(function() {
                        return _this.renderOrdersTooltip(d);
                    })
                    .transition(t)
                    .style("opacity", 1)
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px");
            })
            .on("mouseout", function() {
                var t = transition('t').duration(500);
                select(".tooltip").transition(t)
                    .style("opacity", 0);
            });
        var maxLength = max(nestedData, function(d) {
            return d.values.length;
        });
        this.svg
            .attr('height', this.promisDimension.height - 50 + this.timeScale(25) * maxLength);
    };
    /**
     *
     * @param ordersInfo
     */
    similarityScoreDiagram.prototype.addSimilarOrderPoints = function(ordersInfo, similarOrdersInfo) {
        // -------  target patient
        var _this = this;
        var minDate = this.findMinDate(this.targetPatientProInfo);
        ordersInfo.forEach(function(d) {
            var time = _this.parseTime(d['ORDER_DTM'], minDate).getTime();
            d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
        });
        var self = this;
        this.svg.select('#pat_orders')
            .append('g')
            .attr('transform', function() {
                return "translate(" + _this.margin.x + ",0)"; // If there is a label for the x-axis change 0
            })
            .selectAll('.patRect')
            .data([ordersInfo])
            .enter()
            .append('g')
            .attr('transform', function() { return "translate(0," + (_this.promisDimension.height - 50) + ")"; })
            .classed('patRect', true)
            .selectAll('rect')
            .data(function(d) { return d; })
            .enter()
            .append('rect')
            .attr('class', function(d) { return "" + d['ORDER_CATALOG_TYPE']; })
            .attr('x', function(g) { return _this.timeScale(g.diff); })
            .attr('y', 0)
            .attr('width', this.similarBar.width)
            .attr('height', this.similarBar.height)
            .on('click', function(d) {
                if (!select(this).classed('selectedOrder')) {
                    select(this).classed('selectedOrder', true);
                    select(this.parentNode.parentNode.parentNode)
                        .append('line')
                        .classed('selectedLine', true)
                        .attr('id', "orderLine_" + d['VISIT_NO'])
                        .attr('x1', self.timeScale(d['diff']) + self.margin.x)
                        .attr('x2', self.timeScale(d['diff']) + self.margin.x)
                        .attr('y1', self.scoreScale(100) + self.margin.y)
                        .attr('y2', self.scoreScale(0) + self.margin.y)
                        .on('click', function() { return console.log(d); });
                    console.log(d);
                } else {
                    select(this).classed('selectedOrder', false);
                    select("#orderLine_" + d['VISIT_NO']).remove();
                }
            })
            .on("mouseover", function(d) {
                var t = transition('t').duration(500);
                select(".tooltip")
                    .html(function() {
                        return _this.renderOrdersTooltip(d);
                    })
                    .transition(t)
                    .style("opacity", 1)
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px");
            })
            .on("mouseout", function() {
                var t = transition('t').duration(500);
                select(".tooltip").transition(t)
                    .style("opacity", 0);
            });
        // ----- add diff days to the data
        similarOrdersInfo.forEach(function(g) {
            var currPatient = _this.similarPatientsProInfo.filter(function(d) {
                return d.key == g.key;
            })[0];
            var minDate = _this.findMinDate(currPatient.value);
            g.value.forEach(function(d) {
                try {
                    d.diff = Math.ceil((_this.parseTime(d['ORDER_DTM'], null).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
                } catch (TypeError) {
                    console.log('error');
                    d.diff = -1;
                }
            });
        });
        this.svg.select('#similar_orders')
            .append('g')
            .attr('transform', function() {
                return "translate(" + _this.margin.x + ",0)"; // If there is a label for the x-axis change 0
            })
            .selectAll('.similarRect')
            .data(similarOrdersInfo)
            .enter()
            .append('g')
            .attr('transform', function(d, i) { return "translate(0," + (_this.promisDimension.height - 50 + (i + 1) * (_this.similarBar.height + 5)) + ")"; })
            .classed('similarRect', true)
            .selectAll('rect')
            .data(function(d) { return d.value; })
            .enter()
            .append('rect')
            .attr('class', function(d) { return "" + d['ORDER_CATALOG_TYPE']; })
            .attr('x', function(g) { return _this.timeScale(g.diff); })
            .attr('y', 0)
            .attr('width', this.similarBar.width)
            .attr('height', this.similarBar.height)
            .on('click', function(d) {
                if (!select(this).classed('selectedOrder')) {
                    select(this).classed('selectedOrder', true);
                    select(this.parentNode.parentNode.parentNode)
                        .append('line')
                        .classed('selectedLine', true)
                        .attr('id', "orderLine_" + d['VISIT_NO'])
                        .attr('x1', self.timeScale(d['diff']) + self.margin.x)
                        .attr('x2', self.timeScale(d['diff']) + self.margin.x)
                        .attr('y1', self.scoreScale(100) + self.margin.y)
                        .attr('y2', self.scoreScale(0) + self.margin.y)
                        .on('click', function() { return console.log(d); });
                    console.log(d);
                } else {
                    select(this).classed('selectedOrder', false);
                    select("#orderLine_" + d['VISIT_NO']).remove();
                }
            })
            .on("mouseover", function(d) {
                var t = transition('t').duration(500);
                select(".tooltip")
                    .html(function() {
                        return _this.renderOrdersTooltip(d);
                    })
                    .transition(t)
                    .style("opacity", 1)
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px");
            })
            .on("mouseout", function() {
                var t = transition('t').duration(500);
                select(".tooltip").transition(t)
                    .style("opacity", 0);
            });
        // fix height of the svg
        this.svg
            .attr('height', this.promisDimension.height - 50 + (this.similarBar.height + 5) * similarOrdersInfo.length);
    };
    /**
     * clear the diagram
     */
    similarityScoreDiagram.prototype.clearDiagram = function() {
        this.svg.select('#pat_score').selectAll('g').remove();
        this.svg.select('#similar_score').selectAll('g').remove();
        this.svg.select('#pat_orders').selectAll('line,g').remove();
        this.svg.select('#similar_orders').selectAll('g').remove();
    };
    /**
     * Utility method
     * @param pat
     * @returns {Date}
     */
    similarityScoreDiagram.prototype.findMinDate = function(pat) {
        var minDate = new Date();
        for (var index = 0; index < pat.length; index++) {
            if (!pat[index]['ASSESSMENT_START_DTM'])
                continue;
            if (this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null) < minDate)
                minDate = this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null);
        }
        return minDate;
    };
    /**
     * parse time
     * @param date
     * @param nullDate
     * @returns {null}
     */
    similarityScoreDiagram.prototype.parseTime = function(date, nullDate) {
        var parseT1 = timeParse('%x %X');
        var parseT2 = timeParse('%x');
        var time = nullDate;
        if (date) {
            if (date.split(' ').length > 1) {
                time = parseT1(date);
            } else
                time = parseT2(date);
        }
        return time;
    };
    /**
     * Get the data via API
     * @param URL
     * @returns {Promise<any>}
     */
    similarityScoreDiagram.prototype.getData = function(URL) {
        return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , ajax.getAPIJSON(URL)];
                    case 1:
                        return [2 /*return*/ , _a.sent()];
                }
            });
        });
    };
    similarityScoreDiagram.prototype.renderOrdersTooltip = function(tooltip_data) {
        var text = "<strong style='color:darkslateblue'>" + tooltip_data['ORDER_CATALOG_TYPE'] + "</strong></br>";
        text += "<span>" + tooltip_data['ORDER_MNEMONIC'] + "</span></br>";
        text += "<span>" + tooltip_data['ORDER_DTM'] + "</span></br>";
        return text;
    };
    /**
     * Show or hide the application loading indicator
     * @param isBusy
     */
    similarityScoreDiagram.prototype.setBusy = function(isBusy) {
        var status = select('.busy').classed('hidden');
        if (status == isBusy)
            select('.busy').classed('hidden', !isBusy);
    };
    return similarityScoreDiagram;
}());
export { similarityScoreDiagram };
export function create(parent, diagram) {
    return new similarityScoreDiagram(parent, diagram);
}
//# sourceMappingURL=similarityScoreDiagram.js.map