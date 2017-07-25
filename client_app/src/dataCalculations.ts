/**
 * Created by Jen Rogers 07/20/2017.
 */

import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll, event} from 'd3-selection';
import {nest, values, keys, map, entries} from 'd3-collection'
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal} from 'd3-scale';
import {timeParse} from 'd3-time-format';
import {extent, min, max, ascending} from 'd3-array';
import {Constants} from './constants';
import {axisBottom, axisLeft} from 'd3-axis';

export class dataCalc {


}

 /**
     * Utility method
     * @param pat
     * @returns {Date}
     */
    export function findMinDate(pat) {

        let minDate = new Date();
        for (let index = 0; index < pat.length; index++) {
            if (!pat[index]['ASSESSMENT_START_DTM']) continue;
            if (this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null) < minDate)
                minDate = this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null)
        }
        return minDate
    }


/**
     * parse time
     * @param date
     * @param nullDate
     * @returns {null}
     */
    export function parseTime(date, nullDate) {
        let parseT1 = timeParse('%x %X');
        let parseT2 = timeParse('%x');
        let time = nullDate;

        if (date) {
            if (date.split(' ').length > 1) {
                time = parseT1(date);
            }
            else
                time = parseT2(date)
        }
        return time
    }

/**
   * Draw the diagram with the given data from getSimilarRows
   * @param args
   */
  export function setOrderScale() {
    // find the max difference between the first patient visit and the last visit. This determines the domain scale of the graph.
    // ----- add diff days to the data

    let maxDiff = 0;

    let minPatDate = this.findMinDate(this.targetPatientProInfo);
    this.targetPatientProInfo.forEach((d) => {
      d.diff = Math.ceil((this.parseTime(d['ASSESSMENT_START_DTM'], null).getTime() - minPatDate.getTime()) / (1000 * 60 * 60 * 24));
      maxDiff = d.diff > maxDiff ? d.diff : maxDiff
    });
    this.targetPatientProInfo.sort((a, b) => ascending(a.diff, b.diff));

    const patData = this.targetPatientProInfo.filter((d) => {
      return d['FORM'] == this.svg//changed to svg because I dont have a diagram
    });


    // -----  set domain for initial draw call
    this.timeScale.domain([-1, maxDiff]);
    this.timeScaleMini.domain([-1,maxDiff]);
    

    events.on('brushed', (newMin, newMax) => {  // from brushed in rect exploration
    
   //------- set domain after brush event
    console.log(newMax[1]);
    if (this.brush.move != null) {
      this.timeScale.domain([newMax[0], newMax[1]])
    }
    
    
    return this.timeScale.domain([newMax[0], newMax[1]]);
   
    });
    
    this.svg.select('.xAxis')
      .call(axisBottom(this.timeScale));
  }
