/**
 * Created by Jen Rogers 07/20/2017.
 */
import { select } from 'd3-selection';
import * as events from 'phovea_core/src/event';
import { timeParse } from 'd3-time-format';
import { ascending } from 'd3-array';
import { axisBottom } from 'd3-axis';

var dataCalc = (function() {
    function dataCalc() {}
    return dataCalc;
}());
export { dataCalc };
/**
 * Utility method
 * @param pat
 * @returns {Date}
 */
export function findMinDate(pat) {
    var minDate = new Date();
    for (var index = 0; index < pat.length; index++) {
        if (!pat[index]['ASSESSMENT_START_DTM'])
            continue;
        if (this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null) < minDate)
            minDate = this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null);
    }
    return minDate;
}
/**
 * parse time
 * @param date
 * @param nullDate
 * @returns {null}
 */
export function parseTime(date, nullDate) {
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
}
/**
 * Draw the diagram with the given data from getSimilarRows
 * @param args
 */
export function setOrderScale() {
    // find the max difference between the first patient visit and the last visit. This determines the domain scale of the graph.
    // ----- add diff days to the data
    var _this = this;
    var maxDiff = 0;
    var minPatDate = this.findMinDate(this.targetPatientProInfo);
    this.targetPatientProInfo.forEach(function(d) {
        d.diff = Math.ceil((_this.parseTime(d['ASSESSMENT_START_DTM'], null).getTime() - minPatDate.getTime()) / (1000 * 60 * 60 * 24));
        maxDiff = d.diff > maxDiff ? d.diff : maxDiff;
    });
    this.targetPatientProInfo.sort(function(a, b) { return ascending(a.diff, b.diff); });
    var patData = this.targetPatientProInfo.filter(function(d) {
        return d['FORM'] == _this.svg; //changed to svg because I dont have a diagram
    });
    // -----  set domain for initial draw call
    this.timeScale.domain([-1, maxDiff]);
    this.timeScaleMini.domain([-1, maxDiff]);
    events.on('brushed', function(newMin, newMax) {
        //------- set domain after brush event
        console.log(newMax[1]);
        if (_this.brush.move != null) {
            _this.timeScale.domain([newMax[0], newMax[1]]);
        }
        return _this.timeScale.domain([newMax[0], newMax[1]]);
    });
    this.svg.select('.xAxis')
        .call(axisBottom(this.timeScale));
}
export function getClassAssignment(attString) {
    //this uses a work around to use a function with classed. As well it preserves the already assinged classes
    return function(d) {
        var element = select(this);
        element.classed(d[attString], true);
        return element.attr('class');
    };
}
//# sourceMappingURL=dataCalculations.js.map