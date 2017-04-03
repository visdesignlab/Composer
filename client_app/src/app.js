/**
 * Created by Caleydo Team on 31.08.2016.
 */
import * as tslib_1 from "tslib";
import { select } from 'd3-selection';
import * as svgTable from './svgTable';
import * as queryBox from './queryBox';
import * as sideBar from './sideBar';
/**
 * The main class for the App app
 */
var App = (function () {
    function App(parent) {
        this.$node = select(parent);
    }
    /**
     * Initialize the view and return a promise
     * that is resolved as soon the view is completely initialized.
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
            var sideBarDiv, side, main, query_box, table1, table2, table3, table4, svg_table1, svg_table2, svg_table3, svg_table4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //let dp = drawPlots.create(this.$node.node());
                        //await dp.run();
                        //let pl = printLogs.create('Demo');
                        //await pl.runLogs();
                        //await pl.runDemo();
                        //await pl.runRemove("clinical_2");  // Not Working!
                        //await pl.showInfo();
                        this.$node.select('h3').remove();
                        sideBarDiv = this.$node.append("div").classed("sideBar", true);
                        side = sideBar.create(sideBarDiv.node());
                        return [4 /*yield*/, side.init()];
                    case 1:
                        _a.sent();
                        main = this.$node.append("div").classed("main", true);
                        query_box = queryBox.create(main.node(), 'Demo');
                        main.append("h3").text("Demo");
                        table1 = main.append("div");
                        main.append("h3").text("PRO");
                        table2 = main.append("div");
                        main.append("h3").text("PT");
                        table3 = main.append("div");
                        main.append("h3").text("VAS");
                        table4 = main.append("div");
                        svg_table1 = svgTable.create(table1.node());
                        svg_table2 = svgTable.create(table2.node());
                        svg_table3 = svgTable.create(table3.node());
                        svg_table4 = svgTable.create(table4.node());
                        // TODO: replace with events.fire and .on
                        query_box.set_svg_table(svg_table1, svg_table2, svg_table3, svg_table4);
                        return [4 /*yield*/, svg_table1.drawTable('Demo')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, svg_table2.drawTable('PRO')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, svg_table3.drawTable('PT')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, svg_table4.drawTable('VAS')];
                    case 5:
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