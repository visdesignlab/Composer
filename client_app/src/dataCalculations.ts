/**
 * Created by Jen Rogers 07/20/2017.
 */

import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll, event} from 'd3-selection';
import {nest, values, keys, map, entries} from 'd3-collection'
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal} from 'd3-scale';
import {timeParse} from 'd3-time-format';
import {extent, min, max, ascending} from 'd3-array';
//import {Constants} from './constants';
import {axisBottom, axisLeft} from 'd3-axis';
import {transition} from 'd3-transition';
import * as d3 from 'd3';

/*
This is for calculations that I do repeatedly that I don't want to keep typing
*/

export class dataCalc {

    startDate;
    private filteredOrders;

    constructor(parent: Element) {

       // this.filteredOrders = this.getTargetPatient();
    }

}

 /**
     * Used in calc for pat promis scores
     * @param pat
     * @returns {Date}
     */
    export function findMinDate(pat) {

        let minDate = new Date();
        for (let index = 0; index < pat.length; index++) {
            if (!pat[index]['ASSESSMENT_START_DTM']) continue;
            if (this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null) < minDate)
                minDate = this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null)
        }
       
        return minDate
        
    }

    export function findMinDateCPT(pat) {
   
        let minDate = new Date();
        for (let index = 0; index < pat.length; index++) {
            if (!pat[index]['PROC_DTM']) continue;
            if (this.parseTime(pat[index]['PROC_DTM'], null) < minDate)
                minDate = this.parseTime(pat[index]['PROC_DTM'], null)
        }
        return minDate
    }

     /**
     * Used in calc for pat promis scores
     * @param pat
     * @returns {Date}
     */
    export function findMaxDate(pat) {

        let maxDate = this.parseTime(pat[0]['ASSESSMENT_START_DTM'], null);

        for (let index = 0; index < pat.length; index++) {
            if (!pat[index]['ASSESSMENT_START_DTM']) continue;
            if (this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null) > maxDate)
                maxDate = this.parseTime(pat[index]['ASSESSMENT_START_DTM'], null)
        }
       
        return maxDate
        
    }

    /**
     * filteres target patient orders into arrays 
     * @param ordersInfo
     */
    export function orderHierarchy(ordersInfo) {

    
      let filteredOrders = {
             procedureGroup : [],
             medicationGroup : [],
      }
      
        ordersInfo.forEach((d) => {
            
            if (d['ORDER_CATALOG_TYPE'] == 'PROCEDURE') {
                filteredOrders.procedureGroup.push(d);
               
            }else if(d['ORDER_CATALOG_TYPE'] == 'MEDICATION'){
                filteredOrders.medicationGroup.push(d);
               
            }else { console.log('type not found');  }
           
        });
        
       
        return filteredOrders;

    }


/**
     * parse time
     * @param date
     * @param nullDate
     * @returns {null}
     */
    export function parseTime(date, nullDate) {
        let parseT1 = timeParse('%x %X');
        let parseT2 = timeParse('%x');
        let time = nullDate;

        if (date) {
            if (date.split(' ').length > 1) {
                time = parseT1(date);
            }
            else
                time = parseT2(date)
        }
        //console.log(' :' + time);
        return time
    }
//get med and pro groups for target patient
        export function orderType(type) {
          
         let value = type;
    
        let dataset = 'selected';
   
        let targetOrder = value;
        const url = `/data_api/filteredOrderType/${dataset}/${targetOrder}`;
        // const url = `/data_api/filteredOrdersByMonth/${dataset}/${targetOrder}`;
         this.setBusy(true);
         this.getData(url).then((args) => {

        events.fire('find_order_type', [args]);
        this.setBusy(false);
        //console.log(args);
      
        events.fire('query_order_type', value);

      });
  }

/**
   * Draw the diagram with the given data from getSimilarRows
   * @param args
   */
  export function setOrderScale() {

 
    // find the max difference between the first patient visit and the last visit. 
    //This determines the domain scale of the graph.
    // ----- add diff days to the data

    let maxDiff = 0;

    let minPatDate = this.findMinDate(this.targetProInfo);
 
    this.startDate = "patient";
    events.fire('start_date_patient', minPatDate);

    //minPatDate is the first date of the target patient PROMIS records

    this.targetProInfo.forEach((d) => {
      d.diff = Math.ceil((this.parseTime(d['ASSESSMENT_START_DTM'], null).getTime() - minPatDate.getTime()) / (1000 * 60 * 60 * 24));
      maxDiff = d.diff > maxDiff ? d.diff : maxDiff
    });
    this.targetProInfo.sort((a, b) => ascending(a.diff, b.diff));

    const patData = this.targetProInfo.filter((d) => {
      return d['FORM'] == this.svg//changed to svg because I dont have a diagram
    });


    // -----  set domain for initial draw call
    this.timeScale.domain([-1, maxDiff]);
    if (this.timeScaleMini != null){
         this.timeScaleMini.domain([-1,maxDiff]);
    }

   
    events.on('brushed', (newMin, newMax) => {  // from brushed in rect exploration
    
   //------- set domain after brush event

    if (this.brush.move != null) {
      this.timeScale.domain([newMax[0], newMax[1]])
    }
    
    
    return this.timeScale.domain([newMax[0], newMax[1]]);
   
    });
    
    this.svg.select('.xAxis')
      .call(axisBottom(this.timeScale));

  }

  
//make this more generic
  export function reformatCPT(patProInfo, similarOrdersInfo) {

    let minDate = this.findMinDate(patProInfo);
              
    similarOrdersInfo.forEach((d) => {
        let time = this.parseTime(d['PROC_DTM'], minDate).getTime();
        d.diff = Math.ceil((time - minDate.getTime()) / (1000 * 60 * 60 * 24));
    });

    const self = this;

// ----- add diff days to the data

    let filteredOrders = [];
    similarOrdersInfo.forEach((g) => {

//g.array = [];

    if(g.value != null){
    let minDate = this.findMinDateCPT(g.value);
    }
    g.value.forEach((d) => {

    d.array = []; 
    d.time = d['PROC_DTM'];

    try {
        d.diff = Math.ceil((this.parseTime(d['PROC_DTM'], null).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
     
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

    filteredOrders.push(filter);
         
});

events.fire('cpt_filtered', filteredOrders);
this.filteredCPT = filteredOrders;
select('#pat_cpt').selectAll('.patCPTRecord').remove();
this.drawOrders(filteredOrders);
this.drawMiniRects(this.targetProInfo, filteredOrders);

 }
//Draw the CPT rects for the patients. This takes the filtered CPT that has been formatted
export function drawOrders (filteredCPT) {


    let patGroups = this.svg.select('#pat_cpt')
    .selectAll('.patCPTRecord')
    .data(filteredCPT);
    //.data(similarOrdersInfo);

let patGroupEnter = patGroups
    .enter()
    //.append('g').attr('class', d=>d[0].key)//.attr('class', d=> d.key);
    .append('g').attr('class', 'patCPTRecord')

   // patGroupEnter
   // .attr('transform', 
  //  (d, i) => `translate(0,${this.rectBoxDimension.height - 50 + (i + 1) * (this.similarBar.height + 5)})`);

    patGroups = patGroupEnter.merge(patGroups);
    patGroups.exit().remove();
/*
    patGroups
    .attr('transform', 
    (d, i) => `translate(0,${(i + 1) * (this.orderBar.height + 5)})`);
*/
let patInnerGroup = patGroupEnter.append('g')
    .classed('patInnerGroup', true)
   // .attr('transform', 'translate(60, 0)');

 let rectGroup = patGroups.select('.patInnerGroup')
    .selectAll('.visitDays')
    .data(d => d)     

let rectGroupEnter = rectGroup
    .enter()
    .append('g')

rectGroup = rectGroupEnter.merge(rectGroup);

rectGroup.exit().remove();

rectGroup.classed('visitDays', true)
 .attr('transform', (d) => `translate(`+ this.timeScale(d.diff) +`,0)`);

let rects = rectGroup.selectAll('rect')
      .data(d => d.value[0]);

let rectsEnter = rects
      .enter()
      .append('rect')
      .attr('class', d => d);

rects = rectsEnter.merge(rects);

rects.exit().remove();

rects
      .attr('y', 0)
      .attr('width', this.orderBar.width)
      .attr('height', this.orderBar.height)
   
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
    })
    .on('click', function (d) {
      console.log(d);
      let parentData = select(this.parentNode).data;
     console.log(parentData);
      
    });

 // this.svg.select('#similar_orders').selectAll('.similarRect')
    //  .append('text')
     // .text(filteredCPT.pat_id);

       /*
  Major categories for  CPT defined below and classes assigned:
  CPT Category 1: Evaluation and Management: 99201 – 99499
                  Anesthesia: 00100 – 01999; 99100 – 99140
                  Surgery: 10021 – 69990
                  Radiology: 70010 – 79999
                  Pathology and Laboratory: 80047 – 89398
                  Medicine: 90281 – 99199; 99500 – 99607
  */
  //Pathology and Laboratory: 80047 – 89398
  let pathologyLab = rects.filter(function(d){
    return d > 80046 && d < 89399;
});
//pathology lab class assigned to each rect with code in this range
let pathLabRects = pathologyLab.nodes();
pathLabRects.forEach(rect => rect.classList.add('pathology_lab'));


//Medicine: 90281 – 99199; 99500 – 99607
let medicine = rects.filter((d)=>  {
    return d > 90280 && d < 99200 || d > 99499 && d < 99608; 
});
//class assigned to each rect with code in this range
let medRects = pathologyLab.nodes();
medRects.forEach(rect => rect.classList.add('medicine'));


//Evaluation and Management: 99201 – 99499
let evaluationFilter = rects.filter((d)=>  {
    return (d > 99200 && d < 99500) || d == 96150 || d == 96118;
});
//class assigned to each rect with code in this range
let evalRects = evaluationFilter.nodes();
evalRects.forEach(rect => rect.classList.add('evaluation'));


// Anesthesia: 00100 – 01999; 99100 – 99140.
let anesthesia = rects.filter((d)=>  {
    return (d > 99 && d < 2000) || (d > 99099 && d < 99141);
}); 
//class assigned to each rect with code in this range
let anesthesiaRects = anesthesia.nodes();
anesthesiaRects.forEach(rect => {rect.classList.add('anesthesia')});


// Surgery: 10021 – 69990.
let surgery = rects.filter((d)=>  {
    return d > 10020 && d < 69991
});   
//class assigned to each rect with code in this range
let surgeryRects = surgery.nodes();
surgeryRects.forEach(rect => rect.classList.add('surgery'));


// Radiology: 70010 – 79999.
let radiology = rects.filter((d)=>  {
    return (d > 70010 && d < 79999) || d == 93970;
}); 
//class assigned to each rect with code in this range
let radiologyRects = radiology.nodes();
radiologyRects.forEach(rect => rect.classList.add('radiology'));

 /*
Secondary categories for CPT defined below and classes assigned:
CPT group 2: Nerve Conduction
             Physical Therapy
             Injections
*/
let biopsy = rects.filter((d)=> {
    return d == 'G0364'; 
});

let biopsyRects = biopsy.nodes();
biopsyRects.forEach(rect => rect.classList.add('biopsy'));

let chiropractor = rects.filter((d)=>  {
    return d  == 97140 || d == 97012;
});
let chiropractorRects = chiropractor.nodes();
chiropractorRects.forEach(rect => rect.classList.add('chiropractor'));

let ecg_ekg = rects.filter((d)=> {
    return d > 92999 && d < 93011;
});
let ecgRects = ecg_ekg.nodes();
ecgRects.forEach(rect => rect.classList.add('ecg_ekg'));


//95860-95872, 95885-95887
let emg = rects.filter((d)=> {
    return (d > 95859 && d < 95873) || (d > 95884 && d < 95888);
});
let emgRects = emg.nodes();
emgRects.forEach(rect => rect.classList.add('emg'));


 //93350 - 93351, 93303 - 93308, 93312- 93317, 93320 - 93321, 93325
 let echocardiography = rects.filter((d)=> {
    return (d > 93349 && d < 93352) || (d > 93302 && d < 93309) || (d > 93311 && d < 93318) || 
            d == 93320 || d == 93321 || d == 93325;
});
let echocardiographyRects = echocardiography.nodes();
echocardiographyRects.forEach(rect => rect.classList.add('echocardiography'));


//gynechology 
let gyn = rects.filter((d)=> {
    return d == 'Q0091' || d == 93325;
});
let gynRects = gyn.nodes();
gynRects.forEach(rect => rect.classList.add('gynecologic'));


let electricalStimulation = rects.filter((d)=> {
    return d == 'G0283' || d == 97110;
});
let elStimRects = electricalStimulation.nodes();
elStimRects.forEach(rect => rect.classList.add('electrical_stimulation'));


let mammography = rects.filter((d)=>  {
    return d  == "G0204" || d == "G0202" || d == "G0206";
});
let mammographyRects = mammography.nodes();
mammographyRects.forEach(rect => rect.classList.add('mammography'));


let nerveConduction = rects.filter((d)=> {
    return d == 95908 || d == 95909;
});
let nerveRects = nerveConduction.nodes();
nerveRects.forEach(rect => rect.classList.add('nerve_conduction'));


let pulmonary = rects.filter((d)=> {
    return d == 94060 || d == 94010 || d == 94640 || d == 94620 || d == 94729 || d == 94761;
});
let pulmonaryRects = pulmonary.nodes();
pulmonaryRects.forEach(rect => rect.classList.add('pulmonary'));


let postopVisit = rects.filter((d)=> {
    return d == 99024;
});
let postopVisitRects = postopVisit.nodes();
postopVisitRects.forEach(rect => rect.classList.add('postoperative_visit'));


//97001-97004 are the old codes
//97161- 97168 are the new codes
let physicalTherapy = rects.filter((d)=>  {
    return d  == 97110 || (d > 97000 && d < 97005) || (d > 97160 && d < 97169) || d == 97112 
        || d == 97010 || d == 97530 || d =="G8979" || d == "G8978";
});
let physicalTherapyRects = physicalTherapy.nodes();
physicalTherapyRects.forEach(rect => rect.classList.add('physical_therapy'));


let injection = rects.filter((d)=>  {
return d == 96365 || d == 96450 || d == 96372 || d == 96375 || d == 96374;
});
let injectionRects = injection.nodes();
injectionRects.forEach(rect => rect.classList.add('injection'));


let vaccine = rects.filter((d)=> {
    return d == 'G0008' || d == 'G0009' || d == 90688 || (d > 90475 && d < 90750) || (d > 90470 && d < 90475);
});
let vaccineRects = vaccine.nodes();
vaccineRects.forEach(rect => rect.classList.add('vaccine'));


let opthalmic = rects.filter((d)=> {
    return d == 92002 || d == 92136 || d == 92134 || d == 92004 || d == 92012 || d == 92014 || d == 92015
    || d == 99173;
});
let opthalmicRects = opthalmic.nodes();
opthalmicRects.forEach(rect => rect.classList.add('opthalmology'));


let oncology = rects.filter((d)=> {
    return d == 96413 || d == 96411 || d == 96417 || d == 96415;
});
let oncologyRects = oncology.nodes();
oncologyRects.forEach(rect => rect.classList.add('oncology'));

let other = rects.filter((d) => {
    return d == '4248F';
});
let otherRects = other.nodes();
otherRects.forEach(rect => rect.classList.add('other'));


//31579, 92520 - 92526
let slp = rects.filter((d)=> {
    return d == 31579 || (d > 92519 && d < 92527) || (d > 92507 && d < 92508) || d == 92511
        || d == 92597 || d == 92605 || d == 92618 || d == "G8999" || d == "G9186" || d == "G89158";
});
let slpRects = slp.nodes();
slpRects.forEach(rect => rect.classList.add('SLP'));

  // fix height of the svg
  this.svg
     .attr('height', this.rectBoxDimension.height + 50 + ((this.orderBar.height + 5) * filteredCPT.length));

}

  export function getClassAssignment (attString) {
      //this uses a work around to use a function with classed. As well it preserves the already assinged classes
        
        return function (d) { 
          let element = select(this);
          element.classed (d[attString], true);
          return element.attr('class');
        }

        
  }
