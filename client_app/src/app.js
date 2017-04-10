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
            var sideBarDiv, side, main, table_demo, table_pro, table_pt, table_vas, table_cci, table_codes, table_orders, svg_table_demo, svg_table_pro, svg_table_pt, svg_table_vas, svg_table_cci, svg_table_codes, svg_table_orders;
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
                        queryBox.create(main.node(), 'Demo');
                        main.append("h3").text("Demo");
                        table_demo = main.append("div");
                        main.append("h3").text("PRO");
                        table_pro = main.append("div");
                        main.append("h3").text("PT");
                        table_pt = main.append("div");
                        main.append("h3").text("VAS");
                        table_vas = main.append("div");
                        main.append("h3").text("CCI");
                        table_cci = main.append("div");
                        main.append("h3").text("Codes");
                        table_codes = main.append("div");
                        main.append("h3").text("Orders");
                        table_orders = main.append("div");
                        svg_table_demo = svgTable.create(table_demo.node());
                        svg_table_pro = svgTable.create(table_pro.node());
                        svg_table_pt = svgTable.create(table_pt.node());
                        svg_table_vas = svgTable.create(table_vas.node());
                        svg_table_cci = svgTable.create(table_cci.node());
                        svg_table_codes = svgTable.create(table_codes.node());
                        svg_table_orders = svgTable.create(table_orders.node());
                        return [4 /*yield*/, svg_table_demo.drawTable('Demo')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, svg_table_pro.drawTable('PRO')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, svg_table_pt.drawTable('PT')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, svg_table_vas.drawTable('VAS')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, svg_table_cci.drawTable('CCI')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, svg_table_codes.drawTable('Codes')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, svg_table_orders.drawTable('Orders')];
                    case 8:
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