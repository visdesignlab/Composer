/**
 * Created by saharmehrpour on 4/12/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll,event} from 'd3-selection';
import {nest,values,keys,map} from 'd3-collection'
import * as events from 'phovea_core/src/event';
import {scaleLinear,scaleTime,scaleOrdinal} from 'd3-scale';
import {line,curveBasis} from 'd3-shape';
import {timeParse} from 'd3-time-format';
import {extent,min,max} from 'd3-array';
import {axisBottom,axisLeft} from 'd3-axis';
import {Constants} from './constants';

export class ScoreDiagram {

  private $node;
  private datasetId;
  private yearScale;
  private scoreScale;
  //private colorScale;
  private svg;
  private parseTime = timeParse('%x %X');

  height = 300;
  width = 300;
  margin = 20;

  constructor(parent: Element, datasetId) {

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

  private attachListener() {
    events.on('init_score_diagram', (evt, item) => {
      const url = `/data_api/getPatInfo/${this.datasetId}/${item[1]}`;
      const dic = {'func': 'init', 'URL': url, 'arg': 'rows', 'PAT_ID': item[1]};

      // reset
      this.svg.selectAll('g').remove();
      this.yearScale = scaleTime().range([0, this.width - 2 * this.margin]);
      this.scoreScale = scaleLinear().range([0, this.height - 2 * this.margin]);

      this.drawDiagram(dic);
    });

    events.on('add_score_diagram', (evt, item) => {
      const url = `/data_api/getPatInfo/${this.datasetId}/${item[1]}`;
      const dic = {'func': 'add', 'URL': url, 'arg': 'rows', 'PAT_ID': item[1]};
      this.drawDiagram(dic);
    });

    events.on('remove_score_diagram', (evt, item) => {
      this.removeFromDiagram(item[1]);
    });

  }

  /**
   *
   * @param input
   * @returns {Promise<void>}
   */
  private async drawDiagram(input) {
    const args = await ajax.getAPIJSON(input.URL);
    const data = args[input.arg].map((d) => {
      return {date: this.parseTime(d.ASSESSMENT_START_DTM), score: d.SCORE, form: d.FORM};
    });

    const nestedData = nest()
      .key((d) => d['form'])
      .entries(data);

    console.log(nestedData);

    // set domains and axis

    let dates = data.map(function (d) {
      return d['date']
    });
    if (this.svg.selectAll('.diagrams').size() !==0 ) {
      dates.push(this.yearScale.domain()[0]);
      dates.push(this.yearScale.domain()[1]);
    }
    this.yearScale.domain(extent(dates));

    this.scoreScale.domain([
      max([this.scoreScale.domain()[0], max(data, (d) => d['score'])]),
      min([this.scoreScale.domain()[1], min(data, (d) => d['score'])])
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

    // define line function

    const lineFunc = line()
      .curve(curveBasis)
      .x((d) => {
        return this.yearScale(d['date']);
      })
      .y((d) => {
        return this.scoreScale(d['score']);
      });

    // draw

    let existingDgm = this.svg.selectAll('.diagrams').size() - 1;

    for (let i = 0; i < nestedData.length; i++) {

      const nData = nestedData[i];
      const keyForID = Constants.scoreIds[nData['key']];

      let dgm = this.svg.select(`#${keyForID}`);

      /* Add the dgm if not exist */

      if (dgm.size() === 0) {
        existingDgm += 1;

        dgm = this.svg.append('g')
          .classed('diagrams', true)
          .attr('id', keyForID)
          .attr('transform', () => {
            return 'translate(' + (this.margin + this.width * existingDgm) + ',' + this.margin + ')';
          });

        dgm.append('text')
          .attr("transform", "translate(0," + this.height + ")")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("fill", "#000")
          .text(nData['key']);

        dgm.append('g')
          .attr('class', 'xAxis')
          .attr('transform', 'translate(0,' + (this.height - 2 * this.margin) + ')')
          .call(axisBottom(this.yearScale))
          .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '.15em')
          .attr('transform', 'rotate(-65)');

        dgm.append('g')
          .attr('class', 'yAxis')
          .call(axisLeft(this.scoreScale));
      }

      /* Add the lines and circles */

      dgm.selectAll(`#score_dgm_${keyForID}_${input.PAT_ID}`)
        .data([nData['values']])
        .enter().append('g')
        .attr('class', 'formScore')
        .attr('id', () => `score_dgm_${keyForID}_${input.PAT_ID}`)
        .append('path')
        .attr('class', 'scoreLine')
        .attr('d', (d) => {
          return lineFunc(d)
        });

      let scoreLine = dgm.selectAll(`#score_dgm_${keyForID}_${input.PAT_ID}`);

      let circles = scoreLine.selectAll('.scoreCircle')
        .data(nData['values']);

      circles.enter().append('circle')
        .attr('class', 'scoreCircle')
        .classed(`circle_${input.PAT_ID}`, true)
        .attr('r', 3)
        .attr('cx', (g) => this.yearScale(g['date']))
        .attr('cy', (g) => this.scoreScale(g['score']))
        .on('mouseover', function (g) {
          select('.tooltip')
            .style('opacity', 1);
          select('.tooltip').html(() => {
            return `${g['date']}, ${g['score']}`;
          })
            .style('left', (event.pageX) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function () {
          select('.tooltip')
            .style('opacity', 0);
        });;

    }

    this.svg.selectAll('.formScore')
      .selectAll('path')
      .attr('d', (d) => lineFunc(d));

    this.svg.selectAll('.formScore')
      .selectAll('circle')
      .attr('cx', (g) => this.yearScale(g['date']))
      .attr('cy', (g) => this.scoreScale(g['score']));

  }

  private removeFromDiagram (patId) {
    for(let id in Constants.scoreIds){
      if( Constants.scoreIds.hasOwnProperty(id) ) {
        this.svg.selectAll(`#score_dgm_${Constants.scoreIds[id]}_${patId}`)
          .remove();
      }
    }
  }
}

export function create(parent:Element, datasetId) {
  return new ScoreDiagram(parent, datasetId);
}

