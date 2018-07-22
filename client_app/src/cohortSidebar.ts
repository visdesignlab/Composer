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

    events.on('update_chart', (evt, item)=> {
    
       
      if(item){
          let selectedFilters = item.filterArray;
          let cohortPromis = item.promis;
        
          this.DrawfilterDescriptionBox(item);
      }
    });

  }

  async init() {

    let cohortPanel = this.$node.append('div').attr('id', 'cohort_control');
    this.BuildCohortPanel(cohortPanel).then(div => this.cohortKeeper = div.append('svg').classed('cohortSvg', true));
    

    let cohortDetail = this.$node.append('div').attr('id', 'cohort_detail');
    this.BuildFilterPanel(cohortDetail).then(panel => {
      panel.append('div').classed('descriptionDiv', true);
    });

    console.log(this.$node);

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
      let button = cohorthead.append('button').classed('btn', true).classed('btn-default', true).classed('btn-sm', true)
      .append('text').text('+');

      button.attr('margin-left', 10);

      button.on('click', function(d){ 
        events.fire('show_layer_panel'); 
        select(document.getElementById('filterSideBar')).classed('hidden', false);
      });
  
      let cohortBody = panelDiv.append('div').classed('panel-body', true);

      return cohortBody;

    }

    private async updateCohorts(cohortData, div){
      console.log(div);

      div.selectAll('.cohort').remove();
      div.selectAll('.cohort-lines').remove();

      let data = [];
      let rows = [];
    
      cohortData.forEach(d => {
        data.push(d);
        if(d.branches.length != 0){ 
          d.branches.forEach(b => {
            data.push(b);
          });
         };
      });

      let height = data.length;
  
      div.attr('height', height * 30);

     // cohortSvg.append('g');
      
      let cohortKeeper = div.selectAll('.cohort').data(data);

      cohortKeeper.exit().remove();

      let coEnter = cohortKeeper.enter().append('g').attr('class', (d, i)=> 'c-' + i).classed('cohort', true);

      cohortKeeper = coEnter.merge(cohortKeeper);

      let rect = cohortKeeper.append('rect').attr('height', 30).attr('transform', (d, i) => 'translate(0,'+ i * 30 +')');

      let x = cohortKeeper.append('text').text('x');

      x.attr('transform', (d, i)=> 'translate(235, '+ ((i * 30) + 15) + ')');

      x.on('click', function(d, i){
        console.log(this);
        console.log(d);
        console.log('remove_cohort', d);
      });

      data.forEach(c => {
       
        let e = c.filterArray.map((event, i) => {
           let coord = {x: (i * 40) + 65, y: 6 };
           return coord;
        });
        rows.push(e);
        c.rowData = e;
    });

    data.forEach(c => {
  
      if(c.branches.length != 0){
          c.branches.forEach((b, i) => {
              b.rowData = [{x: 27, y: -27 }, {x: 60, y: 0 }];
              b.filterArray.forEach((event, i) => {
                  let coord = {x: (i * 40) + 65, y: 6 };
                  b.rowData.push(coord);
               });
          });
      }
  });



  let linko = line().curve(curveMonotoneX)
  .x(function(d) { return d['x'] })
  .y(function(d) { return d['y'] });

    let cohorts = div.selectAll('.cohort-lines').data(data);
    cohorts.exit().remove();

    let cohEnter = cohorts.enter().append('g').attr('class', (d, i) => d.label).classed('cohort-lines', true);
    cohorts = cohEnter.merge(cohorts);

    cohorts.attr('transform', (d, i)=> 'translate(0,' + ((i * 30) + 10) + ')');

    let label = cohorts.append('g').classed('labels', true);
    label.append('rect').attr('width', 55).attr('height', 18).attr('opacity', 0).attr('transform', 'translate(-3, -13)');;
    label.append('text').text((d, i)=> {return d.label} );
    label.attr('transform', 'translate(3, 10)');
    label.on('click', (d, i)=> {
       
        this.$node.selectAll('.selected').classed('selected', false);
        let thislabel = label.nodes();
        thislabel[i].classList.add('selected');
        console.log(d);
        if(d.parentIndex == null){
            events.fire('cohort_selected', d);
        }else{
            events.fire('branch_selected', d.cohortIndex);
        }
       // events.fire('cohort_selected', [d, i]);
    });

    let linegroups = cohorts.append('g').classed('rows', true).attr('transform', (d) => 'translate('+ (d.eventIndex * 4) +'0)');//.selectAll('.rows').data(d=> d).enter().append('g').classed('rows', true);
    linegroups.append('path').attr('d', (d, i)=> linko(d.rowData)).classed('node-links', true);

   // let wrapperRow = cohorts.append('g').attr('transform', (d, i) => 'translate('+ (d.eventIndex * 6) +'0)');
    
    let cohortevents = linegroups.append('g').classed('event-rows', true).attr('transform', 'translate(60, 0)').selectAll('.events').data(d=> d.filterArray);
    cohortevents.exit().remove();

    let eventEnter = cohortevents.enter().append('g').classed('events', true);

    cohortevents = eventEnter.merge(cohortevents);
    cohortevents.attr('transform', (d, i)=> 'translate(' + i * 40 + ', 0)');

    let circle = cohortevents.append('circle').attr('cx', 5).attr('cy', 5).attr('r', 4);
    circle.on("mouseover", (d) => {
        let t = transition('t').duration(500);
        select(".tooltip")
          .html(() => {
            return this.renderOrdersTooltip(d);
          })
          .transition(t)
          .style("opacity", 1)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mouseout", () => {
        let t = transition('t').duration(500);
        select(".tooltip").transition(t)
        .style("opacity", 0);
      });

  
    }

    private DrawfilterDescriptionBox(cohort){


      let filter = cohort.filterArray.filter(d=> {return d[0] != 'Branch'});
      
      let rectScale = scaleLinear().domain([0, 6000]).range([0, 150]).clamp(true);

      select('.descriptionDiv').selectAll('div').remove();

      const box = select('.descriptionDiv').append('div').classed('panel', true).classed('panel-default', true);
      box.append('div').classed('panel-heading', true).append('text').text(cohort.label + ' Filter Layers');

      let body = box.append('div').classed('panel-body', true);

      let cohortCount = body.append('div').append('text').text('Cohort Size: ' + filter[filter.length - 1][2]);
  
      let barGroup = body.selectAll('.filter_stage').data(filter);
      barGroup.exit().remove();
      let barGroupEnter = barGroup.enter().append('div').classed('filter_stage', true);
      barGroup = barGroupEnter.merge(barGroup);

      let barSvg = barGroup.append('svg').classed('filter_stage_svg', true);

      let rect = barSvg.append('rect').attr('height', 20).attr('width', d=> rectScale(d[2])).attr('transform', 'translate(12, 0)');
      rect.attr('class', d=> classRect(d));

      let text = barSvg.append('g').attr('transform', 'translate(0, 12)');
      text.append('text').text((d, i)=> { return (i + 1) + ': '});

      let description = text.append('text').text(d=> fillText(d)).attr('transform', 'translate(15, 0)');

      function classRect(d){
          let name;
          if(d[0] == 'demographic'){ name = 'demographic';
          }else if(d[0] == 'CPT'){ name = d[1][1][0].parent;
          }else if(d[0] ==  'Score Count'){ name = 'score'; }
          return name;
      }

      function fillText(d){
          let des;
          if(d[0] == 'demographic'){
              if(d[1].length != 0){
                  des = 'Demographic Filter';
              }else{
                  des = 'All Patients';
              }
          }else if(d[0] == 'CPT'){
                  des = d[1][1][0].parent;
              }
          else{ des = d[0] + ' > ' + d[1]; }

          return des;
      }

      text.append('text').text(d => d[2]).attr('transform', 'translate(170, 0)');
      text.on("mouseover", (d) => {
          let t = transition('t').duration(500);
          select(".tooltip")
          .html(() => {
              return this.renderFilterTooltip(d);
          })
          .transition(t)
          .style("opacity", 1)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mouseout", () => {
          let t = transition('t').duration(500);
          select(".tooltip").transition(t)
          .style("opacity", 0);
      });

}

private renderOrdersTooltip(tooltip_data) {

  let text = "<strong style='color:darkslateblue'>" + tooltip_data['value'] + "</strong></br>";

  return text;
}

private renderHistogramTooltip(tooltip_data) {

  let text = "<strong style='color:darkslateblue'>" + tooltip_data.x0 + ' - ' + tooltip_data.x1 + ': ' +  tooltip_data.length + "</strong></br>";
  return text;
}

private renderFilterTooltip(data) {
 
  let text;
  if(data[0]== 'demographic'){
      if(data[1].length == 0){ text = 'All Patients'; 
      }else{
              text = ' ';
              data[1].forEach(f=> {
                 
                  text = text + f.attributeName + ": " + f.checkedOptions[0] + "</br>";
              });
      }

  }else{
      text = data[1][0].parent;
  }

  return text;
}

 }

 

export function create(parent:Element) {
  return new  CohortSideBar(parent);
}