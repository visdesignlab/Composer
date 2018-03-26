/**
 * Created by saharmehrpour on 3/8/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll} from 'd3-selection';
import * as events from 'phovea_core/src/event';
import * as cohortStat from './cohortStat';

export class QueryBox {

    private $node;
    private similarArgs;
    private dataset;
    private startDay;
    private startBool;
    private cohortKeeper;
    private queryDateArray;
    private queryDataArray;
    private targetOrder;
    private filteredCPT;
    private currentlySelectedName;
    private selected;

    constructor(parent: Element) {

        this.dataset = 'selected';

        this.$node = select(parent)
            .append('div')
            .classed('queryDiv', true);

        const self = this;

        this.drawQueryBox();
        this.attachListener();
    }

    /**
     * Attaching listener
     */
    private attachListener() {

    events.on('cpt_mapped', (evt, item)=> {
            //this.timeScale.domain([0, this.maxDay]);
            this.filteredCPT = item;
       });

       events.on('selected_cpt_change', (evt, item) => {

           this.filteredCPT = item;

       });

       events.on('make_stat_node', (evt, item)=> {
           let parent = document.getElementsByClassName('cohort ' + item[1])[0];
           console.log(parent);
           let view = parent.querySelector('.stat_view');
           cohortStat.create(view, item[0], item[1]);
           //select('.cohort.' + item[1])
       });


        events.on('update_start_event', (evt, item)=>  {
            console.log('does this even do anything?');
            let startLabel = select('#start_date_label').style('color', 'black');
            this.startBool = '0 date determined by event';
            let startLabelBool = select('#pat_or_event').text(this.startBool);

        });

        events.on('start_date_patient', (evt, item)=> {
            this.startBool = '0 date determined by patient';
            this.startDay = item;
            let startLabel = select('#start_date_label').text(item);//.style('color', 'red');
            let startLabelBool = select('#pat_or_event').text(this.startBool);
        });

        events.on('add_to_cohort_bar', (evt, item)=> {
            this.drawCohortLabels(item[0], item[1]);//.then(console.log(item[0]));
        });
        events.on('update_filters', (evt, item)=> {
            this.drawCohortLabels(item[0], item[1]);//.then(events.fire('send_stats'));
        });
    }

    private async drawCohortLabels(filterKeeper, cohorts) {
        
            this.cohortKeeper.selectAll('div').remove();
            let counter = -1;
            let nodeArray = [];
            let filters = filterKeeper;

            filters.forEach((cohort, i) => {
                //console.log(item[1][i].length);
                let cohortBox = this.cohortKeeper.append('div').classed('cohort', true).classed(i, true);
                let cohortarrow = cohortBox.append('div').classed('arrow-up', true);
                let cohortlabel = cohortBox.append('div').classed('cohort-label', true).append('text').text('Cohort  '+ (i+1) );
                let cohortCount = cohortBox.append('div').classed('cohort-label', true).append('text').text(cohorts[i].length);
                let cohortfilter;
                let label = document.getElementsByClassName('cohort ' + i);
                let statView = select(label[0]).append('div').classed('stat_view', true).classed('hidden', true);
                let view = document.getElementsByClassName('cohort ' + i)[0].querySelector('.stat_view');
                cohortStat.create(view, cohorts[i], i);

                let labelhide = true;
                cohortarrow.on('click', ()=> { 
                    if(labelhide){ 
                        statView.classed('hidden', false); 
                        labelhide = false;
                    }else{
                            statView.classed('hidden', true);
                            labelhide = true;
                        }
                    
                    console.log(select(label[0]));
                });
                cohortfilter = filters[i].demo.forEach(element => {
                                                
                                                cohortBox.append('div').classed('cohort-label', true).append('text').text(element.attributeName + ': ')
                                                element.checkedOptions.forEach(op => {
                                                    cohortBox.append('text').text(op + ', ');
                                                });
                                                cohortBox.append('text').text(element.checkedOptions.forEach(op => {
                                                    return op + ',';
                                                }));

                });


                if(filters[i].cpt != 0){
                    let cptBox = cohortBox.append('div').classed('cohort-label', true);
                    cptBox.append('text').text('  CPT: ');
                    filters[i].cpt.forEach(code => {cptBox.append('text').text(code[0] + "  ");

                })};

                if(filters[i].minCount != null){
                    let minBox = cohortBox.append('div').classed('cohort-label', true);
                    minBox.append('text').text(' Min Score Count: '+ filters[i].minCount);

                };

                counter = counter + 1;

                cohortlabel.on('click', ()=> {
                    this.selected = i;
                    events.fire('cohort_selected', [cohort, i]);

                });
            });
            if(this.selected == undefined){

                let cohortLabels = this.cohortKeeper.selectAll('.cohort').nodes();
                let picked = cohortLabels[counter];
                picked.classList.add('selected');

            }else{

                let cohortLabels = this.cohortKeeper.selectAll('.cohort').nodes();
                let picked = cohortLabels[this.selected];
                picked.classList.add('selected');
            }


    }

    private drawQueryBox () {

       // let form = this.$node.append('form');
        const form = this.$node.append('form');
        this.cohortKeeper = form.append('div').attr('id', 'cohortKeeper').attr('height', 50);
        form.append('input')
            .attr('type', 'button')
            .attr('value', 'Clear Cohorts')
            .on('click', () => {
                events.fire('clear_cohorts');
                this.cohortKeeper.selectAll('div').remove();
            });
/*
        form.append('input')
            .attr('type', 'button')
            .attr('value', 'Show Stats')
            .on('click', () => events.fire('show_distributions'));
            */
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
                  this.searchByEvent();
                  //events.fire('filter_cohort_by_event', [this.queryDataArray, this.targetOrder]);
                  selectAll('.selectedOrder').classed('selectedOrder', false);
                  selectAll('.unselectedOrder').classed('unselectedOrder', false);
                  events.fire('min date to cpt', this.queryDateArray);
                  let eventLabel = select('#eventLabel').text(" " + this.targetOrder);
                 // events.fire('filter_by_code', this.targetOrder);
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
    
        private cptchecker() {
            //this is where you are going to filter by category
            const value = (<HTMLInputElement>document.getElementById('order_search')).value;
            let codes = value.split(' ');
      
            let withQuery = [];
            let queryDate = [];
    
            this.filteredCPT.forEach((element) => {
                let elementBool;
                element.forEach(g => {
                    if(codes.some(r=> g.value[0].includes(+r))){
                       
                        if(elementBool != g.key){
                            withQuery.push(element);
                            queryDate.push(g);
                        }elementBool = g.key;
                    }
                    });
                });
    
            this.queryDataArray = withQuery;
            this.queryDateArray = queryDate;
    
            events.fire('query_order', value);
    
        }

        private searchByEvent() {

            let withQuery = [];
            let queryDate = [];
                
            if (this.currentlySelectedName != undefined ){
              this.currentlySelectedName = undefined;
            }
      
            const value = (<HTMLInputElement>document.getElementById('order_search')).value;
          
            this.targetOrder = value;
    
            this.filteredCPT.forEach((element) => {
                console.log(element);
                let elementBool;
                element.forEach(g => {
                    if (g.value[0].includes(+value)){
                        if(elementBool != g.key){
                            withQuery.push(element);
                            queryDate.push(g);
                        }elementBool = g.key;
                        }
                });
              
            });
    
            this.queryDataArray = withQuery;
            this.queryDateArray = queryDate;
    
            events.fire('query_order', value);
            events.fire('filter_cohort_by_event', [this.queryDataArray, this.targetOrder]);
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
    return new QueryBox(parent);
}
