/**
 * Created by Jen Rogers on 5/14/17.
 */

import * as ajax from 'phovea_core/src/ajax';
//import {select, selectAll} from 'd3-selection';
import * as events from 'phovea_core/src/event';
import {BaseType, select, selectAll, event} from 'd3-selection';
import * as cohortStat from './cohortStat';
import * as dict from './cptDictionary';
import {transition} from 'd3-transition';
import { scaleLinear, scaleLog } from 'd3-scale';
import {extent, min, max, ascending, histogram, mean, deviation} from 'd3-array';
import {brushX} from 'd3-brush';

export class CodeSidebar {

    private $node;
    private dataset;
    private startDay;
    private startBool;
    private cohortKeeper;
    private targetOrder;
    private selectedCohort;
    private currentlySelectedName;
    private selected;
    private dictionary;
    private selectedCohortFilters;
    private filterArray;
    private scoreLabel;
    private scoreBox;
    private xScale;
    private yScale;
    private svgWidth;
    private svgHeight;
    private freqBrush;
    private scoreFreqRange;

    constructor(parent: Element) {

        this.dataset = 'selected';
        this.scoreLabel = 'Absolute Scale';
        this.xScale = scaleLinear();
        this.yScale = scaleLinear().range([0, 30]);
        this.svgWidth = 190;
        this.svgHeight = 40;

        this.$node = select(parent).append('div').classed('sidebarDiv', true);

        this.scoreBox = this.$node.append('div').classed('scoreDiv', true);
        let orderFilter = this.$node.append('div').classed('orderDiv', true);
        let filterDescription = this.$node.append('div').classed('descriptionDiv', true);

        const self = this;

        this.dictionary = new dict.CPTDictionary().codeDict;

        this.drawScoreFilterBox(this.scoreBox);
        this.drawOrderFilterBox(orderFilter);
        this.attachListener();

    }

    /**
     * Attaching listener
     */
    private attachListener() {

       events.on('selected_cohort_change', (evt, item)=> {
        select('.orderDiv').select('.codes').remove();
        select('.checkDiv').remove();
        this.$node.select('.distributionWrapper').selectAll('*').remove();
    
        this.histogrammer(item).then(d=> this.drawHistogram(d));
    
       });

       events.on('send_filter_to_codebar', (evt, item)=> {
        this.selectedCohortFilters = item[0];
        this.DrawfilterDescriptionBox(item[0]);
       });

        events.on('make_stat_node', (evt, item)=> {
           let parent = document.getElementsByClassName('cohort ' + item[1])[0];
           let view = parent.querySelector('.stat_view');
           cohortStat.create(view, item[0], item[1]);
       });

        events.on('update_start_event', (evt, item)=>  {
            let startLabel = select('#start_date_label').style('color', 'black');
            this.startBool = '0 date determined by event';
            let startLabelBool = select('#pat_or_event').text(this.startBool);
        });

        events.on('start_date_patient', (evt, item)=> {
            this.startBool = '0 date determined by patient';
            this.startDay = item;
            let startLabel = select('#start_date_label').text(item);
            let startLabelBool = select('#pat_or_event').text(this.startBool);
        });

    }

    private searchDictionary(value, type){

        if(type == 'dict') {
            for(let prop in this.dictionary){
            
                if (prop == value){
                    let orderarray = [];
                    for(let p in this.dictionary[prop]){
                        let order = {'key': p, 'value' : this.dictionary[prop][p], 'parent': prop};
                        orderarray.push(order);
                    }
                   
                    this.drawOrderSearchBar(orderarray);
                }else{
                    for(let p in this.dictionary[prop]){
                        
                        if(p == value){
                            let order = {'key': p, 'value': this.dictionary[prop][p], 'parent': prop};
                           
                            this.drawOrderSearchBar([order]);
                        }
                    }
                }
            }
        }else if(type == 'code'){

            for(let prop in this.dictionary){
            
                    for(let p in this.dictionary[prop]){
                      // 
                        if(this.dictionary[prop][p].includes(+value)){
                            
                            let order = {'key': p, 'value': value, 'parent': prop};
                            this.drawOrderSearchBar([order]);
                        }
                    }
                }
            }
    }

    private async histogrammer(cohort) {
        let totalPatients = cohort.length;
        let mapped = cohort.map(pat  => {return +pat.value.length});
 
        let maxValue = max(mapped);

        let x = scaleLinear().domain([0, +maxValue]).nice();

        let bins = histogram()
        .domain([0, +maxValue])
        .thresholds(x.ticks(40))
        (mapped);
        let histogramData = bins.map(function (d) {
          totalPatients -= d.length;
          return {x0: d.x0, x1: d.x1, length: d.length, totalPatients: totalPatients + d.length, binCount: bins.length, frequency: d.length/bins.length, };
        });
  
        return histogramData;
    }

    private drawScoreFilterBox (div) {

      //  this.drawDistributionBands(null);
     
        div.selectAll('div').remove();
        div.selectAll('form').remove();

        let scorepanel = div.classed('panel', true).classed('panel-default', true);
        let scorehead = scorepanel.append('div').classed('panel-heading', true)
        scorehead.append('text').text('Score Filters');

        let scorebody = scorepanel.append('div').classed('panel-body', true);

        const form = scorebody.append('form');

        let freqPanel = form.append('div').classed('frequency-histogram', true);
        
        freqPanel.append('div').classed('distributionWrapper', true);
        
    
        let countPromis = form.append('div').classed('input-group', true).classed('countPromis', true);
                        //filter patients by a minimum score count threshold

        countPromis.append('input').attr('type', 'text').classed('form-control', true)
                        .attr('placeholder', 'Min Score Count')
                        .attr('id', 'count_search')
                        .attr('value');
                
        countPromis.append('div').classed('input-group-btn', true)
            .append('input').attr('type', 'button').classed('btn', true).classed('btn-default', true)
                        .attr('value', 'Filter').on('click', () =>{
                            let val = (<HTMLInputElement>document.getElementById('count_search')).value;
                            let count = +val;
                            events.fire('filter_by_Promis_count', count);
                    });


}

    private drawHistogram(histobins) {


       let data = {'key': 'Score-Count', 'label': 'Score Count', 'value': histobins, 'scale': this.xScale.domain([0, histobins[0].binCount])};

        this.yScale.domain([0, max(histobins, function (d) {
            return d['frequency'] + .1;
        })]);

        let barBrush = brushX()
        .extent([[0, 0], [this.svgWidth, 30]])
        .handleSize(0);

        let distScale = scaleLinear().domain([0, 1000]);
        let freqScale = scaleLinear().domain([0, 100]).range([0, this.svgWidth]);
    
        let distLabel = this.$node.select('.distributionWrapper');
        distLabel.append('text').text('Score Count Distributions');
        let distDiagrams = distLabel.append('div').classed('distLabel', true).attr('width', this.svgWidth).attr('height', this.svgHeight);
    
        let distFilter = distDiagrams.append('div').classed('distFilter', true).attr('width', this.svgWidth);

        let distSvg = distFilter.append('svg').classed('distDetail_svg', true);//.classed('hidden', true);
        let distFilter_svg = distFilter.append('svg').classed('distFilter_svg', true).attr('width', '95%');//.classed('hidden', true)
        let svg_rect_group = distFilter_svg.append('g').attr('width', '95%');
        let rect_label_group = distFilter_svg.append('g');

        rect_label_group.append('text').text(data.value[0].x0).attr('transform', 'translate(0, 20)');
        rect_label_group.append('text').text(data.value[data.value.length-1].x1).attr('transform', 'translate('+ (this.svgWidth - 15) +', 20)');

        let rects = svg_rect_group.selectAll('rect').data(data.value).enter().append('rect').attr('width', d=> (this.svgWidth/d.binCount)-1).attr('height', 15)
        .attr('opacity', (d)=> (distScale(d['length'] * 2.5)))
        .attr('fill', '#212F3D')
        .attr('x', (d, i)=> (i * this.svgWidth/d.binCount) + 5);

        //////////////bar groups for all data////////////////////////////////
        let barGroupsALL = distSvg.selectAll('.barALL')
        .data(histobins);

        barGroupsALL.exit().remove();

        let barEnterALL = barGroupsALL.enter().append("g")
        .attr("class", "barALL");

        barGroupsALL = barEnterALL.merge(barGroupsALL);

        barGroupsALL
        .attr("transform", (d, i) => {
            return "translate(" +  ((i * this.svgWidth/d.binCount) + 4) + ",0)";
        });
        barEnterALL.append("rect");

        barGroupsALL.select('rect')
        .transition(9000)
        .attr("x", 1)
        .attr("y", (d) => {
            return 30 - this.yScale(d.frequency);
        })

        .attr('width', d=> (this.svgWidth/d.binCount)-1)
        .attr("height", (d) => {
            return this.yScale(d.frequency);
        });
 
        barGroupsALL.on("mouseover", (d) => {
    
            let t = transition('t').duration(500);
            select(".tooltip")
            .html(() => {
                return this.renderHistogramTooltip(d);
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

        let brush = distFilter_svg.append('g').attr('id', data['key'] + '-Brush').classed('brush', true);
        let that = this;

        this.freqBrush = brushX()
        .extent([[0, 0], [this.svgWidth, 30]])
        .handleSize(0)
        .on("end", () => {
        if (event.selection === null) {
            //this.setOrderScale();
        }else {
        let start = freqScale.invert(event.selection[0]);
        let end = freqScale.invert(event.selection[1]);
        let Dom1 = Math.floor((start+1)/10)*10;
        let Dom2 = Math.ceil((end+1)/10)*10;

        this.scoreFreqRange = [Dom1, Dom2];
            }
        });
                    
        this.$node.select('#Score-Count-Brush').call(this.freqBrush);

  }

private drawOrderFilterBox (div) {
    let orderpanel = div.classed('panel', true).classed('panel-default', true);
    let scorehead = orderpanel.append('div').classed('panel-heading', true)
    scorehead.append('text').text('Order Filters');

    let panelbody = orderpanel.append('div').classed('panel-body', true);

    const form = panelbody.append('form');

    let ordersearch = form.append('div').classed('input-group', true);

    ordersearch.append('input').classed('form-control', true)
            .attr('type', 'text')
            .attr('placeholder', 'CPT Name/Code')
            .attr('id', 'order_search')
            .attr('value');

    ordersearch.append('div').classed('input-group-btn', true)
            .append('input')
            .attr('type', 'button').classed('btn', true).classed('btn-default', true)
           // .append('i').classed('glyphicon glyphicon-search', true)
            .attr('value', 'Search')
            .on('click', () => {
              const value = (<HTMLInputElement>document.getElementById('order_search')).value;

              function hasNumber(myString) {
                return /\d/.test(myString);
              }

              if(!hasNumber(value)){ this.searchDictionary(value, 'dict');
                }else{
                    this.searchDictionary(value, 'code');
                }
    });

}
private drawOrderSearchBar(order){

    select('.orderDiv').select('.codes').remove();

    const box = select('.orderDiv').append('div').classed('codes', true);
    let props = [];

    let orderFilters = box.selectAll('.orderFilters').data(order);

    let orderEnter = orderFilters.enter().append('div').classed('orderFilters', true);

    orderFilters.exit().remove();

    orderFilters = orderEnter.merge(orderFilters);
   
    let ordercheck = orderFilters.append('input').attr('type', 'checkbox').attr('value', d => d['value']).attr('checked', true);
    let ordertext = orderFilters.append('text').text(d => d['key']);

    ordertext.on("mouseover", (d) => {
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

    ordercheck.on('click', (d)=>{ console.log(d);})

    box.append('input')
    .attr('type', 'button').classed('btn', true).classed('btn-default', true)
    .attr('value', 'Filter by Code')
    .on('click', () => {

    let checkNodes = ordercheck.nodes();
    let checkedarray = [];
    let cptFilterArray = [];

    checkNodes.forEach((n, i) => {
        if(n['checked']){
            checkedarray.push(n['value']);
           // Maybe make the 2 arrays use this array?
           cptFilterArray.push(order[i]);
        }
    });

    let fixed = [];
    checkedarray.forEach(ch=> {
        if (ch.indexOf(',') > -1) { 
            let fix = ch.split(',');
            fix.forEach(f => {
                fixed.push(f);
            });
        }else{fixed.push(ch); };
    });

    events.fire('filter_by_cpt', [fixed, cptFilterArray]);
  //  events.fire('add_cpt_to filterArray', cptFilterArray);
    select('.orderDiv').select('.codes').remove();
});
}

private DrawfilterDescriptionBox(filter){

    filter = filter.filter(d=> {return d[0] != 'Branch'});
       
    let rectScale = scaleLinear().domain([0, 6000]).range([0, 150]).clamp(true);

    select('.descriptionDiv').selectAll('div').remove();
   // let label = select('.descriptionDiv').append('div').classed('divLabel', true).append('text').text('Filter Layers');
    const box = select('.descriptionDiv').append('div').classed('panel', true).classed('panel-default', true);
    box.append('div').classed('panel-heading', true).append('text').text('Filter Layers');

    let body = box.append('div').classed('panel-body', true);

    let cohortCount = body.append('div').append('text').text('Cohort Size: ' + filter[filter.length - 1][2]);
   // let filter = cohort[1];
    filter.forEach((fil, i) => {
       
       let stage = body.append('div').classed('filter_stage', true);
        let stageSvg = stage.append('svg').classed('filter_stage_svg', true);
     
        let rect = stageSvg.append('rect').attr('height', 20).attr('width', rectScale(fil[2])).attr('transform', 'translate(12, 0)');
        if(fil[0] == 'demographic') {
            rect.attr('fill', '#D5D8DC');}
        if(fil[0] == 'CPT') {
            rect.classed(fil[1][1][0].parent, true);
        }
           
        let text = stageSvg.append('g').attr('transform', 'translate(0, 12)');
        text.append('text').text((i + 1) + ': ' );

        if(fil[0] == 'demographic'){
            if(fil[1].length != 0){
                
                   // text.selectAll('text').data(fil[1]).enter().append('text').text('Demographic').attr('transform', 'translate(15, 0)');
                    text.append('text').text('Demographic').attr('transform', 'translate(15, 0)').data(fil[1]);
                    text.on("mouseover", (d) => {
                        let t = transition('t').duration(500);
                        select(".tooltip")
                          .html(() => {
                            return this.renderFilterTooltip(d);
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
                
               }
            else{ text.append('text').text('all patients').attr('transform', 'translate(15, 0)'); }
            }
        if(fil[0] == 'CPT') {
       
            text.append('text').text(fil[1][1][0].parent).attr('transform', 'translate(15, 0)');}

        text.append('text').text(fil[2]).attr('transform', 'translate(170, 0)');
    });

}

private renderOrdersTooltip(tooltip_data) {

    let text = "<strong style='color:darkslateblue'>" + tooltip_data['value'] + "</strong></br>";
  
    return text;
}

private renderHistogramTooltip(tooltip_data) {

    let text = "<strong style='color:darkslateblue'>" + tooltip_data.x0 + ' - ' + tooltip_data.x1 + ': ' +  tooltip_data.length + "</strong></br>";

    return text;
}

private renderFilterTooltip(tooltip_data) {

    let text = "<strong style='color:darkslateblue'>" + tooltip_data[0] + "</strong></br>";
/*
    tooltip_data.forEach(data => {
    console.log(data);
    });*/

   // text = "<strong style='color:darkslateblue'>" + tooltip_data[0] + "</strong></br>";

    return text;
}


    /**
     * getting the similar patients info and firing events to update the vis
     * @returns {Promise<void>}
     */

    /**
     * get Data by API
     * @param URL
     * @returns {Promise<any>}
     */
    private async getData(URL) {
        return await ajax.getAPIJSON(URL);
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

export function create(parent: Element) {
    return new CodeSidebar(parent);
}
