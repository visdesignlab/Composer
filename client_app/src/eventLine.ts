/**
 * Created by Jen Rogers on 3/22/2018.
 */
import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll, event} from 'd3-selection';
import {nest, values, keys, map, entries} from 'd3-collection';
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal, scaleSqrt} from 'd3-scale';
import * as hierarchy from 'd3-hierarchy';
import {line, curveMonotoneX, curveLinear, linkHorizontal, curveMonotoneY, curveCardinal} from 'd3-shape';
import {timeParse} from 'd3-time-format';
import {extent, min, max, ascending} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {drag} from 'd3-drag';
import * as d3 from 'd3';
import {transition} from 'd3-transition';
import {brush, brushY} from 'd3-brush';
import * as dataCalc from './dataCalculations';
import {ITable, asTable} from 'phovea_core/src/table';
import {IAnyVector, INumericalVector} from 'phovea_core/src/vector';
import {list as listData, getFirstByName, get as getById} from 'phovea_core/src/data';
import {range, list, join, Range, Range1D, all} from 'phovea_core/src/range';
import {asVector} from 'phovea_core/src/vector/Vector';
import {argFilter} from 'phovea_core/src/';

export class EventLine {
    private $node;
    private eventScale;
    private circleScale;
    private filter;
    private startCodes;
    private scoreLabel;
    private scoreType;
    private startEventLabel;
    private eventToggleLabels;
    private branchHeight;
    private layerBool;
    private scoreChangeBool;

    constructor(parent: Element, cohort) {

    this.$node = select(parent);
    this.eventScale = scaleLinear().domain([0, 4])
            .range([0, 750]).clamp(true);

    this.circleScale = scaleLinear().domain([0, 3000])
            .range([1, 15]).clamp(true);

    this.scoreLabel = 'Absolute Scale';
    this.startEventLabel = 'Change Start to Event';
    this.branchHeight = 30;
    let layer = this.$node.append('div').attr('id', 'layerDiv').classed('hidden', true);
    let branchWrapper = this.$node.append('div').classed('branch-wrapper', true);
    branchWrapper.append('svg').attr('height', this.branchHeight);
    this.scoreChangeBool;
   
    this.attachListener();

    const that = this;
    this.startCodes = null;
    this.scoreType = 'PROMIS Physical Function';
    }

    private attachListener() {
        
        events.on('enter_layer_view', ()=> {
            this.layerBool = true;
            document.getElementById('quartile-btn').classList.add('disabled');
            select('#layerDiv').classed('hidden', false);
            let array = [];
      
            let selected = this.$node.selectAll('.fill');
          
            selected.nodes().forEach(sel => {
              let entry = {class: sel.classList[0], data: sel.__data__ }
              array.push(entry);
          });
      
          events.fire('update_layers', array);
        });

        events.on('exit_layer_view', ()=> {
            this.layerBool = false;
            document.getElementById('quartile-btn').classList.remove('disabled');
            select('#layerDiv').classed('hidden', true);
        });
      
        events.on('test', (evt, item)=> {
       
            let cohortTree = item[0];
            let cohortIndex = item[1];

            selectAll('.selected').classed('selected', false);

            //need to update comparison array
            let layer = select('#layerDiv');
            layer.selectAll('*').remove();
            this.buildLayerFilter(layer, item[0]);
    
          });

        events.on('clear_cohorts', (evt, item)=> {
            let branchSvg =this.$node.select('.branch-wrapper').select('svg');
            branchSvg.selectAll('*').remove();

            this.layerBool = false;
         
        });

        events.on('update_chart', (evt, item)=> {

            if(item){
                this.filter = item.filterArray;

                let startEvent = item.startEvent;
                if(startEvent == null){  this.startEventLabel = 'Change Start to Event'; }else{
                    this.startEventLabel = item.startEvent[1];
                }

                if(this.filter){
                    this.drawEventButtons(item);
                }
            }
   
        });

    }

    private async buildLayerFilter(compareDiv, data){

        let flatData  = [];
        let array = [];
        let rows = [];
     
            
        data.forEach(d => {
            flatData.push(d);
              if(d.branches.length != 0){ 
                d.branches.forEach(b => {
                    flatData.push(b);
                });
               };
            });
            let panel = compareDiv.append('div').classed('panel', true).classed('panel-default', true).attr('width', 500);
           let header =  panel.append('div').classed('panel-heading', true);
           header.append('text').text('Layer Control');

           let panelBody = panel.append('div').classed('panel-body', true);

            let svg = panelBody.append('svg').attr('width', 450).attr('height', this.branchHeight);
    
            let layerG = svg.selectAll('.layers').data(flatData);
    
            let layerenter = layerG.enter().append('g').attr('class', (d,i)=> 'layer-' + String(i)).classed('layers', true);
    
            layerG = layerenter.merge(layerG);

            layerG.attr('transform', (d, i) => 'translate('+ i * 71 +', 5)');
    
            let rect = layerG.append('rect').attr('width', 20).attr('height', 20).attr('class', (d,i)=> 'layer-' + String(i)).classed('fill', true);
            let label = layerG.append('text').text((d, i)=> 'Layer-'+ (i + 1));
            label.attr('transform', 'translate(30, 12)');
    
            rect.attr('transform', 'translate(5, 0)');
            rect.classed('fill', true);
    
            rect.on('click', (d, i)=> {
              let array = [];
    
              let r = rect.nodes()[i];
              if(r.classList.contains('clear')){
                r.classList.remove('clear');
                r.classList.add('fill');
              }else{ 
                r.classList.remove('fill');
                r.classList.add('clear'); }
               
              let selected = compareDiv.selectAll('.fill');
              
              selected.nodes().forEach(sel => {
                let entry = {class: sel.classList[0], data: sel.__data__ }
                array.push(entry);
              });
    
              if(this.layerBool == true){
                events.fire('update_layers', array);
              }
    
            });
    
            let selected = this.$node.selectAll('.fill');
          
            selected.nodes().forEach(sel => {
              let entry = {class: sel.classList[0], data: sel.__data__ }
              array.push(entry);
            });
        
            return array;
          //  events.fire('update_layers', array);
        
      }

    private async classingSelected(cohort){
            
            selectAll('.selected-group').classed('selected-group', false);
            let selected = document.getElementsByClassName(cohort.label);
            selectAll(selected).selectAll('.event-rows').classed('selected-group', true);

    }

    private drawEventButtons(cohort){
            let filters = cohort.filterArray;
            let scaleRelative = cohort.scaleR;
            let separated = cohort.separated;
            let clumped = cohort.clumped;
            let dataType = cohort.chartData[0].value[0]['FORM'];
            let startEvent = cohort.startEvent;

            console.log(startEvent);

            if(!scaleRelative){  this.scoreLabel = 'Absolute Scale';
            }else{ this.scoreLabel = 'Relative Scale'; }

            let that = this;

            function filText(d){
                if(d.type !=  'Branch'){
                    if(d.type == 'Start'){
                        let label = 'First Promis Score';
                        return label;
                    }else{ 
                        let label = d.filter;
                        return label;
                    }
                }else{ console.log('Branch filter passed')};
            }
            function labelClick(d){
              
                let rec = select(d);
                    if(d == 'First Promis Score'){
                        that.startCodes = null;
                        that.startEventLabel = 'First Promis Score';
                        that.drawEventButtons(that.filter);
                        events.fire('event_selected', [that.startCodes, that.startEventLabel]);
                        }else{
                        that.startCodes = d.value;
                      
                        let label = d.filter;
                        that.startEventLabel = label;
                        that.drawEventButtons(cohort);
                        events.fire('event_selected', [that.startCodes, that.startEventLabel]);
                    }
            }

            filters = filters.filter(d=> {return d.type != 'Branch' && d.type != 'Demographic' && d.type != 'Score'});
        
            this.$node.select('.event-buttons').remove();

            let div = this.$node.append('div').classed('event-buttons', true);
            //toggle for event day
            let startPanel = div.append('div').classed('start-event', true);
                    
            let startToggle = startPanel.append('div').classed('btn-group', true);
            startToggle.append('button').classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                                    .append('text').text(this.startEventLabel);
    
            let startTogglebutton = startToggle.append('button')
                                        .classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                                        .classed('dropdown-toggle', true)
                                        .attr('data-toggle', 'dropdown');
    
            startTogglebutton.append('span').classed('caret', true);
    
            let startUl = startToggle.append('ul').classed('dropdown-menu', true).attr('role', 'menu');
            
            let eventLabels = startUl.selectAll('li').data(filters).enter().append('li');
                                      
            eventLabels.append('href').append('text').text(d=> filText(d));

            eventLabels.on('click', d=> labelClick(d));
  
            //toggle for scale
            let scalePanel = div.append('div').classed('scale', true);
                    
            let scaleToggle = scalePanel.append('div').classed('btn-group', true);
            scaleToggle.append('button').classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                                    .append('text').text(this.scoreLabel);

            let scaletogglebutton = scaleToggle.append('button')
                                        .classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                                        .classed('dropdown-toggle', true)
                                        .attr('data-toggle', 'dropdown');
    
            scaletogglebutton.append('span').classed('caret', true);
    
                        let ul = scaleToggle.append('ul').classed('dropdown-menu', true).attr('role', 'menu');
                        let abs = ul.append('li').attr('class', 'choice').append('text').text('Absolute');
                        let rel = ul.append('li').attr('class', 'choice').append('text').text('Relative');//.attr('value', 'Absolute');
              
            abs.on('click', () =>{
                            this.drawEventButtons(cohort);
                            events.fire('change_promis_scale', this.scoreLabel)});
    
            rel.on('click', () =>{
                                this.drawEventButtons(cohort);
                                events.fire('change_promis_scale', this.scoreLabel)});
    
            let aggToggle = div.append('div').classed('aggDiv', true);
            
            let aggButton = aggToggle.append('input')
                            .attr('type', 'button').attr('id', 'aggToggle')
                            .classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                            .attr('value', 'Aggregate Scores')
                            .on('click', () => {
                                events.fire('aggregate_button_clicked');
                            });

            if(!clumped){  aggButton.classed('btn-warning', false);  }
            else{ aggButton.classed('btn-warning', true); }
            
            let quartDiv = div.append('div').classed('quartDiv', true);
                quartDiv.append('input').attr('type', 'button').attr('id', 'quartile-btn')
                    .classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                    .attr('value', 'Separate Quantiles').on('click', () =>{
                        select('.checkDiv').remove();
                      
                        events.fire('separate_aggregate');
                          ///radio aggregation
                    });
                    let checkDiv = quartDiv.append('div').attr('id', 'checkDiv')//.classed('hidden', true);
                    let tCheck = checkDiv.append('div');
                    tCheck.append('input').attr('type', 'checkbox').attr('name', 'sample').attr('id', 'sampleT').attr('checked', true)
                    .attr('value', 'top').on('click', () => {
                        let p = selectAll('.top');
                        if(select("#sampleT").property('checked')){
                            p.classed('hidden', false);
                        }else{
                            p.classed('hidden', true);
                        }
                    });
                    tCheck.append('label').attr('for', 'sampleT').text('top').style('color', '#2874A6');
                    let mCheck = checkDiv.append('div')//.classed('container', true);
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

                    /*
                    let radio = quartDiv.append('form');
                    radio.append('input').attr('type', 'radio').attr('value', true).attr('name', 'quart').attr('id', 'quartile-radio-1');
                    radio.append('label').attr('for', 'quartile-radio-1').text('Average Score Change');
                    radio.append('input').attr('type', 'radio').attr('value', false).attr('name', 'quart').attr('id', 'quartile-radio-2');
                    radio.append('label').attr('for', 'quartile-radio-2').text('Score at Zero Day');
                    if(this.scoreChangeBool){
                        select(document.getElementById(this.scoreChangeBool)).attr('checked', true);
                    }*/
           
                   /*
                    this.$node.selectAll("input[name='quart']").on('change', function() {
                        let scoreChange = {id : this.id, scaleR: null};
                        if(this.id == 'quartile-radio-1'){ scoreChange.scaleR = true;
                        }else{ scoreChange.scaleR = false; }
                        that.scoreChangeBool = this.id;
                        events.fire('change_sep_bool', scoreChange);
                    });*/

                    let slidDiv = quartDiv.append('div').attr('id', 'sepSlider');

                    var margin = {left: 30, right: 30},
                    width = 200,
                    height = 60,
                    range = [0, 365],
                    step = 2; // change the step and if null, it'll switch back to a normal slider
            
                    // append svg
                    const sliderDiv = select('#sepSlider').node();
                    
                    const svg = select(sliderDiv).append('svg').node();

                    select(svg).attr('width', width)
                                    .attr('height', height);
                
                    const slider = select(svg).append('g').node();

                    select(slider).classed('slider', true)
                        .attr('transform', 'translate(' + margin.left +', '+ (height/2) + ')');

                    // using clamp here to avoid slider exceeding the range limits
                    var xScale = scaleLinear()
                        .domain(range)
                        .range([0, width - margin.left - margin.right])
                        .clamp(true);
                
                    // array useful for step sliders
                    var rangeValues = d3.range(range[0], range[1], step || 1).concat(range[1]);
                    var xAxis = axisBottom(xScale).ticks(10);
                  //  .tickFormat((d)=> {
                     //   return d;
                   ///});
            
                xScale.clamp(true);
                // drag behavior initialization
                const dragg = drag()
                    .on('start.interrupt', function () {
                        select(slider).interrupt();
                    }).on('start drag', function () {
                        dragged(event.x);
        
                    });

                
                    // this is the main bar with a stroke (applied through CSS)
                var track = select(slider).append('line').attr('class', 'track')
                .attr('x1', xScale.range()[0])
                .attr('x2', xScale.range()[1]);

                var trackInset = select(slider).append('line').attr('class', 'track-inset')
                .attr('x1', xScale.range()[0])
                .attr('x2', xScale.range()[1]);

                var trackOverlay = select(slider).append('g').attr('class', 'track-overlay')
                .attr('x1', xScale.range()[0])
                .attr('x2', xScale.range()[1])
                

                // this is a bar (steelblue) that's inside the main "track" to make it look like a rect with a border
               // var trackInset = d3.select(slider.appendChild(track.node().cloneNode())).attr('class', 'track-inset');

                var ticks = select(slider).append('g').attr('class', 'ticks').attr('transform', 'translate(0, 4)')
                    .call(xAxis);

                // drag handle
                var handle = select(slider).append('circle').classed('handle', true)
                    .attr('r', 8).call(dragg);

                select(slider).transition().duration(750)
                .tween("drag", function () {
                   // var i = d3.interpolate(0, 10);
                    return function (t) {
                       // dragged(xScale(i(t)));
                        dragged(xScale(t));
                    }
                });

                function dragged(value) {
                    var x = xScale.invert(value), index = null, midPoint, cx, xVal;
                    console.log(x);
                    if(step) {
                        // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
                        for (var i = 0; i < rangeValues.length - 1; i++) {
                            if (x >= rangeValues[i] && x <= rangeValues[i + 1]) {
                                index = i;
                                break;
                            }
                        }
                        midPoint = (rangeValues[index] + rangeValues[index + 1]) / 2;
                        if (x < midPoint) {
                            cx = xScale(rangeValues[index]);
                            xVal = rangeValues[index];
                        } else {
                            cx = xScale(rangeValues[index + 1]);
                            xVal = rangeValues[index + 1];
                        }
                    } else {
                        // if step is null or 0, return the drag value as is
                        cx = xScale(x);
                        xVal = x.toFixed(3);
                    }
                    // use xVal as drag value
                    handle.attr('cx', cx);
                
                }
/*
                    if(!separated){  
                        checkDiv.classed('hidden', true); 
                        radio.classed('hidden', true); }
                    else{ checkDiv.classed('hidden', false); 
                          radio.classed('hidden', false);}
*/
                    if(this.layerBool){
                        //document.getElementById('quartile-btn').classList.add('disabled');
                        quartDiv.select('#quartile-btn').classed('disabled', true);
                    }

                    let layer = div.append('input').attr('type', 'button').attr('id', 'layerButton').attr('class', 'btn').classed('btn-default', true).classed('btn-sm', true).attr('value', 'Layer View');
                    layer.on('click', function(d){ events.fire('layer_button_down'); });

                    let changePanel = div.append('div').classed('changePlot', true);
                    
                    let changeToggle = changePanel.append('div').classed('btn-group', true);
                    changeToggle.append('button').classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                                            .append('text').text(dataType);
        
                    let changeTogglebutton = changeToggle.append('button')
                                                .classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                                                .classed('dropdown-toggle', true)
                                                .attr('data-toggle', 'dropdown');
            
                    changeTogglebutton.append('span').classed('caret', true);
            
                                let cul = changeToggle.append('ul').classed('dropdown-menu', true).attr('role', 'menu');
                                let c1 = cul.append('li').attr('class', 'choice').append('text').text('PROMIS Physical Function');
                                c1.on('click', ()=> {
                                    this.scoreType = 'PROMIS Physical Function';
                                    events.fire('change_plot_data', 'promis')});
                                let c2 = cul.append('li').attr('class', 'choice').append('text').text('Oswestry').attr('value', 'oswestry');
                                c2.on('click', ()=> {
                                    this.scoreType = 'Oswestry Index';
                                    events.fire('change_plot_data', 'oswestry')});
            }

    private async flattenCohort(cohort) {

        let flat = [];

        cohort.forEach(group => {
            flat.push(group);
            if(group.branches.length > 0){
                group.branches.forEach(branch => {
                    flat.push(branch);
                });
            }
        });

       
        return flat;
    }
    
    private renderOrdersTooltip(tooltip_data) {

            let text;
            if(tooltip_data[0] == 'demographic') {
              if(tooltip_data[1].length == 0){
                text = "<strong style='color:darkslateblue'>" + 'All Patients: ' + tooltip_data[2] + "</strong></br>";
              }else{ 
                text = "<strong style='color:darkslateblue'>" + 'Demographic Filter: ' + tooltip_data[2] + "</strong></br>";
              }
            } 
            if(tooltip_data[0] == 'CPT'){ 
               
                let code = tooltip_data[1][1];
               
                text = "<strong style='color:darkslateblue'>" + code[0].parent + ': ' + tooltip_data[2] + "</strong></br>";
            } 
            if(tooltip_data[0] == 'Score Count'){ 

                text = "<strong style='color:darkslateblue'>" + tooltip_data[0] + ' > ' + tooltip_data[1] +  ' : ' + tooltip_data[2] + "</strong></br>";
            }
            if(tooltip_data[0] == 'Branch'){
                text = 'Cohort Branched';
            }
            if(tooltip_data.parentLink){ 
                text = 'Branch from Cohort at ' + tooltip_data.parentLink[1] + ' patients';
                console.log(tooltip_data); }
           
            return text;
    }


}

export function create(parent:Element, cohort) {
    return new EventLine(parent, cohort);
  }