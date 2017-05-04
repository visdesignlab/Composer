/**
 * Created by saharmehrpour on 3/8/17.
 */
import * as tslib_1 from "tslib";
import { select } from 'd3-selection';
//import {values,keys} from 'd3-collection'
import * as events from 'phovea_core/src/event';
var QueryBox = (function () {
    function QueryBox(parent, datasetId) {
        var _this = this;
        this.datasetId = datasetId;
        this.$node = select(parent)
            .append('div')
            .classed('queryDiv', true);
        this.$node.append('input')
            .attr('type', 'button')
            .attr('value', 'Latest')
            .on('click', function () { return events.fire('update_table_latest', ['func', 'latest']); });
        this.$node.append('input')
            .attr('type', 'button')
            .attr('value', 'Reset')
            .on('click', function () { return events.fire('update_table_init', ['func', 'init']); });
        this.$node.append('input')
            .attr('type', 'text')
            .attr('placeholder', 'Search PAT_ID')
            .attr('id', 'text_pat_id');
        this.$node.append('input')
            .attr('type', 'button')
            .attr('value', 'similar')
            .on('click', function () { return _this.updateTableSimilar(); });
        // TODO: Not active right now
        /*
        this.$node.append('input')
          .attr('type', 'button')
          .attr('value', 'All Info')
          .on('click', () => this.updateTableInfo());
    
    
        this.$node.append('input')
          .attr('type', 'button')
          .attr('value', 'Add Patient info')
          .on('click', () => this.addInfo());
    
        this.$node.append('input')
          .attr('type', 'button')
          .attr('value', 'Remove Patient info')
          .on('click', () => this.removeInfo());
    
        //this.$node.append('p')
        //  .text('A good example is 6790018');
    
    */
    }
    QueryBox.prototype.updateTableSimilar = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var value;
            return tslib_1.__generator(this, function (_a) {
                value = document.getElementById('text_pat_id').value;
                if (!isNaN(+value)) {
                    events.fire('update_table_similar', ['PAT_ID', value]);
                }
                else {
                    console.log('Not a Number');
                }
                return [2 /*return*/];
            });
        });
    };
    QueryBox.prototype.updateTableInfo = function () {
        var value = document.getElementById('text_pat_id').value;
        if (!isNaN(+value)) {
            events.fire('update_table_all', ['PAT_ID', value]);
        }
        else {
            console.log('Not a Number');
        }
    };
    return QueryBox;
}());
export { QueryBox };
export function create(parent, datasetId) {
    return new QueryBox(parent, datasetId);
}
//# sourceMappingURL=queryBox.js.map