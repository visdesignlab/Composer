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
//import React from 'react';
//import Collapsible from 'react-collapsible';


export class SideBar {

  private $node;

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

    var form = this.$node.append("form").append('div').attr('padding-top', 250);
    
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

       // console.log(this.$node.querySelectorAll('li'));
    
        listlabel.insert("input").attr('type', 'checkbox').attr('value', (d=>d));
    
        
        listlabel.on('click', function(d){

          let parentValue = this.parentNode.attributes[0].value;
         // console.log(d);
          //console.log(parentValue);
         
          events.fire('filter_data', [d, parentValue]);
        } );
  }

 }

export function create(parent:Element) {
  return new SideBar(parent);
}

