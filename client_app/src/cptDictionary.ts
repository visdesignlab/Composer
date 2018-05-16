/**
 * Created by Jen Rogers on 1/29/18.
 * data for the views.
 */
import * as ajax from 'phovea_core/src/ajax';
import {ITable, asTable} from 'phovea_core/src/table';
import {IAnyVector} from 'phovea_core/src/vector';
import {list as listData, getFirstByName, get as getById} from 'phovea_core/src/data';
import {tsv} from 'd3-request';
import {ICategoricalVector, INumericalVector} from 'phovea_core/src/vector/IVector';
import {VALUE_TYPE_CATEGORICAL, VALUE_TYPE_INT} from 'phovea_core/src/datatype';
import {range, list, join, Range, Range1D, all} from 'phovea_core/src/range';
import {asVector} from 'phovea_core/src/vector/Vector';
import {argFilter} from 'phovea_core/src/';
import * as events from 'phovea_core/src/event';
import {nest, values, keys, map, entries} from 'd3-collection';
import * as d3 from 'd3';
import { filteredOrders } from 'client_app/src/similarityScoreDiagram';
import * as dataCalculations from './dataCalculations';


export class CPTDictionary {
    public codeDict = {

        'PT' : {
            'physical therapy evaluation' : [97001, 97002],//combined eval and re eval. this should potentially be separate?
            'theraputic excercises' : [97110],
            'manual therapy' : [97140],
            'theraputic activities': [97530],
            'self-care': [97535],
            'home management training': [97535],
            'neuromuscular re-education': [97112],
            'aquatic therapy': [97113],
            'physical performance test': [97750],
            'physical performance measurement': [97750],
            'Extremity muscle testing': [95831],
            'trunk muscle testing': [95831]
        },

        'injection' : {
            'injection': [
                62310, 62312, 62313, 62314, 62315, 62316, 62317, 62318,
                62320, 62321, 62322, 62323, 62324, 62325, 62326, 62327
            ]
        },

        'surgery' : {
            'surgery': [63030],
        }
    }

}

  export function create() {
    return new CPTDictionary();
}
