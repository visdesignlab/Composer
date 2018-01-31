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
    startDay;
    startBool;
    cohortKeeper;

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
                this.cohortKeeper.selectAll('label').remove();
            });


        form.append('br');

        form.append('input')
            .attr('type', 'button')
            .attr('value', 'CPT Codes')
           // .on('click', () => events.fire('show_cpt'));
            .on('click', () => events.fire('load_cpt'));

        form.append('input')
            .attr('type', 'button')
            .attr('value', 'Show Stats')
            .on('click', () => events.fire('show_distributions'));

         //test button to create parallel when I want to
        form.append('input')
            .attr('type', 'button')
            .attr('value', 'Parallel Coordinate')
            .on('click', () => events.fire('parallel'));

        this.attachListener();
    }

    /**
     * Attaching listener
     */
    private attachListener() {


        events.on('update_start_event', (evt, item)=>  {

            console.log('button press');
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

        events.on('cohort_added', (evt, item)=> {
            
            this.cohortKeeper.selectAll('label').remove();
            let counter = -1;
            let nodeArray = [];
            item.forEach((cohort, i) => {
                let label = this.cohortKeeper.append('label').classed('cohort', true).classed(i, true).text('Cohort  '+ (i+1) );
                counter = counter + 1;
                //label.data(item[i]);
                label.on('click', ()=> {
                    events.fire('cohort_selected', [cohort, i]);
                });
            });
            let cohortLabels = this.cohortKeeper.selectAll('.cohort').nodes();
            let picked = cohortLabels[counter];
            picked.classList.add('selected');
            console.log(picked.classList);
        });

    }


    /**
     * getting the similar patients info and firing events to update the vis
     * @returns {Promise<void>}
     */
    /*
    private async updateSimilar() {

        const value = (<HTMLInputElement>document.getElementById('text_pat_id')).value;
        const number = (<HTMLInputElement>document.getElementById('text_num_similar')).value;

        if (!isNaN(+value) && value) {
            let n = !isNaN(+number) ? +number : 10;
            n = n <= 0 ? 10 : n;
            const url = `/data_api/getSimilarRows/${value}/${n}/${this.dataset}`;
            this.setBusy(true);
            this.getData(url).then((args) => {

                this.setBusy(false);
                this.similarArgs = args;


                // caught by svgTable and scoreDiagram and statHistogram
                events.fire('update_similar', [value, n, args]);
                events.fire('update_hierarchy');
            });

        } else {
            console.log('Not a Number');
        }

    }*/

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
