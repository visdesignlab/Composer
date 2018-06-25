/**
 * Created by Jen Rogers on 3/22/2018.
 */
import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll, event} from 'd3-selection';
import {nest, values, keys, map, entries} from 'd3-collection';
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal, scaleSqrt} from 'd3-scale';
import * as hierarchy from 'd3-hierarchy';
import {line, curveMonotoneX, curveLinear, linkHorizontal} from 'd3-shape';
import {timeParse} from 'd3-time-format';
import {extent, min, max, ascending} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {drag} from 'd3-drag';
import * as d3 from 'd3';
//import {Constants} from './constants';
import {transition} from 'd3-transition';
import {brush, brushY} from 'd3-brush';
import * as dataCalc from './dataCalculations';
import * as dataManager from './dataManager';
import {ITable, asTable} from 'phovea_core/src/table';
import {IAnyVector, INumericalVector} from 'phovea_core/src/vector';
import {list as listData, getFirstByName, get as getById} from 'phovea_core/src/data';
import {range, list, join, Range, Range1D, all} from 'phovea_core/src/range';
import {asVector} from 'phovea_core/src/vector/Vector';
import {argFilter} from 'phovea_core/src/';

export class EventLine {
    private $node;
    private eventScale;
    private circleScale;
    private filter;
    private startCodes;
    private scoreLabel;
    private startEventLabel;
    private eventToggleLabels;

    constructor(parent: Element, cohort) {

    this.$node = select(parent);
    this.eventScale = scaleLinear().domain([0, 4])
            .range([0, 750]).clamp(true);

    this.circleScale = scaleLinear().domain([0, 3000])
            .range([1, 15]).clamp(true);

    this.scoreLabel = 'Absolute Scale';
    this.startEventLabel = 'Change Start to Event';

    let branchWrapper = this.$node.append('div').classed('branch-wrapper', true);
    branchWrapper.append('svg');
   
    this.attachListener();

    const that = this;
    this.startCodes = null;

    }

    private attachListener() {

    events.on('test', (evt, item)=> {
        console.log(item);
        this.drawBranches(item);
        this.tester(item);

    })

    events.on('send_filter_to_codebar', (evt, item)=> {
       
            //item[0] is for the event start buttons,
            let eventButtonData = item[0];
            
            //item[1] is the entire cohort and branches for the branch lines
            let branchLineData = item[1];

            this.filter = item[0];

            this.drawEventButtons(item[0]);
           // this.updateEvents(eventButtonData);
          //  this.drawBranches(branchLineData);

            let eventIndex =  eventButtonData.length;
            let event =  eventButtonData[eventIndex -1];
         
           if(event[1].length != 0){
            this.startCodes = event[1];
           }else{
               this.startCodes = null;
               this.startEventLabel = 'First Promis Score';
           }
          
    });

    }

    private drawBranches(cohort){
    
        let branchWrapper = this.$node.select('.branch-wrapper');
        let branchSvg = branchWrapper.select('svg');
        branchSvg.selectAll('*').remove();
       //let circleScale = scaleSqrt().range([2, 12]).domain([0, 3000]).clamp(true);

        let cohorts = branchSvg.selectAll('.cohort-lines').data(cohort);

        cohorts.exit().remove();

        let coEnter = cohorts.enter().append('g').attr('class', (d, i) => i).classed('cohort-lines', true);

        cohorts = coEnter.merge(cohorts);

        cohorts.attr('transform', (d, i)=> 'translate(0,' + i * 40 + ')');

        let label = cohorts.append('text').text((d, i)=> {return 'Cohort ' + (i + 1)}).attr('transform', 'translate(0, 10)');
        
        let events = cohorts.append('g').attr('transform', 'translate(60, 0)').selectAll('.events').data(d=> d.events);

        events.exit().remove();

        let eventEnter = events.enter().append('g').classed('.events', true);

        events = eventEnter.merge(events);

        events.attr('transform', (d, i)=> 'translate(' + i * 30 + ', 0)');
        
        let circle = events.append('circle').attr('cx', 5).attr('cy', 5).attr('r', 4);
        
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

          let branchGroups = cohorts.selectAll('.branches').data(d=>d.branches);

          branchGroups.exit().remove();

          let benter = branchGroups.enter().append('g').classed('branches', true);

          branchGroups = benter.merge(branchGroups);

          branchGroups.attr('transform', (d, i) => 'translate(' + ((d.eventIndex * 30) + 60) + ','+ ((i * 10) + 15) + ')');

          console.log(branchGroups);

          let branchEvents = branchGroups.selectAll('.branch-events').data((d, i)=> d.events);

          branchEvents.exit().remove();

          let branchEventsEnter = branchEvents.enter().append('g').classed('branch-events', true);
          
          branchEvents = branchEventsEnter.merge(branchEvents);

          branchEvents.attr('transform', (d, i)=> 'translate(' + i * 30 + ', 0)');

          let branchCircle = branchEvents.append('circle').attr('cx', 5).attr('cy', 5).attr('r', 4);

          branchCircle.on("mouseover", (d) => {
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

          

          var link = linkHorizontal();
         // .x(function(d) { return d.y; })
         // .y(function(d) { return d.x; });
      
    }

    private tester(treedata){
      //  let hierarchy = hierarchy;
      
        let nodes = hierarchy(treedata, function(d){
            return d.branches;
        });

          console.log(treedata);

          let branch = treedata.map(d=> d.branches);

        //  selectAll(cohort)
        console.log(branch);

          function positionLink(d) {
            return "M" + d[0].x + "," + d[0].y
                 + "S" + d[1].x + "," + d[1].y
                 + " " + d[2].x + "," + d[2].y;
          }
    }

    private drawLine(){
        let eventLine = this.$node;
        let eventLineSvg = eventLine.append('svg').classed('event_line_svg', true)
        .attr('height', 25).attr('width', 500);

    }

    private drawEventButtons(filters){
            let that = this;
            
            function filText(d){
                if(d[0] == 'demographic'){return 'First Score'}else{
                    let label = d[1][1];
                    return label[0].parent;
                }
            }

            function labelClick(d){
                let rec = select(d);
                    if(d[0] == 'demographic'){
                      //  events.fire('revert_to_promis');
                        that.startCodes = null;
                        that.startEventLabel = 'First Promis Score';
                        that.drawEventButtons(that.filter);
                        events.fire('event_selected', that.startCodes);
                       
                        }else{
                        
                        that.startCodes = d[1];
                        let label = d[1][1];
                        that.startEventLabel = label[0].parent;
                       
                        that.drawEventButtons(that.filter);
                        events.fire('event_selected', that.startCodes);
                       
                    }
                }

            filters = filters.filter(d=> {return d[0] != 'Branch' || d[0] != 'demographic'});

            this.$node.select('.event-buttons').remove();

            let div = this.$node.append('div').classed('event-buttons', true);
           // let div = this.$node;
            //toggle for event day
            let startPanel = div.append('div').classed('start-event', true);
                    
            let startToggle = startPanel.append('div').classed('btn-group', true);
            startToggle.append('button').classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                                    .append('text').text(this.startEventLabel);
    
            let startTogglebutton = startToggle.append('button')
                                        .classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                                        .classed('dropdown-toggle', true)
                                        .attr('data-toggle', 'dropdown');
    
            startTogglebutton.append('span').classed('caret', true);
    
            let startUl = startToggle.append('ul').classed('dropdown-menu', true).attr('role', 'menu');
            
            let eventLabels = startUl.selectAll('li').data(filters).enter().append('li');
                                      
            eventLabels.append('href').append('text').text(d=> filText(d));

            eventLabels.on('click', d=> labelClick(d));
  
            //toggle for scale
            let scalePanel = div.append('div').classed('scale', true);
                    
            let scaleToggle = scalePanel.append('div').classed('btn-group', true);
            scaleToggle.append('button').classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                                    .append('text').text(this.scoreLabel);

            
            let togglebutton = scaleToggle.append('button')
                                        .classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                                        .classed('dropdown-toggle', true)
                                        .attr('data-toggle', 'dropdown');
    
            togglebutton.append('span').classed('caret', true);
    
                        let ul = scaleToggle.append('ul').classed('dropdown-menu', true).attr('role', 'menu');
                        let abs = ul.append('li').append('href').append('text').text('Absolute');
                        let rel = ul.append('li').append('href').append('text').text('Relative');//.attr('value', 'Absolute');
              
            abs.on('click', () =>{
                            this.scoreLabel = 'Absolute Scale';
                            this.drawEventButtons(this.filter);
                           // this.drawScoreFilterBox(this.scoreBox);
                            events.fire('change_promis_scale', this.scoreLabel)});
    
            rel.on('click', () =>{
                                this.scoreLabel = 'Relative Scale';
                                this.drawEventButtons(this.filter);
                              //  this.drawScoreFilterBox(this.scoreBox);
        
                                events.fire('change_promis_scale', this.scoreLabel)});
    
            let aggToggle = div.append('div').classed('aggDiv', true).append('input')
                            .attr('type', 'button').attr('id', 'aggToggle')
                            .classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                            .attr('value', 'Aggregate Scores')
                            .on('click', () => {
                                events.fire('aggregate_button_clicked');
                            });
            
            let quartDiv = div.append('div').classed('quartDiv', true);
                quartDiv.append('input').attr('type', 'button')
                    .classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                    .attr('value', 'Separate by Quartiles').on('click', () =>{
                        select('.checkDiv').remove();
                        events.fire('separate_aggregate');
                          ///radio aggregation
                        let checkDiv = quartDiv.append('div').classed('checkDiv', true);
                        let tCheck = checkDiv.append('div');
                        tCheck.append('input').attr('type', 'checkbox').attr('name', 'sample').attr('id', 'sampleT').attr('checked', true)
                        .attr('value', 'top').on('click', () => {
    
                            let p = selectAll('.top');
                      
                            if(select("#sampleT").property("checked")){
                                p.classed('hidden', false);
                            }else{
                                p.classed('hidden', true);
                            }
                        })
                        tCheck.append('label').attr('for', 'sampleT').text('top').style('color', '#2874A6');
    
                        let mCheck = checkDiv.append('div');
                        mCheck.append('input').attr('type', 'checkbox').attr('name', 'sample').attr('id', 'sampleM').attr('checked', true)
                        .attr('value', 'middle').on('click', () => {
                            let p = selectAll('.middle');
                            if(select("#sampleM").property("checked")){
                                p.classed('hidden', false);
                            }else{
                                p.classed('hidden', true);
                            }
                        });
                        mCheck.append('label').attr('for', 'sampleM').text('middle').style('color', '#F7DC6F');
    
                        let bCheck = checkDiv.append('div');
                        bCheck.append('input').attr('type', 'checkbox').attr('name', 'sample').attr('id', 'sampleB').attr('checked', true)
                        .attr('value', 'bottom').on('click', () =>{
                            let p = selectAll('.bottom');
                            if(select("#sampleB").property("checked")){
                                p.classed('hidden', false);
                            }else{
                                p.classed('hidden', true);
                            }
                        });
                        bCheck.append('label').attr('for', 'sampleB').text('bottom').style('color', '#fc8d59');
                    });
        }

        private renderOrdersTooltip(tooltip_data) {

            let text = "<strong style='color:darkslateblue'>" + tooltip_data + "</strong></br>";
          
            return text;
        }
}

export function create(parent:Element, cohort) {
    return new EventLine(parent, cohort);
  }