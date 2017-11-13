/**
 * Created by Jen Rogers on 8/11/17.
 */
import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll,event} from 'd3-selection';
import {nest,values,keys,map,entries} from 'd3-collection'
import * as events from 'phovea_core/src/event';
import {scaleLinear,scaleTime,scaleOrdinal, scaleBand} from 'd3-scale';
import {line,curveMonotoneX} from 'd3-shape';
import {timeParse} from 'd3-time-format';
import {extent, min, max, ascending} from 'd3-array';
import {axisBottom,axisLeft} from 'd3-axis';
import {drag} from 'd3-drag';
import {Constants} from './constants';
import * as dataCalc from './dataCalculations';
import {transition} from 'd3-transition';
import {brush, brushY, brushX, brushSelection} from 'd3-brush';
import * as similarityScore  from './similarityScoreDiagram';
import * as d3 from 'd3';
import {ITable, asTable} from 'phovea_core/src/table';
import {IAnyVector} from 'phovea_core/src/vector';
import {list as listData, getFirstByName, get as getById} from 'phovea_core/src/data';
//import * as csvUrl from 'file-loader!../data/number_one_artists.csv';
import {tsv} from 'd3-request';
import {ICategoricalVector, INumericalVector} from 'phovea_core/src/vector/IVector';
import {VALUE_TYPE_CATEGORICAL, VALUE_TYPE_INT} from 'phovea_core/src/datatype';
import {range, list, join, Range, Range1D, all} from 'phovea_core/src/range';
import {asVector} from 'phovea_core/src/vector/Vector';
import {argFilter} from 'phovea_core/src/';

export class parallel {

  private $node;
  private svg;
  private brush;
  private allData;
  private yscale;
  private xscale;
  private plotDimension = {width: 1100, height: 300 };
  private margin = {top: 20, right: 10, bottom: 10, left: 10};
  private SelectedCounter;
  private plotLines;
  private backgroundLines;
  private dimension;
  private path;

  selectedData;
  contextData;
  

  table: ITable;

  constructor(parent: Element) {

    this.$node = select(parent)
        .append('div')
        .classed('parallelDiv', true);
    
    this.svg = this.$node.append('svg')
        .attr('class', 'parallel-svg')
        .attr('width', this.plotDimension.width )
        .attr('height', this.plotDimension.height + this.margin.top + this.margin.bottom);
    
    this.yscale = scaleLinear().range([0, this.plotDimension.height]);
    this.xscale = scaleLinear().range([0, this.plotDimension.width]);

    this.mapPatientData();
    this.attachListener();
    
    this.plotLines = select('#plotGroup').selectAll('path');
    
  }

  private attachListener() {
    
            // item: pat_id, number of similar patients, DATA
            events.on('filter_data', (evt, item) => { // called in queryBox
              this.updatePlot(this.plotLines, item);

            });

            events.on('brushes', (evt, item) => {
             // console.log(item);
              this.plotPatients(item, null);
            });

            events.on('dataUpdated', (evt, item) =>{
             // console.log(item);
              let selected = item[0];
              this.updateCounter(selected);
            }) 
    
        }
  

    /**
       * get Data by API
       * @param URL
       * @returns {Promise<any>}
       */
      private async getData(URL) {
        return await ajax.getAPIJSON(URL);
      }

  public async mapPatientData() {

    let table : ITable;
    let that = this;

    //this.table = <ITable> await getById('CPT_codes');
  this.table = <ITable> await getById('Demo_Info');
  console.log(await this.table.desc);

     let patID = (await this.table.colData('PAT_ID')).map(d => +d);
     let GENDER = (await this.table.colData('PAT_GENDER')).map(d => d);
     let MARITAL_STATUS = (await this.table.colData('PAT_MARITAL_STAT')).map(d => d);
     let TOBACCO = (await this.table.colData('TOBACCO_USER')).map(d => d);
     let ALCOHOL = (await this.table.colData('ALCOHOL_USER')).map(d => d);
     let DRUG_USER = (await this.table.colData('ILLICIT_DRUG_USER')).map(d => d);
     let RACE = (await this.table.colData('PAT_RACE')).map(d => d);
     let BMI = (await this.table.colData('BMI')).map(d => +d);
     let patDOB = (await this.table.colData('PAT_BIRTHDATE')).map(d => new Date(String(d)));
     let CCI = (await this.table.colData('CCI')).map(d => +d);

  let patAge = [];

    patDOB.forEach((d) => { 
        let diff = Date.now() - d.getTime();
        patAge.push(diff / (1000 * 60 * 60 * 24 * 365.25));
       
      });
  
      this.selectedData = patID.map((id, i) => {
        return {
          ID: id,
          GENDER: GENDER[i],
          AGE: patAge[i],
          BMI: BMI[i],
          MARITAL_STATUS: MARITAL_STATUS[i],
          TOBACCO: TOBACCO[i],
          ALCOHOL: ALCOHOL[i],
          DRUG_USER: DRUG_USER[i],
          RACE : RACE[i],
          CCI: CCI[i]
        };
      });

      this.allData = this.selectedData;

      let types = {
        "Number": {
          key: "Number",
          coerce: function(d) { return +d; },
          extent: d3.extent,
          within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
          defaultScale: scaleLinear().range([innerHeight, 0])
        },
        "String": {
          key: "String",
          coerce: String,
          extent: function (data) { return data.sort(); },
          within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
         // defaultScale: scalePoint().range([0, innerHeight])
        },
        "Date": {
          key: "Date",
          coerce: function(d) { return new Date(d); },
          extent: d3.extent,
          within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
          defaultScale: scaleTime().range([0, innerHeight])
        }
      };

  this.dimension = [

     {'value' : 'AGE', 'data':  patAge, 'type': types['Number'], 
     'scale': scaleLinear().range(this.yscale.range()).domain([d3.max(patAge),d3.min(patAge)]).clamp(true) },
      {'value': 'BMI', 'data': BMI, 'type': types['Number'], 
      'scale': scaleLinear().range(this.yscale.range()).domain([d3.max(BMI),d3.min(BMI)]).clamp(true) },
      {'value': 'CCI', 'data': CCI, 'type': types['Number'], 
      'scale': scaleLinear().range(this.yscale.range()).domain([d3.max(CCI),d3.min(CCI)]).clamp(true) }

    ];
 
  let lineGen = d3.svg.line();
  this.xscale.domain([0, this.dimension.length]);
  let axis = d3.svg.axis().orient("left");

  this.path = (d) => {
    
      let coordinateList = this.dimension.map((p, i) => {

        if(p.value !== d.ID
          ){
      
              let axisXCoord = this.xscale(i);
              let yScale = p.scale;
              let lineYCoord = yScale(d[p.value]);
        
              return [axisXCoord, lineYCoord];
        }
            });
          
            // coordinateList is a list of lists
            return lineGen(coordinateList);
  }

     // Add a group element for each dimension.
     
  let dimensionGroup = this.svg.selectAll(".dimension")
  .data(this.dimension)
  .enter().append("g")
  .attr("class", "dimension")
  .attr("transform", function(d, i) { return "translate("+ that.xscale(i) +")"; });

   // Add an axis and title.
   dimensionGroup.append("g").attr('transform', 'translate(25, '+this.margin.top+')')
   .attr("class", "axis")
   .each(function(d, i) { d3.select(this).call(axis.scale(d.scale)); })
   .append("text")
   .style("text-anchor", "middle")
   .attr("y", -9)
   .text(function(d) { return d.value; });

   this.brush = brushY()
   .extent([[0, 0], [25, this.plotDimension.height + this.margin.top]])

   dimensionGroup.append("g")
   .attr("class", "brush")
   .call(this.brush);

    let brushed = function() {
      let lines = select('#plotGroup').selectAll('path');

          let actives = [];
          dimensionGroup.selectAll(".brush")
            .filter(function(d) {
              return brushSelection(this);
            })
            .each(function(d) {
              actives.push({
                dimension: d,
                extent: brushSelection(this)
               
              });
            });
          
           let activeData = [];
           let rejectData;
      
          let selected = lines.filter(function(d) {
            if (actives.every(function(active) {

               var dim = active.dimension;
            
                // test if point is within extents for each active brush
                return dim.type.within(d[dim.value], active.extent, dim);
              })) 
              {
              return true;
            }
          });

         selected.each((d)=> activeData.push(d));
        
        events.fire('brushes', activeData);
        events.fire('dataUpdated', [activeData, this.allData]);
      
        }

this.brush.on('end', brushed);

this.svg.append('g')
.attr('height', this.plotDimension.height).attr('transform', 'translate(25, '+this.margin.top+')').attr('id', 'plotGroup');

this.svg.append('g')
.attr('height', this.plotDimension.height).attr('transform', 'translate(25, '+this.margin.top+')').attr('id', 'plotRejects');

this.plotPatients(this.selectedData, this.contextData);
events.fire('dataLoaded', this.allData);

this.SelectedCounter = this.svg.append('g')
.attr('transform', 'translate(30,' + (this.plotDimension.height + 30) + ')')
.classed('counter', true).append('text');


}

private async plotPatients(data, rejectData){
  
   // console.log(rejectData);
   
   let plotLines = select('#plotGroup')
    .selectAll('path').data(data);
  
    plotLines.exit().remove();
    
    let linesEnter = plotLines.enter().append('path');
    plotLines = linesEnter.merge(plotLines);
  
    plotLines.attr('d', d => this.path(d));
  
    plotLines.attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', .3).attr("stroke-opacity", 0.2);


  }

private updatePlot(selected, d) {

let choice = d[0];
let parent = d[1];

    let lines = select('#plotGroup').selectAll('path');


    let filterGroup = lines.filter(d => d[parent] == choice);


     let filteredData = this.selectedData.filter(d => d[parent] == choice);
     let rejectData = this.selectedData.filter(d => d[parent] !== choice);//.classed('hidden', true);

    filterGroup.classed(parent, true);

    this.plotPatients(filteredData, rejectData);

    events.fire('dataUpdated', [filteredData, this.allData]);

}

private updateCounter(data){
  this.selectedData = data;
  this.SelectedCounter.text('Selected Patients:   ' + data.length);
}


  }

   

export function create(parent:Element) {
  return new parallel(parent);
}

