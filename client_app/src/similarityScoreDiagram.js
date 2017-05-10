/**
 * Created by saharmehrpour on 4/20/17.
 */
import { select, event } from 'd3-selection';
import * as events from 'phovea_core/src/event';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { timeParse } from 'd3-time-format';
import { axisBottom, axisLeft } from 'd3-axis';
import { brushY } from 'd3-brush';
var similarityScoreDiagram = (function () {
    function similarityScoreDiagram(parent, diagram) {
        var _this = this;
        this.parseTime = timeParse('%x %X');
        this.parseTimeOrders = timeParse('%x');
        this.height = 400;
        this.width = 600;
        this.margin = { x: 80, y: 40 };
        this.sliderWidth = 10;
        this.diagram = diagram;
        this.$node = select(parent)
            .append('div')
            .classed('diagramDiv', true);
        this.svg = this.$node.append('svg')
            .attr('height', this.height)
            .attr('width', this.width);
        // scales
        this.timeScale = scaleLinear()
            .range([0, this.width - 2 * this.margin.x]);
        this.scoreScale = scaleLinear()
            .domain([100, 0])
            .range([0, this.height - 3 * this.margin.y]);
        // axis
        this.svg.append('g')
            .attr('class', 'xAxis')
            .attr('transform', "translate(" + this.margin.x + "," + (this.height - 2 * this.margin.y) + ")");
        this.svg.append('text')
            .text('Days')
            .attr('transform', "translate(" + (this.width - this.margin.x) / 2 + "," + (this.height - this.margin.y) + ")");
        this.svg.append('g')
            .attr('class', 'yAxis')
            .attr('transform', "translate(" + (this.margin.x - this.sliderWidth) + "," + this.margin.y + ")")
            .call(axisLeft(this.scoreScale));
        // -----
        var slider = this.svg.append('g')
            .attr('class', 'slider')
            .attr('transform', "translate(" + (this.margin.x - this.sliderWidth + 2) + "," + this.margin.y + ")");
        this.brush = brushY()
            .extent([[0, 0], [this.sliderWidth - 2, this.scoreScale.range()[1]]])
            .on("end", function () {
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
            .attr('transform', "translate(" + this.margin.x / 4 + "," + this.height * 0.5 + ") rotate(-90)");
        this.svg.append('g')
            .attr('class', 'grid')
            .attr('transform', "translate(" + this.margin.x + "," + this.margin.y + ")")
            .call(axisLeft(this.scoreScale)
            .tickSize(-(this.width - this.margin.x)))
            .selectAll('text').remove();
        this.svg.append('g')
            .attr('id', 'pat_score');
        this.svg.append('g')
            .attr('id', 'med_score');
        this.svg.append('g')
            .attr('id', 'pro_score');
        this.svg.append('g')
            .attr('id', 'pat_orders');
        this.attachListener();
    }
    /**
     * Attach listeners
     */
    similarityScoreDiagram.prototype.attachListener = function () {
        var _this = this;
        events.on('update_similar', function (evt, item) {
            _this.svg.select('.slider') // reset slider
                .call(_this.brush)
                .call(_this.brush.move, _this.scoreScale.range());
            _this.proInfo = item[1]['target_PRO'];
            _this.drawDiagram(item[1]);
        });
        events.on('update_pro_info', function (evt, item) {
            _this.svg.select('.slider') // reset slider
                .call(_this.brush)
                .call(_this.brush.move, _this.scoreScale.range());
            _this.proInfo = item[1]['rows'];
            _this.drawDiagram({ 'target_PRO': item[1]['rows'], 'med_rows': [], 'pro_rows': [] });
        });
        events.on('update_orders_info', function (evt, item) {
            _this.addProPoints(item[1]['rows']);
        });
    };
    /**
     * Draw the diagram with the given data from getSimilarRows
     * @param args
     */
    similarityScoreDiagram.prototype.drawDiagram = function (args) {
        var _this = this;
        var patData = args['target_PRO'].filter(function (d) {
            return d['FORM'] == _this.diagram;
        });
        var similarMedData = [];
        for (var index = 0; index < args['med_rows'].length; index++) {
            var curr_pat_info = args['med_rows'][index];
            var filtered = curr_pat_info.filter(function (d) {
                return d['FORM'] == _this.diagram;
            });
            if (filtered.length)
                similarMedData.push(filtered);
        }
        var similarProData = [];
        for (var index = 0; index < args['pro_rows'].length; index++) {
            var curr_pat_info = args['pro_rows'][index];
            var filtered = curr_pat_info.filter(function (d) {
                return d['FORM'] == _this.diagram;
            });
            if (filtered.length)
                similarProData.push(filtered);
        }
        // ----- add diff days to the data
        var maxDiff = 0;
        var minDate = this.findMinDate(patData);
        patData.forEach(function (d) {
            d.diff = Math.ceil((_this.parseTime(d['ASSESSMENT_START_DTM']).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
            maxDiff = d.diff > maxDiff ? d.diff : maxDiff;
        });
        similarMedData.forEach(function (g) {
            var minDate = _this.findMinDate(g);
            g.forEach(function (d) {
                try {
                    d.diff = Math.ceil((_this.parseTime(d['ASSESSMENT_START_DTM']).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
                    maxDiff = d.diff > maxDiff ? d.diff : maxDiff;
                }
                catch (TypeError) {
                    d.diff = -1;
                }
            });
        });
        similarProData.forEach(function (g) {
            var minDate = _this.findMinDate(g);
            g.forEach(function (d) {
                try {
                    d.diff = Math.ceil((_this.parseTime(d['ASSESSMENT_START_DTM']).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
                    maxDiff = d.diff > maxDiff ? d.diff : maxDiff;
                }
                catch (TypeError) {
                    d.diff = -1;
                }
            });
        });
        // -----  set domains and axis
        // time scale
        this.timeScale.domain([-1, maxDiff]);
        this.svg.select('.xAxis')
            .call(axisBottom(this.timeScale));
        // -------  define line function
        var lineFunc = line()
            .x(function (d) {
            return _this.timeScale(d['diff']);
        })
            .y(function (d) {
            return _this.scoreScale(+d['SCORE']);
        });
        // ------- draw
        this.svg.select('#pat_score').selectAll('g').remove();
        this.svg.select('#med_score').selectAll('g').remove();
        this.svg.select('#pro_score').selectAll('g').remove();
        this.svg.select('#pat_orders').selectAll('g').remove();
        var patScoreGroup = this.svg.select('#pat_score');
        var patLine = patScoreGroup
            .append('g')
            .attr('transform', function () {
            return "translate(" + _this.margin.x + "," + _this.margin.y + ")";
        })
            .selectAll('.patLine')
            .data([patData])
            .enter()
            .append('path')
            .attr('class', 'patLine')
            .attr('d', function (d) { return lineFunc(d); })
            .on('click', function (d) { return console.log(d); });
        var medScoreGroup = this.svg.select('#med_score');
        medScoreGroup.selectAll('.med_group')
            .data(similarMedData)
            .enter()
            .append('g')
            .attr('transform', function () {
            return "translate(" + _this.margin.x + "," + _this.margin.y + ")";
        })
            .each(function (d) {
            var currGroup = select(this);
            currGroup.append('g')
                .append('path')
                .attr('class', 'medLine')
                .attr('d', function () { return lineFunc(d); });
        })
            .on('click', function (d) { return console.log(d); });
        var proScoreGroup = this.svg.select('#pro_score');
        proScoreGroup.selectAll('.med_group')
            .data(similarProData)
            .enter()
            .append('g')
            .attr('transform', function () {
            return "translate(" + _this.margin.x + "," + _this.margin.y + ")";
        })
            .each(function (d) {
            var currGroup = select(this);
            currGroup.append('g')
                .append('path')
                .attr('class', 'proLine')
                .attr('d', function () { return lineFunc(d); });
        })
            .on('click', function (d) { return console.log(d); });
    };
    /**
     * Utility method
     * @param pat
     * @returns {Date}
     */
    similarityScoreDiagram.prototype.findMinDate = function (pat) {
        var minDate = new Date();
        minDate.setFullYear(3000);
        for (var index = 0; index < pat.length; index++) {
            if (!pat[index]['ASSESSMENT_START_DTM'])
                continue;
            if (this.parseTime(pat[index]['ASSESSMENT_START_DTM']) < minDate)
                minDate = this.parseTime(pat[index]['ASSESSMENT_START_DTM']);
        }
        return minDate;
    };
    /**
     * Utility method
     * @param start
     * @param end
     */
    similarityScoreDiagram.prototype.updateSlider = function (start, end) {
        var lowScore = this.scoreScale.invert(end);
        var highScore = this.scoreScale.invert(start);
        var pro = this.svg.select('#pro_score')
            .selectAll('path')
            .style('opacity', 0);
        pro.filter(function (d) {
            if (!d.length)
                return false;
            return d[0].SCORE <= highScore && d[0].SCORE >= lowScore;
        }).style('opacity', 1);
        var med = this.svg.select('#med_score')
            .selectAll('path')
            .style('opacity', 0);
        med.filter(function (d) {
            if (!d.length)
                return false;
            return d[0].SCORE <= highScore && d[0].SCORE >= lowScore;
        }).style('opacity', 1);
    };
    /**
     * add lines for orders for a patient
     * @param ordersInfo
     */
    similarityScoreDiagram.prototype.addProPoints = function (ordersInfo) {
        var _this = this;
        var minDate = this.findMinDate(this.proInfo);
        ordersInfo.forEach(function (d) {
            var time = null;
            try {
                time = _this.parseTimeOrders(d['ORDER_DTM']).getTime();
            }
            catch (TypeError) {
                time = _this.parseTime(d['ORDER_DTM']).getTime();
            }
            d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
        });
        this.svg.select('#pat_orders').selectAll('g').remove();
        this.svg.select('#pat_orders')
            .append('g')
            .attr('transform', function () {
            return "translate(" + _this.margin.x + "," + _this.margin.y + ")";
        })
            .selectAll('.patOrder')
            .data(ordersInfo)
            .enter()
            .append('line')
            .attr('class', 'patOrder')
            .attr('x1', function (d) { return _this.timeScale(d['diff']); })
            .attr('y1', function (d) { return _this.scoreScale(0); })
            .attr('x2', function (d) { return _this.timeScale(d['diff']); })
            .attr('y2', function (d) { return _this.scoreScale(100); })
            .on('click', function (d) { return console.log(d); });
    };
    return similarityScoreDiagram;
}());
export { similarityScoreDiagram };
export function create(parent, diagram) {
    return new similarityScoreDiagram(parent, diagram);
}
//# sourceMappingURL=similarityScoreDiagram.js.map