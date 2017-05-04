/**
 * Created by saharmehrpour on 4/20/17.
 */
import { select } from 'd3-selection';
import { entries } from 'd3-collection';
import * as events from 'phovea_core/src/event';
import { scaleLinear } from 'd3-scale';
import { line, curveBasis } from 'd3-shape';
import { timeParse } from 'd3-time-format';
import { axisBottom, axisLeft } from 'd3-axis';
var similarityScoreDiagram = (function () {
    function similarityScoreDiagram(parent, diagram) {
        this.parseTime = timeParse('%x %X');
        this.height = 400;
        this.width = 600;
        this.margin = 40;
        this.diagram = diagram;
        this.$node = select(parent)
            .append('div')
            .classed('diagramDiv', true);
        this.svg = this.$node.append('svg')
            .attr('height', this.height)
            .attr('width', this.width);
        // scales
        this.visitScale = scaleLinear().range([0, this.width - 2 * this.margin]); // changed from scaleTime()
        this.scoreScale = scaleLinear()
            .domain([100, 0])
            .range([0, this.height - 3 * this.margin]);
        // axis
        this.svg.append('g')
            .attr('class', 'xAxis')
            .attr('transform', "translate(" + this.margin + "," + (this.height - 2 * this.margin) + ")");
        this.svg.append('text')
            .text('Number of visits')
            .attr('transform', "translate(" + (this.width - this.margin) / 2 + "," + (this.height - this.margin) + ")");
        this.svg.append('g')
            .attr('class', 'yAxis')
            .attr('transform', "translate(" + this.margin + "," + this.margin + ")")
            .call(axisLeft(this.scoreScale));
        this.svg.append('text')
            .text("" + this.diagram)
            .attr('transform', "translate(" + this.margin / 4 + "," + this.height * 0.75 + ") rotate(-90)");
        this.svg.append('g')
            .attr('class', 'grid')
            .attr('transform', "translate(" + this.margin + "," + this.margin + ")")
            .call(axisLeft(this.scoreScale)
            .tickSize(-(this.width - this.margin)))
            .selectAll('text').remove();
        this.svg.append('g')
            .attr('id', 'pat_score');
        this.svg.append('g')
            .attr('id', 'med_score');
        this.svg.append('g')
            .attr('id', 'pro_score');
        this.attachListener();
    }
    /**
     * Attach listeners
     */
    similarityScoreDiagram.prototype.attachListener = function () {
        var _this = this;
        events.on('similar_score_diagram', function (evt, item) {
            _this.drawDiagram(item[1]);
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
        var similarMedData = {};
        for (var index = 0; index < args['med_rows'].length; index++) {
            var curr_pat_info = args['med_rows'][index];
            similarMedData[curr_pat_info[0]['PAT_ID']] = curr_pat_info.filter(function (d) {
                return d['FORM'] == _this.diagram;
            });
        }
        var similarProData = {};
        for (var index = 0; index < args['pro_rows'].length; index++) {
            var curr_pat_info = args['pro_rows'][index];
            similarProData[curr_pat_info[0]['PAT_ID']] = curr_pat_info.filter(function (d) {
                return d['FORM'] == _this.diagram;
            });
        }
        //console.log(patData, similarMedData, similarProData);
        // -----  set domains and axis
        // time scale
        /*
         let tempDates = this.findAllColValue(patData, entries(similarMedData), entries(similarProData), 'ASSESSMENT_START_DTM');
         let dates = tempDates.map((d) => this.parseTime(d));
         if (this.svg.selectAll('.diagrams').size() !== 0) {
         dates.push(this.yearScale.domain()[0]);
         dates.push(this.yearScale.domain()[1]);
         }
         this.yearScale.domain(extent(dates));
         */
        var maxLength = this.findLength(patData, entries(similarMedData), entries(similarProData));
        this.visitScale.domain([0, maxLength]);
        // score scale
        /*
         const allScores = this.findAllColValue(patData, entries(similarMedData), entries(similarProData), 'SCORE');
         this.scoreScale.domain([
         max([this.scoreScale.domain()[0], max(allScores, (d) => +d)]),
         min([this.scoreScale.domain()[1], min(allScores, (d) => +d)])
         ]);
         */
        // set x-Axis and y-Axis
        /*
        this.svg.select('.grid')
          .call(axisLeft(this.scoreScale)
            .tickSize(-(this.width - this.margin))
          )
          .selectAll('text').remove();
    
        this.svg.select('.yAxis')
          .call(axisLeft(this.scoreScale));
        */
        this.svg.select('.xAxis')
            .call(axisBottom(this.visitScale));
        // -------  define line function
        var lineFunc = line()
            .curve(curveBasis)
            .x(function (d, i) {
            return _this.visitScale(i);
            //return this.yearScale(this.parseTime(d['ASSESSMENT_START_DTM']));
        })
            .y(function (d) {
            return _this.scoreScale(+d['SCORE']);
        });
        // ------- draw
        this.svg.select('#pat_score').selectAll('g').remove();
        this.svg.select('#med_score').selectAll('g').remove();
        this.svg.select('#pro_score').selectAll('g').remove();
        var patScoreGroup = this.svg.select('#pat_score');
        var patLine = patScoreGroup
            .append('g')
            .attr('transform', function () {
            return "translate(" + _this.margin + "," + _this.margin + ")";
        })
            .selectAll('.patLine')
            .data([patData])
            .enter()
            .append('path')
            .attr('class', 'patLine')
            .attr('d', function (d) { return lineFunc(d); });
        var medScoreGroup = this.svg.select('#med_score');
        medScoreGroup.selectAll('.med_group')
            .data(entries(similarMedData))
            .enter()
            .append('g')
            .attr('transform', function () {
            return "translate(" + _this.margin + "," + _this.margin + ")";
        })
            .each(function (d) {
            var currGroup = select(this);
            currGroup.append('g')
                .append('path')
                .attr('class', 'medLine')
                .attr('d', function () { return lineFunc(d.value); });
        });
        var proScoreGroup = this.svg.select('#pro_score');
        proScoreGroup.selectAll('.med_group')
            .data(entries(similarProData))
            .enter()
            .append('g')
            .attr('transform', function () {
            return "translate(" + _this.margin + "," + _this.margin + ")";
        })
            .each(function (d) {
            var currGroup = select(this);
            currGroup.append('g')
                .append('path')
                .attr('class', 'proLine')
                .attr('d', function () { return lineFunc(d.value); });
        });
    };
    similarityScoreDiagram.prototype.findAllColValue = function (pat, medPats, proPats, col) {
        var result = pat.map(function (d) { return d[col]; });
        for (var i = 0; i < medPats.length; i++) {
            var temp = medPats[i].value;
            result = result.concat(temp.map(function (d) { return d[col]; }));
        }
        for (var i = 0; i < proPats.length; i++) {
            var temp = proPats[i].value;
            result = result.concat(temp.map(function (d) { return d[col]; }));
        }
        return result;
    };
    similarityScoreDiagram.prototype.findLength = function (pat, medPats, proPats) {
        var result = pat.length;
        for (var i = 0; i < medPats.length; i++) {
            result = Math.max(result, medPats[i].value.length);
        }
        for (var i = 0; i < proPats.length; i++) {
            result = Math.max(result, proPats[i].value.length);
        }
        return result;
    };
    return similarityScoreDiagram;
}());
export { similarityScoreDiagram };
export function create(parent, diagram) {
    return new similarityScoreDiagram(parent, diagram);
}
//# sourceMappingURL=similarityScoreDiagram.js.map