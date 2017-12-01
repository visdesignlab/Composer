/**
 * Created by Jen on 11/4/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll, event} from 'd3-selection';
import {values,keys,entries} from 'd3-collection';
import {type} from 'os';
import * as events from 'phovea_core/src/event';
//import {transition} from 'd3-transition';
import {Constants} from './constants';
import * as parallel from './parallel';
import {scaleLinear,scaleTime,scaleOrdinal, scaleBand} from 'd3-scale';

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
        
      ];
      
  constructor(parent: Element) {
    this.$node = select(parent);
    this.popRectScale = scaleLinear().range([0,150]);

    this.attachListener();
  }

  private attachListener () {
    
       events.on('filter_counted', (evt, item) => {
         let allCount = item[0];
         let popCount = item[1];
         let parentValue = item[2];
        // let choiceValue = item[3];
         this.popRectScale.domain([0, allCount]);
         let selected = select('#' +parentValue);//.selectAll('li[value='+choiceValue+']');//.querySelector('li[value='+choiceValue+']'); //.filter(d=> d.value = choiceValue);
         console.log(selected);
         selected.select('text').text(popCount)
         .attr('transform', 'translate('+ this.popRectScale(popCount) +', 10)');
         selected.select('rect').transition() // Wait one second. Then brown, and remove.
         .attr('width', this.popRectScale(popCount));
        // selected.node.append('svg');
         //let select = selected.querySelector('li[value="M"]');
        // console.log(select);
       });
      }

  async init() {

    this.filters = [];
    let parents = [];
    let that = this;

    let form = this.$node.append("form").append('div').attr('padding-top', 250);
    
    let labels = form.selectAll("div")
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
          console.log(this);
        //  select(this).select('svg').select('text').classed('hidden', false);
          events.fire('checked', [parentValue, d])
        });
        liHover.on('mouseout', function(d){
          console.log(select(this.parentNode.parentNode).select('rect'));
          select(this.parentNode.parentNode).select('rect').attr('width', 0);
          select(this.parentNode.parentNode).select('text').text(' ');
        //  select(this).parentNode.parentNode).select('svg').select('rect').attr('width', 0);
        //  select(this).select('svg').select('text').text(' ');
          console.log('leaving');
        });
    
        listlabel.on('click', function(d){

          let choice = d;

          let parentValue = this.parentNode.attributes[0].value;
          let parental = this.parentNode.classList.add('parent');
          parents.push(parental);
          
          let lines = select('#plotGroup').selectAll('path');
          let filterGroup = lines.filter(d => d[parentValue] == choice);
         
          filterGroup.classed(parentValue, true);
          events.fire('checked', [parentValue, choice]);
     
        } );
       
        form.insert('input').attr('type', 'button').attr('value', 'filter').on('click', function(d){
          
         let input = form.selectAll('li').nodes();
         let filterInput = input.filter(d=> d.lastChild['checked']);
       
         filterInput.forEach(d=> {
          that.filters.push([d.innerText, d.parentNode.attributes[0].value]);
          });
 
    let parentFilter = form.selectAll('ul.parent');//.nodes().filter(d => d.classList.value == 'parent');

    let filterList = [];

    parentFilter.each(function (element) {
       
        let filter = {
        
        attributeName:(this).attributes[0].value,
        checkedOptions: []
      
        };

        let children = select(this).selectAll('li');
        children
        .each(function (option) {
      
         if (select(this).select(':last-child').property('checked')){
            filter.checkedOptions.push(option);
            };
          });
        filterList.push(filter);
      });

      
         events.fire('filter_data', filterList);
          that.filters = [];
          
          filterList = [];
          
        });

      //let popRect = ul.selectAll('li').append('svg').attr('width', 100).attr('height', 20);
  }

 }

export function create(parent:Element) {
  return new SideBar(parent);
}

