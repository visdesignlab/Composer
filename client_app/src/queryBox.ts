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

    constructor(parent: Element) {

        this.dataset = 'selected';

        this.$node = select(parent)
            .append('div')
            .classed('queryDiv', true);

        this.$node.append('label')
            .attr('for', 'dataset_selection')
            .text('Consider All (6071) Patients?');

        this.$node.append('input')
            .attr('type', 'checkbox')
            .property('checked', false)
            .attr('id', 'dataset_selection')
            .on('change', () => {
                if (select("#dataset_selection").property("checked"))
                    this.dataset = 'all';
                else
                    this.dataset = 'selected';
                events.fire('update_dataset', ['dataset', this.dataset])
            });

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

        this.$node.append('input')
            .attr('type', 'text')
            .attr('placeholder', 'Search PAT_ID')
            .attr('id', 'text_pat_id');

        this.$node.append('input')
            .attr('type', 'button')
            .attr('value', 'All Info')
            .on('click', () => this.updateAllInfo());

        this.$node.append('input')
            .attr('type', 'button')
            .attr('value', 'similar')
            .on('click', () => this.updateSimilar());

        this.$node.append('input')
            .attr('type', 'text')
            .attr('placeholder', 'Number of similar patients')
            .attr('id', 'text_num_similar');

        this.attachListener(); // TODO test!

    }

    /**
     * Attaching listener
     * Only used for the initial testing (events fired in app.ts).
     * Should be removed at the end.
     */
    private attachListener() {  // TODO test!
        events.on('update_temp_similar', (evt, item) => {

            const url = `/data_api/getSimilarRows/${item[1]}/${item[2]}/${this.dataset}`;
            this.setBusy(true);
            this.getData(url).then((args) => {

                this.setBusy(false);
                this.similarArgs = args;

                events.fire('update_similar', [item[1], item[2], args]); // caught by svgTable and scoreDiagram and statHistogram
            });
        });
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

                //console.log(args);

                // caught by svgTable and scoreDiagram and statHistogram
                events.fire('update_similar', [value, n, args]);
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

                this.setBusy(false);
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
