/**
 * Created by saharmehrpour on 4/20/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll, event} from 'd3-selection';
import {nest, values, keys, map, entries} from 'd3-collection'
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal} from 'd3-scale';
import {line, curveMonotoneX} from 'd3-shape';
import {timeParse} from 'd3-time-format';
import {extent, min, max, ascending} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {drag} from 'd3-drag';
import {Constants} from './constants';
import {transition} from 'd3-transition';
import {brush, brushY} from 'd3-brush';
import * as dataCalc from './dataCalculations';

export const filteredOrders = this.filteredOrders;

export class similarityScoreDiagram {

    private $node;
    private diagram;
    private timeScale;
    private scoreScale;
    private svg;
    private brush;

    private targetPatientProInfo;
    private similarPatientsProInfo;
    private findMinDate = dataCalc.findMinDate;//function for calculating the minDate for given patient record
    private parseTime = dataCalc.parseTime;
    private setOrderScale = dataCalc.setOrderScale;
    private getClassAssignment = dataCalc.getClassAssignment;
    private orderHierarchy = dataCalc.orderHierarchy;

   filteredOrders = {
       medGroup : [],
       proGroup : [],
   }

    height = 400;
    width = 600;
    promisDimension = {height: 400, width: 600};
    margin = {x: 80, y: 40};
    sliderWidth = 10;
    similarBar = {width: 4, height: 10};

    constructor(parent: Element, diagram) {

        this.diagram = diagram;
        this.$node = select(parent)
            .append('div')
            .classed('diagramDiv', true);

        this.svg = this.$node.append('svg')
            .attr('height', this.promisDimension.height)
            .attr('width', this.promisDimension.width);

        // scales
        this.timeScale = scaleLinear()
            .range([0, this.promisDimension.width - 2 * this.margin.x])
            .clamp(true);

        this.scoreScale = scaleLinear()
            .domain([100, 0])
            .range([0, this.promisDimension.height - 3 * this.margin.y]);

        // axis
        this.svg.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(${this.margin.x},${this.promisDimension.height - 2 * this.margin.y})`);
      
        this.svg.append('g')
            .attr('class', 'yAxis')
            .attr('transform', `translate(${(this.margin.x - this.sliderWidth)},${this.margin.y})`)
            .call(axisLeft(this.scoreScale));

        // -----

        let slider = this.svg.append('g')
            .attr('class', 'slider')
            .attr('transform', `translate(${(this.margin.x - this.sliderWidth + 2)},${this.margin.y})`);

        this.brush = brushY()
            .extent([[0, 0], [this.sliderWidth - 2, this.scoreScale.range()[1]]])
            .on("end", () => {
                let start = event.selection[0];
                let end = event.selection[1];

                this.updateSlider(start, end)
            });

        slider.call(this.brush)
            .call(this.brush.move, this.scoreScale.range());

        // -----

        this.svg.append('text')
            .text(`${this.diagram}`)
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(${this.margin.x / 4},${this.promisDimension.height * 0.5}) rotate(-90)`);

        this.svg.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(${this.margin.x},${this.margin.y})`)
            .call(axisLeft(this.scoreScale)
                .tickSize(-(this.promisDimension.width - this.margin.x))
            )
            .selectAll('text').remove();

        this.svg.append('g')
            .attr('id', 'pat_score');

        this.svg.append('g')
            .attr('id', 'similar_score');

        this.svg.append('g')
            .attr('id', 'pat_orders');

        this.svg.append('g')
            .attr('id', 'similar_orders');

        this.attachListener();

    }

    /**
     * Attach listeners
     */
    private attachListener() {

        // item: pat_id, number of similar patients, DATA
        events.on('update_similar', (evt, item) => { // called in queryBox
            this.svg.select('.slider')  // reset slider
                .call(this.brush)
                .call(this.brush.move, this.scoreScale.range());

            this.targetPatientProInfo = item[2]['pat_PRO'][item[0]].slice();
            this.similarPatientsProInfo = entries(item[2]['similar_PRO']);
            //console.log(this.similarPatientsProInfo);
           // console.log(item[2]);
           // console.log(item[2]['pat_Orders']);
            this.clearDiagram();
            this.drawDiagram();
            this.addSimilarOrderPoints(item[2]['pat_Orders'][item[0]].slice(), entries(item[2]['similar_Orders']))
            //this.orderHierarchy(item[1]['Orders'][item[0]]);

        });

        // item: pat_id, DATA
        events.on('update_all_info', (evt, item) => {  // called in query box

            this.svg.select('.slider')  // reset slider
                .call(this.brush)
                .call(this.brush.move, this.scoreScale.range());

            this.targetPatientProInfo = item[1]['PRO'][item[0]];
            this.similarPatientsProInfo = [];

            this.clearDiagram();
            this.drawDiagram();
            this.addOrderSquares(item[1]['Orders'][item[0]]);
            //this splits the order hierarchy into 2 arrays of medicaiton and procedures for the patient but it is
            //not recognized in the drawpatientrects();
            this.filteredOrders.medGroup = this.orderHierarchy(item[1]['Orders'][item[0]]).medicationGroup;
            this.filteredOrders.proGroup = this.orderHierarchy(item[1]['Orders'][item[0]]).procedureGroup;
           // console.log(this.medGroup.length);
           // console.log(this.proGroup.length);
        });

    }

    /**
     * Draw the diagram with the given data from getSimilarRows
     * @param args
     */
    private drawDiagram() {

        // ----- add diff days to the data

        let maxDiff = 0;

        let minPatDate = this.findMinDate(this.targetPatientProInfo);
        this.targetPatientProInfo.forEach((d) => {
            d.diff = Math.ceil((this.parseTime(d['ASSESSMENT_START_DTM'], null).getTime() - minPatDate.getTime()) / (1000 * 60 * 60 * 24));
            maxDiff = d.diff > maxDiff ? d.diff : maxDiff
        });
        this.targetPatientProInfo.sort((a, b) => ascending(a.diff, b.diff));


        this.similarPatientsProInfo.forEach((g) => {
            let minDate = this.findMinDate(g.value);
            g.value.forEach((d) => {
                try {
                    d.diff = Math.ceil((this.parseTime(d['ASSESSMENT_START_DTM'], null).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
                    maxDiff = d.diff > maxDiff ? d.diff : maxDiff
                }
                catch (TypeError) {
                    d.diff = -1;
                }
            })
        });


        const patData = this.targetPatientProInfo.filter((d) => {
            return d['FORM'] == this.diagram
        });

        let similarData = this.similarPatientsProInfo.map((d) => {
            let res = d.value.filter((g) => {
                return g['FORM'] == this.diagram
            });
            res.sort((a, b) => ascending(a.diff, b.diff));
            return res;
        });

        // -----  set domains and axis

        // time scale

        this.timeScale.domain([-1, maxDiff]);

        this.svg.select('.xAxis')
            .call(axisBottom(this.timeScale));

        // -------  define line function

        const lineFunc = line()
            .curve(curveMonotoneX)
            .x((d) => {
                return this.timeScale(d['diff']);
            })
            .y((d) => {
                return this.scoreScale(+d['SCORE']);
            });

        // ------- draw

        const patScoreGroup = this.svg.select('#pat_score');
        const patLine = patScoreGroup
            .append('g')
            .attr('transform', () => {
                return `translate(${this.margin.x},${this.margin.y})`;
            })
            .selectAll('.patLine')
            .data([patData])
            .enter()
            .append('path')
            .attr('class', 'patLine')
            .attr('d', (d) => lineFunc(d))
            .on('click', (d) => console.log(d));


        const medScoreGroup = this.svg.select('#similar_score');
        medScoreGroup.selectAll('.med_group')
            .data(similarData)
            .enter()
            .append('g')
            .attr('transform', () => {
                return `translate(${this.margin.x},${this.margin.y})`;
            })
            .each(function (d) {
                let currGroup = select(this);
                currGroup.append('g')
                    .append('path')
                    .attr('class', 'proLine') // TODO later after getting classification
                    .attr('d', () => lineFunc(d));
            })
            .on('click', (d) => console.log(d));


    }

    /**
     * Utility method
     * @param start
     * @param end
     */
    private updateSlider(start, end) {

        let lowScore = this.scoreScale.invert(end);
        let highScore = this.scoreScale.invert(start);

        let pro = this.svg.select('#pro_score')
            .selectAll('path')
            .style('opacity', 0);

        pro.filter(function (d) {
            if (!d.length) return false;
            return d[0].SCORE <= highScore && d[0].SCORE >= lowScore
        }).style('opacity', 1);


        let med = this.svg.select('#similar_score')
            .selectAll('path')
            .style('opacity', 0);

        med.filter(function (d) {
            if (!d.length) return false;
            return d[0].SCORE <= highScore && d[0].SCORE >= lowScore
        }).style('opacity', 1)

    }

    
 /** 
     * add small squares for orders of one (target) patient
     * @param ordersInfo
     */
    private addOrderSquares(ordersInfo) {

        let minDate = this.findMinDate(this.targetPatientProInfo);

        ordersInfo.forEach((d) => {
            let time = this.parseTime(d['ORDER_DTM'], minDate).getTime();
            d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
        });

        const self = this;

        let nestedData = nest()
            .key(function (d) {
                return (Math.floor(d['diff'] / 60) * 100).toString()
            })
            .entries(ordersInfo);

        nestedData.forEach((d) => {
            d.values = d.values.sort((a, b) => ascending(a.diff, b.diff));
            // rollup was not successful
            d['sumUp'] = nest().key((g) => g['diff']).entries(d.values); // TODO visualize collapsible squares
        });

       // console.log(nestedData);

        this.svg.select('#pat_orders').selectAll('g').remove();


        this.svg.select('#pat_orders')
            .append('g')
            .attr('transform', () => {
                return `translate(${this.margin.x},0)`; // If there is a label for the x-axis change 0
            })
            .selectAll('.patOrder')
            .data(nestedData)
            .enter()
            .append('g')
            .attr('transform', (d) => `translate(0,${this.promisDimension.height - 50})`)
            .classed('patOrder', true)
            .selectAll('rect')
            .data((d) => d.values)
            .enter()
            .append('rect')
            .attr('class', this.getClassAssignment('ORDER_CATALOG_TYPE'))
             .attr('class', this.getClassAssignment('ORDER_STATUS'))
            //.attr('class', (d) => `${d['ORDER_CATALOG_TYPE']}`)
            .attr('x', (g) => this.timeScale(g.diff))
            .attr('y', (g, i) => i * this.timeScale(25))
            .attr('width', this.timeScale(20))
            .attr('height', this.timeScale(20))
            .on('click', function (d) {

                if (!select(this).classed('selectedOrder')) {

                    select(this).classed('selectedOrder', true);

                    select(this.parentNode.parentNode.parentNode)
                        .append('line')
                        .classed('selectedLine', true)
                        .attr('id', `orderLine_${d['VISIT_NO']}`)
                        .attr('x1', self.timeScale(d['diff']) + self.margin.x)
                        .attr('x2', self.timeScale(d['diff']) + self.margin.x)
                        .attr('y1', self.scoreScale(100) + self.margin.y)
                        .attr('y2', self.scoreScale(0) + self.margin.y)
                        .on('click', () => console.log(d));

                    console.log(d);
                }
                else {
                    select(this).classed('selectedOrder', false);
                    select(`#orderLine_${d['VISIT_NO']}`).remove();
                }
            })
            .on("mouseover", (d) => {
                let t = transition('t').duration(500);
                select(".tooltip")
                    .html(() => {
                        return this.renderOrdersTooltip(d);
                    })
                    .transition(t)
                    .style("opacity", 1)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);
            })
            .on("mouseout", () => {
                let t = transition('t').duration(500);
                select(".tooltip").transition(t)
                    .style("opacity", 0);
            });

        let maxLength = max(nestedData, (d) => {
            return d.values.length;
        });

        this.svg
            .attr('height', this.promisDimension.height - 50 + this.timeScale(25) * maxLength);


    }


    /**
     *
     * @param ordersInfo
     */
    private addSimilarOrderPoints(ordersInfo, similarOrdersInfo) {

        // -------  target patient

        let minDate = this.findMinDate(this.targetPatientProInfo);

        ordersInfo.forEach((d) => {
            let time = this.parseTime(d['ORDER_DTM'], minDate).getTime();
            d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
        });

        const self = this;

        this.svg.select('#pat_orders')
            .append('g')
            .attr('transform', () => {
                return `translate(${this.margin.x},0)`; // If there is a label for the x-axis change 0
            })
            .selectAll('.patRect')
            .data([ordersInfo])
            .enter()
            .append('g')
            .attr('transform', () => `translate(0,${this.promisDimension.height - 50})`)
            .classed('patRect', true)
            .selectAll('rect')
            .data((d) => d)
            .enter()
            .append('rect')
             .attr('class', this.getClassAssignment('ORDER_CATALOG_TYPE'))
             .attr('class', this.getClassAssignment('ORDER_STATUS'))
           // .attr('class', (d) => `${d['ORDER_CATALOG_TYPE']}`)
            .attr('x', (g) => this.timeScale(g.diff))
            .attr('y', 0)
            .attr('width', this.similarBar.width)
            .attr('height', this.similarBar.height)
            .on('click', function (d) {

                if (!select(this).classed('selectedOrder')) {

                    select(this).classed('selectedOrder', true);

                    select(this.parentNode.parentNode.parentNode)
                        .append('line')
                        .classed('selectedLine', true)
                        .attr('id', `orderLine_${d['VISIT_NO']}`)
                        .attr('x1', self.timeScale(d['diff']) + self.margin.x)
                        .attr('x2', self.timeScale(d['diff']) + self.margin.x)
                        .attr('y1', self.scoreScale(100) + self.margin.y)
                        .attr('y2', self.scoreScale(0) + self.margin.y)
                        .on('click', () => console.log(d));

                    console.log(d);
                }
                else {
                    select(this).classed('selectedOrder', false);
                    select(`#orderLine_${d['VISIT_NO']}`).remove();
                }
            })
            .on("mouseover", (d) => {
                let t = transition('t').duration(500);
                select(".tooltip")
                    .html(() => {
                        return this.renderOrdersTooltip(d);
                    })
                    .transition(t)
                    .style("opacity", 1)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);
            })
            .on("mouseout", () => {
                let t = transition('t').duration(500);
                select(".tooltip").transition(t)
                    .style("opacity", 0);
            });


        // ----- add diff days to the data

        similarOrdersInfo.forEach((g) => {

            let currPatient = this.similarPatientsProInfo.filter((d) => {
                return d.key == g.key
            })[0];

            let minDate = this.findMinDate(currPatient.value);
            g.value.forEach((d) => {
                try {
                    d.diff = Math.ceil((this.parseTime(d['ORDER_DTM'], null).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
                }
                catch (TypeError) {
                    console.log('error');
                    d.diff = -1;
                }
            })
        });

        this.svg.select('#similar_orders')
            .append('g')
            .attr('transform', () => {
                return `translate(${this.margin.x},0)`; // If there is a label for the x-axis change 0
            })
            .selectAll('.similarRect')
            .data(similarOrdersInfo)
            .enter()
            .append('g')
            .attr('transform', (d, i) => `translate(0,${this.promisDimension.height - 50 + (i + 1) * (this.similarBar.height + 5)})`)
            .classed('similarRect', true)
            .selectAll('rect')
            .data((d) => d.value)
            .enter()
            .append('rect')
            .attr('class', (d) => `${d['ORDER_CATALOG_TYPE']}`)
            .attr('x', (g) => this.timeScale(g.diff))
            .attr('y', 0)
            .attr('width', this.similarBar.width)
            .attr('height', this.similarBar.height)
            .on('click', function (d) {

                if (!select(this).classed('selectedOrder')) {

                    select(this).classed('selectedOrder', true);

                    select(this.parentNode.parentNode.parentNode)
                        .append('line')
                        .classed('selectedLine', true)
                        .attr('id', `orderLine_${d['VISIT_NO']}`)
                        .attr('x1', self.timeScale(d['diff']) + self.margin.x)
                        .attr('x2', self.timeScale(d['diff']) + self.margin.x)
                        .attr('y1', self.scoreScale(100) + self.margin.y)
                        .attr('y2', self.scoreScale(0) + self.margin.y)
                        .on('click', () => console.log(d));

                    console.log(d);
                }
                else {
                    select(this).classed('selectedOrder', false);
                    select(`#orderLine_${d['VISIT_NO']}`).remove();
                }
            })
            .on("mouseover", (d) => {
                let t = transition('t').duration(500);
                select(".tooltip")
                    .html(() => {
                        return this.renderOrdersTooltip(d);
                    })
                    .transition(t)
                    .style("opacity", 1)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);
            })
            .on("mouseout", () => {
                let t = transition('t').duration(500);
                select(".tooltip").transition(t)
                    .style("opacity", 0);
            });
            
              this.svg.select('#similar_orders').selectAll('.similarRect')
                    .append('text')
                    .text(similarOrdersInfo.pat_id);

        // fix height of the svg
        this.svg
            .attr('height', this.promisDimension.height - 50 + (this.similarBar.height + 5) * similarOrdersInfo.length);

    }


    /**
     * clear the diagram
     */
    private clearDiagram() {

        this.svg.select('#pat_score').selectAll('g').remove();
        this.svg.select('#similar_score').selectAll('g').remove();
        this.svg.select('#pat_orders').selectAll('line,g').remove();
        this.svg.select('#similar_orders').selectAll('g').remove();
    }


    
    /**
     * Get the data via API
     * @param URL
     * @returns {Promise<any>}
     */
    private async getData(URL) {
        return await ajax.getAPIJSON(URL);
    }


    private renderOrdersTooltip(tooltip_data) {

        let text = "<strong style='color:darkslateblue'>" + tooltip_data['ORDER_CATALOG_TYPE'] + "</strong></br>";
        text += "<span>" + tooltip_data['ORDER_MNEMONIC'] + "</span></br>";
        text += "<span>" + tooltip_data['ORDER_DTM'] + "</span></br>";
        return text;
    }

    /**
     * Show or hide the application loading indicator
     * @param isBusy
     */
    setBusy(isBusy: boolean) {
        let status = select('.busy').classed('hidden');
        if (status == isBusy)
            select('.busy').classed('hidden', !isBusy);
    }

}

export let targetPatientOrders;


export function create(parent: Element, diagram) {
    return new similarityScoreDiagram(parent, diagram);
}