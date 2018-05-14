/**
 * Created by Jen Rogers on 5/14/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll} from 'd3-selection';
import * as events from 'phovea_core/src/event';
import * as cohortStat from './cohortStat';
import * as dict from './cptDictionary';

export class CodeSidebar {

    private $node;
    private dataset;
    private startDay;
    private startBool;
    private cohortKeeper;
    private targetOrder;
    private filteredCPT;
    private currentlySelectedName;
    private selected;
    private dictionary;

    constructor(parent: Element) {

        this.dataset = 'selected';

        this.$node = select(parent)
            .append('div')
            .classed('queryDiv', true);

        const self = this;

        this.dictionary = new dict.CPTDictionary();

        console.log(this.dictionary);
        console.log(this.dictionary.codeDict);
        console.log(this.dictionary.codeDict.PT);
        

        this.drawQueryBox();
        this.attachListener();

    }

    /**
     * Attaching listener
     */
    private attachListener() {

        events.on('add_to_cohort_bar', (evt, item)=> {
               // this.drawCohortLabels(item[0], item[1]);
            });

        events.on('cpt_mapped', (evt, item)=> {
                this.filteredCPT = item;
        });

        events.on('clear_cohorts', (evt, item)=> {
            this.cohortKeeper.selectAll('div').remove();
        });

        events.on('selected_cpt_change', (evt, item) => {

           this.filteredCPT = item;
           

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

   
    private drawQueryBox () {

        const form = this.$node.append('form');
       // this.cohortKeeper = form.append('div').attr('id', 'cohortKeeper').attr('height', 50);

        let aggDiv = this.$node.append('div').classed('aggRadio', true);
        let countPromis = this.$node.append('div').classed('countPromis', true);
    
        form.append('input')
                .attr('type', 'text')
                .attr('placeholder', 'Search Order Name')
                .attr('id', 'order_search')
                .attr('value');

        form.append('input')
                .attr('type', 'button')
                .attr('value', 'Filter by Code')
                .on('click', () => {
                  const value = (<HTMLInputElement>document.getElementById('order_search')).value;
                  events.fire('filter_by_cpt', value);
                  selectAll('.selectedOrder').classed('selectedOrder', false);
                  selectAll('.unselectedOrder').classed('unselectedOrder', false);
                  let eventLabel = select('#eventLabel').text(" " + value);
         
        });

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
