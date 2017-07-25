/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 08.10.2014.
 */

import {Vector2D} from '../2D';
import Rect from './Rect';
import Circle from './Circle';
import Polygon from './Polygon';
import Line from './Line';
import Ellipse from './Ellipse';
import AShape from './AShape';

export {default as Rect} from './Rect';
export {default as Circle} from './Circle';
export {default as Polygon} from './Polygon';
export {default as Line} from './Line';
export {default as Ellipse} from './Ellipse';
export {default as AShape, CORNER} from './AShape';


export function vec2(x: number, y: number): Vector2D {
  return new Vector2D(x, y);
}

export function rect(x: number, y: number, w: number, h: number): Rect {
  return new Rect(x, y, w, h);
}
export function circle(x: number, y: number, radius: number): Circle {
  return new Circle(x, y, radius);
}
export function ellipse(x: number, y: number, radiusX: number, radiusY: number): Ellipse {
  return new Ellipse(x, y, radiusX, radiusY);
}
export function line(x1: number, y1: number, x2: number, y2: number): Line {
  return new Line(x1, y1, x2, y2);
}
export function polygon(...points: Vector2D[]): Polygon;
export function polygon(points: Vector2D[]): Polygon;
export function polygon(): Polygon {
  if (Array.isArray(arguments[0])) {
    return new Polygon(arguments[0]);
  }
  return new Polygon(Array.from(arguments));
}

export function wrap(obj: any): AShape {
  if (!obj) {
    return obj;
  }
  if (obj instanceof AShape) {
    return <AShape>obj;
  }
  if (obj.hasOwnProperty('x') && obj.hasOwnProperty('y')) {
    if (obj.hasOwnProperty('radius') || obj.hasOwnProperty('r')) {
      return circle(obj.x, obj.y, obj.hasOwnProperty('radius') ? obj.radius : obj.r);
    }
    if ((obj.hasOwnProperty('radiusX') || obj.hasOwnProperty('rx')) && (obj.hasOwnProperty('radiusY') || obj.hasOwnProperty('ry'))) {
      return ellipse(obj.x, obj.y, obj.hasOwnProperty('radiusX') ? obj.radiusX : obj.rx, obj.hasOwnProperty('radiusY') ? obj.radiusY : obj.ry);
    }
    if (obj.hasOwnProperty('w') && obj.hasOwnProperty('h')) {
      return rect(obj.x, obj.y, obj.w, obj.h);
    }
    if (obj.hasOwnProperty('width') && obj.hasOwnProperty('height')) {
      return rect(obj.x, obj.y, obj.width, obj.height);
    }
  }
  if (obj.hasOwnProperty('x1') && obj.hasOwnProperty('y1') && obj.hasOwnProperty('x2') && obj.hasOwnProperty('y2')) {
    return line(obj.x1, obj.y1, obj.x2, obj.y2);
  }
  if (Array.isArray(obj) && obj.length > 0 && obj[0].hasOwnProperty('x') && obj[0].hasOwnProperty('y')) {
    return polygon(obj);
  }
  // TODO throw error?
  return obj; //can't derive it, yet
}
