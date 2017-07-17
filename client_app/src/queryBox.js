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
        this.$node.append('label')
            .attr('for', 'dataset_selection')
            .text('Consider All (6071) Patients?');
        this.$node.append('input')
            .attr('type', 'checkbox')
            .property('checked', false)
            .attr('id', 'dataset_selection')
            .on('change', function () {
            if (select("#dataset_selection").property("checked"))
                _this.dataset = 'all';
            else
                _this.dataset = 'selected';
            events.fire('update_dataset', ['dataset', _this.dataset]);
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
            .on('click', function () { return _this.updateAllInfo(); });
        this.$node.append('input')
            .attr('type', 'button')
            .attr('value', 'similar')
            .on('click', function () { return _this.updateSimilar(); });
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
    QueryBox.prototype.attachListener = function () {
        var _this = this;
        events.on('update_temp_similar', function (evt, item) {
            var url = "/data_api/getSimilarRows/" + item[1] + "/" + item[2] + "/" + _this.dataset;
            _this.setBusy(true);
            _this.getData(url).then(function (args) {
                _this.setBusy(false);
                _this.similarArgs = args;
                events.fire('update_similar', [item[1], item[2], args]); // caught by svgTable and scoreDiagram and statHistogram
            });
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