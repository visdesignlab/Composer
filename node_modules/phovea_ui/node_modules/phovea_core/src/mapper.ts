/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 24.09.2014.
 * @deprecated isn't it obsolete to idtype functions?
 */
import {argList} from './index';
import {getAPIJSON} from './ajax';
import {IDType} from './idtype';
import {Range, is as isRange, parse, list as rlist} from './range';

export interface IIDMapper {
  (...id:number[]) : Promise<Range>;
  (range:Range) : Promise<Range>;
  (id:number[]) : Promise<Range>;
}

export function map(source:IDType, target:IDType) : IIDMapper;
export function map(source:IDType, target:IDType, id:number, ...ids:number[]) : Promise<Range>;
export function map(source:IDType, target:IDType, range:Range) : Promise<Range>;
export function map(source:IDType, target:IDType, id:number[]) : Promise<Range>;

export function map(source:IDType, target:IDType) : any {
  var that = this;
  if (arguments.length === 2) {
    //return a mapper
    return function() {
      var args = argList(arguments);
      args.unshift(target);
      args.unshift(source);
      return map.apply(that, args);
    };
  }
  var args = argList(arguments);
  args.shift(); //source
  args.shift(); //target
  var id = args.shift(), range;
  //check type and create a range out of it
  if (Array.isArray(id)) {
    range = rlist(<number[]>id);
  } else if (isRange(id)) {
    range = <Range>id;
  } else {
    args.unshift(id);
    range = rlist(<number[]>args);
  }
  return mapImpl(source, target, range);
}

//TODO convert to Map
var cache : {[key:string] : Promise<Range> } = {};

function mapImpl(source:IDType, target:IDType, range:Range) {
  var key = source.toString()+'->'+target.toString()+':'+range.toString();
  if (cache.hasOwnProperty(key)) {
    return cache[key];
  }

  //TODO clear old cache entries

  var r = getAPIJSON('/mapper/map',{
    source: source.toString(),
    target: target.toString(),
    range: range.toString()
  }).then((data) => {
    return parse(data.range);
  });
  cache[key] = r;
  return r;
}
