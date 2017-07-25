/**
 * Created by Samuel Gratzl on 27.12.2016.
 */

import Range from './Range';
import Range1D from './Range1D';
import Range1DGroup from './Range1DGroup';
import RangeElem from './internal/RangeElem';
import CompositeRange1D from './CompositeRange1D';

//Range EBNF grammar
//R   = Dim { ',' Dim }
//Dim = '' | SR | '(' SR { ',' SR ' } ')'
//SR  = N [ ':' N [ ':' N ] ]
//N   = '0'...'9'
//Str =  '"' literal '"'
//Name= Str
//Col = Str
//GDim= Name Col Dim
//CDim= Name '{' GDim { ',' GDim } '}'

interface IParseDimResult {
  act: number;
  dim: Range1D;
}

/**
 * parse the give code created toString
 * @param code
 * @returns {Range}
 */
export default function parseRange(code: string) {
  const dims: Range1D[] = [];
  let act = 0, c: string, t: IParseDimResult;
  code = code.trim();
  while (act < code.length) {
    c = code.charAt(act);
    switch (c) {
      case '"' :
        t = parseNamedRange1D(code, act);
        act = t.act + 1; //skip ,
        dims.push(t.dim);
        break;
      case ',' :
        act++;
        dims.push(Range1D.all());
        break;
      default:
        if (c.match(/\s/)) {
          act++;
        } else {
          t = parseRange1D(code, act);
          act = t.act + 1; //skip ,
          dims.push(t.dim);
        }
        break;
    }
  }
  if (code.charAt(code.length - 1) === ',') { //last is an empty one
    dims.push(Range1D.all());
  }
  return new Range(dims);
}

function parseNamedRange1D(code: string, act: number): IParseDimResult {
  act += 1; //skip "
  let end = code.indexOf('"', act);
  const name = code.slice(act, end);
  let r: IParseDimResult;
  act = end + 1;
  switch (code.charAt(act)) {
    case '"':
      end = code.indexOf('"', act + 1);
      r = parseRange1D(code, end + 1);
      return {
        dim: new Range1DGroup(name, code.slice(act + 1, end), r.dim),
        act: r.act
      };
    case '{':
      const groups: Range1DGroup[] = [];
      while (code.charAt(act) !== '}') {
        r = parseNamedRange1D(code, act + 1);
        groups.push(<Range1DGroup>r.dim);
        act = r.act;
      }
      return {
        dim: new CompositeRange1D(name, groups),
        act: r.act + 1
      };
    default: //ERROR
      return {
        dim: Range1D.all(),
        act
      };
  }
}

function parseRange1D(code: string, act: number): IParseDimResult {
  let next: number, r: Range1D;
  switch (code.charAt(act)) {
    case ',':
    case '}':
      next = act;
      r = Range1D.all();
      break;
    case '(':
      r = new Range1D();
      next = code.indexOf(')', act);
      if (next > act + 1) { //not ()
        r.push.apply(r, code.slice(act + 1, next).split(',').map(RangeElem.parse));
      }
      next += 1; //skip )
      break;
    default:
      next = code.indexOf('}', act);
      const n2 = code.indexOf(',', act);
      if (next >= 0 && n2 >= 0) {
        next = Math.min(next, n2);
      } else if (next < 0) {
        next = n2;
      }

      if (next < 0) {
        next = code.length;
      }
      r = new Range1D([RangeElem.parse(code.slice(act, next))]);
      break;
  }
  return {
    act: next,
    dim: r
  };
}


