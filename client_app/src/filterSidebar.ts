/**
 * Created by Jen on 11/4/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll, event} from 'd3-selection';
import {values,keys,entries} from 'd3-collection';
import {type} from 'os';
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal, scaleBand, scaleLog, scalePoint, scalePow} from 'd3-scale';
import {area, line, curveMonotoneX, curveMonotoneY, curveLinear, curveBasis} from 'd3-shape';
//importing other modules from app
import * as demoGraph from './demoGraphs';
import {axisBottom} from 'd3-axis';
import {extent, min, max, ascending, histogram, mean, deviation} from 'd3-array';
import { all } from 'phovea_core/src/range';
import {brushX} from 'd3-brush';
import {transition} from 'd3-transition';
import { stringify } from 'querystring';
import * as dict from './cptDictionary';

export class FilterSideBar {

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
  private freqBrush;
  private scoreFreqRange;
  private dictionary;
  private demoPanel;
  scorePanel;
  codePanel;
  private demoFilterKeeper;
  private oldClass;

  private header = [
    {'key': 'PAT_ETHNICITY', 'label': 'Ethnicity', 'value': ['W', 'H' ]},
    {'key': 'GENDER', 'label': 'Gender', 'value': ['M', 'F' ]},
    {'key': 'RACE', 'label': 'Race', 'value': ['C', 'B', 'O' ]},
    {'key': 'MARITAL_STATUS', 'label': 'Marital Status', 'value': ['M', 'W', 'S', 'D', 'U' ]},
    {'key': 'TOBACCO', 'label': 'Tobacco Use', 'value': ['Quit', 'Yes', 'NaN', 'Never' ]},
    {'key': 'ALCOHOL','label': 'Alcohol Use', 'value': ['Yes', 'No', 'Not Asked', 'NaN' ]},
    {'key': 'DRUG_USER','label': 'Drug Use', 'value': ['Yes', 'No', 'Not Asked', 'NaN' ]},
    {'key': 'DM_CODE', 'label': 'Diabetic', 'value': [250.0, 0 ]},

  ];

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
    this.demoPanel;
    this.demoFilterKeeper;

    this.dictionary = new dict.CPTDictionary().codeDict;

    this.init();
    //this.buildComparisonFilter(compare);
    
    this.attachListener();
  }

  private attachListener () {

    events.on('test', (evt, item)=> {
  
    });

    events.on('population demo loaded', (evt, item)=> {
        this.populationDemo = item;
        this.distribute(item).then(header => {
            header.forEach(data => {
                this.drawBandTest(data, 'demoPanel');
            });
        });
    });

    events.on('update_chart', (evt, item)=> {
     if(item){ 

        let classGroup = select(document.getElementById('filterSideBar')).selectAll('.demoBand').selectAll('rect');
         if(this.oldClass){
            classGroup.classed(this.oldClass, false);
         }

        let cohortClass = 'c-' + (item.flatIndex);
        classGroup.classed(cohortClass, true);
       
        console.log(cohortClass);

         this.oldClass = cohortClass;

         console.log(this.oldClass);

        let value = item.promis.map(v=> v.value);
     
        this.histogrammer(value, null, 10).then(d=> this.drawHistogram(d));}
    });

  }

  async init() {

    this.demoPanel = this.$node.append('div').attr('id', 'demoPanel');
    this.BuildFilterPanel(this.demoPanel, 'Demographic Filters')//.then(panel=> this.buildDemoFilter(panel));//.then(div => this.cohortKeeper = div.append('svg').classed('cohortSvg', true));
    
    this.scorePanel = this.$node.append('div').attr('id', 'scorePanel');
    this.BuildFilterPanel(this.scorePanel, 'Score Filters').then(panel=> {

        this.drawScoreFilterBox(panel)});

    this.codePanel = this.$node.append('div').attr('id', 'codePanel');
    this.BuildFilterPanel(this.codePanel, 'CPT Filters').then(panel => {

        this.drawOrderFilterBox(panel)});

    this.$node.selectAll('.panel-body').classed('hidden', true);
    }

    private async BuildFilterPanel(panelDiv, title){

      let cohorthead = panelDiv.append('div').classed('panel-head', true);
      cohorthead.append('text').text(title).style('padding-right', '20px');
      let button = cohorthead.append('button').classed('btn', true).classed('btn-default', true).classed('btn-sm', true);
      button.append('text').text('+');

    

      button.attr('margin-left', 10);

      button.on('click', function(d){ 
        events.fire('show_layer_panel');
        select(document.getElementById('filterSideBar')).classed('hidden', false);
      });
  
      let cohortBody = panelDiv.append('div').classed('panel-body', true);

      button.on('click', ()=> {
          if(cohortBody.classed('hidden')){ 
              cohortBody.classed('hidden', false); }
          else{cohortBody.classed('hidden', true); }
      });

      return cohortBody;

    }

    private buildDemoFilter(div) {

      // this.filters = [];
       this.bmiRange = null;
       this.cciRange = null;
       this.ageRange = null;
       
       let parents = [];
       let that = this;
   
       let demopanel = div.classed('panel', true).classed('panel-default', true);
       let scorehead = demopanel.append('div').classed('panel-heading', true);
       scorehead.append('text').text('Demographic Filters');
   
       let demobody = demopanel.append('div').classed('panel-body', true);
   
       this.demoform = demobody.append('form');
   
       let labels = this.demoform.append('div').classed('labelWrapper', true).selectAll('.labelDiv')
           .data(this.header);
   
       let distLabel = this.demoform.append('div').classed('distributionWrapper', true);
    
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
             let parental = this.parentNode;
             if(parental.classList.contains('parent')) {
               parental.classList.remove('parent');
              }else { parental.classList.add('parent'); }
   
             parents.push(parental);
   
             let lines = select('#plotGroup').selectAll('path');
             let filterGroup = lines.filter(d => d[parentValue] == choice);
   
             filterGroup.classed(parentValue, true);
           });
           this.demoform.append('div').append('input').attr('type', 'button')
           .classed('btn', true).classed('btn-primary', true)
           .attr('value', 'Filter by Demographic').on('click', ()=> {
           //  that.filterDemo('demo_refine');
           });
     }

    private drawOrderFilterBox (div) {
        let orderpanel = div.classed('panel', true).classed('panel-default', true);
    
        const form = div.append('form');
    
        let ordersearch = form.append('div').classed('input-group', true);
    
        ordersearch.append('input').classed('form-control', true)
                .attr('type', 'text')
                .attr('placeholder', 'CPT Name/Code')
                .attr('id', 'order_search')
                .attr('value');
    
        ordersearch.append('div').classed('input-group-btn', true)
                .append('input')
                .attr('type', 'button').classed('btn', true).classed('btn-default', true)
               // .append('i').classed('glyphicon glyphicon-search', true)
                .attr('value', 'Search')
                .on('click', () => {
                  const value = (<HTMLInputElement>document.getElementById('order_search')).value;
    
                  function hasNumber(myString) {
                    return /\d/.test(myString);
                  }
    
                  if(!hasNumber(value)){ this.searchDictionary(value, 'dict');
                    }else{
                        this.searchDictionary(value, 'code');
                    }
        });

        
        div.append('div').classed('orderDiv', true);

    }

    private async frequencyMapper(data, key){

        let categories = Array.from(new Set(data));

        let mapped = [];

        categories.forEach(cat => {
            let counter = data.filter(d=> d == cat);
            let map = {value: cat, length: counter.length, binCount: categories.length, frequency: counter.length/categories.length, type: 'qual'};
            mapped.push(map);
        });

        return mapped;
  
    }

    private async histogrammer(data, type, ticks) {

        if(type == null){
          
        }

        let totalPatients = data.length;

        let x;
        let bins;

        let maxValue = max(data);
        x = scaleLinear().domain([0, +maxValue]).nice();

        bins = histogram()
                .domain([0, +maxValue])
                .thresholds(x.ticks(ticks))
                (data);
        
        let histogramData = bins.map(function (d) {
            totalPatients -= d.length;
        // return {x0: d.x0, x1: d.x1, length: d.length, totalPatients: totalPatients + d.length, binCount: bins.length, frequency: d.length/bins.length, };
            return {x0: d.x0, x1: d.x1, length: d.length, binCount: bins.length, frequency: d.length/bins.length, max: maxValue, type: type};
        });

        return histogramData;
    }

    private async distribute(data){

        let totalPatients = data.length;

        let mappedBMI = data.map((d: number) => +d['BMI']);
    
        let mappedAGE = data.map((d: number) => +d['AGE']);
    
        let mappedCCI = data.map((d: number) => +d['CCI']);

        let mappedAlco = data.map((d: string) => d['ALCOHOL']);

        let mappedDrug = data.map((d: string) => d['DRUG_USER']);

        let mappedDM = data.map((d: string) => d['DM_CODE']);

        let mappedTOB = data.map((d: string) => d['TOBACCO']);

        let alcDomain = Array.from(new Set(mappedAlco));
        let drugDomain = Array.from(new Set(mappedDrug));
        let dmDomain = Array.from(new Set(mappedDM));
        let tobDomain = Array.from(new Set(mappedTOB));

        let binBMI = await this.histogrammer(mappedBMI, 'quant', 8);
        let binCCI = await this.histogrammer(mappedCCI, 'quant', 22);
        let binAGE = await this.histogrammer(mappedAGE, 'quant', 9);
        let binALCOHOL = await this.frequencyMapper(mappedAlco, 'ALCOHOL');
        let binDRUG = await this.frequencyMapper(mappedDrug, 'DRUG_USER');
        let binTOB = await this.frequencyMapper(mappedTOB, 'TOBACCO');

     
    
       // 'scale': this.xScale.domain([0, binBMI[0].binCount])
    
       let distData = [
        {key: 'BMI', 'label': 'BMI', value: binBMI, scale: scaleLinear().domain([0, 90]).range([0, 180]), domain: [0, +binBMI[0].binCount], type: 'quant'},
        {key: 'CCI', 'label': 'CCI', value: binCCI, scale: scaleLinear().domain([0, +binCCI[0].binCount - 1]).range([0, 180]), domain: [0, +binCCI[0].binCount], type: 'quant'},
        {key: 'AGE', 'label': 'Age', value: binAGE, scale: scaleLinear().domain([0, 100]).range([0, 180]), domain: [0, +binAGE[0].binCount], type: 'quant'},
        {key: 'ALCOHOL', 'label': 'Alcohol User', value: binALCOHOL, scale: scalePoint().domain(['Yes', 'No', '', 'Not Asked']).range([0, 180]), domain: alcDomain, type: 'qual' },
        {key: 'DRUG_USER', 'label': 'Drug User', value: binDRUG, scale: scalePoint().domain(['Yes', 'No', '', 'Not Asked']).range([0, 180]), domain: drugDomain, type: 'qual' },
        {key: 'TOBACCO', 'label': 'Tobacco User', value: binTOB, scale: scalePoint().domain(["Quit", "Yes", "", "Never", "Not Asked", "Passive"]).range([0, 180]), domain: tobDomain, type: 'qual' }
        ];
    
        return distData;

      }

    private drawScoreFilterBox (scorebody) {

      scorebody.select('.frequency-histogram').remove();

      const form = scorebody.append('form');

      let freqPanel = form.append('div').classed('frequency-histogram', true);
      
      freqPanel.append('div').classed('distributionWrapper', true);
      
  
      let countPromis = form.append('div').classed('input-group', true).classed('countPromis', true);
                      //filter patients by a minimum score count threshold

      countPromis.append('input').attr('type', 'text').classed('form-control', true)
                      .attr('placeholder', 'Min Score Count')
                      .attr('id', 'count_search')
                      .attr('value');
              
      countPromis.append('div').classed('input-group-btn', true)
          .append('input').attr('type', 'button').classed('btn', true).classed('btn-default', true)
                      .attr('value', 'Filter').on('click', () =>{
                          let val = (<HTMLInputElement>document.getElementById('count_search')).value;
                          let count = +val;
                          events.fire('filter_by_Promis_count', count);
                  });
    }

    private async drawBandTest(data, id){
  
        let bandWidth = 180;
       
        let domain = data.domain;
        let label = data.label;
        let key = data.key;
        let scale = data.scale;
        let value = data.value;
        console.log(value);
        let brush;
      
        let maxVal = max(value.map(d=> +d.frequency));
 
        let distScale = scaleLinear().domain([0, +maxVal]).range([0, 50]);
    
        let xAxis = axisBottom(scale);
    
        let panelBody = select(document.getElementById(id)).select('.panel-body');
        let demoBand = panelBody.append('div').classed('demoBand', true);
        let demoLabel = demoBand.append('div').append('text').text(label);
        let bandSvg = demoBand.append('svg').attr('class', key);
        let rects = bandSvg.append('g').attr('transform', 'translate(2, 0)').selectAll('rect').data(value);

        rects.exit().remove();
        
        let rectEnter = rects.enter().append('rect').classed('filter-bars', true);
        
        rects = rectEnter.merge(rects);

        rects
        .attr('width', d=> (bandWidth/d['binCount'])-1).attr('height', (d)=> distScale(d['frequency']))
      //  .attr('opacity', (d)=> (distScale(d['length'] * 2.5)))
        .attr('fill', '#212F3D')
        .attr('x', (d, i)=> (i * bandWidth/d['binCount']) + 5)
        .attr('y', (d)=> 50 - distScale(d['frequency']));

       let axis = bandSvg.append('g').classed('x-axis', true).attr('transform', 'translate(6, 50)');

       axis.call(xAxis);

       let quantBrush = brushX()
       .extent([[0, 0], [bandWidth, 50]])
       .handleSize(2);

       if(data.type == 'quant'){

           brush = bandSvg.append('g').attr('class', data.key + '-BRUSH').attr('transform', 'translate(5, 0)');

           quantBrush
           .on("end", () => {
               if(event.selection == null){
            
                events.fire('demo_filter_change', [data.key, null]);
               }else{
                let start = scale.invert(event.selection[0]);
                let end = scale.invert(event.selection[1]);
                let Dom1 = Math.floor(start);
                let Dom2 = Math.ceil(end);
                let test = bandSvg.selectAll('rect');
                test.classed('choice', false);
                let test2 = test.filter(r=> r['x0'] >= start && r['x1'] <= end);
                test2.classed('choice', true);
    
                events.fire('demo_filter_change', {parent: data.key, choice: [Dom1, Dom2]});
               }
          });

           brush.call(quantBrush);

           
       }else{
        bandSvg.attr('height', 150);
        
        axis.selectAll("text")
        .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-50)" );

        rects.classed('choice', true);

        let rectArray = rects.nodes();

        rects.on('click', function(d, i) {
       
            if(select(this).classed('choice')){
                select(this).classed('choice', false);
            }else{
                select(this).classed('choice', true);
            }
            let nodes = document.getElementsByClassName(key);

            let testArray = [];
           
            let selected = selectAll(nodes).selectAll('.choice').data();
        
            events.fire('demo_filter_change', {parent: data.key, choice: selected.map(d=> d['value']) });

        });
       }

    }

    private drawHistogram(histobins) {

     this.$node.select('.distributionWrapper').selectAll('*').remove();

     let data = {'key': 'Score-Count', 'label': 'Score Count', 'value': histobins, scale: this.xScale.domain([0, histobins[0].binCount])};

      this.yScale.domain([0, max(histobins, function (d) {
          return d['frequency'] + .1;
      })]);

      let barBrush = brushX()
      .extent([[0, 0], [this.svgWidth, 30]])
      .handleSize(0);

      let distScale = scaleLinear().domain([0, 1000]);
      let freqScale = scaleLinear().domain([0, 100]).range([0, this.svgWidth]);
  
      let distLabel = this.$node.select('.distributionWrapper');
      distLabel.append('text').text('Score Count Distributions');
      let distDiagrams = distLabel.append('div').classed('distLabel', true).attr('width', this.svgWidth).attr('height', this.svgHeight);
  
      let distFilter = distDiagrams.append('div').classed('distFilter', true).attr('width', this.svgWidth);

      let distSvg = distFilter.append('svg').classed('distDetail_svg', true);//.classed('hidden', true);
      let distFilter_svg = distFilter.append('svg').classed('distFilter_svg', true).attr('width', '95%');//.classed('hidden', true)
      let svg_rect_group = distFilter_svg.append('g').attr('width', '95%');
      let rect_label_group = distFilter_svg.append('g');

      rect_label_group.append('text').text(data.value[0].x0).attr('transform', 'translate(0, 20)');
      rect_label_group.append('text').text(data.value[data.value.length-1].x1).attr('transform', 'translate('+ (this.svgWidth - 15) +', 20)');

      let rects = svg_rect_group.selectAll('rect').data(data.value).enter().append('rect').attr('width', d=> (this.svgWidth/d.binCount)-1).attr('height', 15)
      .attr('opacity', (d)=> (distScale(d['length'] * 2.5)))
      .attr('fill', '#212F3D')
      .attr('x', (d, i)=> (i * this.svgWidth/d.binCount) + 5);

      //////////////bar groups for all data////////////////////////////////
      let barGroupsALL = distSvg.selectAll('.barALL')
      .data(histobins);

      barGroupsALL.exit().remove();

      let barEnterALL = barGroupsALL.enter().append("g")
      .attr("class", "barALL");

      barGroupsALL = barEnterALL.merge(barGroupsALL);

      barGroupsALL
      .attr("transform", (d, i) => {
          return "translate(" +  ((i * this.svgWidth/d.binCount) + 4) + ",0)";
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

      barGroupsALL.on("mouseover", (d) => {
  
          let t = transition('t').duration(500);
          select(".tooltip")
        //  .html(() => {
            //  return this.renderHistogramTooltip(d);
       //   })
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

      let brush = distFilter_svg.append('g').attr('id', data['key'] + '-Brush').classed('brush', true);
      let that = this;

      this.freqBrush = brushX()
      .extent([[0, 0], [this.svgWidth, 30]])
      .handleSize(0)
      .on("end", () => {
      if (event.selection === null) {
          //this.setOrderScale();
      }else {
      let start = freqScale.invert(event.selection[0]);
      let end = freqScale.invert(event.selection[1]);
      let Dom1 = Math.floor((start+1)/10)*10;
      let Dom2 = Math.ceil((end+1)/10)*10;

      this.scoreFreqRange = [Dom1, Dom2];
          }
      });

      this.$node.select('#Score-Count-Brush').call(this.freqBrush);

    }

    private drawOrderSearchBar(order){

        select('.orderDiv').select('.codes').remove();

        const box = select('.orderDiv').append('div').classed('codes', true);
        let props = [];

        let orderFilters = box.selectAll('.orderFilters').data(order);

        let orderEnter = orderFilters.enter().append('div').classed('orderFilters', true);

        orderFilters.exit().remove();

        orderFilters = orderEnter.merge(orderFilters);

        let ordercheck = orderFilters.append('input').attr('type', 'checkbox').attr('value', d => d['value']).attr('checked', true);
        let ordertext = orderFilters.append('text').text(d => d['key']);

        ordertext.on("mouseover", (d) => {
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

        ordercheck.on('click', (d)=>{ console.log(d);})

        box.append('input')
        .attr('type', 'button').classed('btn', true).classed('btn-default', true)
        .attr('value', 'Filter by Code')
        .on('click', () => {

        let checkNodes = ordercheck.nodes();
        let checkedarray = [];
        let cptFilterArray = [];

        checkNodes.forEach((n, i) => {
            if(n['checked']){
                checkedarray.push(n['value']);
            // Maybe make the 2 arrays use this array?
            cptFilterArray.push(order[i]);
            }
        });

        let fixed = [];
        checkedarray.forEach(ch=> {
            if (ch.indexOf(',') > -1) { 
                let fix = ch.split(',');
                fix.forEach(f => {
                    fixed.push(f);
                });
            }else{fixed.push(ch); };
        });
        events.fire('cpt_filter_button',  [fixed, cptFilterArray]);
        // events.fire('filter_by_cpt', [fixed, cptFilterArray]);

        select('.orderDiv').select('.codes').remove();
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

    private searchDictionary(value, type){

        if(type == 'dict') {
            for(let prop in this.dictionary){
                if (prop == value){
                    let orderarray = [];
                    for(let p in this.dictionary[prop]){
                        let order = {'key': p, 'value' : this.dictionary[prop][p], 'parent': prop};
                        orderarray.push(order);
                    }
                    this.drawOrderSearchBar(orderarray);
                }else{
                    for(let p in this.dictionary[prop]){
                        if(p == value){
                            let order = {'key': p, 'value': this.dictionary[prop][p], 'parent': prop};
                            this.drawOrderSearchBar([order]);
                        }
                    }
                }
            }
        }else if(type == 'code'){

            for(let prop in this.dictionary){
            
                    for(let p in this.dictionary[prop]){
                    // 
                        if(this.dictionary[prop][p].includes(+value)){
                            let order = {'key': p, 'value': value, 'parent': prop};
                            this.drawOrderSearchBar([order]);
                        }
                    }
                }
            }
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

    private renderOrdersTooltip(tooltip_data) {

        let text = "<strong style='color:darkslateblue'>" + tooltip_data['value'] + "</strong></br>";
      
        return text;
    }
    

}



 

export function create(parent:Element) {
  return new  FilterSideBar(parent);
}