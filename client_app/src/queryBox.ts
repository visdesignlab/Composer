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

    constructor(parent: Element) {

        this.dataset = 'selected';

        this.$node = select(parent)
            .append('div')
            .classed('queryDiv', true);

        let self = this;

        let form = this.$node.append('form');
/*
        form.append('label')
            .attr('for', 'dataset_selection')
            .text('Dataset: ');

        form.append("input")
            .attr('type', 'radio')
            .attr("name", "dataset_selection")
            .attr("value", "selected")
            .property('checked', true)
            .on("click", function () {
                let val = select(this).attr("value");
                if (val !== self.dataset) {
                    self.dataset = val;
                    events.fire('update_dataset', ['dataset', self.dataset])
                }
            });

        form.append('label')
            .html('Selected');

        form.append('input')
            .attr('type', 'radio')
            .attr('value', 'all')
            .attr('name', 'dataset_selection')
            .on('click', function () {
                let val = select(this).attr("value");
                if (val !== self.dataset) {
                    self.dataset = val;
                    events.fire('update_dataset', ['dataset', self.dataset])
                }
            });

        form.append('label')
            .html('All');
*/
        form.append('br');

        // // these events are only handled in tables
        // this.$node.append('input')
        //     .attr('type', 'button')
        //     .attr('value', 'Latest')
        //     .on('click', () => events.fire('update_latest', ['func', 'latest'])); // only 'Demo' is updated
        //
        // this.$node.append('input')
        //     .attr('type', 'button')
        //     .attr('value', 'Reset')
        //     .on('click', () => events.fire('update_init', ['func', 'init']));

        form.append('label')
            .attr('for', 'text_pat_id')
            .text('Patient ID');

        form.append('input')
            .attr('type', 'text')
            .attr('placeholder', 'Search PAT_ID')
            .attr('id', 'text_pat_id')
            .attr('value', '20559329');

        form.append('input')
            .attr('type', 'button')
            .attr('value', 'Update Target Patient')
            .on('click', () => events.fire('update_target'));

/*
        form.append('input')
            .attr('type', 'button')
            .attr('value', 'All Info')
            .on('click', () => this.updateAllInfo());

        form.append('input')
            .attr('type', 'button')
            .attr('value', 'similar')
            .on('click', () => this.updateSimilar());

        form.append('input')
            .attr('type', 'button')
            .attr('value', 'Orders')
            .on('click', () => events.fire('show_orders'));
*/
        form.append('input')
            .attr('type', 'button')
            .attr('value', 'CPT Codes')
            .on('click', () => events.fire('show_cpt'));

        form.append('input')
            .attr('type', 'button')
            .attr('value', 'PROMIS Scores')
            .on('click', () => events.fire('show_PROMIS'));

        form.append('label')
            .attr('for', 'start_date')
            .attr('id', 'start_date_label')
           .text(this.startDay);
            
        form.append('input')
            .attr('type', 'button')
            .attr('id', 'start_date')
            .attr('value', 'Update Start Day')
            .on('click', () => events.fire('update_start_event'));

        form.append('label')
            .attr('id', 'pat_or_event')
            .text(this.startBool);


        this.attachListener();
    }

    /**
     * Attaching listener
     */
    private attachListener() {

        // TODO test!
        // Only used for the initial testing (events fired in app.ts).
        // Should be removed at the end.
        events.on('update_temp_similar', (evt, item) => {

            const url = `/data_api/getSimilarRows/${item[1]}/${item[2]}/${this.dataset}`;
            this.setBusy(true);
            this.getData(url).then((args) => {

                this.setBusy(false);
                this.similarArgs = args;
               // console.log(args);
                events.fire('update_similar', [item[1], item[2], args]); // caught by svgTable and scoreDiagram and statHistogram
               // console.log('testing  ' + item);
            });
        });

        events.on('update_start_event', (evt, item)=>  {
            
            console.log('button press');
            let startLabel = select('#start_date_label').style('color', 'black');
            this.startBool = '0 date determined by event';
            let startLabelBool = select('#pat_or_event').text(this.startBool);
         
        });

        events.on('date clicked', (evt, item)=>  {

            this.startDay = item;
            let startLabel = select('#start_date_label').text(item).style('color', 'red');
            console.log(this.startDay);

        });

        events.on('start_date_patient', (evt, item)=> {
            this.startBool = '0 date determined by patient';
            this.startDay = item;
            let startLabel = select('#start_date_label').text(item);//.style('color', 'red');
            let startLabelBool = select('#pat_or_event').text(this.startBool);
        });

        events.on('number_of_similar_patients', (evt, item) => {  // called in distribution diagram
            select('#text_num_similar').attr('value', item[0]);
            this.updateSimilar();

        });
/*
        events.on('selected_updated', (evt, item)=>{
            events.fire('update_similar', [item, item.length, null]);
        });*/
    }


    /**
     * getting the similar patients info and firing events to update the vis
     * @returns {Promise<void>}
     */
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
               // console.log(this.similarArgs.ids);
              //  console.log('value  '+ value);
               // console.log('args  '+ args);
               

                // caught by svgTable and scoreDiagram and statHistogram
                events.fire('update_similar', [value, n, args]);
                events.fire('update_hierarchy');
            });

        } else {
            console.log('Not a Number');
        }

    }

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
