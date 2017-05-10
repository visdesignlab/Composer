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
import {transition} from 'd3-transition';
import {brush, brushY} from 'd3-brush';

export class similarityScoreDiagram {

  private $node;
  private diagram;
  private timeScale;
  private scoreScale;
  private svg;
  private parseTime = timeParse('%x %X');
  private parseTimeOrders = timeParse('%x');
  private brush;

  private proInfo;

  height = 400;
  width = 600;
  margin = {x: 80, y: 40};
  sliderWidth = 10;

  constructor(parent: Element, diagram) {

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
      .attr('transform', `translate(${this.margin.x},${this.height - 2 * this.margin.y})`);

    this.svg.append('text')
      .text('Days')
      .attr('transform', `translate(${(this.width - this.margin.x) / 2},${this.height - this.margin.y})`);

    this.svg.append('g')
      .attr('class', 'yAxis')
      .attr('transform', `translate(${(this.margin.x - this.sliderWidth)},${this.margin.y})`)
      .call(axisLeft(this.scoreScale));

    // -----

    let slider = this.svg.append('g')
      .attr('class', 'slider')
      .attr('transform', `translate(${(this.margin.x - this.sliderWidth + 2)},${this.margin.y})`);

    this.brush = brushY()
      .extent([[0, 0], [this.sliderWidth - 2, this.scoreScale.range()[1]]])
      .on("end", () => {
        let start = event.selection[0];
        let end = event.selection[1];

        this.updateSlider(start, end)
      });

    slider.call(this.brush)
      .call(this.brush.move, this.scoreScale.range());

    // -----

    this.svg.append('text')
      .text(`${this.diagram}`)
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${this.margin.x / 4},${this.height * 0.5}) rotate(-90)`);

    this.svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${this.margin.x},${this.margin.y})`)
      .call(axisLeft(this.scoreScale)
        .tickSize(-(this.width - this.margin.x))
      )
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
  private attachListener() {

    events.on('update_similar', (evt, item) => { // called in queryBox
      this.svg.select('.slider')  // reset slider
        .call(this.brush)
        .call(this.brush.move, this.scoreScale.range());

      this.proInfo = item[1]['target_PRO'];

      this.drawDiagram(item[1]);
    });

    events.on('update_pro_info', (evt, item) => { // called in svgTable
      this.svg.select('.slider')  // reset slider
        .call(this.brush)
        .call(this.brush.move, this.scoreScale.range());

      this.proInfo = item[1]['rows'];

      this.drawDiagram({'target_PRO': item[1]['rows'], 'med_rows': [], 'pro_rows': []});
    });

    events.on('update_orders_info', (evt, item) => { // called in svgTable called right after 'update_pro_info'
      this.addProPoints(item[1]['rows']);
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

    let similarMedData = [];
    for (let index = 0; index < args['med_rows'].length; index++) {
      let curr_pat_info = args['med_rows'][index];
      let filtered = curr_pat_info.filter((d) => {
        return d['FORM'] == this.diagram
      });
      if (filtered.length)
        similarMedData.push(filtered);
    }

    let similarProData = [];
    for (let index = 0; index < args['pro_rows'].length; index++) {
      let curr_pat_info = args['pro_rows'][index];
      let filtered = curr_pat_info.filter((d) => {
        return d['FORM'] == this.diagram
      });
      if (filtered.length)
        similarProData.push(filtered);
    }

    // ----- add diff days to the data

    let maxDiff = 0;

    let minDate = this.findMinDate(patData);
    patData.forEach((d) => {
      d.diff = Math.ceil((this.parseTime(d['ASSESSMENT_START_DTM']).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
      maxDiff = d.diff > maxDiff ? d.diff : maxDiff
    });


    similarMedData.forEach((g) => {
      let minDate = this.findMinDate(g);
      g.forEach((d) => {
        try {
          d.diff = Math.ceil((this.parseTime(d['ASSESSMENT_START_DTM']).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
          maxDiff = d.diff > maxDiff ? d.diff : maxDiff
        }
        catch (TypeError) {
          d.diff = -1;
        }
      })
    });

    similarProData.forEach((g) => {
      let minDate = this.findMinDate(g);
      g.forEach((d) => {
        try {
          d.diff = Math.ceil((this.parseTime(d['ASSESSMENT_START_DTM']).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
          maxDiff = d.diff > maxDiff ? d.diff : maxDiff
        }
        catch (TypeError) {
          d.diff = -1;
        }
      })
    });

    // -----  set domains and axis

    // time scale

    this.timeScale.domain([-1, maxDiff]);

    this.svg.select('.xAxis')
      .call(axisBottom(this.timeScale));

    // -------  define line function

    const lineFunc = line()
      //.curve(curveBasis)
      .x((d) => {
        return this.timeScale(d['diff']);
      })
      .y((d) => {
        return this.scoreScale(+d['SCORE']);
      });

    // ------- draw

    this.svg.select('#pat_score').selectAll('g').remove();
    this.svg.select('#med_score').selectAll('g').remove();
    this.svg.select('#pro_score').selectAll('g').remove();
    this.svg.select('#pat_orders').selectAll('g').remove();

    const patScoreGroup = this.svg.select('#pat_score');
    const patLine = patScoreGroup
      .append('g')
      .attr('transform', () => {
        return `translate(${this.margin.x},${this.margin.y})`;
      })
      .selectAll('.patLine')
      .data([patData])
      .enter()
      .append('path')
      .attr('class', 'patLine')
      .attr('d', (d) => lineFunc(d))
      .on('click', (d) => console.log(d));


    const medScoreGroup = this.svg.select('#med_score');
    medScoreGroup.selectAll('.med_group')
      .data(similarMedData)
      .enter()
      .append('g')
      .attr('transform', () => {
        return `translate(${this.margin.x},${this.margin.y})`;
      })
      .each(function (d) {
        let currGroup = select(this);
        currGroup.append('g')
          .append('path')
          .attr('class', 'medLine')
          .attr('d', () => lineFunc(d));
      })
      .on('click', (d) => console.log(d));


    const proScoreGroup = this.svg.select('#pro_score');
    proScoreGroup.selectAll('.med_group')
      .data(similarProData)
      .enter()
      .append('g')
      .attr('transform', () => {
        return `translate(${this.margin.x},${this.margin.y})`;
      })
      .each(function (d) {
        let currGroup = select(this);
        currGroup.append('g')
          .append('path')
          .attr('class', 'proLine')
          .attr('d', () => lineFunc(d));
      })
      .on('click', (d) => console.log(d));

  }

  /**
   * Utility method
   * @param pat
   * @returns {Date}
   */
  private findMinDate(pat) {
    let minDate = new Date();
    minDate.setFullYear(3000);
    for (let index = 0; index < pat.length; index++) {
      if (!pat[index]['ASSESSMENT_START_DTM']) continue;
      if (this.parseTime(pat[index]['ASSESSMENT_START_DTM']) < minDate)
        minDate = this.parseTime(pat[index]['ASSESSMENT_START_DTM'])
    }
    return minDate
  }


  /**
   * Utility method
   * @param start
   * @param end
   */
  private updateSlider(start, end) {

    let lowScore = this.scoreScale.invert(end);
    let highScore = this.scoreScale.invert(start);

    let pro = this.svg.select('#pro_score')
      .selectAll('path')
      .style('opacity', 0);

    pro.filter(function (d) {
      if (!d.length) return false;
      return d[0].SCORE <= highScore && d[0].SCORE >= lowScore
    }).style('opacity', 1);


    let med = this.svg.select('#med_score')
      .selectAll('path')
      .style('opacity', 0);

    med.filter(function (d) {
      if (!d.length) return false;
      return d[0].SCORE <= highScore && d[0].SCORE >= lowScore
    }).style('opacity', 1)

  }


  /**
   * add lines for orders for a patient
   * @param ordersInfo
   */
  private addProPoints (ordersInfo) {

    let minDate = this.findMinDate(this.proInfo);
    ordersInfo.forEach((d) => {
      let time = null;
      try {
        time = this.parseTimeOrders(d['ORDER_DTM']).getTime();
      }
      catch (TypeError) {
        time = this.parseTime(d['ORDER_DTM']).getTime();
      }
      d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
    });

    this.svg.select('#pat_orders').selectAll('g').remove();

    this.svg.select('#pat_orders')
      .append('g')
      .attr('transform', () => {
        return `translate(${this.margin.x},${this.margin.y})`;
      })
      .selectAll('.patOrder')
      .data(ordersInfo)
      .enter()
      .append('line')
      .attr('class', 'patOrder')
      .attr('x1', (d) => this.timeScale(d['diff']))
      .attr('y1', (d) => this.scoreScale(0))
      .attr('x2', (d) => this.timeScale(d['diff']))
      .attr('y2', (d) => this.scoreScale(100))
      .on('click', (d) => console.log(d));

  }

}


export function create(parent:Element, diagram) {
  return new similarityScoreDiagram(parent, diagram);
}
