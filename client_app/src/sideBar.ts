/**
 * Created by saharmehrpour on 4/3/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll, event} from 'd3-selection';
import {values,keys,entries} from 'd3-collection';
import {type} from 'os';
//import {transition} from 'd3-transition';
import {Constants} from './constants';

export class SideBar {

  private $node;

  private header = {
    'Demo': ['PAT_BIRTHDATE', 'PAT_GENDER', 'PAT_ETHNICITY', 'D_ETHNICITY_DESC',
      'PAT_RACE', 'D_RACE_DESC', 'PAT_MARITAL_STAT', 'PAT_DEATH_IND', 'BMI',
      'HEIGHT_CM', 'WEIGHT_KG', 'ADM_DATE', 'DSCH_DATE', 'TOBACCO_USER',
      'ALCOHOL_USER', 'ILLICIT_DRUG_USER']
  };

  constructor(parent: Element) {
    this.$node = select(parent);
  }

  async init() {

    let args_Demo = await ajax.getAPIJSON(`/data_api/getWeights/Demo`);
    let args_CCI = await ajax.getAPIJSON(`/data_api/getWeights/CCI`);
    const weights = Object.assign(args_Demo.weights,args_CCI.weights);

    this.$node.selectAll('.item').data(
      entries(Constants.sideBar.Demo).concat(entries(Constants.sideBar.CCI)))
      .enter()
      .append('div')
      .classed('item', true);

    this.$node.selectAll('.item')
      .html((d) => {
        return `<input type='text' placeholder='Weight' size='8' id='weight_` + d.key
          + `' value='` + weights[d.key] + `'>`
          + `&nbsp;` + d.value;
      });

    this.$node.append('input')
      .attr('type', 'button')
      .attr('value', 'Update')
      .on('click', () => this.updateWeights());
  }

  async updateWeights() {

    for(let t=0; t<['Demo', 'CCI'].length; t++) {
      let table = ['Demo', 'CCI'][t];

      let tempWeights = '';
      let array = entries(Constants.sideBar[table]);

      for (let counter = 0; counter < array.length; counter++) {
        const tempId = 'weight_' + array[counter].key;
        const tempValue = (<HTMLInputElement>document.getElementById(tempId)).value;

        if (isNaN(+tempValue)) {
          console.log('error in ' + array[counter].key);
          return;
        }
        tempWeights = tempWeights + (+tempValue.toString()) + `+`;
      }

      let URL = `/data_api/updateWeights/${table}/`
        + tempWeights.substring(0, tempWeights.length-1); // The last character is '+'
      await ajax.getAPIJSON(URL);
      console.log(URL);
    }

    console.log('Weights are updated.');

  }

}

export function create(parent:Element) {
  return new SideBar(parent);
}

