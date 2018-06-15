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

    constructor(parent: Element) {

        this.dataset = 'selected';
        this.scoreLabel = 'Absolute Scale';

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
           console.log('when does this happen');
        select('.orderDiv').select('.codes').remove();
        select('.checkDiv').remove();

       });

       events.on('send_filter_to_codebar', (evt, item)=> {
        this.selectedCohortFilters = item;
        this.DrawfilterDescriptionBox(item);
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
                    console.log(orderarray);
                    this.drawOrderSearchBar(orderarray);
                }else{
                    for(let p in this.dictionary[prop]){
                        
                        if(p == value){
                            let order = {'key': p, 'value': this.dictionary[prop][p], 'parent': prop};
                            console.log([order]);
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

    private drawScoreFilterBox (div) {

        div.selectAll('div').remove();
        div.selectAll('form').remove();

        let scorepanel = div.classed('panel', true).classed('panel-default', true);
        let scorehead = scorepanel.append('div').classed('panel-heading', true)
        scorehead.append('text').text('Score Filters');

        let scorebody = scorepanel.append('div').classed('panel-body', true);

        const form = scorebody.append('form');
    
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

                let scalePanel = form.append('div').classed('scale', true);
                    
                let scaleToggle = scalePanel.append('div').classed('btn-group', true);
                    scaleToggle.append('button').classed('btn', true).classed('btn-primary', true)
                                .append('text').text(this.scoreLabel);

                let togglebutton = scaleToggle.append('button')
                                    .classed('btn', true).classed('btn-primary', true)
                                    .classed('dropdown-toggle', true)
                                    .attr('data-toggle', 'dropdown');

                togglebutton.append('span').classed('caret', true);

                    let ul = scaleToggle.append('ul').classed('dropdown-menu', true).attr('role', 'menu');
                    let abs = ul.append('li').append('href').append('text').text('Absolute');
                    let rel = ul.append('li').append('href').append('text').text('Relative');//.attr('value', 'Absolute');
          
                    abs.on('click', () =>{
                        this.scoreLabel = 'Absolute Scale';
                        console.log(this.scoreLabel);
                        this.drawScoreFilterBox(this.scoreBox);
                        events.fire('change_promis_scale', this.scoreLabel)});

                    rel.on('click', () =>{
                            this.scoreLabel = 'Relative Scale';
                            console.log(this.scoreLabel);
                            this.drawScoreFilterBox(this.scoreBox);
    
                            events.fire('change_promis_scale', this.scoreLabel)});

                    form.append('input')
                    .attr('type', 'button')
                    .classed('btn', true).classed('btn-primary', true)
                    .attr('value', 'Aggregate Scores')
                    .on('click', () => {
                        events.fire('aggregate_button_clicked');
                    });
        
        let aggDiv = form.append('div').classed('aggDiv', true);
            aggDiv.append('div').append('input').attr('type', 'button')
                .classed('btn', true).classed('btn-primary', true)
                .attr('value', 'Separate by Quartiles').on('click', () =>{
                    select('.checkDiv').remove();
                    events.fire('separate_aggregate');
                      ///radio aggregation
                    let checkDiv = aggDiv.append('div').classed('checkDiv', true);
                    let tCheck = checkDiv.append('div');
                    tCheck.append('input').attr('type', 'checkbox').attr('name', 'sample').attr('id', 'sampleT').attr('checked', true)
                    .attr('value', 'top').on('click', () => {

                        let p = selectAll('.top');
                  
                        if(select("#sampleT").property("checked")){
                            p.classed('hidden', false);
                        }else{
                            p.classed('hidden', true);
                        }
        
                    })
                    tCheck.append('label').attr('for', 'sampleT').text('top').style('color', '#2874A6');

                    let mCheck = checkDiv.append('div');
                    mCheck.append('input').attr('type', 'checkbox').attr('name', 'sample').attr('id', 'sampleM').attr('checked', true)
                    .attr('value', 'middle').on('click', () => {
                        let p = selectAll('.middle');
                        if(select("#sampleM").property("checked")){
                            p.classed('hidden', false);
                        }else{
                            p.classed('hidden', true);
                        }
                    });
                    mCheck.append('label').attr('for', 'sampleM').text('middle').style('color', '#F7DC6F');

                    let bCheck = checkDiv.append('div');
                    bCheck.append('input').attr('type', 'checkbox').attr('name', 'sample').attr('id', 'sampleB').attr('checked', true)
                    .attr('value', 'bottom').on('click', () =>{
                        let p = selectAll('.bottom');
                        if(select("#sampleB").property("checked")){
                            p.classed('hidden', false);
                        }else{
                            p.classed('hidden', true);
                        }
                    });
                    bCheck.append('label').attr('for', 'sampleB').text('bottom').style('color', '#fc8d59');
                });

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
    events.fire('add_cpt_to filterArray', cptFilterArray);
    select('.orderDiv').select('.codes').remove();

});
}

private DrawfilterDescriptionBox(filter){

    let rectScale = scaleLinear().domain([0, 6000]).range([0, 150]).clamp(true);

    select('.descriptionDiv').selectAll('div').remove();
   // let label = select('.descriptionDiv').append('div').classed('divLabel', true).append('text').text('Filter Layers');
    const box = select('.descriptionDiv').append('div').classed('panel', true).classed('panel-default', true);
   
    let cohortCount = box.append('div').append('text').text('Cohort Size: ' + filter[filter.length - 1][2]);
   // let filter = cohort[1];
    filter.forEach((fil, i) => {
       
       let stage = box.append('div').classed('filter_stage', true);
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

                    text.append('text').text('Demo').attr('transform', 'translate(15, 0)');
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
