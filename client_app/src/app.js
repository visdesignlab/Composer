/**
 * Created by Caleydo Team on 31.08.2016.
 */
import * as tslib_1 from "tslib";
import { select } from 'd3-selection';
import * as queryBox from './queryBox';
import * as similarityScoreDiagram from './similarityScoreDiagram';
import * as events from 'phovea_core/src/event';
import * as statHistogram from './statHistogram';
import * as rectExploration from './rectExploration';
import * as distributionDiagram from './distributionDiagram';
import React from 'react';
import ReactDOM from 'react-dom';
import SideBarComponent from './ReactComponents/SideBarComponent';
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
            var main, dgmPromisPhysicalDiv;
            return tslib_1.__generator(this, function (_a) {
                //const pl = printLogs.create('Demo');
                //await pl.runLogs();
                //await pl.runDemo();
                //await pl.showInfo();
                // loading header
                this.$node.select('h3').remove();
                // create side bar
                // const sideBarDiv = this.$node.append('div').classed('sideBar', true);
                // const side = sideBar.create(sideBarDiv.node());
                // await side.init();
                this.$node.append('div').attr('id', 'sideBar');
                ReactDOM.render(React.createElement(SideBarComponent), document.getElementById('sideBar'));
                main = this.$node.append('div').classed('main', true);
                // query box
                queryBox.create(main.node());
                // distributionDiagram
                distributionDiagram.create(main.node());
                // histogram
                statHistogram.create(main.node());
                //rect
                rectExploration.create(main.node());
                dgmPromisPhysicalDiv = main.append('Div').classed('allDiagramDiv', true);
                similarityScoreDiagram.create(dgmPromisPhysicalDiv.node(), 'PROMIS Bank v1.2 - Physical Function');
                similarityScoreDiagram.create(dgmPromisPhysicalDiv.node(), 'Oswestry Index (ODI)');
                similarityScoreDiagram.create(dgmPromisPhysicalDiv.node(), 'PROMIS Bank v1.0 - Depression');
                // // create table titles and div
                // main.append('h3').text('Demo');
                // const tableDemo = main.append('div');
                // main.append('h3').text('PRO');
                // const tablePro = main.append('div');
                // //main.append('h3').text('CCI');
                // //const tableCci = main.append('div');
                // //main.append('h3').text('Codes');
                // //const tableCodes = main.append('div');
                // main.append('h3').text('Orders');
                // const tableOrders = main.append('div');
                // //main.append('h3').text('PT');
                // //const tablePt = main.append('div');
                // //main.append('h3').text('VAS');
                // //const tableVas = main.append('div');
                //
                //
                // // create the table
                // const svgTableDemo = svgTable.create(tableDemo.node());
                // const svgTablePro = svgTable.create(tablePro.node());
                // //const svgTableCci = svgTable.create(tableCci.node());
                // //const svgTableCodes = svgTable.create(tableCodes.node());
                // const svgTableOrders = svgTable.create(tableOrders.node());
                // //const svgTablePt = svgTable.create(tablePt.node());
                // //const svgTableVas = svgTable.create(tableVas.node());
                //
                //
                // // draw the table
                // await svgTableDemo.drawTable('Demo');
                // await svgTablePro.drawTable('PRO');
                // //await svgTableCci.drawTable('CCI');
                // //await svgTableCodes.drawTable('Codes');
                // await svgTableOrders.drawTable('Orders');
                // //await svgTablePt.drawTable('PT');
                // //await svgTableVas.drawTable('VAS');
                this.setBusy(false);
                events.fire('update_temp_similar', ['PAT_ID', '20559329', 10]);
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