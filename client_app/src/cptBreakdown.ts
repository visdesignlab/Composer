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

export class cptBreakdown {

  private $node;
  private timeScale;
  private scoreScale;
  private svg;
  //private findMinDate = dataCalc.findMinDate;//function for calculating the minDate for given patient record
  private parseTime = dataCalc.parseTime;
  private setOrderScale = dataCalc.setOrderScale;
  private getClassAssignment = dataCalc.getClassAssignment;
  private drawPatOrderRects = dataCalc.drawPatOrderRects;
  private orderHierarchy = dataCalc.orderHierarchy;
  private patOrderGroup;
  targetPatientOrders;
  targetPatientProInfo
  similarPatientsProInfo;


  rectBoxDimension = {width: 1100, height: 90 };
  orderBar = {width: 10, height: 60 };
  similarBar = {width: 8, height: 30 };
  margin = {top: 20, right: 10, bottom: 10, left: 10};
  contextDimension = {width: this.rectBoxDimension.width, height:55};
 
  selectedPatientArray;
  cptObject;
  filteredCPT;

  table: ITable;
  table2: ITable;
    
  constructor(parent: Element) {

    this.$node = select(parent)
    .append('div')
    .classed('cptBreakdownDiv', true)
    .attr('transform', `translate(-50,0)`);

this.svg = this.$node.append('svg')
    .attr('class', 'cptSVG')
    .attr('width', this.rectBoxDimension.width)
    .attr('height', this.rectBoxDimension.height*4);

    this.svg.append('g')
    .attr('id', 'similar_cpt');

this.timeScale = scaleLinear()
    .range([0, this.rectBoxDimension.width])
    .clamp(true);

//append patient order svg group
  //append patient order svg group
//  this.svg.append('g')
//  .attr('id', 'sim_rect_line')
//   .attr('transform', `translate(${this.margin.left},${this.margin.top})`);   
this.patOrderGroup = this.svg.select('#similar_cpt')
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

    events.on('selected_pat_array', (evt, item)=> {
     
        this.selectedPatientArray = item;
        this.getCPT(this.selectedPatientArray, this.cptObject);
    });

    events.on('cpt_object', (evt, item)=> {
      
        this.cptObject = item;
     
    });

    events.on('filtered_CPT', (evt, item) => {
      console.log("working??")
      this.addSimilarOrderPoints(this.targetPatientProInfo, item);
    });

      // item: pat_id, number of similar patients, DATA
      events.on('update_similar', (evt, item) => { // called in queryBox
        this.targetPatientProInfo = item[2]['pat_PRO'][item[0]].slice();
        this.similarPatientsProInfo = entries(item[2]['similar_PRO']);
 
       this.setOrderScale();
       this.targetPatientOrders = item[2]['pat_Orders'][item[0]].slice();
      
     });
   

  }

  
 /**
     * Utility method
     * @param pat
     * @returns {Date}
     */
    private findMinDate(pat) {
      
              let minDate = new Date();
              for (let index = 0; index < pat.length; index++) {
                  if (!pat[index]['ASSESSMENT_START_DTM']) continue;
                  if (this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null) < minDate)
                      minDate = this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null)
              }
              return minDate
          }

           /**
     * Utility method
     * @param pat
     * @returns {Date}
     */
    private findMinDateCPT(pat) {
      
              let minDate = new Date();
              for (let index = 0; index < pat.length; index++) {
                  if (!pat[index]['PROC_DTM']) continue;
                  if (this.parseTime(pat[index]['PROC_DTM'], null) < minDate)
                      minDate = this.parseTime(pat[index]['PROC_DTM'], null)
              }
              return minDate
          }

   //uses Phovea to access PRO data and draw table
   private async getCPT(selectedPatIds, cptObject) {

    console.log(cptObject);
    console.log(this.selectedPatientArray);

    let filteredPatOrders = {};
   // const patOrders = await this.orderTable.objects();
   
     cptObject.forEach(item => {
         if (selectedPatIds.indexOf(item.PAT_ID) !== -1) {
          if (filteredPatOrders[item.PAT_ID] === undefined) {
     filteredPatOrders[item.PAT_ID] = [];
   }
     filteredPatOrders[item.PAT_ID].push(item);
    }
     });
    let mapped = entries(filteredPatOrders);

    events.fire('filtered_CPT', mapped);

 };

  /**
     *
     * @param ordersInfo
     */
    private addSimilarOrderPoints(patProInfo, similarOrdersInfo) {

      console.log("patpro"+ patProInfo);
      
              // -------  target patient
              let minDate = this.findMinDate(patProInfo);
              
                      similarOrdersInfo.forEach((d) => {
                          let time = this.parseTime(d['PROC_DTM'], minDate).getTime();
                          d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
                      });
      
              const self = this;

              // ----- add diff days to the data
            // console.log() similarOrdersInfo.values();
              let filteredOrders = [];
              similarOrdersInfo.forEach((g) => {

                //g.array = [];
      
                 if(g.value != null){
                      let minDate = this.findMinDateCPT(g.value);
                 }
                // let minDate = this.findMinDate(similarOrdersInfo.value);
                  g.value.forEach((d) => {

                      d.array = []; 
                      d.time = d['PROC_DTM'];

                      try {
                          d.diff = Math.ceil((this.parseTime(d['PROC_DTM'], null).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
                          console.log(d.diff);
                        }
                      catch (TypeError) {
                          console.log('error');
                          d.diff = -1;
                      }
                      if(d['CPT_1'] !== 0){ d.array.push(d['CPT_1']);   };
                      if(d['CPT_2'] !== 0){ d.array.push(d['CPT_2'])    };
                      if(d['CPT_3'] !== 0){ d.array.push(d['CPT_3'])    };
                      if(d['CPT_4'] !== 0){ d.array.push(d['CPT_4'])    };
                      if(d['CPT_5'] !== 0){ d.array.push(d['CPT_5'])    };
                      if(d['CPT_6'] !== 0){ d.array.push(d['CPT_6'])    };
                      if(d['CPT_7'] !== 0){ d.array.push(d['CPT_7'])    };
                      if(d['CPT_5'] !== 0){ d.array.push(d['CPT_5'])    };
                      if(d['CPT_6'] !== 0){ d.array.push(d['CPT_6'])    };
                      if(d['CPT_7'] !== 0){ d.array.push(d['CPT_7'])    };
                      //console.log(g.array);
                      d.diff = d.diff;

                     });

                     let filter = g.value.map(function(blob) {
                        let temp = [];
                        temp.push(blob.array);  
                        return {
                            key: blob.PAT_ID,
                            value : temp,
                            time: blob.PROC_DTM,
                            diff : blob.diff
                            };
                        });
/* attempted array of codes separate
                        let filter = g.value.map(function(blob) {
                            let temp = [];
                            temp.push(blob.array);  
                            return {
                                key: blob.PAT_ID,
                                values : temp,
                                };
                            });
                        */
                      //console.log(filter);
                      filteredOrders.push(filter);
                           
                });
                console.log(filteredOrders);
                console.log(similarOrdersInfo);
            
              let patGroups = this.patOrderGroup
                  .selectAll('.patgroups')
                  .data(filteredOrders);
                  //.data(similarOrdersInfo);

                  patGroups.exit().remove();

              let similarOrderGroupEnter = patGroups
                  .enter()
                  .append('g').attr('class', 'patgroups')//.attr('class', d=> d.key);
              let patGroupText = similarOrderGroupEnter
                  .append('text').text(d=>d[0].key)
                  .attr('transform', `translate(0,10)`);

                 similarOrderGroupEnter
                  .attr('transform', (d, i) => `translate(0,${this.rectBoxDimension.height - 50 + (i + 1) * (this.similarBar.height + 5)})`);
                
               let rects =  similarOrderGroupEnter.append('g')
                  .classed('similarRectCPT', true)
                  .attr('transform', `translate(60,0)`)
                  .selectAll('rect')
                  .data((d, i)=> d)
                //  .data(d=> d.value)
                  .enter()
                  .append('rect')
                  //.attr('class', (d) => `${d['ORDER_CATALOG_TYPE']}`)
                  .attr('class', this.getClassAssignment('time'))
                 // .attr('class', this.getClassAssignment('CPT_2'))
                  .attr('x', (g) => this.timeScale(g.diff))
                  .attr('y', 0)
                  .attr('width', this.similarBar.width)
                  .attr('height', this.similarBar.height)
                 
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

          //tooltip
  private renderOrdersTooltip(tooltip_data) {
        let text
        text = tooltip_data['time'];
        tooltip_data.value.forEach((d, i) => {
            console.log(d[i]);
        });
        /*
    if(tooltip_data['CPT_1'] !== 0){text = "<strong style='color:darkslateblue'>" + tooltip_data['CPT_1'] + "</strong></br>";}
        if(tooltip_data['CPT_2'] !== 0){text += "<span>" + tooltip_data['CPT_2'] + "</span></br>"; }
        if(tooltip_data['CPT_3'] !== 0){ text += "<span>" + tooltip_data['CPT_3'] + "</span></br>";}
        if(tooltip_data['CPT_4'] !== 0){ text += "<span>" + tooltip_data['CPT_4'] + "</span></br>";}
        if(tooltip_data['CPT_5'] !== 0){text += "<span>" + tooltip_data['CPT_5'] + "</span></br>";}
        if(tooltip_data['CPT_6'] !== 0){ text = "<strong style='color:darkslateblue'>" + tooltip_data['CPT_6'] + "</strong></br>";}
        if(tooltip_data['CPT_7'] !== 0){text += "<span>" + tooltip_data['CPT_7'] + "</span></br>";}
        if(tooltip_data['CPT_8'] !== 0){ text += "<span>" + tooltip_data['CPT_8'] + "</span></br>";}
        if(tooltip_data['CPT_9'] !== 0){text += "<span>" + tooltip_data['CPT_9'] + "</span></br>";}
        if(tooltip_data['CPT_10'] !== 0){text += "<span>" + tooltip_data['CPT_10'] + "</span></br>";}*/
        return text;
      }




  }
   

export function create(parent:Element) {
  return new cptBreakdown(parent);
}

