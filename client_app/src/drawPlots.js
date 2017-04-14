/**
 * Created by saharmehrpour on 3/3/17.
 */
import { select } from 'd3-selection';
import * as scatterPlot from './scatterPlot';
import * as ajax from 'phovea_core/src/ajax';
var DrawPlots = (function () {
    function DrawPlots(parent) {
        this.$node = select(parent);
    }
    DrawPlots.prototype.run = function () {
        var _this = this;
        return new Promise(function (resolve) {
            Promise.all([ajax.getAPIJSON('/iris_api/irisDataDecomposed'), ajax.getAPIJSON('/iris_api/irisClustered')])
                .then(function (args) {
                var data = args[0];
                var result = args[1].clustered;
                var scatter1 = scatterPlot.create(_this.$node.node(), data.data_01, result);
                scatter1.init();
                var scatter2 = scatterPlot.create(_this.$node.node(), data.data_12, result);
                scatter2.init();
                var scatter3 = scatterPlot.create(_this.$node.node(), data.data_23, result);
                scatter3.init();
                var scatter4 = scatterPlot.create(_this.$node.node(), data.data_03, result);
                scatter4.init();
                resolve(_this);
            });
        });
    };
    return DrawPlots;
}());
export { DrawPlots };
export function create(parent) {
    return new DrawPlots(parent);
}
//# sourceMappingURL=drawPlots.js.map