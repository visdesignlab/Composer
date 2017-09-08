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
  margin = {top: 20, right: 10, bottom: 10, left: 10};
  contextDimension = {width: this.rectBoxDimension.width, height:55};

  table: ITable;
  table2: ITable;
    
  constructor(parent: Element) {

    this.$node = select(parent)
        .append('div')
        .classed('orderBreakdownDiv', true);
    
    this.svg = this.$node.append('svg')
        .attr('class', 'rectSVG')
        .attr('width', this.rectBoxDimension.width)
        .attr('height', this.rectBoxDimension.height*4)
    
    this.timeScale = scaleLinear()
        .range([0, this.rectBoxDimension.width])
        .clamp(true);

    //append patient order svg group
      //append patient order svg group
   this.svg.append('g')
      .attr('id', 'pat_rect_line')
       .attr('transform', `translate(${this.margin.left},${this.margin.top})`); 
  /*
   let context = this.svg.append('g')
            .attr('class', 'context')
            .attr('width', this.contextDimension.width)
            .attr('height', this.contextDimension.height)
            .attr('transform', `translate(${this.margin.left},${this.rectBoxDimension.height + this.margin.top})`);
*/
    
  this.attachListener();

      }

  /**
   * Attach listeners
   */
  
  private attachListener() {

    // item: pat_id, number of similar patients, DATA
    events.on('update_similar', (evt, item) => { // called in queryBox

       this.targetPatientProInfo = item[2]['pat_PRO'][item[0]].slice();
       this.similarPatientsProInfo = entries(item[2]['similar_PRO']);

      this.setOrderScale();
      this.targetPatientOrders = item[2]['pat_Orders'][item[0]].slice();
      
      let filteredorders = this.orderHierarchy(this.targetPatientOrders);

      this.drawPatOrderRects(this.targetPatientOrders);
      this.drawPatOrderRects(filteredorders.medicationGroup);
     // this.drawPatOrderRects(filteredorders.procedureGroup);
    
    });

    // item: pat_id, DATA
    events.on('update_all_info', (evt, item) => {  // called in query box
      this.targetPatientProInfo = item[1]['PRO'][item[0]];
      this.similarPatientsProInfo = [];

      this.setOrderScale();

     // this.drawPatOrderRects(this.targetPatientOrders);
  
    });


  }

 
 
  private assignCurrentName (d) {
          
         
          if (this.currentlySelectedName != undefined){
            this.currentlySelectedName = undefined;
          }
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

        //console.log(nestedData);

        this.svg.select('#pat_orders').selectAll('g').remove();


        this.svg.select('#pat_orders')
            .append('g')
            .attr('transform', () => {
                return `translate(${this.margin.left},0)`; // If there is a label for the x-axis change 0
            })
            .selectAll('.patOrder')
            .data(nestedData)
            .enter()
            .append('g')
            .attr('transform', (d) => `translate(0,${this.rectBoxDimension.height - 50})`)
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
                        .attr('x1', self.timeScale(d['diff']) + self.margin.left)
                        .attr('x2', self.timeScale(d['diff']) + self.margin.left)
                        .attr('y1', self.scoreScale(100) + self.margin.left)
                        .attr('y2', self.scoreScale(0) + self.margin.left)
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
            .attr('height', this.rectBoxDimension.height - 50 + this.timeScale(25) * maxLength);


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

   public async loadDataFromServer() {
     
   
    console.log('Loading Data from the a Server');
    // listData() returns a list of all datasets loaded by the server
    // notice the await keyword - you'll see an explanation below
    const allDatasets = await listData();
    //console.log('All loaded datasets:');
    console.log(allDatasets);
     // we could use those dataset to filter them based on their description and pick the one(s) we're interested in
    // here we pick the first dataset and cast it to ITable - by default the datasets are returned as IDataType
    let tempTable: ITable;
    let orderArray = [];
    // retrieving a dataset by name. Note that only the first dataset will be returned.
    tempTable = <ITable> await getById('Orders');
   
    let tempVector = await tempTable.cols()[5].data();
    console.log(tempVector);
    //console.log(this.currentlySelectedName);

   }

/*
 const url = `/data_api/getSimilarRows/${value}/${n}/${this.dataset}`;
            this.setBusy(true);
            this.getData(url).then((args) => {
                this.setBusy(false);
                this.similarArgs = args;*/

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

export function create(parent:Element) {
  return new patOrderBreakdown(parent);
}

