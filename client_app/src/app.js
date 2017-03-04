/**
 * Created by Caleydo Team on 31.08.2016.
 */
import * as tslib_1 from "tslib";
import { select } from 'd3-selection';
import * as drawPlots from './drawPlots';
import * as printLogs from './printLogs';
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
            var dp, pl;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dp = drawPlots.create(this.$node.node());
                        return [4 /*yield*/, dp.run()];
                    case 1:
                        _a.sent();
                        pl = printLogs.create();
                        //await pl.runLogs();
                        //await pl.runDemo();
                        // Not Working!
                        //await pl.runRemove();
                        return [4 /*yield*/, pl.showInfo()];
                    case 2:
                        //await pl.runLogs();
                        //await pl.runDemo();
                        // Not Working!
                        //await pl.runRemove();
                        _a.sent();
                        // Fix it from the server
                        //await pl.showRow();
                        this.$node.select('h3').remove();
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