/**
 * Created by Jen Rogers on 5/14/17.
 */

import * as ajax from 'phovea_core/src/ajax';
//import {select, selectAll} from 'd3-selection';
import * as events from 'phovea_core/src/event';
import {BaseType, select, selectAll, event} from 'd3-selection';
import * as cohortStat from './cohortStat';
import * as dict from './cptDictionary';
import {transition} from 'd3-transition';

export class CodeSidebar {

    private $node;
    private dataset;
    private startDay;
    private startBool;
    private cohortKeeper;
    private targetOrder;
    private selectedCohort;
    private currentlySelectedName;
    private selected;
    private dictionary;

    constructor(parent: Element) {

        this.dataset = 'selected';

        this.$node = select(parent).append('div').classed('sidebarDiv', true);

        let scoreFilter = this.$node.append('div').classed('scoreDiv', true);
        let orderFilter = this.$node.append('div').classed('orderDiv', true);
        let filterDescription = this.$node.append('div').classed('descriptionDiv', true);

        const self = this;

        this.dictionary = new dict.CPTDictionary().codeDict;

        this.drawScoreFilterBox(scoreFilter);
        this.drawOrderFilterBox(orderFilter);
        this.attachListener();

    }

    /**
     * Attaching listener
     */
    private attachListener() {

       events.on('selected_cohort_change', (evt, item)=> {
        select('.orderDiv').select('div').remove();
    
       });

       events.on('send_filter_to_codebar', (evt, item)=> {
           console.log(item);
       })

       events.on('update_cohort_description', (evt, item)=> {
           console.log('update_cohort_description');
           console.log(item);
           this.DrawfilterDescriptionBox(item);
       });

        events.on('make_stat_node', (evt, item)=> {
           let parent = document.getElementsByClassName('cohort ' + item[1])[0];
           let view = parent.querySelector('.stat_view');
           cohortStat.create(view, item[0], item[1]);
           //select('.cohort.' + item[1])
       });

        events.on('update_start_event', (evt, item)=>  {
           
            let startLabel = select('#start_date_label').style('color', 'black');
            this.startBool = '0 date determined by event';
            let startLabelBool = select('#pat_or_event').text(this.startBool);

        });

        events.on('start_date_patient', (evt, item)=> {
            this.startBool = '0 date determined by patient';
            this.startDay = item;
            let startLabel = select('#start_date_label').text(item);
            let startLabelBool = select('#pat_or_event').text(this.startBool);
        });

    }

    private searchDictionary(value, type){

        if(type == 'dict'){
            for(let prop in this.dictionary){
            
                if (prop == value){
                    let orderarray = [];
                    for(let p in this.dictionary[prop]){
                        let order = {'key': p, 'value' : this.dictionary[prop][p]};
                        orderarray.push(order);
                    }
                    this.drawOrderSearchBar(orderarray);
                }else{
                    for(let p in this.dictionary[prop]){
                        
                        if(p == value){
                            let order = {'key': p, 'value': this.dictionary[prop][p]};
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
                            
                            let order = {'key': p, 'value': value};
                            this.drawOrderSearchBar([order]);
                        }
                    }
                }
            }

    }

   
    private drawScoreFilterBox (div) {

        const form = div.append('form');
        let scoreFilterLabel = form.append('text').text('Score Filters');

        let aggDiv = div.append('div').classed('aggRadio', true);
        let countPromis = div.append('div').classed('countPromis', true);

            ///radio aggregation
            aggDiv.append('input').attr('type', 'radio').attr('name', 'sample').attr('id', 'sample1')
            .attr('value', 'bottom').on('click', () =>{});
            aggDiv.append('label').attr('for', 'sample1').text('bottom');
            aggDiv.append('input').attr('type', 'radio').attr('name', 'sample').attr('id', 'sample2')
            .attr('value', 'middle').on('click', () =>console.log(this));
            aggDiv.append('label').attr('for', 'sample2').text('middle');
            aggDiv.append('input').attr('type', 'radio').attr('name', 'sample').attr('id', 'sample3')
            .attr('value', 'top').on('click', () =>console.log(this));
            aggDiv.append('label').attr('for', 'sample1').text('top');
            aggDiv.append('div').append('input').attr('type', 'submit')
            .attr('value', 'Filter Aggregate').on('click', () =>{
                let checked = document.querySelector('input[name="sample"]:checked');
                let selected = checked['value'];
                events.fire('filter_aggregate', selected); });
    
        //filter patients by a minimum score count threshold
            countPromis.append('input').attr('type', 'text')
            .attr('placeholder', 'Min Promis Score Count')
            .attr('id', 'count_search')
            .attr('value');
    
            countPromis.append('input').attr('type', 'button')
            .attr('value', 'Filter by Score Count').on('click', () =>{
                let val = (<HTMLInputElement>document.getElementById('count_search')).value;
                let count = +val;
                events.fire('filter_by_Promis_count', count);
        });

}

private drawOrderFilterBox (div) {

    const form = div.append('form');
   

    let orderFilterLabel = form.append('text').text('Order Filters');

    form.append('input')
            .attr('type', 'text')
            .attr('placeholder', 'Search Order Name')
            .attr('id', 'order_search')
            .attr('value');

            form.append('input')
            .attr('type', 'button')
            .attr('value', 'Search Codes')
            .on('click', () => {
              const value = (<HTMLInputElement>document.getElementById('order_search')).value;

              function hasNumber(myString) {
                return /\d/.test(myString);
              }

              if(!hasNumber(value)){ this.searchDictionary(value, 'dict');
                }else{
                    //events.fire('filter_by_cpt', [value]);
                    this.searchDictionary(value, 'code');
                }
     
    });

   

}
private drawOrderSearchBar(order){

    select('.orderDiv').select('div').remove();

    const box = select('.orderDiv').append('div');
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
    .attr('type', 'button')
    .attr('value', 'Filter by Code')
    .on('click', () => {

    let checkNodes = ordercheck.nodes();
    let checkedarray = [];
    let cptFilterArray = [];

    checkNodes.forEach((n, i) => {
        if(n['checked']){
            checkedarray.push(n['value']);
           console.log(order[i]);
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

    events.fire('filter_by_cpt', [fixed, cptFilterArray]);
    events.fire('add_cpt_to filterArray', cptFilterArray);
    select('.orderDiv').select('div').remove();

});
          
}

private DrawfilterDescriptionBox(cohort){
  
    select('.descriptionDiv').select('div').remove();
    const box = select('.descriptionDiv').append('div');
    box.append('text').text(cohort[0].length + ' Patients');

    let filter = cohort[1];
    for(let dis in filter){
        
        if(filter[dis] != null && filter[dis].length !=0 ){
            box.append('div').append('text').text(dis + ":  ");
            for(let d in filter[dis]){
                console.log(d);
                filter[dis].forEach(attr => {
                    console.log(attr);
                    if(dis == 'demo'){
                        box.append('div').append('text').text(attr.attributeName + ' : ' + attr.checkedOptions );
                    }
                    if(dis == 'cpt'){
                        let cptdiv = box.append('div');
                       attr.forEach(a => {
                           console.log(a);
                        let cpttext = cptdiv.append('text').text(a.key + ", ");
                       });
                    }
                });
            }
        }
       
    }

}

private renderOrdersTooltip(tooltip_data) {

    let text = "<strong style='color:darkslateblue'>" + tooltip_data['value'] + "</strong></br>";
  
    return text;
}
    /**
     * getting the similar patients info and firing events to update the vis
     * @returns {Promise<void>}
     */

    /**
     * get Data by API
     * @param URL
     * @returns {Promise<any>}
     */
    private async getData(URL) {
        return await ajax.getAPIJSON(URL);
    }

    /**
     * Show or hide the application loading indicator
     * @param isBusy
     */
    setBusy(isBusy: boolean) {
        let status = select('.busy').classed('hidden');
        if (status == isBusy)
            select('.busy').classed('hidden', !isBusy);
    }

}

export function create(parent: Element) {
    return new CodeSidebar(parent);
}
