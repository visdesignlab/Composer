/**
 * Created by Caleydo Team on 31.08.2016.
 */
import * as tslib_1 from "tslib";
import { select } from 'd3-selection';
import * as svgTable from './svgTable';
import * as queryBox from './queryBox';
import * as sideBar from './sideBar';
import * as similarityScoreDiagram from './similarityScoreDiagram';
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
            var sideBarDiv, side, main, dgmPromisPhysicalDiv, tableDemo, tablePro, tableCci, svgTableDemo, svgTablePro, svgTableCci;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //const pl = printLogs.create('Demo');
                        //await pl.runLogs();
                        //await pl.runDemo();
                        //await pl.showInfo();
                        this.$node.select('h3').remove();
                        sideBarDiv = this.$node.append('div').classed('sideBar', true);
                        side = sideBar.create(sideBarDiv.node());
                        return [4 /*yield*/, side.init()];
                    case 1:
                        _a.sent();
                        main = this.$node.append('div').classed('main', true);
                        queryBox.create(main.node(), 'Demo');
                        dgmPromisPhysicalDiv = main.append('Div');
                        main.append('h3').text('Demo');
                        tableDemo = main.append('div');
                        main.append('h3').text('PRO');
                        tablePro = main.append('div');
                        main.append('h3').text('CCI');
                        tableCci = main.append('div');
                        //main.append('h3').text('Codes');
                        //const tableCodes = main.append('div');
                        //main.append('h3').text('Orders');
                        //const tableOrders = main.append('div');
                        //main.append('h3').text('PT');
                        //const tablePt = main.append('div');
                        //main.append('h3').text('VAS');
                        //const tableVas = main.append('div');
                        //scoreDiagram.create(scoreDgm.node(), 'PRO'); // old one
                        similarityScoreDiagram.create(dgmPromisPhysicalDiv.node(), 'PROMIS Bank v1.2 - Physical Function');
                        similarityScoreDiagram.create(dgmPromisPhysicalDiv.node(), 'Oswestry Index (ODI)');
                        similarityScoreDiagram.create(dgmPromisPhysicalDiv.node(), 'PROMIS Bank v1.0 - Depression');
                        svgTableDemo = svgTable.create(tableDemo.node());
                        svgTablePro = svgTable.create(tablePro.node());
                        svgTableCci = svgTable.create(tableCci.node());
                        //const svgTableCodes = svgTable.create(tableCodes.node());
                        //const svgTableOrders = svgTable.create(tableOrders.node());
                        //const svgTablePt = svgTable.create(tablePt.node());
                        //const svgTableVas = svgTable.create(tableVas.node());
                        return [4 /*yield*/, svgTableDemo.drawTable('Demo')];
                    case 2:
                        //const svgTableCodes = svgTable.create(tableCodes.node());
                        //const svgTableOrders = svgTable.create(tableOrders.node());
                        //const svgTablePt = svgTable.create(tablePt.node());
                        //const svgTableVas = svgTable.create(tableVas.node());
                        _a.sent();
                        return [4 /*yield*/, svgTablePro.drawTable('PRO')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, svgTableCci.drawTable('CCI')];
                    case 4:
                        _a.sent();
                        //await svgTableCodes.drawTable('Codes');
                        //await svgTableOrders.drawTable('Orders');
                        //await svgTablePt.drawTable('PT');
                        //await svgTableVas.drawTable('VAS');
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