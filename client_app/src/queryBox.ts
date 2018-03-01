/**
 * Created by saharmehrpour on 3/8/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll} from 'd3-selection';
import * as events from 'phovea_core/src/event';

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
        const form = this.$node.append('form');
        this.cohortKeeper = form.append('div').attr('id', 'cohortKeeper').attr('height', 50);

        form.append('input')
            .attr('type', 'button')
            .attr('value', 'Clear Cohorts')
            .on('click', () => {
                events.fire('clear_cohorts');
                this.cohortKeeper.selectAll('div').remove();
            });

        form.append('input')
            .attr('type', 'button')
            .attr('value', 'Show Stats')
            .on('click', () => events.fire('show_distributions'));

        form.append('br');

         //test button to create parallel when I want to
         /*
        form.append('input')
            .attr('type', 'button')
            .attr('value', 'Parallel Coordinate')
            .on('click', () => events.fire('parallel'));
        */
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
          // console.log(item);
           //this.timeScale.domain([0, this.maxDay]);
           this.filteredCPT = item;
          // this.drawOrders(item);
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
          
            this.drawCohortLabels(item[0], item[1]);
          
        });
        events.on('update_filters', (evt, item)=> {
            this.drawCohortLabels(item[0], item[1]);
        });
    }

    private drawCohortLabels(filterKeeper, cohorts) {
        
                    this.cohortKeeper.selectAll('div').remove();
            let counter = -1;
            let nodeArray = [];
            let filters = filterKeeper;

            filters.forEach((cohort, i) => {
                //console.log(item[1][i].length);
                let cohortBox = this.cohortKeeper.append('div').classed('cohort', true).classed(i, true);
                let cohortlabel = cohortBox.append('div').classed('cohort-label', true).append('text').text('Cohort  '+ (i+1) );
                let cohortCount = cohortBox.append('div').classed('cohort-label', true).append('text').text(cohorts[i].length);
                let cohortfilter;
                
                
                cohortfilter = filters[i].demo.forEach(element => {
                                                cohortBox.append('text').text(element.attributeName + ': ')
                                                element.checkedOptions.forEach(op => {
                                                    cohortBox.append('text').text(op + ', ');
                                                });
                                                cohortBox.append('text').text(element.checkedOptions.forEach(op => {
                                                    return op + ',';
                                                }));
                
                //cohortBox.append('text').text(cohort[i].length);
                });

               

                if(filters[i].cpt != 0){

                    filters[i].cpt.forEach(code => {cohortBox.append('text').text(' CPT: '+ code);
                        
                })};

                counter = counter + 1;
                //label.data(item[i]);
                cohortlabel.on('click', ()=> {
                    console.log(cohort);
                    console.log(i);
                    this.selected = i;
                    events.fire('cohort_selected', [cohort, i]);

                });
            });
            if(this.selected == undefined){

                let cohortLabels = this.cohortKeeper.selectAll('.cohort').nodes();
                let picked = cohortLabels[counter];
                picked.classList.add('selected');
            }else{
                console.log(this.selected);
                let cohortLabels = this.cohortKeeper.selectAll('.cohort').nodes();
                let picked = cohortLabels[this.selected];
                picked.classList.add('selected');
            }
    }

    private drawQueryBox (){

        let form = this.$node.append('form');
    
        form.append('input')
                .attr('type', 'text')
                .attr('placeholder', 'Search Order Name')
                .attr('id', 'order_search')
                .attr('value');
    /*
        form.append('input')
                .attr('type', 'button')
                .attr('value', 'search for event')
                .on('click', () => {
                    this.searchByEvent();
                    //this.cptchecker();
                });
        form.append('input')
                .attr('type', 'button')
                .attr('value', 'search for codes')
                .on('click', () => {
                    this.searchByEvent();
                    this.cptchecker();
                });*/
    
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
                  events.fire('filter_by_code', this.targetOrder);
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
     * firing event to update the vis for info of a patient
     */
    private updateAllInfo() {
        const value = (<HTMLInputElement>document.getElementById('text_pat_id')).value;
        if (!isNaN(+value) && value) {
            const url = `/data_api/getPatInfo/${value}/${this.dataset}`;
            this.setBusy(true);
            this.getData(url).then((args) => {

                // caught by svgTable and similarityScoreDiagram
                events.fire('update_all_info', [value, args]);

                this.setBusy(false)
            });

        } else {
            console.log('Not a Number');
        }
    }

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
