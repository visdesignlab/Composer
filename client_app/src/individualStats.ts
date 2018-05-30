/**
 * Created by Jen on 1/19/2018.
 */

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll, event} from 'd3-selection';
import {values,keys,entries} from 'd3-collection';
import {type} from 'os';
import * as events from 'phovea_core/src/event';
//import {transition} from 'd3-transition';
//import {Constants} from './constants';
import * as parallel from './parallel';
import {scaleLinear,scaleTime,scaleOrdinal, scaleBand} from 'd3-scale';
//importing other modules from app
import * as demoGraph from './demoGraphs';
import * as d3 from 'd3';
import {extent, min, max, ascending} from 'd3-array';
import {axisBottom,axisLeft} from 'd3-axis';
import {transition} from 'd3-transition';

export class individualStats {

    private $node;
    private statWin;
    private rectWin;
    private timeScale;
    private rectBoxDimension;
    private rectSvg;

    constructor(parent: Element) {

        this.$node = select(parent)
        .append('div')
        .classed('individualStatWrapper', true);

        this.rectWin = this.$node.append('div').classed('patientCPTOrders', true);
        this.statWin = this.$node.append('div').classed('patientPromisOrders', true);
       

        this.rectBoxDimension = {'width' : 720, 'height': 200};

        this.timeScale = scaleLinear()
        .range([0, this.rectBoxDimension.width])
        .clamp(true);

        this.rectSvg = this.rectWin.append('svg')
        .attr('width', this.rectBoxDimension.width)
        .attr('height', this.rectBoxDimension.height);

        this.attachListener();


    }

    private attachListener () {
        events.on('chosen_pat_cpt', (evt, item)=> {
            console.log(item);
            this.rectSvg.selectAll('.rect_group').remove();
            this.drawPatRects(item);
        });

        events.on('line_clicked', (evt, item)=> {
           // this.drawOrderWin(item);
        });
        events.on('line_unclicked', (evt, item)=>{
           // console.log('item');
            this.statWin.select('.'+ [item.key]).remove();
        });

    }

    private drawOrderWin(orders){

        let statArray = [];
        let patBox = this.statWin.append('div').attr('class', orders.key).classed('patBox', true);
        patBox.append('div').classed('patLabel', true).append('text').text('ID :   '+ orders.key).append('br');
        patBox.append('br').append('br');


        orders.forEach((d, i) => {
            let div = patBox.append('div').classed('order' + (i + 1) + " ' ", true);
    
            div.append('text').text('Date :   '+ d.ASSESSMENT_START_DTM);
            div.append('br');
            
            div.append('text').text('Score :   '+ d.SCORE);
            div.append('br');
            div.append('br');
        });
       
    }

    private drawPatRects(orders) {
    
        this.timeScale.domain([-100, 100]);
        let patGroup = this.rectSvg.selectAll('.rect_group').data(orders);

        patGroup.exit().remove();
        
        let patGroupEnter = patGroup.enter()
        .append('g').classed('rect_group', true);

        patGroup = patGroupEnter.merge(patGroup);

        patGroup
        .attr('transform', 
        (d, i) => `translate(0,${(i * 26)})`);

        let patGroupText = patGroupEnter
        .append('text').text(d=>d[0].key)
        .attr('transform', `translate(0,10)`);

        let patInnerGroup = patGroupEnter.append('g')
        .classed('patInnerGroup', true)
        .attr('transform', 'translate(70, 0)');

        let rectGroup = patGroup.select('.patInnerGroup')
        .selectAll('.visitDays')
        .data(d => d);

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
        .attr('width', 10)
        .attr('height', 25)
    
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
        let parentData = select(this.parentNode);
        console.log(parentData);

    });
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
     // return d > 10020 && d < 69991
     return d == 63030;
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



    }

    private renderOrdersTooltip(tooltip_data) {
        let text
        text = tooltip_data;
        
        /*
    if(tooltip_data['CPT_1'] !== 0){text = "<strong style='color:darkslateblue'>" + tooltip_data['CPT_1'] + "</strong></br>";}
        if(tooltip_data['CPT_2'] !== 0){text += "<span>" + tooltip_data['CPT_2'] + "</span></br>"; }
      */
        return text;
      }

}

export function create(parent:Element) {
    return new individualStats(parent);
  }