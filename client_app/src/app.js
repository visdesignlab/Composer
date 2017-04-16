/**
 * Created by Caleydo Team on 31.08.2016.
 */
import * as tslib_1 from "tslib";
import { select } from 'd3-selection';
import * as svgTable from './svgTable';
import * as queryBox from './queryBox';
import * as scoreDiagram from './scoreDiagram';
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
            var main, scoreDgm, tableDemo, tablePro, tableCci, tableOrders, svgTableDemo, svgTablePro, svgTableCci, svgTableOrders;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //const pl = printLogs.create('Demo');
                        //await pl.runLogs();
                        //await pl.runDemo();
                        //await pl.showInfo();
                        this.$node.select('h3').remove();
                        main = this.$node.append('div').classed('main', true);
                        queryBox.create(main.node(), 'Demo');
                        scoreDgm = main.append('div');
                        main.append('h3').text('Demo');
                        tableDemo = main.append('div');
                        main.append('h3').text('PRO');
                        tablePro = main.append('div');
                        //main.append('h3').text('PT');
                        //const tablePt = main.append('div');
                        //main.append('h3').text('VAS');
                        //const tableVas = main.append('div');
                        main.append('h3').text('CCI');
                        tableCci = main.append('div');
                        //main.append('h3').text('Codes');
                        //const tableCodes = main.append('div');
                        main.append('h3').text('Orders');
                        tableOrders = main.append('div');
                        scoreDiagram.create(scoreDgm.node(), 'PRO');
                        svgTableDemo = svgTable.create(tableDemo.node());
                        svgTablePro = svgTable.create(tablePro.node());
                        svgTableCci = svgTable.create(tableCci.node());
                        svgTableOrders = svgTable.create(tableOrders.node());
                        return [4 /*yield*/, svgTableDemo.drawTable('Demo')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, svgTablePro.drawTable('PRO')];
                    case 2:
                        _a.sent();
                        //await svgTablePt.drawTable('PT');
                        //await svgTableVas.drawTable('VAS');
                        return [4 /*yield*/, svgTableCci.drawTable('CCI')];
                    case 3:
                        //await svgTablePt.drawTable('PT');
                        //await svgTableVas.drawTable('VAS');
                        _a.sent();
                        //await svgTableCodes.drawTable('Codes');
                        return [4 /*yield*/, svgTableOrders.drawTable('Orders')];
                    case 4:
                        //await svgTableCodes.drawTable('Codes');
                        _a.sent();
                        this.setBusy(false);
                        return [2 /*return*/];
                }
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