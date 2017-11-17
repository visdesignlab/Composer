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

export class SideBar {

  private $node;
  private filters;

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
  }

  async init() {

    this.filters = [];
    let that = this;

    let form = this.$node.append("form").append('div').attr('padding-top', 250);
    
    let labels = form.selectAll("div")
        .data(this.header)
        .enter()
        .append("div");

    let ul = labels.append('ul')
        .attr('value', (d=>d.key));

        let headerLabel = ul.append('label')
        .text(function(d) {return d.key;}).attr('value', (d=>d.key));

        let listlabel = ul.selectAll('li').data((d) => d.value).enter().append('li').text(d => d);

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
    
        listlabel.on('click', function(d){

          let choice = d;

          let parentValue = this.parentNode.attributes[0].value;
          that.filters.push([d, parentValue]);

          let lines = select('#plotGroup').selectAll('path');
          let filterGroup = lines.filter(d => d[parentValue] == choice);
         
          filterGroup.classed(parentValue, true);
          console.log(that.filters);
        } );
       
        form.insert('input').attr('type', 'button').attr('value', 'filter').on('click', function(d){
          events.fire('filter_data', that.filters);//sent to parallel
         });
  }

 }

export function create(parent:Element) {
  return new SideBar(parent);
}

