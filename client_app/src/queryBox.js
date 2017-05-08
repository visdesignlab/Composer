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
        this.$node = select(parent)
            .append('div')
            .classed('queryDiv', true);
        this.$node.append('input')
            .attr('type', 'button')
            .attr('value', 'Latest')
            .on('click', function () { return events.fire('update_latest', ['func', 'latest']); }); // only 'Demo' is updated
        this.$node.append('input')
            .attr('type', 'button')
            .attr('value', 'Reset')
            .on('click', function () { return events.fire('update_init', ['func', 'init']); });
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
     */
    QueryBox.prototype.attachListener = function () {
        var _this = this;
        events.on('update_temp_similar', function (evt, item) {
            var url = "/data_api/getSimilarRows/" + item[1] + "/" + item[2];
            _this.setBusy(true);
            _this.getData(url).then(function (args) {
                _this.setBusy(false);
                _this.similarArgs = args;
                events.fire('update_similar', ['args', args]); // caught by svgTable and scoreDiagram and statHistogram
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
            var value, number, n, url;
            return tslib_1.__generator(this, function (_a) {
                value = document.getElementById('text_pat_id').value;
                number = document.getElementById('text_num_similar').value;
                if (!isNaN(+value) && value) {
                    n = !isNaN(+number) ? +number : 10;
                    n = n <= 0 ? 10 : n;
                    url = "/data_api/getSimilarRows/" + value + "/" + n;
                    this.setBusy(true);
                    this.getData(url).then(function (args) {
                        _this.setBusy(false);
                        _this.similarArgs = args;
                        console.log(args);
                        events.fire('update_similar', ['args', args]); // caught by svgTable and scoreDiagram and statHistogram
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
        var value = document.getElementById('text_pat_id').value;
        if (!isNaN(+value) && value) {
            events.fire('update_all_info', ['PAT_ID', value]); // caught by svgTable
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