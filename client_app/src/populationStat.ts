/**
 * Created by Jen on 1/12/17.
 */

import * as ajax from 'phovea_core/src/ajax';
import {BaseType, select, selectAll, event} from 'd3-selection';
import {nest, values, keys, map, entries} from 'd3-collection'
import * as events from 'phovea_core/src/event';
import {scaleLinear, scaleTime, scaleOrdinal} from 'd3-scale';
import {line, curveMonotoneX} from 'd3-shape';
import {timeParse} from 'd3-time-format';
import {extent, min, max, ascending, histogram, mean, deviation} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {drag} from 'd3-drag';
import { format } from 'd3-format';
import {transition} from 'd3-transition';
import * as distributionDiagram from './distributionDiagram';

export class populationStat {

    private $node;
    private icdObjects;
    private cptObjects;

    constructor(parent: Element) {

        this.$node = select(parent);

        const distributions = this.$node.append('div').classed('distributions', true);
        distributionDiagram.create(distributions.node());

        this.attachListener();
        


    }

    private attachListener() {  

       // events.on('')


    }

}

export function create(parent: Element) {
    return new populationStat(parent);
}