/**
 * Created by saharmehrpour on 4/12/17.
 */
import * as tslib_1 from "tslib";
import * as ajax from 'phovea_core/src/ajax';
import { select } from 'd3-selection';
import { nest } from 'd3-collection';
import * as events from 'phovea_core/src/event';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line, curveBasis } from 'd3-shape';
import { timeParse } from 'd3-time-format';
import { extent, min, max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { Constants } from './constants';
var ScoreDiagram = (function () {
    function ScoreDiagram(parent, datasetId) {
        this.parseTime = timeParse('%x %X');
        this.height = 300;
        this.width = 300;
        this.margin = 20;
        this.datasetId = datasetId;
        this.$node = select(parent)
            .append('div')
            .classed('diagramDiv', true);
        this.svg = this.$node.append('svg')
            .attr('height', this.height + 100)
            .attr('width', this.width * 5);
        this.attachListener();
        this.yearScale = scaleTime().range([0, this.width - 2 * this.margin]);
        this.scoreScale = scaleLinear().range([0, this.height - 2 * this.margin]);
        //this.colorScale = scaleOrdinal().range(['darkblue', 'darkred', 'forestgreen', 'darkmagenta']);
    }
    ScoreDiagram.prototype.attachListener = function () {
        var _this = this;
        events.on('draw_score_diagram', function (evt, item) {
            var url = "/data_api/getInfoByColValue/" + _this.datasetId + "/" + item[0] + "/" + item[1];
            var dic = { 'func': 'update', 'URL': url, 'arg': 'info_rows', 'PAT_ID': item[1] };
            _this.svg.selectAll('g').remove();
            _this.yearScale = scaleTime().range([0, _this.width - 2 * _this.margin]);
            _this.scoreScale = scaleLinear().range([0, _this.height - 2 * _this.margin]);
            _this.drawDiagram(dic);
        });
        events.on('edit_score_diagram', function (evt, item) {
            var url = "/data_api/getInfoByColValue/" + _this.datasetId + "/" + item[0] + "/" + item[1];
            var dic = { 'func': 'update', 'URL': url, 'arg': 'info_rows', 'PAT_ID': item[1] };
            _this.drawDiagram(dic);
        });
        events.on('remove_score_diagram', function (evt, item) {
            _this.removeFromDiagram(item[1]);
        });
    };
    /**
     * Function to draw diagram
     * @param input
     * @returns {Promise<void>}
     */
    ScoreDiagram.prototype.oldDrawDiagram = function (input) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var args, data, nestedData, lineFunc, dgms, self;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Drawing diagram of ' + this.datasetId);
                        return [4 /*yield*/, ajax.getAPIJSON(input.URL)];
                    case 1:
                        args = _a.sent();
                        data = args[input.arg].map(function (d) {
                            return { date: _this.parseTime(d.ASSESSMENT_START_DTM), score: d.SCORE, form: d.FORM };
                        });
                        nestedData = nest()
                            .key(function (d) { return d['form']; })
                            .entries(data);
                        console.log(nestedData);
                        // set domains
                        this.yearScale.domain(extent(data, function (d) { return d['date']; }));
                        this.scoreScale.domain([
                            max(data, function (d) { return d['score']; }),
                            min(data, function (d) { return d['score']; })
                        ]);
                        lineFunc = line()
                            .curve(curveBasis)
                            .x(function (d) {
                            return _this.yearScale(d['date']);
                        })
                            .y(function (d) {
                            return _this.scoreScale(d['score']);
                        });
                        // draw diagram
                        this.svg.selectAll('g').remove();
                        dgms = this.svg.selectAll('.diagrams')
                            .data(nestedData)
                            .enter()
                            .append('g')
                            .classed('diagrams', true)
                            .attr('id', function (d) { return Constants.scoreIds[d.key]; })
                            .attr('transform', function (d, i) {
                            return 'translate(' + (_this.margin + _this.width * i) + ',' + _this.margin + ')';
                        });
                        dgms.append('text')
                            .attr("transform", "translate(0," + this.height + ")")
                            .attr("y", 6)
                            .attr("dy", "0.71em")
                            .attr("fill", "#000")
                            .text(function (d) { return d.key; });
                        dgms.enter().merge(dgms);
                        self = this;
                        dgms.each(function (d) {
                            var group = select(this);
                            group.append('g')
                                .attr('class', 'axis axis--x')
                                .attr('transform', 'translate(0,' + (self.height - 2 * self.margin) + ')')
                                .call(axisBottom(self.yearScale));
                            group.append('g')
                                .attr('class', 'axis axis--y')
                                .call(axisLeft(self.scoreScale));
                            var formScore = group.selectAll('.formScore')
                                .data([1])
                                .enter().append('g')
                                .attr('class', 'formScore')
                                .attr('id', function () { return "score_dgm_" + Constants.scoreIds[d.key] + "_" + input.PAT_ID; });
                            formScore.append('path')
                                .attr('class', 'scoreLine')
                                .attr('d', function () {
                                return lineFunc(d.values);
                            });
                            formScore.selectAll('.scoreCircle')
                                .data(d.values)
                                .enter().append('circle')
                                .attr('class', 'scoreCircle')
                                .attr('cx', function (g) { return self.yearScale(g['date']); })
                                .attr('cy', function (g) { return self.scoreScale(g['score']); })
                                .attr('r', 3);
                            //.style('stroke', (g) => this.colorScale(g.key));
                        });
                        console.log('Drawing diagram of ' + this.datasetId + ' ended');
                        return [2 /*return*/];
                }
            });
        });
    };
    ScoreDiagram.prototype.editDiagram = function (input) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var args, data, nestedData, lineFunc, _loop_1, this_1, i;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Editing diagram of ' + this.datasetId);
                        return [4 /*yield*/, ajax.getAPIJSON(input.URL)];
                    case 1:
                        args = _a.sent();
                        data = args[input.arg].map(function (d) {
                            return { date: _this.parseTime(d.ASSESSMENT_START_DTM), score: d.SCORE, form: d.FORM };
                        });
                        nestedData = nest()
                            .key(function (d) { return d['form']; })
                            .entries(data);
                        console.log(nestedData);
                        // set domains
                        this.yearScale.domain(extent(data, function (d) { return d['date']; }));
                        this.scoreScale.domain([
                            max(data, function (d) { return d['score']; }),
                            min(data, function (d) { return d['score']; })
                        ]);
                        lineFunc = line()
                            .curve(curveBasis)
                            .x(function (d) {
                            return _this.yearScale(d['date']);
                        })
                            .y(function (d) {
                            return _this.scoreScale(d['score']);
                        });
                        _loop_1 = function (i) {
                            var nData = nestedData[i];
                            // add charts if necessary
                            console.log(nData);
                            var keyForID = Constants.scoreIds[nData['key']];
                            var dgm = this_1.svg.selectAll("#" + keyForID)
                                .data([1]);
                            dgm.enter()
                                .append('g')
                                .classed('diagrams', true)
                                .attr('id', function (d) { return keyForID; })
                                .attr('transform', function () {
                                var i = select('.diagrams').size();
                                return 'translate(' + (_this.margin + _this.width * i) + ',' + _this.margin + ')';
                            });
                            dgm.enter().append('g')
                                .attr('class', 'axis axis--x')
                                .attr('transform', 'translate(0,' + (this_1.height - 2 * this_1.margin) + ')')
                                .call(axisBottom(this_1.yearScale));
                            dgm.enter().append('g')
                                .attr('class', 'axis axis--y')
                                .call(axisLeft(this_1.scoreScale));
                            dgm.enter().append('text')
                                .attr("transform", "translate(0," + this_1.height + ")")
                                .attr("y", 6)
                                .attr("dy", "0.71em")
                                .attr("fill", "#000")
                                .text(nData['key']);
                            dgm.enter().merge(dgm);
                            var formScore = dgm.selectAll("#score_dgm_" + keyForID + "_" + input.PAT_ID)
                                .data([1])
                                .enter().append('g')
                                .attr('class', 'formScore')
                                .attr('id', function () { return "score_dgm_" + keyForID + "_" + input.PAT_ID; });
                            formScore.append('path')
                                .attr('class', 'scoreLine')
                                .attr('d', function () {
                                return lineFunc(nData['values']);
                            });
                            formScore.selectAll('.scoreCircle')
                                .data(nData['values'])
                                .enter().append('circle')
                                .attr('class', 'scoreCircle')
                                .attr('cx', function (g) { return _this.yearScale(g['date']); })
                                .attr('cy', function (g) { return _this.scoreScale(g['score']); })
                                .attr('r', 3);
                        };
                        this_1 = this;
                        for (i = 0; i < nestedData.length; i++) {
                            _loop_1(i);
                        }
                        console.log('Editing diagram of ' + this.datasetId + ' ended');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param input
     * @returns {Promise<void>}
     */
    ScoreDiagram.prototype.drawDiagram = function (input) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var args, data, nestedData, dates, lineFunc, existingDgm, _loop_2, this_2, i;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ajax.getAPIJSON(input.URL)];
                    case 1:
                        args = _a.sent();
                        data = args[input.arg].map(function (d) {
                            return { date: _this.parseTime(d.ASSESSMENT_START_DTM), score: d.SCORE, form: d.FORM };
                        });
                        nestedData = nest()
                            .key(function (d) { return d['form']; })
                            .entries(data);
                        console.log(nestedData);
                        dates = data.map(function (d) {
                            return d['date'];
                        });
                        if (this.svg.selectAll('.diagrams').size() !== 0) {
                            dates.push(this.yearScale.domain()[0]);
                            dates.push(this.yearScale.domain()[1]);
                        }
                        this.yearScale.domain(extent(dates));
                        this.scoreScale.domain([
                            max([this.scoreScale.domain()[0], max(data, function (d) { return d['score']; })]),
                            min([this.scoreScale.domain()[1], min(data, function (d) { return d['score']; })])
                        ]);
                        this.svg.selectAll('.xAxis')
                            .call(axisBottom(this.yearScale))
                            .selectAll('text')
                            .style('text-anchor', 'end')
                            .attr('dx', '-.8em')
                            .attr('dy', '.15em')
                            .attr('transform', 'rotate(-65)');
                        this.svg.selectAll('.yAxis')
                            .call(axisLeft(this.scoreScale));
                        lineFunc = line()
                            .curve(curveBasis)
                            .x(function (d) {
                            return _this.yearScale(d['date']);
                        })
                            .y(function (d) {
                            return _this.scoreScale(d['score']);
                        });
                        existingDgm = this.svg.selectAll('.diagrams').size() - 1;
                        _loop_2 = function (i) {
                            var nData = nestedData[i];
                            var keyForID = Constants.scoreIds[nData['key']];
                            var dgm = this_2.svg.select("#" + keyForID);
                            /* Add the dgm if not exist */
                            if (dgm.size() === 0) {
                                existingDgm += 1;
                                dgm = this_2.svg.append('g')
                                    .classed('diagrams', true)
                                    .attr('id', keyForID)
                                    .attr('transform', function () {
                                    return 'translate(' + (_this.margin + _this.width * existingDgm) + ',' + _this.margin + ')';
                                });
                                dgm.append('text')
                                    .attr("transform", "translate(0," + this_2.height + ")")
                                    .attr("y", 6)
                                    .attr("dy", "0.71em")
                                    .attr("fill", "#000")
                                    .text(nData['key']);
                                dgm.append('g')
                                    .attr('class', 'xAxis')
                                    .attr('transform', 'translate(0,' + (this_2.height - 2 * this_2.margin) + ')')
                                    .call(axisBottom(this_2.yearScale))
                                    .selectAll('text')
                                    .style('text-anchor', 'end')
                                    .attr('dx', '-.8em')
                                    .attr('dy', '.15em')
                                    .attr('transform', 'rotate(-65)');
                                dgm.append('g')
                                    .attr('class', 'yAxis')
                                    .call(axisLeft(this_2.scoreScale));
                            }
                            /* Add the lines and circles */
                            dgm.selectAll("#score_dgm_" + keyForID + "_" + input.PAT_ID)
                                .data([nData['values']])
                                .enter().append('g')
                                .attr('class', 'formScore')
                                .attr('id', function () { return "score_dgm_" + keyForID + "_" + input.PAT_ID; })
                                .append('path')
                                .attr('class', 'scoreLine')
                                .attr('d', function (d) {
                                return lineFunc(d);
                            });
                            var scoreLine = dgm.selectAll("#score_dgm_" + keyForID + "_" + input.PAT_ID);
                            var circles = scoreLine.selectAll('.scoreCircle')
                                .data(nData['values']);
                            circles.enter().append('circle')
                                .attr('class', 'scoreCircle')
                                .classed(input.PAT_ID, true)
                                .attr('r', 3)
                                .attr('cx', function (g) { return _this.yearScale(g['date']); })
                                .attr('cy', function (g) { return _this.scoreScale(g['score']); });
                        };
                        this_2 = this;
                        for (i = 0; i < nestedData.length; i++) {
                            _loop_2(i);
                        }
                        this.svg.selectAll('.formScore')
                            .selectAll('path')
                            .attr('d', function (d) { return lineFunc(d); });
                        this.svg.selectAll('.formScore')
                            .selectAll('circle')
                            .attr('cx', function (g) { return _this.yearScale(g['date']); })
                            .attr('cy', function (g) { return _this.scoreScale(g['score']); });
                        return [2 /*return*/];
                }
            });
        });
    };
    ScoreDiagram.prototype.removeFromDiagram = function (patId) {
        for (var id in Constants.scoreIds) {
            if (Constants.scoreIds.hasOwnProperty(id)) {
                this.svg.selectAll("#score_dgm_" + Constants.scoreIds[id] + "_" + patId)
                    .remove();
            }
        }
        this.svg.selectAll("." + patId)
            .remove();
    };
    return ScoreDiagram;
}());
export { ScoreDiagram };
export function create(parent, datasetId) {
    return new ScoreDiagram(parent, datasetId);
}
//# sourceMappingURL=scoreDiagram.js.map