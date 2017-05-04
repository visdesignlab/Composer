/**
 * Created by saharmehrpour on 4/3/17.
 */
import * as tslib_1 from "tslib";
import * as ajax from 'phovea_core/src/ajax';
import { select } from 'd3-selection';
import { entries } from 'd3-collection';
//import {transition} from 'd3-transition';
import { Constants } from './constants';
var SideBar = (function () {
    function SideBar(parent) {
        this.header = {
            'Demo': ['PAT_BIRTHDATE', 'PAT_GENDER', 'PAT_ETHNICITY', 'D_ETHNICITY_DESC',
                'PAT_RACE', 'D_RACE_DESC', 'PAT_MARITAL_STAT', 'PAT_DEATH_IND', 'BMI',
                'HEIGHT_CM', 'WEIGHT_KG', 'ADM_DATE', 'DSCH_DATE', 'TOBACCO_USER',
                'ALCOHOL_USER', 'ILLICIT_DRUG_USER']
        };
        this.$node = select(parent);
    }
    SideBar.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var args_Demo, args_CCI, weights;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ajax.getAPIJSON("/data_api/getWeights/Demo")];
                    case 1:
                        args_Demo = _a.sent();
                        return [4 /*yield*/, ajax.getAPIJSON("/data_api/getWeights/CCI")];
                    case 2:
                        args_CCI = _a.sent();
                        weights = Object.assign(args_Demo.weights, args_CCI.weights);
                        this.$node.selectAll('.item').data(entries(Constants.sideBar.Demo).concat(entries(Constants.sideBar.CCI)))
                            .enter()
                            .append('div')
                            .classed('item', true);
                        this.$node.selectAll('.item')
                            .html(function (d) {
                            return "<input type='text' placeholder='Weight' size='8' id='weight_" + d.key
                                + "' value='" + weights[d.key] + "'>"
                                + "&nbsp;" + d.value;
                        });
                        this.$node.append('input')
                            .attr('type', 'button')
                            .attr('value', 'Update')
                            .on('click', function () { return _this.updateWeights(); });
                        return [2 /*return*/];
                }
            });
        });
    };
    SideBar.prototype.updateWeights = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tables, t, table, tempWeights, array, counter, tempId, tempValue, URL_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tables = ['Demo', 'CCI'];
                        t = 0;
                        _a.label = 1;
                    case 1:
                        if (!(t < tables.length)) return [3 /*break*/, 4];
                        table = tables[t];
                        tempWeights = '';
                        array = entries(Constants.sideBar[table]);
                        for (counter = 0; counter < array.length; counter++) {
                            tempId = 'weight_' + array[counter].key;
                            tempValue = document.getElementById(tempId).value;
                            if (isNaN(+tempValue)) {
                                console.log('error in ' + array[counter].key);
                                return [2 /*return*/];
                            }
                            tempWeights = tempWeights + (+tempValue.toString()) + "+";
                        }
                        URL_1 = "/data_api/updateWeights/" + table + "/"
                            + tempWeights.substring(0, tempWeights.length - 1);
                        return [4 /*yield*/, ajax.getAPIJSON(URL_1)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        t++;
                        return [3 /*break*/, 1];
                    case 4:
                        console.log('Weights are updated.');
                        return [2 /*return*/];
                }
            });
        });
    };
    return SideBar;
}());
export { SideBar };
export function create(parent) {
    return new SideBar(parent);
}
//# sourceMappingURL=sideBar.js.map