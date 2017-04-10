/**
 * Created by saharmehrpour on 3/8/17.
 */
//import * as ajax from 'phovea_core/src/ajax';
import { select } from 'd3-selection';
//import {values,keys} from 'd3-collection'
import * as events from 'phovea_core/src/event';
var QueryBox = (function () {
    function QueryBox(parent, dataset_id) {
        var _this = this;
        this.dataset_id = dataset_id;
        this.$node = select(parent)
            .append("div")
            .classed("queryDiv", true);
        this.$node.append("input")
            .attr("type", "text")
            .attr("placeholder", "Search Index")
            .attr("id", "text");
        this.$node.append("input")
            .attr("type", "button")
            .attr("value", "cluster")
            .on("click", function () { return _this.updateTableCluster(); });
        this.$node.append("input")
            .attr("type", "button")
            .attr("value", "similar")
            .on("click", function () { return _this.updateTableSimilar(); });
        this.$node.append("input")
            .attr("type", "text")
            .attr("placeholder", "Search PAT_ID")
            .attr("id", "text_pat_id");
        this.$node.append("input")
            .attr("type", "button")
            .attr("value", "All Info")
            .on("click", function () { return _this.updateTableInfo(); });
        //this.$node.append("p")
        //  .text("A good example is 6790018");
        this.$node.append("input")
            .attr("type", "button")
            .attr("value", "Latest")
            .on("click", function () { return events.fire('update_table_latest', ['dataset_id', 'Demo']); });
        this.$node.append("input")
            .attr("type", "button")
            .attr("value", "Reset")
            .on("click", function () { return events.fire('update_table_init', ['func', 'init']); });
    }
    QueryBox.prototype.updateTableCluster = function () {
        var value = document.getElementById("text").value;
        if (!isNaN(+value)) {
            events.fire('update_table_cluster', ['index', value]);
        }
        else
            console.log("Not a Number");
    };
    QueryBox.prototype.updateTableSimilar = function () {
        var value = document.getElementById("text").value;
        if (!isNaN(+value)) {
            events.fire('update_table_similar', ['index', value]);
        }
        else
            console.log("Not a Number");
    };
    QueryBox.prototype.updateTableInfo = function () {
        var value = document.getElementById("text_pat_id").value;
        if (!isNaN(+value))
            events.fire('update_table', ['PAT_ID', value]);
        else
            console.log("Not a Number");
    };
    return QueryBox;
}());
export { QueryBox };
export function create(parent, dataset_id) {
    return new QueryBox(parent, dataset_id);
}
//# sourceMappingURL=queryBox.js.map