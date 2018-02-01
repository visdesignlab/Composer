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
import {scaleLinear,scaleTime,scaleOrdinal, scaleBand} from 'd3-scale';
//importing other modules from app
import * as demoGraph from './demoGraphs';

export class SideBar {

  private $node;
  private filters;
  private popRectScale;


      private header = [
        {'key': 'PAT_ETHNICITY', 'value': ['W', 'H' ]},
        {'key': 'GENDER', 'value': ['M', 'F' ]},
        {'key': 'RACE', 'value': ['C', 'B', 'O' ]},
        {'key': 'MARITAL_STATUS', 'value': ['M', 'W', 'S', 'D', 'U' ]},
        {'key': 'TOBACCO', 'value': ['Quit', 'Yes', 'NaN', 'Never' ]},
        {'key': 'ALCOHOL', 'value': ['Yes', 'No', 'Not Asked', 'NaN' ]},
        {'key': 'DRUG_USER', 'value': ['Yes', 'No', 'Not Asked', 'NaN' ]},
        {'key': 'DM_CODE', 'value': [250.0, 0 ]},
        
      ];
      
  constructor(parent: Element) {
    this.$node = select(parent);
    this.popRectScale = scaleLinear().range([0,150]);
    this.$node.append('div').attr('id', 'filterDiv');
    const distributions = this.$node.append('div').classed('distributions', true);
    demoGraph.create(distributions.node());

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
      }

  async init() {

    this.filters = [];
    let parents = [];
    let that = this;

    let form = this.$node.select('#filterDiv').append('form').append('div').attr('padding-top', 250);
    
    let labels = form.selectAll('div')
        .data(this.header);

    let labelsEnter = labels
        .enter()
        .append("div");

    labels.exit().remove();

    labels = labelsEnter.merge(labels);

    let ul = labels.append('ul')
        .attr('value', (d=>d.key));

        let popRects = labels.append('svg').attr('width', 150).attr('height', 16).attr('id', d=>d.key);
        popRects.append('rect').attr('width', 0).attr('height', 16).attr('fill', '#AEB6BF');
        popRects.append('text').attr('fill', '#AEB6BF');

        let headerLabel = ul.append('label')
        .text(function(d) {return d.key;}).attr('value', (d=>d.key));

        let listlabel = ul.selectAll('li').data((d) => d.value)
        
        let listlabelEnter = listlabel.enter().append('li');

        listlabel.exit().remove();

        listlabel = listlabelEnter.merge(listlabel);
        
        listlabel.text(d => d);
        ul.selectAll('li').attr('value', (d=>d));
        ul.selectAll('li').classed('hidden', true);

      headerLabel.on('click', function(d){
        
         let children = (this.parentNode).querySelectorAll('li');
         children.forEach(element => {
           if(element.classList.contains('hidden')){
            element.classList.remove('hidden');
           }else{
            element.classList.add('hidden');
           }
           
         });
        });

        listlabel.insert("input").attr('type', 'checkbox').attr('value', (d=>d));

        let liHover = ul.selectAll('li');
        
        liHover.on('mouseover', function(d){
          let parentValue = this.parentNode.attributes[0].value;
    
          events.fire('checkbox_hover', [parentValue, d])
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

        let filterButton = form.insert('input').attr('type', 'button').attr('value', 'filter')
                          .on('click', function(d){
                          // let filterList = [];
                          //let input = form.selectAll('li').nodes();
                          //let filterInput = input.filter(d=> d.lastChild['checked']);
/*
                          let input = form.selectAll('li').nodes();
                          let filterInput = input.filter(d=> d.lastChild['checked']);
                        
                          filterInput.forEach(d=> {
                            that.filters.push([d.innerText, d.parentNode.attributes[0].value]);
                          });*/
 
         let parentFilter = form.selectAll('ul.parent');

         parentFilter.each(function (element) {
       
          let filter = {
        
          attributeName:(this).attributes[0].value,
          checkedOptions: []
      
          };

          let children = select(this).selectAll('li').selectAll('input');
         // let children = select(this).selectAll('li');
          console.log(children.nodes());
          children.nodes().forEach(d => {
            console.log(select(d).property('checked'));
            if(select(d).property('checked')){
              filter.checkedOptions.push(d['value']);
              d['checked'] = false;
            }
          });

        filterList.push(filter);
        });

         events.fire('filter_data', filterList);
          that.filters = [];
          filterList = [];
          parentFilter.classed('parent', false);
          form.selectAll('li').classed('hidden', true);
        });
  }

 }

export function create(parent:Element) {
  return new SideBar(parent);
}