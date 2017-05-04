/**
 * Created by saharmehrpour on 4/20/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll,event} from 'd3-selection';
import {nest,values,keys,map,entries} from 'd3-collection'
import * as events from 'phovea_core/src/event';
import {scaleLinear,scaleTime,scaleOrdinal} from 'd3-scale';
import {line,curveBasis} from 'd3-shape';
import {timeParse} from 'd3-time-format';
import {extent,min,max} from 'd3-array';
import {axisBottom,axisLeft} from 'd3-axis';
import {drag} from 'd3-drag';
import {Constants} from './constants';
import {dispatch} from 'd3-dispatch'

export class similarityScoreDiagram {

  private $node;
  private diagram;
  private visitScale;
  private scoreScale;
  private svg;
  private parseTime = timeParse('%x %X');

  height = 400;
  width = 600;
  margin = 40;

  constructor(parent: Element, diagram) {

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
      .attr('transform', `translate(${this.margin},${this.height - 2 * this.margin})`);

    this.svg.append('text')
      .text('Number of visits')
      .attr('transform', `translate(${(this.width - this.margin) / 2},${this.height - this.margin})`);

    this.svg.append('g')
      .attr('class', 'yAxis')
      .attr('transform', `translate(${this.margin},${this.margin})`)
      .call(axisLeft(this.scoreScale));

    this.svg.append('text')
      .text(`${this.diagram}`)
      .attr('transform', `translate(${this.margin / 4},${this.height * 0.75}) rotate(-90)`);

    this.svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${this.margin},${this.margin})`)
      .call(axisLeft(this.scoreScale)
        .tickSize(-(this.width - this.margin))
      )
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
  private attachListener() {
    events.on('similar_score_diagram', (evt, item) => { // called in svgTable
      this.drawDiagram(item[1]);
    });
  }

  /**
   * Draw the diagram with the given data from getSimilarRows
   * @param args
   */
  private drawDiagram(args) {

    const patData = args['target_PRO'].filter((d) => {
      return d['FORM'] == this.diagram
    });

    let similarMedData = {};
    for (let index = 0; index < args['med_rows'].length; index++) {
      let curr_pat_info = args['med_rows'][index];
      similarMedData[curr_pat_info[0]['PAT_ID']] = curr_pat_info.filter((d) => {
        return d['FORM'] == this.diagram
      });
    }

    let similarProData = {};
    for (let index = 0; index < args['pro_rows'].length; index++) {
      let curr_pat_info = args['pro_rows'][index];
      similarProData[curr_pat_info[0]['PAT_ID']] = curr_pat_info.filter((d) => {
        return d['FORM'] == this.diagram
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

    let maxLength = this.findLength(patData, entries(similarMedData), entries(similarProData));
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

    const lineFunc = line()
      .curve(curveBasis)
      .x((d,i) => {
        return this.visitScale(i);
        //return this.yearScale(this.parseTime(d['ASSESSMENT_START_DTM']));
      })
      .y((d) => {
        return this.scoreScale(+d['SCORE']);
      });

    // ------- draw

    this.svg.select('#pat_score').selectAll('g').remove();
    this.svg.select('#med_score').selectAll('g').remove();
    this.svg.select('#pro_score').selectAll('g').remove();

    const patScoreGroup = this.svg.select('#pat_score');
    const patLine = patScoreGroup
      .append('g')
      .attr('transform', () => {
        return `translate(${this.margin},${this.margin})`;
      })
      .selectAll('.patLine')
      .data([patData])
      .enter()
      .append('path')
      .attr('class', 'patLine')
      .attr('d', (d) => lineFunc(d));


    const medScoreGroup = this.svg.select('#med_score');
    medScoreGroup.selectAll('.med_group')
      .data(entries(similarMedData))
      .enter()
      .append('g')
      .attr('transform', () => {
        return `translate(${this.margin},${this.margin})`;
      })
      .each(function (d) {
        let currGroup = select(this);
        currGroup.append('g')
          .append('path')
          .attr('class', 'medLine')
          .attr('d', () => lineFunc(d.value));

      });


    const proScoreGroup = this.svg.select('#pro_score');
    proScoreGroup.selectAll('.med_group')
      .data(entries(similarProData))
      .enter()
      .append('g')
      .attr('transform', () => {
        return `translate(${this.margin},${this.margin})`;
      })
      .each(function (d) {
        let currGroup = select(this);
        currGroup.append('g')
          .append('path')
          .attr('class', 'proLine')
          .attr('d', () => lineFunc(d.value));

      });


  }

  private findAllColValue(pat, medPats, proPats, col) {
    let result = pat.map((d) => d[col]);
    for (let i = 0; i < medPats.length; i++) {
      let temp = medPats[i].value;
      result = result.concat(temp.map((d) => d[col]));
    }
    for (let i = 0; i < proPats.length; i++) {
      let temp = proPats[i].value;
      result = result.concat(temp.map((d) => d[col]));
    }
    return result;
  }

  private findLength(pat, medPats, proPats) {
    let result = pat.length;
    for (let i = 0; i < medPats.length; i++) {
      result = Math.max(result, medPats[i].value.length);
    }
    for (let i = 0; i < proPats.length; i++) {
      result = Math.max(result, proPats[i].value.length);
    }
    return result;
  }

}


export function create(parent:Element, diagram) {
  return new similarityScoreDiagram(parent, diagram);
}
