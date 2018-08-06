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
    
    this.attachListener();
  }

  private attachListener () {

    events.on('test', (evt, item)=> {
      this.groupEvents(item[0], true).then(d=> {
        console.log(d);
        
        this.updateCohorts(d, this.cohortKeeper).then(cohorts=> {
              let index = item[1];
              let selected = cohorts.filter(c=> c.cohortIndex == index);
              selected.classed('selected', true);
            });
            
          });
    });

    events.on('update_chart', (evt, item)=> {
      if(item){
          let selectedFilters = item.filterArray;
          let cohortPromis = item.promis;
        if(selectedFilters.length > 0){
          this.DrawfilterDescriptionBox(item);
        }
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

    }

    private async BuildCohortPanel(panelDiv){
      let cohorthead = panelDiv.append('div').classed('panel-head', true).style('height', '70px');
      let headertext = cohorthead.append('div').style('display', 'block').style('padding-left', '0').style('float', 'none').attr('width', 200).append('text').text('Cohort Control');
  
      let cohortBody = panelDiv.append('div').classed('panel-body', true);

      let buttondiv = cohorthead.append('div').attr('width', 200).style('padding-left', '0').style('display', 'block').style('float', 'none');
  
      let create = buttondiv.append('button').classed('btn', true).classed('btn-default', true).classed('btn-sm', true)
      .append('text').text('+ 1');

      create.on('click', function(d){ events.fire('create_button_down'); });
  
      let clear = buttondiv.append('button').classed('btn', true).classed('btn-default', true).classed('btn-sm', true)
      .append('text').text('clear all');

      clear.on('click', function(d){ events.fire('clear_cohorts'); });

      return cohortBody;
    }

    private async BuildFilterPanel(panelDiv){

      let cohorthead = panelDiv.append('div').classed('panel-head', true);
      cohorthead.append('text').text('Applied Filters').style('padding-right', '20px');
      let button = cohorthead.append('button').classed('btn', true).classed('btn-default', true).classed('btn-sm', true);
      button.append('text').text('+');

      button.on('click', ()=> {
        let filterBox = select(document.getElementById('filterSideBar'));
        if(filterBox.classed('hidden')){
          filterBox.classed('hidden', false);
        }else{ 
          filterBox.classed('hidden', true); }
      });

      button.attr('transform', 'translate(10, 0)');

      let cohortBody = panelDiv.append('div').classed('panel-body', true);

      return cohortBody;

    }

    private async groupEvents(cohortData, groupBool){
  
      let data = [];
    
      let newData = cohortData.map(d=> {
        data.push(d);
        if(d.branches.length != 0){
          d.branches.map(b=> {
            data.push(b);
            if(b.branches.length != 0){ b.branches.map(p=> data.push(p)); }
          });
        }
      });
      if(groupBool == true){
        let test = data.map((co, i)=> {
          if(co.filterArray.length > 3){
            console.log(co);
            let tempFilterArray = [];
            let tempEvents = [];
            let stopIndex = co.filterArray.length - 1;
            
            let index;
            for(index = 0; index < stopIndex; index++){
              tempEvents.push(co.filterArray[index]);
            }
            tempFilterArray.push(tempEvents);
            for(index; index < co.filterArray.length; index++){
              tempFilterArray.push(co.filterArray[index]);
            }
            co.filterArray = tempFilterArray;
          }
          return co;
        });
        return test;
      }else{
        console.log('ungroup');
        let test = data.map((co, i)=> {
          if(co.filterArray[0].length > 1){
            let temp = [];
            co.filterArray.forEach(fil => {
                if(fil.length > 1){
                    fil.forEach(f => { temp.push(f); });
                }else{ temp.push(fil); }
            });
            co.filterArray = temp;
         }
         return co;
        });
        return test;
      }
    }

    private async updateCohorts(data, div){

      div.selectAll('.cohort').remove();
      div.selectAll('.cohort-lines').remove();

      let height = data.length;
      let width = 260;
  
      div.attr('height', height * 30);

      let cohortKeeper = div.selectAll('.cohort').data(data);
      cohortKeeper.exit().remove();
      let coEnter = cohortKeeper.enter().append('g').attr('class', (d, i)=> 'c-' + i).classed('cohort', true);
      cohortKeeper = coEnter.merge(cohortKeeper);

      let rect = cohortKeeper.append('rect').attr('height', 30).attr('width', width).attr('transform', (d, i) => 'translate(0,'+ i * 30 +')');

      let xGroup = cohortKeeper.append('g').classed('x', true);
      xGroup.append('rect').style('fill', 'white').style('width', '20px').attr('height', 20).style('opacity', '.7');
      
      let x = xGroup.append('text').text('x').classed('x', true).attr('transform', 'translate(7, 14)');
      xGroup.attr('transform', (d, i)=> 'translate(230,'+ ((i * 30) + 4) + ')');

      xGroup.on('click', function(d, i){ events.fire('remove_cohort', d); });

      let moveLength = Math.max.apply(null, data.map(d=> {
        if(d.branches.length > 0) { 
          let total = +d.filterArray.length;
          total = total + d.branches[0].filterArray.length;
          return +total;
        }
        else{ return +d.filterArray.length;}
      }));

      data.forEach(c => {
        let e = c.filterArray.map(function(event, i){
          let index = +i;
          let xMove = (index * (140/moveLength)) + 65;
          if(event.length > 1){ 
            let coord = [{x: xMove, y: 6 },{x: xMove + 6, y: 6}, {x: xMove + 9, y: 0}, {x: xMove + 12, y: 12}, {x: xMove + 14, y: 6}];
            return coord;
          }else{
            let coord = {x: xMove, y: 6 };
            return coord;
          }
        });
        let tempArray = [];
        e.forEach((element) => {
          if(element.length > 1){ 
            element.forEach(p=> tempArray.push(p));
          }else{ tempArray.push(element); }
        });
        c.rowData = tempArray;
       
      });

      data.forEach(c => {
        if(c.branches.length != 0){
            c.branches.forEach((b, i) => {
                b.rowData = [{x: (0 - (140/moveLength)) + 65, y: -27 }, {x: ((0 - (140/moveLength))/ 2) + 65, y: 0 }];
                b.filterArray.forEach((event, j) => {
                  let xMove = (+j * (140/moveLength)) + 65;
                    if(event.length > 1){ 
                      b.rowData.push({x: xMove, y: 6 }, {x: xMove + 6, y: 6}, {x: xMove + 9, y: 0}, {x: xMove + 12, y: 12}, {x: xMove + 14, y: 6});
                    }else{
                      let coord = {x: xMove, y: 6 };
                      b.rowData.push(coord);
                    }
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
            if(d.parentIndex == null){
                events.fire('cohort_selected', d);
            }else{
                events.fire('branch_selected', d.cohortIndex);
            }
        });

        function translateEvent(d){ return d.eventIndex * (140/+moveLength); }

        let linegroups = cohorts.append('g').classed('rows', true).attr('transform', (d) => 'translate('+ translateEvent(d) +',0)');//.selectAll('.rows').data(d=> d).enter().append('g').classed('rows', true);
        let linePath = linegroups.append('path').attr('d', (d, i)=> linko(d.rowData)).classed('node-links', true);

        let cohortevents = linegroups.append('g').classed('event-rows', true).attr('transform', 'translate(60, 0)').selectAll('.events').data(d=> d.filterArray);
        cohortevents.exit().remove();

        let eventEnter = cohortevents.enter().append('g').classed('events', true);

        cohortevents = eventEnter.merge(cohortevents);
        cohortevents.attr('transform', (d, i)=> 'translate(' + i * (140/moveLength) + ', 0)');

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

          let nested = cohortevents.filter(d=> d.length > 1);
       
          nested.classed('agg', true);
          nested.select('circle').attr('r', 6);

          nested.on('click', (d, i)=> {
            this.groupEvents(data, false).then(g=> {
              this.updateCohorts(g, this.cohortKeeper).then(co=> {
                  let selected = co.filter(c=> c.flatIndex == i);
                  selected.classed('selected', true);
              });
            });
          });

          let last = selectAll('.event-rows').nodes();
          selectAll('.lastChild').classed('lastChild', false);

          last.forEach((c, i) => {
            let eventNodes = select(c).selectAll('.events').nodes();
            let index = eventNodes.length;
            let lastChild = eventNodes[index - 1];
            select(lastChild).classed('lastChild', true)
                .on("mouseover", (d) => {
                  let t = transition('t').duration(500);
                  select(".tooltip")
                  .html(() => {
                      return this.renderBranchTooltip(d);
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

          let text = select(lastChild).append('g').append('text').text('+');
   
          text.attr('transform', 'translate(1, 10)');

          text.on("mouseover", (d) => {
            let t = transition('t').duration(500);
            select(".tooltip")
            .html(() => {
                return this.renderBranchTooltip(d);
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
          select(lastChild).on('click', (d, i)=> {
            events.fire('branch_cohort');
          });
          });

          return cohortKeeper;
      }

    private DrawfilterDescriptionBox(cohort){

        let data = [];
        cohort.filterArray.forEach(event => {
          if(event.length > 1){ 
            event.forEach(c => {data.push(c)});
          }else{data.push(event); }
        });
 
      let filter = data.filter(d=> {return d.type != 'Branch'});

      let rectScale = scaleLinear().domain([0, 6000]).range([0, 150]).clamp(true);

      select('.descriptionDiv').selectAll('div').remove();

      const box = select('.descriptionDiv').append('div').classed('panel', true).classed('panel-default', true);
      box.append('div').classed('panel-heading', true).append('text').text(cohort.label + ' Filter Layers');

      let body = box.append('div').classed('panel-body', true);

      let cohortCount = body.append('div').append('text').text('Cohort Size: ' + filter[filter.length - 1]['count']);
  
      let barGroup = body.selectAll('.filter_stage').data(filter);
      barGroup.exit().remove();
      let barGroupEnter = barGroup.enter().append('div').classed('filter_stage', true);
      barGroup = barGroupEnter.merge(barGroup);

      let barSvg = barGroup.append('svg').classed('filter_stage_svg', true);
     
      let rect = barSvg.append('rect').attr('height', 20).attr('width', d=> rectScale(d['count'])).attr('transform', 'translate(12, 0)');
      rect.attr('class', d=> classRect(d));
      rect.classed('c-' + cohort.flatIndex, true);
      let text = barSvg.append('g').attr('transform', 'translate(0, 12)');
      text.append('text').text((d, i)=> { return (i + 1) + ': '});

      let xGroup = barSvg.append('g').classed('x', true);
      
      xGroup.append('rect').style('fill', 'gray').style('width', '20px').attr('height', 20).style('opacity', '.7');
      
      let x = xGroup.append('text').text('x').classed('x', true).attr('transform', 'translate(7, 14)');
      xGroup.attr('transform', (d, i)=> 'translate(205, 0)');

      xGroup.on('click', function(d, i){
        events.fire('remove_filter', d);
      });

      let description = text.append('text').text(d=> fillText(d)).attr('transform', 'translate(15, 0)');

      function classRect(d){
          let name;
          if(d.type == 'Demographic'){ name = 'demographic';
          }else if(d.type == 'CPT'){ name = d.type;
          }else if(d.type ==  'Score Count'){ name = 'score'; }
          else{ name = 'start'; }
          return name;
      }

      function fillText(d){
          let des;
          if(d.type == 'Demographic'){
              if(d.value.length != 0){
                  des = d.filter;
              }else{ des = 'All Patients'; }
          }else if(d.type == 'CPT'){ des = d.filter;
          }else if(d.type == 'Start'){ des = 'All Patients'; }
          else{ des = d.filter + ' > ' + d.value; }

          return des;
      }

      text.append('text').text(d => d['count']).attr('transform', 'translate(170, 0)');
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
  let text = data.filter + '</br>';

  if(data.value != null){ 
    if(data.filter == 'BMI' || data.filter == 'AGE' || data.filter == 'CCI'){ text = text + data.value[0] + ' - ' + data.value[1]; 
    }else if(data.filter == 'ALCOHOL'){ 
      text = data.value.forEach(v => { 
        text + String(v) + ', '} );}
  }
  return text;
}

private renderBranchTooltip(data) {
 
  let text = "<strong style='color:darkslateblue'>Branch Cohort</strong></br>";
 
  return text;
}


 }

 

export function create(parent:Element) {
  return new  CohortSideBar(parent);
}