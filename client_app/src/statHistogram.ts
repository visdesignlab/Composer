/**
 * Created by saharmehrpour on 5/7/17.
 */


import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll} from 'd3-selection';
import {scaleLinear,scaleTime,scaleOrdinal} from 'd3-scale';
import {nest,values,keys,map,entries} from 'd3-collection';
import {transition} from 'd3-transition';
import {axisBottom,axisLeft} from 'd3-axis';
import {Constants} from './constants';
import * as events from 'phovea_core/src/event';

export class StatHistogram {

  private $node;
  private xScale;
  private similarData;
  private allData;

  private svgDimension = {width: 250, height: 150, title: 180, spacing: 2};

  private colorRangeSimilar = ['#8dbfff', '#0092ff'];
  private similarColorScale = scaleLinear<string>().domain([0,100]).range(this.colorRangeSimilar);
  private colorRangeAll = ['#adc9aa', '#05c95d'];
  private allColorScale = scaleLinear<string>().domain([0,100]).range(this.colorRangeAll);

  constructor(parent: Element) {

    this.$node = select(parent)
      .append('div')
      .classed('allHistogramDiv', true);

    this.xScale = scaleLinear()
      .domain([0, 100])
      .range([0, this.svgDimension.width/2 - this.svgDimension.spacing]);

    this.getData('/data_api/getStat').then((args) => {
      this.allData = args;
      this.attachListener();

      this.drawHistogram('GENDER');
      this.drawHistogram('BMI');
    });

  }

  /**
   * Draw the initial histogram for all data on the left of the mid line
   * @param hist
   */
  private drawHistogram (hist) {

    let svg = this.$node
      .append('div')
      .classed('histogramDiv', true)
      .append('svg')
      .classed('histogramSVG', true)
      .append('g')
      .attr('transform', `translate(5,0)`)
      .attr('id', `histogram_${hist}`);

    let midLine = svg
      .append('line')
      .classed('midLine', true)
      .attr('x1', this.svgDimension.width / 2)
      .attr('y1', 0)
      .attr('x2', this.svgDimension.width / 2)
      .attr('y2', this.svgDimension.height);

    let allData = [];
    switch (hist) {
      case 'GENDER':
        allData = this.allData['gender'];
        break;
      case 'BMI':
        allData = this.allData['bmi'];
        break;
    }

    let histogramRectAll = svg.selectAll('.histogramRectAll')
      .data(allData);

    histogramRectAll
      .enter()
      .append('rect')
      .classed('histogramRectAll', true)
      .attr('x', this.xScale(100))
      .attr('y', (d, i) => {
        return i * this.svgDimension.height / allData.length + this.svgDimension.spacing
      })
      .attr('width', 0)
      .attr('height', () => {
        return this.svgDimension.height / allData.length - this.svgDimension.spacing
      });

    let t = transition('t').duration(1000);

    histogramRectAll.enter()
      .merge(histogramRectAll)
      .selectAll('rect')
      .transition(t)
      .attr('x', (d) => {
        return this.xScale(100) - this.xScale(d / this.allData['length'] * 100)
      })
      .attr('width', (d) => {
        return this.xScale(d / this.allData['length'] * 100)
      })
      .style('fill', (d) => {
        return this.allColorScale(d / this.allData['length'] * 100)
      });

    // labels
    svg.selectAll('.allLabels')
      .data(Constants.histogramLabels[hist])
      .enter()
      .append('text')
      .classed('allLabels', true)
      .attr('x', 0)
      .attr('y', (d, i) => {
        return i * this.svgDimension.height / allData.length + this.svgDimension.spacing
          + (this.svgDimension.height / allData.length - this.svgDimension.spacing) / 2
      })
      .attr('text-anchor', 'start')
      .text((d) => d);

    // title
    svg.append('text')
      .attr('x', this.svgDimension.width / 2)
      .attr('y', this.svgDimension.title)
      .attr('text-anchor', 'middle')
      .text(hist);

    // axis
    svg.append('g')
      .attr('class', 'xAxis')
      .attr('transform', `translate(${this.svgDimension.width / 2 + 2},${this.svgDimension.height})`)
      .call(axisBottom(this.xScale)
        .ticks(5));

    let leftScale = scaleLinear()
      .domain([0, 100])
      .range([this.svgDimension.width / 2 - this.svgDimension.spacing, 0]);

    svg.append('g')
      .attr('class', 'xAxis')
      .attr('transform', `translate(0,${this.svgDimension.height})`)
      .call(axisBottom(leftScale)
        .ticks(5));

  }

  /**
   * Draw/Update the histogram for similar patients
   * @param hist
   */
  private updateHistogram (hist) {

    let groups = [];
    let allData = [];

    switch (hist) {
      case 'GENDER':
        groups.push(this.similarData['rows'].filter((d) => {
          return d['PAT_GENDER'] == 'F';
        }));
        groups.push(this.similarData['rows'].filter((d) => {
          return d['PAT_GENDER'] == 'M';
        }));
        allData = this.allData['gender'];
        break;
      case 'BMI':
        groups.push(this.similarData['rows'].filter((d) => {
          return d['BMI'] == '';
        }));
        groups.push(this.similarData['rows'].filter((d) => {
          return +d['BMI'] <= 18 && d['BMI'];
        }));
        groups.push(this.similarData['rows'].filter((d) => {
          return +d['BMI'] > 18 && +d['BMI'] <= 21;
        }));
        groups.push(this.similarData['rows'].filter((d) => {
          return +d['BMI'] > 21 && +d['BMI'] <= 24;
        }));
        groups.push(this.similarData['rows'].filter((d) => {
          return +d['BMI'] > 24 && +d['BMI'] <= 27;
        }));
        groups.push(this.similarData['rows'].filter((d) => {
          return +d['BMI'] > 27 && +d['BMI'] <= 30;
        }));
        groups.push(this.similarData['rows'].filter((d) => {
          return +d['BMI'] > 30;
        }));
        allData = this.allData['bmi'];
        break;
    }

    let svg = this.$node.select(`#histogram_${hist}`);

    let histogramRectSimilar = svg.selectAll('.histogramRectSimilar')
      .data(groups);

    histogramRectSimilar
      .enter()
      .append('rect')
      .classed('histogramRectSimilar', true)
      .attr('x', () => {
        return this.svgDimension.width / 2 + this.svgDimension.spacing
      })
      .attr('y', (d, i) => {
        return i * (this.svgDimension.height) / groups.length + this.svgDimension.spacing
      })
      .attr('width', 0)
      .attr('height', () => {
        return this.svgDimension.height / groups.length - this.svgDimension.spacing
      });

    let t = transition('t').duration(1000);

    histogramRectSimilar = svg.selectAll('.histogramRectSimilar')
      .attr('width', function () {
        return select(this).attr('width');
      })
      .transition(t)
      .attr('width', (d) => {
        return this.xScale(d.length / this.similarData['rows'].length * 100)
      })
      .style('fill', (d) => {
        return this.similarColorScale(d.length / this.similarData['rows'].length * 100)
      });


    //console.log(groups);
    //console.log(allData);
    //console.log(this.allData['test']);

    // proportion
    let histogramRectProportion = svg.selectAll('.histogramRectProportion')
      .data(groups);

    histogramRectProportion
      .enter()
      .append('rect')
      .classed('histogramRectProportion', true)
      .attr('x', () => {
        return this.svgDimension.width / 2 - this.svgDimension.spacing
      })
      .attr('y', (d, i) => {
        return i * (this.svgDimension.height) / groups.length + this.svgDimension.spacing
      })
      .attr('width', 0)
      .attr('height', () => {
        return this.svgDimension.height / groups.length - this.svgDimension.spacing
      });

    histogramRectProportion = svg.selectAll('.histogramRectProportion')
      .attr('width', function () {
        return select(this).attr('width');
      })
      .transition(t)
      .attr('x', (d, i) => {
        return this.xScale(100) - this.xScale(d.length / allData[i] * 100)
      })
      .attr('width', (d, i) => {
        return this.xScale(d.length / allData[i] * 100)
      })
      .style('fill', (d, i) => {
        return 'darkred';
        //return this.similarColorScale(allData[i] - d.length / this.similarData['rows'].length * 100)
      });
  }

  /**
   * Attaching listener
   */
  private attachListener() {

    events.on('update_similar', (evt, item) => {
      this.similarData = item[1];
      this.updateHistogram('GENDER');
      this.updateHistogram('BMI');

    });

  }


  /**
   * get Data by API
   * @param URL
   * @returns {Promise<any>}
   */
  private async getData(URL) {
    return await ajax.getAPIJSON(URL);
  }

  /**
   * Show or hide the application loading indicator
   * @param isBusy
   */
  setBusy(isBusy: boolean) {
    let status = select('.busy').classed('hidden');
    if (status == isBusy)
      select('.busy').classed('hidden', !isBusy);
  }

}

export function create(parent:Element) {
  return new StatHistogram(parent);
}

