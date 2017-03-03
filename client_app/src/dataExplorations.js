/**
 * Added by saharmehrpour on 3/1/17. Created by Alex.
 */
import * as tslib_1 from "tslib";
import { list as listData, getFirstByName } from 'phovea_core/src/data';
var DataExplorations = (function () {
    function DataExplorations() {
    }
    /**
     *
     * This function demonstrates the use of a heterogeneous table.
     *
     * The relevant Phovea Classes:
     *
     * Accessing datasets using various functions:
     * https://github.com/phovea/phovea_core/blob/develop/src/data.ts
     * The phovea table interface:
     * https://github.com/phovea/phovea_core/blob/develop/src/table.ts
     *
     * The phovea vector:
     * https://github.com/phovea/phovea_core/blob/develop/src/vector/IVector.ts
     *
     */
    DataExplorations.prototype.demoDatasets = function (table) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var allDatasets, vector, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log('=============================');
                        console.log('RETRIEVING DATA');
                        console.log('=============================');
                        if (!(table == null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, listData()];
                    case 1:
                        allDatasets = _d.sent();
                        console.log('All loaded datasets:');
                        console.log(allDatasets);
                        // we could use those dataset to filter them based on their description and pick the one(s) we're interested in
                        // here we pick the first dataset and cast it to ITable - by default the datasets are returned as IDataType
                        table = allDatasets[0];
                        return [4 /*yield*/, getFirstByName('big-decent-clipped-38')];
                    case 2:
                        // retrieving a dataset by name
                        table = (_d.sent());
                        //console.log('artists dataset retrieved by name:');
                        console.log('big-decent-clipped-38 dataset retrieved by name:');
                        console.log(table);
                        return [3 /*break*/, 4];
                    case 3:
                        console.log('The Table as passed via parameter:');
                        console.log(table);
                        _d.label = 4;
                    case 4:
                        console.log('=============================');
                        console.log('ACCESSING METADATA');
                        console.log('=============================');
                        // Accessing the description of the dataset:
                        console.log('Table description:');
                        console.log(table.desc);
                        // Printing the name
                        console.log('Table Name: ' + table.desc.name);
                        console.log('Artist Table description:');
                        console.log(table.desc);
                        // Printing the name
                        console.log('Table Name: ' + table.desc.name);
                        console.log('=============================');
                        console.log('ACCESSING COLUMNS/VECTORS');
                        console.log('=============================');
                        vector = table.col(0);
                        console.log('The first vector:');
                        console.log(vector);
                        console.log('Length:' + vector.length);
                        console.log('IDType:' + vector.idtype);
                        // TODO: retrieve a vector by name
                        // Access the data of a vector by name:
                        console.log('Accessing RelativeID column by name from big-decent-clipped-38 dataset:');
                        _b = (_a = console).log;
                        return [4 /*yield*/, table.colData('RelativeID')];
                    case 5:
                        _b.apply(_a, [_d.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    return DataExplorations;
}());
export default DataExplorations;
/**
 * Method to create a new graphData instance
 * @returns {graphData}
 */
export function create() {
    return new DataExplorations();
}
//# sourceMappingURL=dataExplorations.js.map