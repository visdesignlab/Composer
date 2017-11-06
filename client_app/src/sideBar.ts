/**
 * Created by Jen on 11/4/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll, event} from 'd3-selection';
import {values,keys,entries} from 'd3-collection';
import {type} from 'os';
//import {transition} from 'd3-transition';
import {Constants} from './constants';
import * as parallel from './parallel';

export class SideBar {

  private $node;

      private header = [
        {'key': 'PAT_ETHNICITY', 'value': ['W', 'H' ]},
        {'key': 'GENDER', 'value': ['M', 'F' ]},
        {'key': 'PAT_RACE', 'value': ['C', 'B', 'O' ]},
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
        .append("div")
        .attr('value', (d=>d.key));

        let headerLabel = labels.append('label')
        .text(function(d) {return d.key;}).attr('value', (d=>d.key));

        let listlabel = labels.selectAll('ul').data((d) => d.value).enter().append('ul').text(d => d);
        
        listlabel.insert("input").attr('type', 'checkbox').attr('value', (d=>d));
        listlabel.on('click', function(d){
         // console.log(this.parentNode.attributes[0].value);
          let parentValue = this.parentNode.attributes[0].value;
          parallel.filterPlot(d, parentValue);

        } );
  }

 }

export function create(parent:Element) {
  return new SideBar(parent);
}

