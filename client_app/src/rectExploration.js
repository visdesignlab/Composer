import * as tslib_1 from "tslib";
/**
 * Created by Jen Rogers on 7/21/17.
 */
import * as ajax from 'phovea_core/src/ajax';
import { select, selectAll, event } from 'd3-selection';
import { entries } from 'd3-collection';
import * as events from 'phovea_core/src/event';
import { scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import * as dataCalc from './dataCalculations';
import { transition } from 'd3-transition';
import { brushX } from 'd3-brush';
import * as d3 from 'd3';
var rectExploration = (function () {
    function rectExploration(parent) {
        var _this = this;
        this.findMinDate = dataCalc.findMinDate; //function for calculating the minDate for given patient record
        this.parseTime = dataCalc.parseTime;
        this.setOrderScale = dataCalc.setOrderScale;
        this.getClassAssignment = dataCalc.getClassAssignment;
        this.rectBoxDimension = { width: 1100, height: 90 };
        this.orderBar = { width: 10, height: 60 };
        this.margin = { top: 20, right: 10, bottom: 10, left: 10 };
        this.contextDimension = { width: this.rectBoxDimension.width, height: 55 };
        this.$node = select(parent)
            .append('div')
            .classed('rectDiv', true);
        this.svg = this.$node.append('svg')
            .attr('width', this.rectBoxDimension.width)
            .attr('height', this.rectBoxDimension.height * 2);
        this.timeScale = scaleLinear()
            .range([0, this.rectBoxDimension.width])
            .clamp(true);
        this.timeScaleMini = scaleLinear()
            .range([0, this.contextDimension.width])
            .clamp(true);
        // axis
        this.svg.append('g')
            .attr('class', 'xAxis')
            .attr('transform', "translate(" + this.margin.left + "," + (this.rectBoxDimension.height - 10) + ")");
        //append patient order svg group
        this.svg.append('g')
            .attr('id', 'pat_rect_line')
            .attr('transform', "translate(" + this.margin.left + "," + this.margin.top + ")");
        var context = this.svg.append('g')
            .attr('class', 'context')
            .attr('width', this.contextDimension.width)
            .attr('height', this.contextDimension.height)
            .attr('transform', "translate(" + this.margin.left + "," + (this.rectBoxDimension.height + this.margin.top) + ")");
        this.brush = brushX()
            .extent([[0, -.50], [this.contextDimension.width, this.contextDimension.height - 30]])
            .handleSize(0)
            .on("end", function () {
            if (event.selection === null) {
                _this.setOrderScale();
            }
            else {
                var start = event.selection[0];
                var end = event.selection[1];
                _this.timeScale.domain([start, end]);
                _this.svg.select('.context')
                    .append('g')
                    .attr('class', '.xAxisMini')
                    .attr('transform', function () { return "translate(0," + (_this.contextDimension.height - 30) + ")"; })
                    .call(axisBottom(_this.timeScaleMini));
            }
            _this.drawPatOrderRects();
            _this.drawMiniRects();
        });
        context.append('g')
            .attr('class', 'brush')
            .call(this.brush);
        this.attachListener();
        this.drawCheckboxes();
    }
    /**
     * Attach listeners
     */
    rectExploration.prototype.attachListener = function () {
        var _this = this;
        // item: pat_id, number of similar patients, DATA
        events.on('update_similar', function (evt, item) {
            _this.targetPatientProInfo = item[2]['pat_PRO'][item[0]].slice();
            _this.similarPatientsProInfo = entries(item[2]['similar_PRO']);
            _this.setOrderScale();
            _this.targetPatientOrders = item[2]['pat_Orders'][item[0]].slice();
            _this.drawPatOrderRects();
            _this.drawMiniRects();
        });
        // item: pat_id, DATA
        events.on('update_all_info', function (evt, item) {
            _this.targetPatientProInfo = item[1]['PRO'][item[0]];
            _this.similarPatientsProInfo = [];
            _this.setOrderScale();
            _this.drawPatOrderRects();
            _this.drawMiniRects();
        });
    };
    /**
     *
     * @param ordersInfo
     */
    rectExploration.prototype.drawPatOrderRects = function () {
        var _this = this;
        var ordersInfo = this.targetPatientOrders;
        // let ordersInfo = this.targetPatientProInfo; why is this not determining the date??
        var minDate = this.findMinDate(this.targetPatientProInfo);
        ordersInfo.forEach(function (d) {
            var time = _this.parseTime(d['ORDER_DTM'], minDate).getTime();
            d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
        });
        /*
              ordersInfo.forEach((d) => {
              let time = this.parseTime(d['ASSESSMENT_START_DTM'], minDate).getTime();
              d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
              });*/
        var self = this;
        /*
        function getClassAssignment (attString) {
        //this uses a work around to use a function with classed. As well it preserves the already assinged classes
          
          return function (d) {
            let element = select(this);
            element.classed (d[attString], true);
            return element.attr('class');
          }
        }*/
        var orderRect = this.svg.select('#pat_rect_line')
            .selectAll('.orderRect')
            .data([ordersInfo]);
        var orderRectEnter = orderRect.enter()
            .append('g')
            .classed('orderRect', true);
        orderRect = orderRectEnter.merge(orderRect);
        var rects = orderRect.selectAll('rect')
            .data(function (d) { return d; });
        var rectsEnter = rects.enter()
            .append('rect');
        rects = rectsEnter.merge(rects);
        rects.attr('class', this.getClassAssignment('ORDER_CATALOG_TYPE'))
            .attr('class', this.getClassAssignment('ORDER_STATUS'))
            .attr('x', function (g) { return _this.timeScale(g.diff); })
            .attr('y', 0)
            .attr('width', this.orderBar.width)
            .attr('height', this.orderBar.height)
            .on('click', function (d) {
            _this.svg.selectAll('rects');
            if (_this.currentlySelectedName === undefined) {
                _this.currentlySelectedName = d.ORDER_MNEMONIC;
                console.log(_this.currentlySelectedName);
                _this.orderLabel = _this.currentlySelectedName; //adds the order name to the label
            }
            else {
                _this.currentlySelectedName = undefined;
                _this.orderLabel = "Select An Order";
                _this.selectedTargetPatOrderCount = "  ";
                _this.selectedSimilarOrderCount = "   ";
                d3.selectAll('.orderLabel').remove();
            }
            _this.drawPatOrderRects();
            _this.selectedTargetPatOrderCount = _this.svg.selectAll('.selectedOrder').size();
            _this.selectedSimilarOrderCount = d3.selectAll('#similar_orders').selectAll('.selectedOrder').size() / 3;
            _this.drawOrderLabel(); //draws the label with the order count for patient and similar patients
            var selectedGroupTargetPat = _this.svg.selectAll('.selectedOrder');
            var selectedGroupSimilar = d3.selectAll('#similar_orders').selectAll('.selectedOrder');
            /*
             let rectXArray = this.svg.selectAll('rects').selectAll('.selectedOrder').nodes().map( let rectPosition =
               (d) => {return d.getAttribute('x'); });
             
             //let rectX = this.svg.selectAll('rects').size;
            // console.log(rectX.length);
            
             */
            console.log(selectedGroupTargetPat.size()); //logs the number of orders in the selected order for target patient
            console.log(selectedGroupSimilar.size() / 3); //logs the number of orders in the selected order of similar patients
        }) //end the mousclick event that shows the graph
            .on("mouseover", function (d) {
            var t = transition('t').duration(500);
            select(".tooltip")
                .html(function () {
                return _this.renderOrdersTooltip(d);
            })
                .transition(t)
                .style("opacity", 1)
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY + 10 + "px");
        })
            .on("mouseout", function () {
            var t = transition('t').duration(500);
            select(".tooltip").transition(t)
                .style("opacity", 0);
        });
        d3.selectAll('.MEDICATION, .PROCEDURE')
            .classed('selectedOrder', function (d) { return d.ORDER_MNEMONIC === _this.currentlySelectedName; })
            .classed('unselectedOrder', function (d) { return _this.currentlySelectedName !== undefined && d.ORDER_MNEMONIC !== _this.currentlySelectedName; });
        this.svg.select('.xAxis')
            .call(axisBottom(this.timeScale));
    };
    rectExploration.prototype.drawMiniRects = function () {
        var _this = this;
        var ordersInfo2 = this.targetPatientOrders;
        var minDate = this.findMinDate(this.targetPatientProInfo);
        ordersInfo2.forEach(function (d) {
            var time = _this.parseTime(d['ORDER_DTM'], minDate).getTime();
            d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
        });
        var self = this;
        this.svg.select('.context')
            .selectAll('.orderRectMini')
            .data([ordersInfo2])
            .enter()
            .append('g')
            .classed('orderRectMini', true)
            .selectAll('rect')
            .data(function (d) { return d; })
            .enter()
            .append('rect')
            .attr('x', function (g) { return _this.timeScaleMini(g.diff); })
            .attr('y', 0)
            .attr('width', 2)
            .attr('height', 15);
    };
    /**
     * Draw the checkboxes for hiding the procedures/med rects
     *
     */
    rectExploration.prototype.drawCheckboxes = function () {
        var _this = this;
        this.svg.append('g')
            .attr('class', 'colorLabels')
            .attr('transform', function () { return "translate(" + (_this.rectBoxDimension.width - 200) + "," + (_this.rectBoxDimension.height + 70) + ")"; })
            .append('rect')
            .attr('width', '20')
            .attr('height', '20')
            .attr('class', 'med-swatch ORDERED');
        this.svg.select('.colorLabels')
            .append('rect')
            .attr('width', '20')
            .attr('height', '20')
            .attr('x', '25')
            .attr('class', 'med-swatch COMPLETED');
        this.svg.select('.colorLabels')
            .append('rect')
            .attr('width', '20')
            .attr('height', '20')
            .attr('x', '50')
            .attr('class', 'med-swatch DISCONTINUED');
        this.svg.select('.colorLabels')
            .append('rect')
            .attr('width', '20')
            .attr('height', '20')
            .attr('x', '100')
            .attr('class', 'pro-swatch ORDERED');
        this.svg.select('.colorLabels')
            .append('rect')
            .attr('width', '20')
            .attr('height', '20')
            .attr('x', '125')
            .attr('class', 'pro-swatch COMPLETED');
        //input checkboxes for hiding orders
        d3.select('.rectDiv')
            .append('div')
            .classed('checkbox-pro', true)
            .append('input')
            .attr('type', 'checkbox')
            .attr('checked', true)
            .attr('value', 'Pro')
            .attr('x', 175)
            .attr('id', 'pro-check')
            .on('click', function () { return _this.updateRectPro(); });
        this.$node.select('.checkbox-pro')
            .append('text')
            .text('Procedures');
        d3.select('.rectDiv')
            .append('div')
            .classed('checkbox-med', true)
            .append('input')
            .attr('type', 'checkbox')
            .attr('checked', true)
            .attr('value', 'med')
            .attr('id', 'med-check')
            .on('click', function () { return _this.updateRectMed(); });
        this.$node.select('.checkbox-med')
            .append('text')
            .text('Medications');
    };
    rectExploration.prototype.drawOrderLabel = function () {
        d3.selectAll('.orderLabel').remove();
        d3.select('.rectDiv ')
            .append('div')
            .classed('orderLabel', true)
            .append('text')
            .text(this.orderLabel);
        d3.select('.rectDiv')
            .append('div')
            .classed('orderLabel', true)
            .append('text')
            .text('Order Frequency for Target Patient: ' + this.selectedTargetPatOrderCount);
        d3.select('.orderLabel')
            .append('div')
            .classed('orderLabel', true)
            .append('text')
            .text('Orders found in Similar Patients: ' + this.selectedSimilarOrderCount);
    };
    rectExploration.prototype.updateRectMed = function () {
        //var rect = this.$node.getElementsByClassName('.MEDICATION');
        var cbMed = select("#med-check").property("checked");
        if (!cbMed)
            selectAll(".MEDICATION").classed('hidden', true);
        else
            selectAll(".MEDICATION").classed('hidden', false);
    };
    rectExploration.prototype.updateRectPro = function () {
        var cbPro = this.$node.select("#pro-check").property("checked");
        if (!cbPro)
            selectAll(".PROCEDURE").classed('hidden', true);
        else
            selectAll(".PROCEDURE").classed('hidden', false);
    };
    //sets up the brush for brush business
    rectExploration.prototype.brushed = function (start, end) {
        //var selectBool = event.selection;
        var newMin = start;
        var newMax = end;
        events.fire('brushed', [newMin, newMax]);
    };
    /**
       * get Data by API
       * @param URL
       * @returns {Promise<any>}
       */
    rectExploration.prototype.getData = function (URL) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ajax.getAPIJSON(URL)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //tooltip
    rectExploration.prototype.renderOrdersTooltip = function (tooltip_data) {
        var text = "<strong style='color:darkslateblue'>" + tooltip_data['ORDER_CATALOG_TYPE'] + "</strong></br>";
        text += "<span>" + tooltip_data['ORDER_MNEMONIC'] + "</span></br>";
        text += "<span>" + tooltip_data['ORDER_DTM'] + "</span></br>";
        return text;
    };
    /**
     * Show or hide the application loading indicator
     * @param isBusy
     */
    rectExploration.prototype.setBusy = function (isBusy) {
        var status = select('.busy').classed('hidden');
        if (status == isBusy)
            select('.busy').classed('hidden', !isBusy);
    };
    return rectExploration;
}());
export { rectExploration };
export function create(parent) {
    return new rectExploration(parent);
}
//# sourceMappingURL=rectExploration.js.map