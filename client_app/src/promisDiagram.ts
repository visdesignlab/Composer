
import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll, event} from 'd3-selection';
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal} from 'd3-scale';
import {area, line, curveMonotoneX, curveLinear, curveMonotoneY} from 'd3-shape';
import {extent, min, max, ascending} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import * as d3 from 'd3';
import * as d3Voronoi from 'd3-voronoi';
import {brushX} from 'd3-brush';
import * as dataCalc from './dataCalculations';
import * as IndividualStats from './individualStats';


export class PromisDiagram {
    private $this;
    private diagram;
    private timeScale;
    private timelineScale;
    scoreScale;
    svg;
    private brush;
    private findMinDate = dataCalc.findMinDate;//function for calculating the minDate for given patient record
    private parseTime = dataCalc.parseTime;
    private setOrderScale = dataCalc.setOrderScale;
    private getClassAssignment = dataCalc.getClassAssignment;
    private orderHierarchy = dataCalc.orderHierarchy;
    private clicked;
    private cohortIndex;
    private plotData;
    individualStats;
    private maxDay;
    private minDay = 0;

    height;
    width;
    margin;

    private sliderWidth = 10;
    private lineScale;
    private lineOpacity;
    private scaleRelative = false;
    private clumped = false;
    private yBrushSelection = false;
    private cohortLabel;
    private domain;
    private scoreGroup;
    private plotLabel;
    private plotHeader;
    private panelWidth;
    private headerToggle;
    private switchUl;
    private allData;

    constructor(parent: Element, diagram, index, domain, dimension, plotData, allData) {

        const that = this;
        this.$this = select(parent);
        this.panelWidth = 700;
        this.cohortIndex = String(index);
        this.diagram = diagram;
        this.domain = domain;
        this.width = dimension.width;
        this.height = dimension.height;
        this.margin = dimension.margin;
        this.plotData = plotData;
        this.allData = allData;

        let plotPanel = this.$this.append('div').classed('plot-' + index, true).classed('panel', true).classed('panel-default', true).style('width', '650px').style('height', '550px');
        this.plotHeader =  plotPanel.append('div').classed('panel-heading', true).style('height', '45px');
        let headText = this.plotHeader.append('div').classed('plot_head', true).append('text').text('Plot ' + (index + 1));
        headText.on('click', (d)=> {
            events.fire('plot_selected', this.cohortIndex);
        });

        plotPanel.on('mouseenter', (d)=>{
            events.fire('plot_selected', this.cohortIndex);
        });
        let headToggle = this.plotHeader.append('div').classed('plot_toggle', true);
        this.headerToggle = headToggle.append('div').classed('btn-group', true);
        this.headerToggle.append('button').classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                                .append('text').text('COHORT TEST');
        let startTogglebutton =  this.headerToggle.append('button')
                                    .classed('btn', true).classed('btn-primary', true).classed('btn-sm', true)
                                    .classed('dropdown-toggle', true)
                                    .attr('data-toggle', 'dropdown');
        startTogglebutton.append('span').classed('caret', true);

        this.switchUl =  this.headerToggle.append('ul').classed('dropdown-menu', true).attr('role', 'menu');

        let remove = this.plotHeader.append('div').classed('header_x', true).append('svg').attr('width', 25).attr('height', 25).append('g').classed('x', true);
        remove.append('rect').style('fill', 'gray').style('width', '20px').attr('height', 20).style('opacity', '.7');

        let x = remove.append('text').text('x').classed('x', true).attr('transform', 'translate(7, 14)');
        remove.on('click', function(d, i){
         events.fire('remove_plot', index);
        });

        let panelBody = plotPanel.append('div').classed('panel-body', true);

        let plotDiv = panelBody.append('div')
        .classed('diagramDiv', true)
        .classed('p-'+index, true);

          // scales
        this.timeScale = scaleLinear()
          .range([0,  this.width - (this.margin.x * 2)]);
        this.timelineScale = scaleLinear()
            .domain([-300, 1251])
            .range([0, this.width - this.margin.x]).clamp(true);

        this.scoreScale = scaleLinear()
            .domain([80, 0])
            .range([0,  this.height - (this.margin.y * 2)]);//.clamp(true);

        this.lineScale = scaleLinear()
            .domain([1, 6071])
            .range([1, .2])//.clamp(true);

        this.lineOpacity = scaleLinear()
            .domain([1, 6071])
            .range([.8, .2]);//.clamp(true);

        this.svg = plotDiv.append('svg').classed('svg-' + this.cohortIndex, true)
            .attr('height',  this.height + (this.margin.y * 2))
            .attr('width',  this.width + (this.margin.x * 2));

        this.scoreGroup = this.svg.append('g').classed('scoreGroup-'+ this.cohortIndex, true).attr('transform', `translate(${( this.margin.x / 2)},${ this.margin.y})`);
        let voronoiGroup = this.scoreGroup.append('g').classed('voronoi', true);

        let lineGroup = this.scoreGroup.append('g').classed('lines', true);

        // axis
        this.scoreGroup.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(${ this.margin.x}, ${ (this.height - this.margin.y)})`);

        this.scoreGroup.append('g')
            .attr('class', 'yAxis')
            .attr('transform', `translate(${( this.margin.x)},${ this.margin.y})`);

        this.scoreGroup.append('g')
            .attr('class', 'grid').attr('transform', () => `translate(`+ (this.margin.x) +`,`+ (this.margin.y) +`)`)
            .call(axisLeft(this.scoreScale)
                .tickSize(-( this.width -  this.margin.x))
            )
            .selectAll('text').remove();

        this.plotLabel = this.scoreGroup.append('text');
        this.drawPromisChart(plotData.promis, 'proLine', null, plotData, allData);
        this.drawTimeline(plotDiv);
        this.individualStats = IndividualStats.create(plotDiv.node(), this.domain);
        plotDiv.append('Div').classed('cptDiv', true);

    }

    /**
     * Get the data via API
     * @param URL
     * @returns {Promise<any>}
     */
    private async getData(URL) {
        return await ajax.getAPIJSON(URL);
    }

    private clearDiagram() {

        select('.scoreGroup-'+  this.cohortIndex).select('.lines').selectAll('*').remove();
        // this.svg.select('.scoreGroup-'+ this.cohortIndex).select('.proLine').selectAll('*').remove();
        select('.scoreGroup-'+  this.cohortIndex).selectAll('.zeroLine').remove();
        select('.scoreGroup-'+  this.cohortIndex).select('.voronoi').selectAll('*').remove();
        select('.scoreGroup-'+  this.cohortIndex).selectAll('#clip').remove();
      
         let aggline =  select('.scoreGroup-'+  this.cohortIndex);
         aggline.selectAll('.middle').remove();
         aggline.selectAll('.top').remove();
         aggline.selectAll('.bottom').remove();
         aggline.selectAll('.layer-0').remove();
         aggline.selectAll('.layer-1').remove();
         aggline.selectAll('.layer-2').remove();
         aggline.selectAll('.layer-3').remove();
         aggline.select('.avLine').remove();
         aggline.select('.avLine_all').remove();
         aggline.select('.avLine_top').remove();
         aggline.select('.avLine_middle').remove();
         aggline.select('.avLine_bottom').remove();
         aggline.select('.stLine').remove();
         aggline.selectAll('.stLine_all').remove();
         aggline.selectAll('.stLine_top').remove();
         aggline.selectAll('.stLine_middle').remove();
         aggline.selectAll('.stLine_bottom').remove();
         aggline.selectAll('.qLine').remove();
         aggline.selectAll('.qLine_all').remove();
         aggline.selectAll('.qLine_top').remove();
         aggline.selectAll('.qLine_middle').remove();
         aggline.selectAll('.qLine_bottom').remove();
      }

    private async drawPromisChart(promis, clump, i, cohort, flatData) {
        
       // let flatData = await flatten(data);

        let eventLabels = this.switchUl.selectAll('li').data(flatData);
        eventLabels.exit().remove();
        let eventEnter = eventLabels.enter().append('li').append('text').text(d=> d.label);
        eventLabels = eventEnter.merge(eventLabels);
    
        this.headerToggle.select('text').text(cohort.label);
    
        eventLabels.on('click', (d, i)=> {
            events.fire('cohort_selected', d);
        });
    
        let scaleRelative = cohort.scaleR;
        let clumped = cohort.clumped;
        let separated = cohort.separated;
        let cohortName = cohort.label;
        let zeroEvent;
        let scoreScale = this.scoreScale;
        let svg = this.svg;
        let index = this.cohortIndex;
        let diagram = promis[0].value[0]['FORM'];
        this.diagram = promis[0].value[0]['FORM'];
     
        let formatPercent = d3.format(".0%");
        this.plotLabel
        .text(`${this.diagram}`)
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${this.margin.x/2.5},${this.height/2}) rotate(-90)`);
    
        let test = promis.map(p=> p.value);
        if(cohort.startEvent == null){ zeroEvent = 'First Promis Score';
        }else{
            zeroEvent = cohort.startEvent[1];
        }
    
        if(scaleRelative){
            scoreScale.domain([30, -30]);
         }else{ 
            if(cohort.dataType == 'oswestry'){ scoreScale.domain([100, 0])
            }else{  scoreScale.domain([80, 0]); }
         }

       let minDay = this.domain[0];
       let maxDay = this.domain[1];
      
       
       svg.select('.voronoi').selectAll('*').remove();
    
       const promisScoreGroup = svg.select('.scoreGroup-'+ index);//.attr('transform', () => `translate(${this.margin.x},${this.margin.y})`);
    
       if(scaleRelative){
               let zeroLine = promisScoreGroup.append('g').classed('zeroLine', true)
               .attr('transform', () => `translate(${this.margin.x},${this.margin.y})`);
               zeroLine.append('line')
                       .attr('x1', 0).attr('x2', this.width)
                       .attr('y1', scoreScale(0)).attr('y2', scoreScale(0)).attr('stroke-width', .5)
                       .attr('stroke', '#E67E22');
       }
    
       let lineCount = promis.length;
         
       let co = promis.filter(g=> {return g.value.length > 1; });
    
       let similarData = co.map((d) => {
               let data = {key: d.key, value: null, line: null, fakeArray: []};
               let res = d.value;
             //  let res = d.value.filter((g) => {//this is redundant for now because promis physical function already filtered
               //return g['FORM'] == this.diagram;
             //  });
               res.sort((a, b) => ascending(a.diff, b.diff));
               res.forEach(r=> r.maxday = d.days);
               res = res.map((r, i)=> {return {
                                           PAT_ID: r.PAT_ID,
                                           diff: +r.diff,
                                           SCORE: r.SCORE,
                                           relScore: r.relScore,
                                           ogScore : r.ogScore,
                                           pat : data
                                           };
                                       });
               data.value = res;
               return data;
           });
    
        function vorline(d) { return d ? 'M' + d.join('L') + 'Z' : null; };
         
           // -----  set domain and axis
           // time scale
            this.timeScale.domain([minDay, maxDay]);
    
            svg.select('.xAxis')
                .call(axisBottom(this.timeScale));
    
            if(cohort.dataType == 'oswestry'){ 
                svg.select('.yAxis')
                .call(axisLeft(scoreScale).tickFormat(d => d + "%"));
              
            }else{
                svg.select('.yAxis')
                .call(axisLeft(scoreScale));
            }
            // -------  define line function
            const lineFunc = line()
                .curve(curveLinear)
                .x((d) => { return this.timeScale(+d['diff']); })
                .y((d) => { 
                    if(scaleRelative){  return scoreScale(+d['relScore']);
                    }else{ return scoreScale(+d['SCORE']); }
                });
    
           // ------- draw
          // const promisScoreGroup = this.svg.select('.scoreGroup');
           promisScoreGroup.append('clipPath').attr('id', 'clip')
           .append('rect')
           .attr('width', this.width - this.margin.x)
           .attr('height', this.height);
    
           let that = this;
    
           let voronoiGroup = svg.select('.voronoi')
               .attr('transform', () => {
                   return `translate(${this.margin.x},${this.margin.y})`;
               });
    
            let lines = promisScoreGroup.select('.lines')
                   .attr('transform', () => { return `translate(${this.margin.x},${this.margin.y})`; })   
                   .attr('clip-path','url(#clip)')
                    .selectAll('.'+ clump)
                    .data(similarData);
    
            lines.exit().remove();
    
            let lineEnter = lines
                       .enter().append('g').attr('class', d=> d['key'])
                       .classed(clump, true);
    
            lines = lineEnter.merge(lines);
    
            lines.append('path')
                .attr('class', d=> d['key'])
                .classed(clump, true)
                .attr('stroke-width', this.lineScale(lineCount))
                .attr('stroke-opacity', this.lineScale(lineCount))
                .attr('d', function (d) {
                            d['line'] = this;
                            return lineFunc(d.value);})
                .on('click', function (d) { voronoiClicked(d); } )
                .on('mouseover', (d)=> addPromisDotsHover(d, scaleRelative))
                .on('mouseout', (d)=> removeDots());
    
               if(promis.length < 500) { 
                   if(clump == 'proLine') {
                       let fakePatArray = [];
                       lines.select('path').nodes().forEach((l, i) => {
                           let fakeArray = [];
                           let bins = Math.floor(l.getTotalLength()/25);
    
                           for(let i = 0; i < bins; i++) {
                               let p = l.getPointAtLength(i * 25);
                               fakeArray.push({x: p.x, y: p.y, pat: l.__data__});
                           }
                         
                           similarData[i].fakeArray = fakeArray;
                       });
    
                    let voronoi = d3Voronoi.voronoi()
                       .x((d, i) => { return d.x })
                       .y((d, i) => { return d.y })
                       .extent([[0, 0], [this.width, 350]]);
    
                    voronoiGroup.selectAll('g')
                       .data(voronoi.polygons(d3.merge(similarData.map(function(d) { 
                           return d.fakeArray; }))))
    
                           .enter().append('g')
                           .append('path')
                           .attr('d', function(d,i){return d ? 'M' + d.join('L') + 'Z' : null;})
                           .attr("class", function(d,i) { return "voronoi-" + i; })
                           .style("fill", "none")
                           .style('pointer-events', 'all')
                           .on('mouseover', mouseover)
                           .on('mouseout', mouseout)
                           .on('click', (d)=>  voronoiClicked(d.data.pat));
                   }
    }
                let zeroLine = promisScoreGroup.append('g').classed('zeroLine', true)
                   .attr('transform', () => `translate(${this.margin.x},${this.margin.y})`);
    
                zeroLine.append('line')
                   .attr('x1', this.timeScale(0)).attr('x2', this.timeScale(0))
                   .attr('y1', 0).attr('y2', this.height - this.margin.y).attr('stroke-width', .5).attr('stroke', '#E67E22');
    
                let zeroText = zeroLine.append('text').text(zeroEvent).attr('x', this.timeScale(0));
    
                if(i != null){
                zeroText.attr('transform', 'translate(0,'+ i * 12 +')').classed(clump, true);
                }
    
                function mouseover(d) {
                   let group = d.data.pat.line;
                   select(group).classed('hover-selected', true);
                }
               
                function mouseout(d) {
                   let group = d.data.pat.line;
                   select(group).classed('hover-selected', false);
                }
    
                function voronoiClicked(d) {
         
                   let line = d.line;
                   if(line.classList.contains('selected')) {
                       line.classList.remove('selected');
                       let dots = document.getElementsByClassName([d.key] + '-clickdots');
                       for (var i = dots.length; i--; ) {
                           dots[i].remove();
                        }
                      events.fire('line_unclicked', d);
                    }else {
                       line.classList.add('selected');
                       addPromisDotsClick(d, scaleRelative);
                       events.fire('line_clicked', d);
                    };
    
                    let lines = svg.select('.lines').selectAll('.selected').nodes();
                    
                    let idarray = [];
                    lines.forEach(element => { idarray.push(+element.__data__.key); });
                    events.fire('selected_line_array', idarray);
    
                   }
    
                function addPromisDotsHover (d, scale) {
    
                    let promisData = d;
             
                    let promisRect = svg.select('.scoreGroup').select('.lines');
                    let dots = promisRect
                    .selectAll('circle').data(promisData);
                    let dotsEnter = dots.enter().append('circle')
                    .attr('class', 'hoverdots')
                    .attr('cx', (d, i)=> this.timeScale(d.diff))
                    .attr('cy', (d)=> {
                        let score; 
                        if(scale){
                            score = d.relScore;
                        }else{  score = d.SCORE; }
                        return this.scoreScale(score);
                    }).attr('r', 5).attr('fill', '#21618C');
                    dots = dotsEnter.merge(dots);
             
                    dots.append('circle').attr('cx', ()=> this.timeScale(0))
                    .attr('cy', (d)=> this.scoreScale(d.b[0])).attr('r', 5).attr('fill', 'red');
             
             }
             
            function addPromisDotsClick (d, scale) {
             
                let n = select(d.line).node();
                let parent = n.parentNode;
        
                let promisData = d.value;
               
                let dots = select(parent)
                .selectAll('circle').data(d.value);
                let dotsEnter = dots.enter().append('circle').attr('class', d.key + '-clickdots')
                .classed('clickdots', true)
                .attr('cx', (d, i)=> {
                    return that.timeScale(d['diff'])})
                .attr('cy', (d)=> {
                    if(scale){  return that.scoreScale(+d['relScore']);
                            }else{ return that.scoreScale(+d['SCORE']) }
                }).attr('r', 5).attr('fill', '#FF5733');
             dots = dotsEnter.merge(dots);
             }
             
             function removeDots () {
                selectAll('.hoverdots').remove();
             }
             
                /**
             * Utility method
             * @param start
             * @param end
             */
            function updateSlider(start, end, cohortIndex) {
             
                let lowScore = this.scoreScale.invert(end);
                let highScore = this.scoreScale.invert(start);
             
                let med = this.svg.select('.scoreGroup-'+ cohortIndex)
                    .selectAll('path')
                    .style('opacity', 0);
             
                med.filter(function (d) {
                    if (!d.length) return false;
                    return d[0].SCORE <= highScore && d[0].SCORE >= lowScore;
                }).style('opacity', 1);
             }
    
       }

       private async drawAgg(chartData, clump, i, cohort){
      
        let patbin = chartData.map((d)=> d.bins.map(b=> {
            if(cohort.scaleR){
                if(b.y == null){ 
                    return {x: b.x, y: null };
                 }else{
                    return {x: b.x, y: b.y - d.b };
                 }
                
            }else{
                return {x: b.x, y: b.y };
            }
        }));

        let medianArray = [];
        let devs = [];

        let zeroEvent;
        
        if(cohort.startEvent == null){ zeroEvent = 'First Promis Score';
       }else{
           zeroEvent = cohort.startEvent[1];
       }
            
        for(let i = 0; i < patbin[0].length; i++){
            let bin = patbin.map(d => d[i].y);
        
           // let mean = d3.mean(patbin.map(d => d[i].y));
            let med = d3.median(patbin.map(d => d[i].y));
      
            let x = d3.mean(patbin.map(d => d[i].x));
    
            let dev =  d3.deviation(patbin.map(d => d[i].y));

            medianArray.push([x, med]);
            devs.push(dev);
        }

        let botdev = medianArray.map((d, i)=> {
            let y = d[1] - devs[i];
            let x = d[0];
            return [x, y];
        });
    
        let topdev = medianArray.map((d, i)=> {
            let y = d[1] + devs[i];
            let x = d[0];
            return [x, y];
        });
    
        let quart = medianArray.map((d, i)=> {
            let x = d[0];
            let y1 = d[1] + devs[i];
            let y2 = d[1] - devs[i];
            return [x, y1, y2];
        });
    
            quart[0] = [medianArray[0][0], quart[1][1], quart[1][2]];
            let quart2 = [];
             
            quart.forEach(d=> {
                let arr = [];
                d.forEach(q=> {
                    //let val = [];
                    if (isNaN(q)) {
                        if(cohort.scaleR){ arr.push(null); }else{ arr.push(null); }
                      }else{arr.push(q); }
                });
                quart2.push(arr);
            });
    
             botdev[0] = [medianArray[0][0], botdev[1][1]];
             let botdev2 = [];
             
            botdev.forEach(d=> {
    
                let arr = [];
                d.forEach(q=> {
                    //let val = [];
                    if (isNaN(q)) {
                        if(cohort.scaleR){ arr.push(null); }else{ arr.push(null); }
                       
                      }else{arr.push(q); }
                });
                botdev2.push(arr);
            });
    
            topdev[0] = [medianArray[0][0], topdev[1][1]];
    
            let topdev2 = [];
             
            topdev.forEach(d=> {
                let arr = [];
                d.forEach(q=> {
                    //let val = [];
                    if (isNaN(q)) {
                        if(cohort.scaleR){ arr.push(null); }else{ arr.push(null); }
                      }else{ arr.push(q); }
                });
                topdev2.push(arr);
            });
    
            let lineCount = cohort.length;
            botdev2 = botdev2.filter(m=> m[1] != null);
            topdev2 = topdev2.filter(m=> m[1] != null);
            quart2 = quart2.filter(m=> m[1] != null);
            let data = medianArray.filter(m=> m[1] != undefined);
      
            let scoreScale = this.scoreScale;

            if(cohort.scaleR){
                scoreScale.domain([30, -30]);
            }else{ 
        
                scoreScale.domain([80, 0]);
            }

            let minDay = this.domain[0];
            let maxDay = this.domain[1];

            // -----  set domain and axis
            // time scale
            this.timeScale.domain(this.domain);
    
            this.svg.select('.xAxis')
                .call(axisBottom(this.timeScale));
    
            this.svg.select('.yAxis')
                .call(axisLeft(scoreScale));

            // -------  define line function
            const lineFunc = line()
                .curve(curveLinear)
                .x((d, i) => { return this.timeScale(+d[0]); })
                .y((d) => { return scoreScale(+d[1]); });
    
            // -------- line function for quartiles 
            const drawPaths = area()
                  .x(d => { return this.timeScale(+d[0]); })
                  .y0(d => { return scoreScale(+d[2]); })
                  .y1(d => { return scoreScale(+d[1]); });
            
            // ------- draw
            const promisScoreGroup = this.svg.select('.scoreGroup-'+ this.cohortIndex);
    
            promisScoreGroup.append('clipPath').attr('id', 'clip')
            .append('rect')
            .attr('width', this.width - this.margin.x)
            .attr('height', this.height - this.margin.y);
    
            let group = promisScoreGroup.append('g').classed(clump, true);
    
                group
                .append('path')
                .classed('qLine', true)
                .classed(clump, true)
                .attr('clip-path','url(#clip)')
                .data([quart2])
                .attr('d', drawPaths)
                .attr('transform', () => {
                    return `translate(${this.margin.x},${this.margin.y})`;
                });
    
                group
                .append('path')
                .classed('avLine', true)
                .classed(clump, true)
                .attr('clip-path','url(#clip)')
                .data([data])
                .attr('d', lineFunc)
                .attr('transform', () => {
                    return `translate(${this.margin.x},${this.margin.y})`;
                });
    
                group
                .append('path')
                .classed('stLine', true)
                .classed(clump, true)
                .attr('clip-path','url(#clip)')
                .data([topdev2])
                .attr('d', lineFunc)
                .attr('transform', () => {
                    return `translate(${this.margin.x},${this.margin.y})`;
                });
    
                group
                .append('path')
                .classed('stLine', true)
                .classed(clump, true)
                .attr('clip-path','url(#clip)')
                .data([botdev2])
                .attr('d', lineFunc)
                .attr('transform', () => {
                    return `translate(${this.margin.x},${this.margin.y})`;
                });
    
                let zeroLine = promisScoreGroup.append('g').classed('zeroLine', true)
                .attr('transform', () => `translate(${this.margin.x},${this.margin.y})`);
    
                zeroLine.append('line')//.attr('class', 'myLine')
                        .attr('x1', this.timeScale(0)).attr('x2', this.timeScale(0))
                        .attr('y1', 0).attr('y2', this.height - this.margin.y).attr('stroke-width', .5).attr('stroke', '#E67E22');
               
                let zeroText = zeroLine.append('text').text(zeroEvent).attr('x', this.timeScale(0));

                if(i != null){
                zeroText.attr('transform', 'translate(0,'+ i * 12 +')').classed(clump, true);
                }
}

    private drawTimeline(div) {

        let timeline = div.append('div').classed('timeline_view', true).attr('width', this.width + (this.margin.y * 2)).attr('height', 30);
        let timelineSVG = timeline.append('svg').classed('day_line_svg', true).attr('width', this.width + this.margin.x).attr('height', 40);

        timelineSVG.append('g')
                        .attr('class', '.xAxisMini')
                        .attr('transform', () => `translate(`+ (this.margin.x * 1.5) +`,`+ (this.margin.y * 2.1) +`)`)
                        .call(axisBottom(this.timelineScale));

         // ----- SLIDER

        let slider = timelineSVG.append('g')
         .attr('class', 'slider').attr('transform', () => `translate(`+ (this.margin.x * 1.5) +`,`+ (this.margin.y * 2.1) +`)`)

        let that = this;

        this.brush = brushX()
        .extent([[0, -3], [this.width, 30]])
        .handleSize(2)
        .on("end", () => {
            if (event.selection === null) {

            } else {
              let start = this.timelineScale.invert(event.selection[0]);
              let end = this.timelineScale.invert(event.selection[1]);
              this.domain[0] = start;
              this.domain[1] = end;
              this.clearDiagram();
              this.drawPromisChart(this.plotData.chartData, 'proLine', null, this.plotData, this.allData);
            
             
              if(this.individualStats){
                this.individualStats.clearPatRects();
                
              }
              
            }
          });


        slider.call(this.brush)
         .call(this.brush.move, [this.timelineScale(-10), this.timelineScale(50)]);

    }

    private renderOrdersTooltip(tooltip_data) {

        let text = "<strong style='color:darkslateblue'>" + tooltip_data['ORDER_CATALOG_TYPE'] + "</strong></br>";
        text += '<span>' + tooltip_data['ORDER_MNEMONIC'] + '</span></br>';
        text += '<span>' + tooltip_data['ORDER_DTM'] + '</span></br>';
        return text;
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

export function create(parent: Element, diagram, index, domain, dimension, plotData, allData) {
    return new PromisDiagram(parent, diagram, index, domain, dimension, plotData, allData);
}