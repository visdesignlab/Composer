/**
 * Created by saharmehrpour on 4/3/17.
 */
import * as tslib_1 from "tslib";
import * as ajax from 'phovea_core/src/ajax';
import { select } from 'd3-selection';
//import {transition} from 'd3-transition';
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
            var URL, args, weights;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        URL = "/data_api/getWeights/Demo";
                        return [4 /*yield*/, ajax.getAPIJSON(URL)];
                    case 1:
                        args = _a.sent();
                        weights = args.weights;
                        this.$node.selectAll('.item').data(this.header.Demo)
                            .enter()
                            .append('div')
                            .classed('item', true);
                        this.$node.selectAll('.item')
                            .html(function (d) {
                            return "<input type='text' placeholder='Weight' size='8' id='weight_" + d
                                + "' value='" + weights[d] + "'>"
                                + "&nbsp;" + d;
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
            var tempValue, tempWeights, counter, tempId, URL, args, weights;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempValue = document.getElementById('weight_PAT_GENDER')
                            .value;
                        if (isNaN(+tempValue)) {
                            console.log('error in weight_PAT_GENDER');
                            return [2 /*return*/];
                        }
                        tempWeights = (+tempValue).toString();
                        for (counter = 1; counter < this.header.Demo.length; counter++) {
                            tempId = 'weight_' + this.header.Demo[counter];
                            tempValue = document.getElementById(tempId).value;
                            if (isNaN(+tempValue)) {
                                console.log('error in ' + tempId);
                                return [2 /*return*/];
                            }
                            tempWeights = tempWeights + "+" + (+tempValue.toString());
                        }
                        URL = "/data_api/updateWeights/Demo/" + tempWeights;
                        return [4 /*yield*/, ajax.getAPIJSON(URL)];
                    case 1:
                        args = _a.sent();
                        weights = args.weights;
                        console.log(URL);
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