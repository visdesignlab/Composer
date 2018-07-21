/**
 * Created by Jen on 11/4/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll, event} from 'd3-selection';
import {values,keys,entries} from 'd3-collection';
import {type} from 'os';
import * as events from 'phovea_core/src/event';
import {scaleLinear,scaleTime,scaleOrdinal, scaleBand, scaleLog} from 'd3-scale';
import {area, line, curveMonotoneX, curveMonotoneY, curveLinear, curveBasis} from 'd3-shape';
//importing other modules from app
import * as demoGraph from './demoGraphs';
import {axisBottom} from 'd3-axis';
import {extent, min, max, ascending, histogram, mean, deviation} from 'd3-array';
import { all } from 'phovea_core/src/range';
import {brushX} from 'd3-brush';
import {transition} from 'd3-transition';
import { stringify } from 'querystring';

export class CohortSideBar {

  private $node;
  private filters;
  private popRectScale;
  private populationDemo;
  private xScale;
  private yScale;
  private svgWidth;
  private svgHeight;
  private barBrush;
  private bmiRange;
  private cciRange;
  private ageRange;
  private bmiBrush;
  private cciBrush;
  private ageBrush;
  private distributionHeader;
  private demoform;
  private cohortKeeper;
  private selected;
  private branchSelected;
  private comparisonNum;
  private layerBool;
  comparisonArray;

  constructor(parent: Element) {
    
    this.$node = select(parent);
    this.popRectScale = scaleLinear().range([0,150]);
 
    this.xScale = scaleLinear();
    this.yScale = scaleLinear().range([0, 30]);
    this.svgWidth = 170;
    this.svgHeight = 40;
    this.branchSelected = null;
    this.comparisonNum = 2;
    this.comparisonArray = [];


    //this.buildComparisonFilter(compare);
    
    this.attachListener();
  }

  private attachListener () {

    events.on('test', (evt, item)=> {
      this.updateCohorts(item[0], this.cohortKeeper);
    });




      }

  async init() {

    let cohortPanel = this.$node.append('div').attr('id', 'cohort_control');
    this.BuildCohortPanel(cohortPanel).then(div => this.cohortKeeper = div);
    

    let cohortDetail = this.$node.append('div').attr('id', 'cohort_detail');
    this.BuildFilterPanel(cohortDetail);

    }

    private async BuildCohortPanel(panelDiv){

      let cohorthead = panelDiv.append('div').classed('panel-head', true);
      cohorthead.append('text').text('Cohort Control');
  
      let cohortBody = panelDiv.append('div').classed('panel-body', true);
  
      let create = cohortBody.append('button').classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
      .append('text').text('+ 1');

      create.on('click', function(d){ events.fire('create_button_down'); });
  
      let clear = cohortBody.append('button').classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
      .append('text').text('clear all');

      clear.on('click', function(d){ events.fire('clear_cohorts'); });

      return cohortBody;

    }

    private async BuildFilterPanel(panelDiv){

      let cohorthead = panelDiv.append('div').classed('panel-head', true);
      cohorthead.append('text').text('Applied Filters');
  
      let cohortBody = panelDiv.append('div').classed('panel-body', true);


    }

    private async updateCohorts(cohorts, div){
      console.log(div);

      let cohortKeeper = div.selectAll('.cohorts').data(cohorts);

      cohortKeeper.exit().remove();

      let coEnter = cohortKeeper.enter().append('div').classed('cohorts', true);

      cohortKeeper = coEnter.merge(cohortKeeper);

  
    }


  private renderOrdersTooltip(tooltip_data) {

    let text = "<strong style='color:darkslateblue'>" + tooltip_data.x0 + ' - ' + tooltip_data.x1 + ': ' +  tooltip_data.length + "</strong></br>";

    return text;
}

 }

 

export function create(parent:Element) {
  return new  CohortSideBar(parent);
}