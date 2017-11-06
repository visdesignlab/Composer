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
import {brush, brushY, brushX} from 'd3-brush';
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
  private timeScale;
  private scoreScale;
  private timeScaleMini;
  private patientInfo;
  private svg;
 // private targetPatientProInfo;
  private brush;
  private targetPatientOrders;
  private currentlySelectedName;
  private similarData;
  private allData;
 // private selectedOrder;
  private plotLines;

  private yscale;
  private xscale;
  private similarPatientsProInfo;
  private plotDimension = {width: 1100, height: 300 };
  private margin = {top: 20, right: 10, bottom: 10, left: 10};

  private filter1;


  table: ITable;

  constructor(parent: Element) {

    this.$node = select(parent)
        .append('div')//.attr('height', 600)
        .classed('parallelDiv', true);
    
    this.svg = this.$node.append('svg')
        .attr('class', 'parallel-svg')
        .attr('width', this.plotDimension.width )
        .attr('height', this.plotDimension.height + this.margin.top + this.margin.bottom);
    
    this.timeScale = scaleLinear()
        .range([0, this.plotDimension.width])
        .clamp(true);

    this.yscale = scaleLinear().range([0, this.plotDimension.height]);
    this.xscale = scaleLinear().range([0, this.plotDimension.width]);

    this.plotPatients();
    
  }
  

    /**
       * get Data by API
       * @param URL
       * @returns {Promise<any>}
       */
      private async getData(URL) {
        return await ajax.getAPIJSON(URL);
      }

  public async plotPatients() {

   // const allDatasets = await listData();
   // console.log('All loaded datasets:');
   // console.log(allDatasets);

    let table : ITable;

    //this.table = <ITable> await getById('CPT_codes');
  this.table = <ITable> await getById('Demo_Info');
  console.log(await this.table.desc);

     let patID = (await this.table.colData('PAT_ID')).map(d => +d);
     let GENDER = (await this.table.colData('PAT_GENDER')).map(d => d);
     let MARITAL_STATUS = (await this.table.colData('PAT_MARITAL_STAT')).map(d => d);
     let TOBACCO = (await this.table.colData('TOBACCO_USER')).map(d => d);
     let ALCOHOL = (await this.table.colData('ALCOHOL_USER')).map(d => d);
     let DRUG_USER = (await this.table.colData('ILLICIT_DRUG_USER')).map(d => d);
     let BMI = (await this.table.colData('BMI')).map(d => +d);
     let patDOB = (await this.table.colData('PAT_BIRTHDATE')).map(d => new Date(String(d)));
     let CCI = (await this.table.colData('CCI')).map(d => +d);

  let patAge = [];

    patDOB.forEach((d) => { 
        let diff = Date.now() - d.getTime();
        patAge.push(diff / (1000 * 60 * 60 * 24 * 365.25));// = diff / (1000 * 60 * 60 * 24 * 365.25);
       
      });
  
      let rows = patID.map((id, i) => {
        return {
          ID: id,
          GENDER: GENDER[i],
          AGE: patAge[i],
          BMI: BMI[i],
          MARITAL_STATUS: MARITAL_STATUS[i],
          TOBACCO: TOBACCO[i],
          ALCOHOL: ALCOHOL[i],
          DRUG_USER: DRUG_USER[i],
          CCI: CCI[i]
        };
      });

      console.log(rows);

  let dimension = [

    //  {'value': 'ID', 'data': patID, 'scale': this.yscale.domain(d3.extent(patID))},
     // {'value' : 'AGE', 'data':  patAge, 'scale': this.yscale.domain(d3.extent(patAge)) },
     {'value' : 'AGE', 'data':  patAge, 'scale': scaleLinear().range(this.yscale.range()).domain([d3.max(patAge),d3.min(patAge)]) },
      {'value': 'BMI', 'data': BMI, 'scale': scaleLinear().range(this.yscale.range()).domain([d3.max(BMI),d3.min(BMI)]) },
      {'value': 'CCI', 'data': CCI, 'scale': scaleLinear().range(this.yscale.range()).domain([d3.max(CCI),d3.min(CCI)]) }

    ];
 
  let lineGen = d3.svg.line();
  

  var xtest = scaleLinear().range([0, this.plotDimension.width]).domain([0, dimension.length]);

     let axis = d3.svg.axis().orient("left");

  let path = (d) => {

      let coordinateList = dimension.map((p, i) => {

        if(p.value !== d.ID && 
           p.value !== d.TOBACCO && 
           p.value !== d.ALCOHOL && 
           p.value !== d.GENDER && 
           p.value !== d.PAT_MARITAL_STAT &&
           p.value !== d.DRUG_USER
          ){
      
             let x = scaleLinear().domain([0, dimension.length]).range([0, this.plotDimension.width]);
          
              let axisXCoord = x(i);
              let yScale = p.scale;
              let lineYCoord = yScale(d[p.value]);
             // console.log(d[p.value]);
        
              return [axisXCoord, lineYCoord];
        }
            });
          
            // coordinateList is a list of lists
            //console.log(coordinateList);
            return lineGen(coordinateList);

  }

  this.plotLines = this.svg.append('g').attr('height', this.plotDimension.height).attr('transform', 'translate(25, '+this.margin.top+')')
  .attr('id', 'plotGroup').selectAll('path').data(rows);

  let linesEnter = this.plotLines.enter().append('path');
  this.plotLines = this.plotLines.merge(linesEnter);
  this.plotLines.attr('d', d => path(d));

  this.plotLines.attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', .3).attr("stroke-opacity", 0.2);
  this.plotLines.on('mouseover', (d)=> console.log(d));
     // Add a group element for each dimension.
     
  let g = this.svg.selectAll(".dimension")
  .data(dimension)
  .enter().append("g")
  .attr("class", "dimension")
  .attr("transform", function(d, i) { return "translate("+ xtest(i) +")"; });

   // Add an axis and title.
   g.append("g").attr('transform', 'translate(25, '+this.margin.top+')')
   .attr("class", "axis")
   .each(function(d, i) { d3.select(this).call(axis.scale(d.scale)); })
 .append("text")
   .style("text-anchor", "middle")
   .attr("y", -9)
   .text(function(d) { return d.value; });
  
}
  }

  export function filterPlot(d, p) {

    let parent = p ;
    let choice =  d ;
  
     let lines = select('#plotGroup').selectAll('path');

     let filterGroup = lines.filter(d => d[parent] == choice);

     console.log(filterGroup);

    filterGroup.attr('class', parent);

    }
   

export function create(parent:Element) {
  return new parallel(parent);
}

