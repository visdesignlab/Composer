/**
 * Created by Caleydo Team on 31.08.2016.
 */
import * as tslib_1 from "tslib";
import { select } from 'd3-selection';
import * as queryBox from './queryBox';
import * as scoreDiagram from './scoreDiagram';
import * as events from 'phovea_core/src/event';
/**
 * The main class for the App app
 */
var App = (function () {
    function App(parent) {
        this.$node = select(parent);
    }
    /**
     * Initialize the view and return a promise
     * that is resolved as soon the view is compconstely initialized.
     * @returns {Promise<App>}
     */
    App.prototype.init = function () {
        return this.build();
    };
    /**
     * Load and initialize all necessary views
     * @returns {Promise<App>}
     */
    App.prototype.build = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var main, scoreDgm;
            return tslib_1.__generator(this, function (_a) {
                //const dp = drawPlots.create(this.$node.node());
                //await dp.run();
                //const pl = printLogs.create('Demo');
                //await pl.runLogs();
                //await pl.runDemo();
                //await pl.runRemove('clinical_2');  // Not Working!
                //await pl.showInfo();
                this.$node.select('h3').remove();
                main = this.$node.append('div').classed('main', true);
                queryBox.create(main.node(), 'Demo');
                scoreDgm = main.append('div');
                scoreDiagram.create(scoreDgm.node(), 'PRO');
                /*
                    await svgTableDemo.drawTable('Demo');
                    await svgTablePro.drawTable('PRO');
                    await svgTablePt.drawTable('PT');
                    await svgTableVas.drawTable('VAS');
                    await svgTableCci.drawTable('CCI');
                    await svgTableCodes.drawTable('Codes');
                    await svgTableOrders.drawTable('Orders');
                */
                this.setBusy(false);
                events.fire('draw_score_diagram', ['PAT_ID', '6790018']);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Show or hide the application loading indicator
     * @param isBusy
     */
    App.prototype.setBusy = function (isBusy) {
        this.$node.select('.busy').classed('hidden', !isBusy);
    };
    return App;
}());
export { App };
/**
 * Factory method to create a new app instance
 * @param parent
 * @returns {App}
 */
export function create(parent) {
    return new App(parent);
}
//# sourceMappingURL=app.js.map