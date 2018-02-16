/**
 * Created by Jen on 11/4/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll, event} from 'd3-selection';
import {values,keys,entries} from 'd3-collection';
import {type} from 'os';
import * as events from 'phovea_core/src/event';
//import {transition} from 'd3-transition';
//import {Constants} from './constants';
import * as parallel from './parallel';
import {scaleLinear,scaleTime,scaleOrdinal, scaleBand, scaleLog} from 'd3-scale';
//importing other modules from app
import * as demoGraph from './demoGraphs';
import {axisBottom} from 'd3-axis';
import {extent, min, max, ascending, histogram, mean, deviation} from 'd3-array';
import { all } from 'phovea_core/src/range';

export class SideBar {

  private $node;
  private filters;
  private popRectScale;
  private populationDemo;
  private xScale;
  private yScale;
  private svgWidth;
  private svgHeight;

      private header = [
        {'key': 'PAT_ETHNICITY', 'label': 'Ethnicity', 'value': ['W', 'H' ]},
        {'key': 'GENDER', 'label': 'Gender', 'value': ['M', 'F' ]},
        {'key': 'RACE', 'label': 'Race', 'value': ['C', 'B', 'O' ]},
        {'key': 'MARITAL_STATUS', 'label': 'Marital Status', 'value': ['M', 'W', 'S', 'D', 'U' ]},
        {'key': 'TOBACCO', 'label': 'Tobacco Use', 'value': ['Quit', 'Yes', 'NaN', 'Never' ]},
        {'key': 'ALCOHOL','label': 'Alcohol Use', 'value': ['Yes', 'No', 'Not Asked', 'NaN' ]},
        {'key': 'DRUG_USER','label': 'Drug Use', 'value': ['Yes', 'No', 'Not Asked', 'NaN' ]},
        {'key': 'DM_CODE', 'label': 'Diabetic', 'value': [250.0, 0 ]},
      //  {'key': 'BMI', 'label': 'BMI', 'value': null},
      //  {'key': 'CCI', 'label': 'BMI', 'value': null},

      ];

      private distributionHeader;
      
  constructor(parent: Element) {
    
    this.$node = select(parent);
    this.popRectScale = scaleLinear().range([0,150]);
    this.$node.append('div').attr('id', 'filterDiv');
   // const distributions = this.$node.append('div').classed('distributions', true);
   // demoGraph.create(distributions.node());
    this.xScale = scaleLinear();//.rangeRound([0, 200]);
    this.yScale = scaleLinear().range([0, 30]);
    this.svgWidth = 180;
    this.svgHeight = 50;
  
    this.attachListener();
  }

  private attachListener () {
    
       events.on('filter_counted', (evt, item) => {//this get the count from the group

         let allCount = item[0];
         let popCount = item[1];
         let parentValue = item[2];
     
         this.popRectScale.domain([0, allCount]);
         let selected = select('#' +parentValue);
         selected.select('text').text(popCount)
         .attr('transform', 'translate('+ this.popRectScale(popCount) +', 10)');
         selected.select('rect').transition() 
         .attr('width', this.popRectScale(popCount));
    
       });

       events.on('population demo loaded', (evt, item)=> {
            
        this.populationDemo = item;
        this.distribute(item);
     
       });
      }

  async init() {

    this.filters = [];
    let parents = [];
    let that = this;

    let form = this.$node.select('#filterDiv').append('form');

    let filterButton = form.insert('input').attr('type', 'button').attr('value', 'Create Cohort');

    let labels = form.append('div').classed('labelWrapper', true).selectAll('.labelDiv')
        .data(this.header);

    let distLabel = form.append('div').classed('distributionWrapper', true);
   // this.drawDistribution('BMI');

    let labelsEnter = labels
        .enter()
        .append('div').classed('labelDiv', true);

    labels.exit().remove();

    labels = labelsEnter.merge(labels);

    let ul = labels.append('ul')
        .attr('value', (d=>d.key));

        let popRects = labels.append('svg').attr('width', 150).attr('height', 16).attr('id', d=>d.key);
        popRects.append('rect').attr('width', 0).attr('height', 16).attr('fill', '#AEB6BF');
        popRects.append('text').attr('fill', '#AEB6BF');

        popRects.classed('hidden', true);

        let headerLabel = ul.append('label')
        .text(function(d) {return d.label;}).attr('value', (d=>d.key));

        let listlabel = ul.selectAll('li').data((d) => {
          if(d.value != null) {return d.value};
         });
        
        let listlabelEnter = listlabel.enter().append('li');

        listlabel.exit().remove();

        listlabel = listlabelEnter.merge(listlabel);
        
        listlabel.text((d) => d);
        ul.selectAll('li').attr('value', ((d) => d));
        ul.selectAll('li').classed('hidden', true);

      headerLabel.on('click', function(d){
       
         let svgLabel = (this.parentNode.parentNode).querySelector('svg');
         let children = (this.parentNode).querySelectorAll('li');
         children.forEach(element => {
           if(element.classList.contains('hidden')) {
            element.classList.remove('hidden');
            svgLabel.classList.remove('hidden');
           }else{
            element.classList.add('hidden');
            svgLabel.classList.add('hidden');
           }
           
         });
        });

        listlabel.insert('input').attr('type', 'checkbox').attr('value', (d=>d));

        let liHover = ul.selectAll('li');
        
        liHover.on('mouseover', function(d){
          let parentValue = this.parentNode.attributes[0].value;
    
          events.fire('checkbox_hover', [parentValue, d]);
        });
        liHover.on('mouseout', function(d){
     
          select(this.parentNode.parentNode).select('rect').attr('width', 0);
          select(this.parentNode.parentNode).select('text').text(' ');
       
        });
    
        listlabel.on('click', function(d){

          let choice = d;

          let parentValue = this.parentNode.attributes[0].value;
          let parental = this.parentNode.classList.add('parent');

          parents.push(parental);

          let lines = select('#plotGroup').selectAll('path');
          let filterGroup = lines.filter(d => d[parentValue] == choice);

          filterGroup.classed(parentValue, true);
        });

        let filterList = [];
        that.filters = [];

       // let distributions = listlabel.append('div').

      
       filterButton.on('click', function(d){

    
                          let parentFilter = form.selectAll('ul.parent');

                          parentFilter.each(function (element) {
          
                                 let filter = {
                                     attributeName:(this).attributes[0].value,
                                     checkedOptions: []
                                    };

                          let children = select(this).selectAll('li').selectAll('input');


                          children.nodes().forEach(d => {
                                 if(select(d).property('checked')){
                                    filter.checkedOptions.push(d['value']);
                                    d['checked'] = false;
                                  }
                              });

                          filterList.push(filter);
                          });

                          events.fire('demo_filter_button_pushed', filterList);
                          that.filters = [];
                          filterList = [];
                          parentFilter.classed('parent', false);
                          form.selectAll('li').classed('hidden', true);
                          });

        
          }

  private histogrammer(data, type, ticks){

    let totalPatients = data.length;

    let mapped = data.map((d: number)=> +d[type]);

    let maxValue = max(mapped);

   console.log(maxValue);

 // if (type == 'BMI') mapped = mapped.filter(d => d > 0);
   let x = this.xScale.domain([0, maxValue]).nice();

    let bins = histogram()
    .domain(x.domain())
    .thresholds(x.ticks(ticks))
    (mapped);

    //return bins;

    let histogramData = bins.map(function (d) {
      totalPatients -= d.length;
      return {x0: d.x0, x1: d.x1, length: d.length, totalPatients: totalPatients + d.length, binCount: bins.length, frequency: d.length/bins.length};
    });

    return histogramData;
  }

  private distribute(data){

    let totalPatients = data.length;

    let mappedBMI = data.map((d: number) => +d['BMI']);

    let mappedAGE = data.map((d: number) => d['AGE']);

    let mappedCCI = data.map((d: number) => d['CCI']);

    let BMIbins = histogram()
    .domain([0,100])
    .thresholds(10)
    (mappedBMI);

    let AGEbins = histogram()
    .domain([0,100])
    .thresholds(10)
    (mappedAGE);

    let CCIbins = histogram()
    .domain([0,100])
    .thresholds(10)
    (mappedCCI);

    let binBMI = this.histogrammer(data, 'BMI', 8);
    let binCCI = this.histogrammer(data, 'CCI', 22);
    let binAGE = this.histogrammer(data, 'AGE', 9);

   this.distributionHeader = [
    {'key': 'BMI', 'label': 'BMI', 'value': binBMI},
    {'key': 'CCI', 'label': 'CCI', 'value': binCCI},
    {'key': 'AGE', 'label': 'Age', 'value': binAGE},
    ];
    console.log(this.distributionHeader);
    this.drawDistributionBands(this.distributionHeader);
    this.drawHistogram(binBMI, 'BMI');
    this.drawHistogram(binCCI, 'CCI');
    this.drawHistogram(binAGE, 'AGE');

  }

  private drawHistogram(histobins, type) {

    this.yScale.domain([0, max(histobins, function (d) {
        return d['frequency'] + .1;
    })]);

    //////////////bar groups for all data////////////////////////////////
    let barGroupsALL = this.$node.select('.distributionWrapper').select('.' +type).selectAll('.barALL')
    .data(histobins);

    barGroupsALL.exit().remove();

let barEnterALL = barGroupsALL.enter().append("g")
    .attr("class", "barALL");

    barGroupsALL = barEnterALL.merge(barGroupsALL);

    barGroupsALL
    .attr("transform", (d, i) => {
        return "translate(" +  i * this.svgWidth/d.binCount + ",0)";
    });
    barEnterALL.append("rect");

    barGroupsALL.select('rect')
    .transition(9000)
    .attr("x", 1)
    .attr("y", (d) => {
        return 30 - this.yScale(d.frequency);
    })
  
    .attr('width', d=> (this.svgWidth/d.binCount)-1)
    .attr("height", (d) => {
        return this.yScale(d.frequency);
   });


  }

  private drawDistributionBands(data) {

  let distScale = scaleLinear().domain([0, 1000]);

   let x = this.xScale.domain([0, 80]).nice();
   let xAxis = axisBottom(x).ticks(10);
   let distLabel = this.$node.select('.distributionWrapper');
   let distDiagrams = distLabel.selectAll('.distLabel').data(data);
   let distLabelEnter = distDiagrams.enter().append('div').classed('distLabel', true);
   distDiagrams.exit().remove();
   distDiagrams = distLabelEnter.merge(distDiagrams);
   this.$node.selectAll('.distLabel').attr('height', '30');
   let ul = distDiagrams.append('ul');
   let label = ul.append('label').attr('value', (d=>d.key)).text(function(d) {return d.label;});
   let distFilter = distDiagrams.append('g').classed('distFilter', true).attr('width', this.svgWidth);

   let distSvg = distFilter.append('svg').attr('class', d=> {return d.key}).classed('distDetail_svg', true).classed('hidden', true);
   let distFilter_svg = distFilter.append('svg').classed('distFilter_svg', true).attr('width', this.svgWidth);//.classed('hidden', true)

  let rects = distFilter_svg.selectAll('rect').data(d => d.value).enter().append('rect').attr('width', d=> (this.svgWidth/d.binCount)-1).attr('height', 20)
  .attr('opacity', (d)=> distScale(d['length']))
  .attr('x', (d, i)=> i * this.svgWidth/d.binCount);
  //let axis = distFilter.append("g").attr("class", "axis axis--x").attr("transform", "translate(0, 10)").call(xAxis);

   distSvg.append('text').text('test');

   label.on('click', function(d){

    let svgLabel = (this.parentNode.parentNode).querySelector('.distDetail_svg');
    if(svgLabel.classList.contains('hidden')) {
      svgLabel.classList.remove('hidden');
    }else{
      svgLabel.classList.add('hidden');
    }

   });
  }
 }

export function create(parent:Element) {
  return new SideBar(parent);
}