/**
 * Created by Jen Rogers on 8/11/17.
 */
import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll,event} from 'd3-selection';
import {nest,values,keys,map,entries} from 'd3-collection'
import * as events from 'phovea_core/src/event';
import {scaleLinear,scaleTime,scaleOrdinal} from 'd3-scale';
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

export class patOrderBreakdown {

  private $node;
  private timeScale;
  private scoreScale;
  private timeScaleMini;
  private patientInfo;
  private svg;
  private targetPatientProInfo;
  private brush;
  private targetPatientOrders;
  private currentlySelectedName;
  private similarData;
  private allData;
  private selectedOrder;
  private orderLabel;
  private selectedTargetPatOrderCount;
  private selectedSimilarOrderCount;

  private similarPatientsProInfo;
 
  private findMinDate = dataCalc.findMinDate;//function for calculating the minDate for given patient record
  private parseTime = dataCalc.parseTime;
  private setOrderScale = dataCalc.setOrderScale;
  private getClassAssignment = dataCalc.getClassAssignment;
  private drawPatOrderRects = dataCalc.drawPatOrderRects;
  private orderHierarchy = dataCalc.orderHierarchy;

  rectBoxDimension = {width: 1100, height: 90 };
  orderBar = {width: 10, height: 60 };
  similarBar = {width: 8, height: 30 };
  margin = {top: 20, right: 10, bottom: 10, left: 10};
  contextDimension = {width: this.rectBoxDimension.width, height:55};
  patOrderGroup;

  table: ITable;
  table2: ITable;
    
  constructor(parent: Element) {

    this.$node = select(parent)
        .append('div')
        .classed('orderBreakdownDiv', true)
        .attr('transform', `translate(-50,0)`);
    
    this.svg = this.$node.append('svg')
        .attr('class', 'rectSVG')
        .attr('width', this.rectBoxDimension.width)
        .attr('height', this.rectBoxDimension.height*4);

        this.svg.append('g')
        .attr('id', 'similar_order');
    
    this.timeScale = scaleLinear()
        .range([0, this.rectBoxDimension.width])
        .clamp(true);

    //append patient order svg group
      //append patient order svg group
 //  this.svg.append('g')
    //  .attr('id', 'sim_rect_line')
    //   .attr('transform', `translate(${this.margin.left},${this.margin.top})`);   
    this.patOrderGroup = this.svg.select('#similar_order')
    .append('g')
    .attr('transform', () => {
        return `translate(${this.margin.left},0)`; // If there is a label for the x-axis change 0
    });
    
  this.attachListener();

      }

  /**
   * Attach listeners
   */
  
  private attachListener() {
    //called in similarityScoreDiagram
    events.on('orders_updated', (evt, item) => {
       // console.log('works!!!');
      //  console.log(item);
       // console.log(this.targetPatientProInfo);


        this.addSimilarOrderPoints(item[0], item[1], item[2]);
    });

    events.on('Orders', (evt, item) => {
       // console.log(item);
        
       // this.addSimilarOrderPoints(this.targetPatientProInfo, item[0], this.targetPatientProInfo, item[0]);
    })

    // item: pat_id, number of similar patients, DATA
    events.on('update_similar', (evt, item) => { // called in queryBox

       this.targetPatientProInfo = item[2]['pat_PRO'][item[0]].slice();
       this.similarPatientsProInfo = entries(item[2]['similar_PRO']);

      this.setOrderScale();
      this.targetPatientOrders = item[2]['pat_Orders'][item[0]].slice();
      
      let filteredorders = this.orderHierarchy(this.targetPatientOrders);

      this.drawPatOrderRects(this.targetPatientOrders);
      this.drawPatOrderRects(filteredorders.medicationGroup);
     
    
    });

    // item: pat_id, DATA
    events.on('update_all_info', (evt, item) => {  // called in query box

      this.targetPatientProInfo = item[1]['PROMIS_Scores'][item[0]];
      this.similarPatientsProInfo = [];

      this.setOrderScale();
 
    });


  }

  private assignCurrentName (d) {
          
         
          if (this.currentlySelectedName != undefined){
            this.currentlySelectedName = undefined;
          }
  }
  

     /**
     *
     * @param ordersInfo
     */
    private addSimilarOrderPoints(patordersInfo, similarOrdersInfo, simPro) {
        
              //similar patient PROMIS score records
               // console.log(simPro); 
               //similar patient order records
               // console.log(patordersInfo);
        
                let minDate = this.findMinDate(patordersInfo);
        
                patordersInfo.forEach((d) => {
                    let time = this.parseTime(d['ORDER_DTM'], minDate).getTime();
                    d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
                });
        
                const self = this;

                // ----- add diff days to the data
        
                similarOrdersInfo.forEach((g) => {

                    //this used to filter 
        
                //   let currPatient = simPro.filter((d) => {
                    //   return d.key == g.key
                 //  })[0];

                  // console.log(currPatient);
    /*
                    if(currentPatient.value != null){
                        let minDate = this.findMinDate(currentPatient.value);
                    }*/
                    if(g.value != null){
                        let minDate = this.findMinDate(g.value);
                    }
                  
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
        
              
                let patGroups = this.patOrderGroup
                    .selectAll('.patgroups')
                    .data(similarOrdersInfo);

                    patGroups.exit().remove();

                let similarOrderGroupEnter = patGroups
                    .enter()
                    .append('g').attr('class', 'patgroups')//.attr('class', d=> d.key);
                let patGroupText = similarOrderGroupEnter
                    .append('text').text(d=> d.key)
                    .attr('transform', `translate(0,10)`);

                   similarOrderGroupEnter
                    .attr('transform', (d, i) => `translate(0,${this.rectBoxDimension.height - 50 + (i + 1) * (this.similarBar.height + 5)})`);
                  
                 let rects =  similarOrderGroupEnter.append('g')
                    .classed('similarRectOrder', true)
                    .attr('transform', `translate(60,0)`)
                    .selectAll('rect')
                    .data(d=> d.value)
                    .enter()
                    .append('rect')
                    //.attr('class', (d) => `${d['ORDER_CATALOG_TYPE']}`)
                    .attr('class', this.getClassAssignment('ORDER_CATALOG_TYPE'))
                    .attr('class', this.getClassAssignment('ORDER_STATUS'))
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
                                .attr('x1', self.timeScale(d['diff']) + self.margin.right)
                                .attr('x2', self.timeScale(d['diff']) + self.margin.right)
                                .attr('y1', self.scoreScale(100) + self.margin.top)
                                .attr('y2', self.scoreScale(0) + self.margin.top)
                                .on('click', () => console.log(d));
        
                           // console.log(d);
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

                    patGroups = similarOrderGroupEnter.merge(patGroups);
                    
                      this.svg.select('#similar_orders').selectAll('.similarRect')
                            .append('text')
                            .text(similarOrdersInfo.pat_id);
        
                // fix height of the svg
                this.svg
                    .attr('height', this.rectBoxDimension.height - 50 + (this.similarBar.height + 5) * similarOrdersInfo.length);
        
            }



 /**
   * get Data by API
   * @param URL
   * @returns {Promise<any>}
   */
  private async getData(URL) {
    return await ajax.getAPIJSON(URL);
  }

  //tooltip
  private renderOrdersTooltip(tooltip_data) {

    let text = "<strong style='color:darkslateblue'>" + tooltip_data['ORDER_CATALOG_TYPE'] + "</strong></br>";
    text += "<span>" + tooltip_data['ORDER_MNEMONIC'] + "</span></br>";
    text += "<span>" + tooltip_data['ORDER_DTM'] + "</span></br>";
    return text;
  }


  }
   

export function create(parent:Element) {
  return new patOrderBreakdown(parent);
}
