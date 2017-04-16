/**
 * Created by saharmehrpour on 3/3/17.
 */
import * as tslib_1 from "tslib";
import * as ajax from 'phovea_core/src/ajax';
import * as dataExplorations from './dataExplorations';
var PrintLogs = (function () {
    function PrintLogs(dataset_id) {
        this.dataset_id = dataset_id;
    }
    PrintLogs.prototype.runLogs = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var URL, args;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        URL = "/data_api/getData/" + this.dataset_id;
                        return [4 /*yield*/, ajax.getAPIJSON(URL)];
                    case 1:
                        args = _a.sent();
                        // print data in console
                        console.log("==========");
                        console.log("Retrieved by phovea_server/src/dataset.py");
                        console.log("==========");
                        console.log("----> /data_api/getData/" + this.dataset_id + " :");
                        console.log(args[0]['data']);
                        console.log("----> /data_api/phoveaServerDataFunction :");
                        console.log(args[1]);
                        return [2 /*return*/];
                }
            });
        });
    };
    PrintLogs.prototype.runDemo = function () {
        var demo = dataExplorations.create();
        return demo.demoDatasets(null);
    };
    PrintLogs.prototype.showInfo = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var URL, args;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        URL = "/data_api/getDatasetInfoByFunctions/" + this.dataset_id;
                        return [4 /*yield*/, ajax.getAPIJSON(URL)];
                    case 1:
                        args = _a.sent();
                        console.log("==========");
                        console.log("dataset: " + this.dataset_id);
                        console.log("Information retrieved from functions in ");
                        console.log("phovea_server/dataset_csv.py#L341");
                        console.log("==========");
                        console.log("----> /data_api/getDatasetInfoByFunctions/" + this.dataset_id + ":");
                        console.log(args);
                        return [2 /*return*/];
                }
            });
        });
    };
    return PrintLogs;
}());
export { PrintLogs };
export function create(dataset_id) {
    return new PrintLogs(dataset_id);
}
//# sourceMappingURL=printLogs.js.map