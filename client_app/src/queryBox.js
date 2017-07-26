/**
 * Created by saharmehrpour on 3/8/17.
 */
import * as tslib_1 from "tslib";
import * as ajax from 'phovea_core/src/ajax';
import { select } from 'd3-selection';
import * as events from 'phovea_core/src/event';
var QueryBox = (function () {
    function QueryBox(parent) {
        var _this = this;
        this.dataset = 'selected';
        this.$node = select(parent)
            .append('div')
            .classed('queryDiv', true);
        var self = this;
        var form = this.$node.append('form');
        form.append('label')
            .attr('for', 'dataset_selection')
            .text('Dataset: ');
        form.append("input")
            .attr('type', 'radio')
            .attr("name", "dataset_selection")
            .attr("value", "selected")
            .property('checked', true)
            .on("click", function () {
            var val = select(this).attr("value");
            if (val !== self.dataset) {
                self.dataset = val;
                events.fire('update_dataset', ['dataset', self.dataset]);
            }
        });
        form.append('label')
            .html('Selected');
        form.append('input')
            .attr('type', 'radio')
            .attr('value', 'all')
            .attr('name', 'dataset_selection')
            .on('click', function () {
            var val = select(this).attr("value");
            if (val !== self.dataset) {
                self.dataset = val;
                events.fire('update_dataset', ['dataset', self.dataset]);
            }
        });
        form.append('label')
            .html('All');
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
            .attr('value', 'All Info')
            .on('click', function () { return _this.updateAllInfo(); });
        form.append('input')
            .attr('type', 'button')
            .attr('value', 'similar')
            .on('click', function () { return _this.updateSimilar(); });
        form.append('label')
            .attr('for', 'text_num_similar')
            .text('Number of similar patients');
        form.append('input')
            .attr('type', 'text')
            .attr('placeholder', 'Number of similar patients')
            .attr('id', 'text_num_similar')
            .attr('value', '10');
        this.attachListener();
    }
    /**
     * Attaching listener
     */
    QueryBox.prototype.attachListener = function () {
        var _this = this;
        // TODO test!
        // Only used for the initial testing (events fired in app.ts).
        // Should be removed at the end.
        events.on('update_temp_similar', function (evt, item) {
            var url = "/data_api/getSimilarRows/" + item[1] + "/" + item[2] + "/" + _this.dataset;
            _this.setBusy(true);
            _this.getData(url).then(function (args) {
                _this.setBusy(false);
                _this.similarArgs = args;
                events.fire('update_similar', [item[1], item[2], args]); // caught by svgTable and scoreDiagram and statHistogram
            });
        });
        events.on('number_of_similar_patients', function (evt, item) {
            select('#text_num_similar').attr('value', item[0]);
            _this.updateSimilar();
        });
    };
    /**
     * getting the similar patients info and firing events to update the vis
     * @returns {Promise<void>}
     */
    QueryBox.prototype.updateSimilar = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var value, number, n_1, url;
            return tslib_1.__generator(this, function (_a) {
                value = document.getElementById('text_pat_id').value;
                number = document.getElementById('text_num_similar').value;
                if (!isNaN(+value) && value) {
                    n_1 = !isNaN(+number) ? +number : 10;
                    n_1 = n_1 <= 0 ? 10 : n_1;
                    url = "/data_api/getSimilarRows/" + value + "/" + n_1 + "/" + this.dataset;
                    this.setBusy(true);
                    this.getData(url).then(function (args) {
                        _this.setBusy(false);
                        _this.similarArgs = args;
                        //console.log(args);
                        // caught by svgTable and scoreDiagram and statHistogram
                        events.fire('update_similar', [value, n_1, args]);
                    });
                }
                else {
                    console.log('Not a Number');
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * firing event to update the vis for info of a patient
     */
    QueryBox.prototype.updateAllInfo = function () {
        var _this = this;
        var value = document.getElementById('text_pat_id').value;
        if (!isNaN(+value) && value) {
            var url = "/data_api/getPatInfo/" + value + "/" + this.dataset;
            this.setBusy(true);
            this.getData(url).then(function (args) {
                // caught by svgTable and similarityScoreDiagram
                events.fire('update_all_info', [value, args]);
                _this.setBusy(false);
            });
        }
        else {
            console.log('Not a Number');
        }
    };
    /**
     * get Data by API
     * @param URL
     * @returns {Promise<any>}
     */
    QueryBox.prototype.getData = function (URL) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ajax.getAPIJSON(URL)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Show or hide the application loading indicator
     * @param isBusy
     */
    QueryBox.prototype.setBusy = function (isBusy) {
        var status = select('.busy').classed('hidden');
        if (status == isBusy)
            select('.busy').classed('hidden', !isBusy);
    };
    return QueryBox;
}());
export { QueryBox };
export function create(parent) {
    return new QueryBox(parent);
}
//# sourceMappingURL=queryBox.js.map