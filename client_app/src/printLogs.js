/**
 * Created by saharmehrpour on 3/3/17.
 */
import * as ajax from 'phovea_core/src/ajax';
import * as dataExplorations from './dataExplorations';
var PrintLogs = (function () {
    function PrintLogs() {
    }
    PrintLogs.prototype.runLogs = function () {
        var _this = this;
        return new Promise(function (resolve) {
            // print TCGA data in console
            Promise.all([ajax.getAPIJSON('/tcga_api/getTCGAData'), ajax.getAPIJSON('/tcga_api/getAllDatasets')])
                .then(function (args) {
                var data = args[0]['data'];
                var datasets = args[1]['data'];
                console.log("==========");
                console.log("Retrieved by phovea_server/src/dataset.py");
                console.log("==========");
                console.log("----> All datasets:");
                console.log(datasets);
                console.log("----> TCGA data:");
                console.log(data);
                Promise.all([ajax.getAPIJSON('/tcga_api/phoveaServerDataFunction')])
                    .then(function (args) {
                    console.log("----> Phovea Server Functions:");
                    console.log(args[0]);
                    resolve(_this);
                });
            });
        });
    };
    PrintLogs.prototype.runDemo = function () {
        var demo = dataExplorations.create();
        return demo.demoDatasets(null);
    };
    PrintLogs.prototype.runRemove = function () {
        var _this = this;
        return new Promise(function (resolve) {
            // print TCGA data in console
            Promise.all([ajax.getAPIJSON('/tcga_api/removeDataSet')])
                .then(function (args) {
                var datasets = args[0];
                console.log("==========");
                console.log("After removing a dataset");
                console.log("==========");
                console.log("----> All datasets and the Result:");
                console.log(datasets);
                resolve(_this);
            });
        });
    };
    PrintLogs.prototype.showRow = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var rowIndex = 1;
            var URL = "/tcga_api/getRow/" + rowIndex;
            // print TCGA data in console
            Promise.all([ajax.getAPIJSON(URL)])
                .then(function (args) {
                var row = args[0];
                console.log("==========");
                console.log("Get Row 1 of TCGA dataset from a server");
                console.log("==========");
                console.log("----> Row 1:");
                console.log(row);
                resolve(_this);
            });
        });
    };
    PrintLogs.prototype.showInfo = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var URL = "/tcga_api/getInfoByFunctions";
            // print TCGA data in console
            Promise.all([ajax.getAPIJSON(URL)])
                .then(function (args) {
                var info = args[0];
                console.log("==========");
                console.log("dataset big-decent-clipped-38");
                console.log("Information retrieved from functions in ");
                console.log("phovea_server/dataset_csv.py#L341");
                console.log("==========");
                console.log("----> Info:");
                console.log(info);
                resolve(_this);
            });
        });
    };
    return PrintLogs;
}());
export { PrintLogs };
export function create() {
    return new PrintLogs();
}
//# sourceMappingURL=printLogs.js.map