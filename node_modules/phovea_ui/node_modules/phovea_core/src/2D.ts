/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */

/**
 * The intersection is based on Kevin Lindsey
 * http://www.kevlindev.com/gui/index.htm
 *
 * copyright 2002 Kevin Lindsey
 */

export interface IIntersectionParam {
  name: string;
  params: any[];
}

export interface IShape {
  asIntersectionParams() : IIntersectionParam;
}

class IntersectionParams implements IIntersectionParam {
  constructor(public name: string, public params: any[]) {

  }
}

export class Intersection {
  points : Vector2D[] = [];

  /**
   *  'Outside',
   *  'Inside',
   *  'Tangent'
   *  'Coincident'
   *  'Parallel'
   *  'Intersection'
   *  'No Intersection'
   */
  constructor(public status = 'No Intersection') {

  }

  get intersects() {
    return this.status === 'Intersection';
  }

  appendPoint(point) {
    this.status = 'Intersection';
    this.points.push(point);
  }

  appendPoints(points) {
    if (points.length > 0) {
      this.status = 'Intersection';
    }
    this.points.push.apply(this.points, points);
  }

  get length() {
    return this.points.length;
  }

  /**
   * Performs the specified action for each element in an array.
   * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  forEach(callbackfn: (value: Vector2D, index: number, array: Vector2D[]) => void, thisArg?: any): void {
    this.points.forEach(callbackfn, thisArg);
  }

  /**
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  map<U>(callbackfn: (value: Vector2D, index: number, array: Vector2D[]) => U, thisArg?: any): U[] {
    return this.points.map(callbackfn, thisArg);
  }

  static intersectShapes(shape1: IShape, shape2: IShape) {
    const ip1 = shape1.asIntersectionParams();
    const ip2 = shape2.asIntersectionParams();
    var result;
    if (ip1 != null && ip2 != null) {
      if (shape1 instanceof Path) {
        result = Intersection.intersectPathShape(<Path>shape1, shape2);
      } else if (shape2 instanceof Path) {
        result = Intersection.intersectPathShape(<Path>shape2, shape1);
      } else {
        var method;
        var params;
        if (ip1.name < ip2.name) {
          method = 'intersect' + ip1.name + ip2.name;
          params = ip1.params.concat(ip2.params);
        } else {
          method = 'intersect' + ip2.name + ip1.name;
          params = ip2.params.concat(ip1.params);
        }
        if (typeof Intersection[method] !== 'function') {
          throw new Error('Intersection not available: ' + method);
        }
        result = Intersection[method].apply(null, params);
      }
    } else {
      result = new Intersection();
    }
    return result;
  }

  static intersectPathShape(path: Path, shape: IShape) {
    return path.intersectShape(shape);
  }

  static intersectBezier2Bezier2(a1: Vector2D, a2: Vector2D, a3: Vector2D, b1: Vector2D, b2: Vector2D, b3: Vector2D) {
    var a, b;
    var c12, c11, c10;
    var c22, c21, c20;
    var TOLERANCE = 1e-4;
    var result = new Intersection();
    a = a2.multiply(-2);
    c12 = a1.add(a.add(a3));
    a = a1.multiply(-2);
    b = a2.multiply(2);
    c11 = a.add(b);
    c10 = new Vector2D(a1.x, a1.y);
    a = b2.multiply(-2);
    c22 = b1.add(a.add(b3));
    a = b1.multiply(-2);
    b = b2.multiply(2);
    c21 = a.add(b);
    c20 = new Vector2D(b1.x, b1.y);
    a = c12.x * c11.y - c11.x * c12.y;
    b = c22.x * c11.y - c11.x * c22.y;
    var c = c21.x * c11.y - c11.x * c21.y;
    var d = c11.x * (c10.y - c20.y) + c11.y * (-c10.x + c20.x);
    var e = c22.x * c12.y - c12.x * c22.y;
    var f = c21.x * c12.y - c12.x * c21.y;
    var g = c12.x * (c10.y - c20.y) + c12.y * (-c10.x + c20.x);
    var poly = new Polynomial(-e * e, -2 * e * f, a * b - f * f - 2 * e * g, a * c - 2 * f * g, a * d - g * g);
    var roots = poly.getRoots();
    for (var i = 0; i < roots.length; i++) {
      var s = roots[i];
      if (0 <= s && s <= 1) {
        var xRoots = new Polynomial(-c12.x, -c11.x, -c10.x + c20.x + s * c21.x + s * s * c22.x).getRoots();
        var yRoots = new Polynomial(-c12.y, -c11.y, -c10.y + c20.y + s * c21.y + s * s * c22.y).getRoots();
        if (xRoots.length > 0 && yRoots.length > 0) {
          checkRoots:for (var j = 0; j < xRoots.length; j++) {
            var xRoot = xRoots[j];
            if (0 <= xRoot && xRoot <= 1) {
              for (var k = 0; k < yRoots.length; k++) {
                if (Math.abs(xRoot - yRoots[k]) < TOLERANCE) {
                  result.points.push(c22.multiply(s * s).add(c21.multiply(s).add(c20)));
                  break checkRoots;
                }
              }
            }
          }
        }
      }
    }
    return result;
  }

  static intersectBezier2Bezier3(a1: Vector2D, a2, a3, b1, b2, b3, b4) {
    var a, b, c, d;
    var c12, c11, c10;
    var c23, c22, c21, c20;
    var result = new Intersection();
    a = a2.multiply(-2);
    c12 = a1.add(a.add(a3));
    a = a1.multiply(-2);
    b = a2.multiply(2);
    c11 = a.add(b);
    c10 = new Vector2D(a1.x, a1.y);
    a = b1.multiply(-1);
    b = b2.multiply(3);
    c = b3.multiply(-3);
    d = a.add(b.add(c.add(b4)));
    c23 = new Vector2D(d.x, d.y);
    a = b1.multiply(3);
    b = b2.multiply(-6);
    c = b3.multiply(3);
    d = a.add(b.add(c));
    c22 = new Vector2D(d.x, d.y);
    a = b1.multiply(-3);
    b = b2.multiply(3);
    c = a.add(b);
    c21 = new Vector2D(c.x, c.y);
    c20 = new Vector2D(b1.x, b1.y);
    var c10x2 = c10.x * c10.x;
    var c10y2 = c10.y * c10.y;
    var c11x2 = c11.x * c11.x;
    var c11y2 = c11.y * c11.y;
    var c12x2 = c12.x * c12.x;
    var c12y2 = c12.y * c12.y;
    var c20x2 = c20.x * c20.x;
    var c20y2 = c20.y * c20.y;
    var c21x2 = c21.x * c21.x;
    var c21y2 = c21.y * c21.y;
    var c22x2 = c22.x * c22.x;
    var c22y2 = c22.y * c22.y;
    var c23x2 = c23.x * c23.x;
    var c23y2 = c23.y * c23.y;
    var poly = new Polynomial(-2 * c12.x * c12.y * c23.x * c23.y + c12x2 * c23y2 + c12y2 * c23x2, -2 * c12.x * c12.y * c22.x * c23.y - 2 * c12.x * c12.y * c22.y * c23.x + 2 * c12y2 * c22.x * c23.x + 2 * c12x2 * c22.y * c23.y, -2 * c12.x * c21.x * c12.y * c23.y - 2 * c12.x * c12.y * c21.y * c23.x - 2 * c12.x * c12.y * c22.x * c22.y + 2 * c21.x * c12y2 * c23.x + c12y2 * c22x2 + c12x2 * (2 * c21.y * c23.y + c22y2), 2 * c10.x * c12.x * c12.y * c23.y + 2 * c10.y * c12.x * c12.y * c23.x + c11.x * c11.y * c12.x * c23.y + c11.x * c11.y * c12.y * c23.x - 2 * c20.x * c12.x * c12.y * c23.y - 2 * c12.x * c20.y * c12.y * c23.x - 2 * c12.x * c21.x * c12.y * c22.y - 2 * c12.x * c12.y * c21.y * c22.x - 2 * c10.x * c12y2 * c23.x - 2 * c10.y * c12x2 * c23.y + 2 * c20.x * c12y2 * c23.x + 2 * c21.x * c12y2 * c22.x - c11y2 * c12.x * c23.x - c11x2 * c12.y * c23.y + c12x2 * (2 * c20.y * c23.y + 2 * c21.y * c22.y), 2 * c10.x * c12.x * c12.y * c22.y + 2 * c10.y * c12.x * c12.y * c22.x + c11.x * c11.y * c12.x * c22.y + c11.x * c11.y * c12.y * c22.x - 2 * c20.x * c12.x * c12.y * c22.y - 2 * c12.x * c20.y * c12.y * c22.x - 2 * c12.x * c21.x * c12.y * c21.y - 2 * c10.x * c12y2 * c22.x - 2 * c10.y * c12x2 * c22.y + 2 * c20.x * c12y2 * c22.x - c11y2 * c12.x * c22.x - c11x2 * c12.y * c22.y + c21x2 * c12y2 + c12x2 * (2 * c20.y * c22.y + c21y2), 2 * c10.x * c12.x * c12.y * c21.y + 2 * c10.y * c12.x * c21.x * c12.y + c11.x * c11.y * c12.x * c21.y + c11.x * c11.y * c21.x * c12.y - 2 * c20.x * c12.x * c12.y * c21.y - 2 * c12.x * c20.y * c21.x * c12.y - 2 * c10.x * c21.x * c12y2 - 2 * c10.y * c12x2 * c21.y + 2 * c20.x * c21.x * c12y2 - c11y2 * c12.x * c21.x - c11x2 * c12.y * c21.y + 2 * c12x2 * c20.y * c21.y, -2 * c10.x * c10.y * c12.x * c12.y - c10.x * c11.x * c11.y * c12.y - c10.y * c11.x * c11.y * c12.x + 2 * c10.x * c12.x * c20.y * c12.y + 2 * c10.y * c20.x * c12.x * c12.y + c11.x * c20.x * c11.y * c12.y + c11.x * c11.y * c12.x * c20.y - 2 * c20.x * c12.x * c20.y * c12.y - 2 * c10.x * c20.x * c12y2 + c10.x * c11y2 * c12.x + c10.y * c11x2 * c12.y - 2 * c10.y * c12x2 * c20.y - c20.x * c11y2 * c12.x - c11x2 * c20.y * c12.y + c10x2 * c12y2 + c10y2 * c12x2 + c20x2 * c12y2 + c12x2 * c20y2);
    var roots = poly.getRootsInInterval(0, 1);
    for (var i = 0; i < roots.length; i++) {
      var s = roots[i];
      var xRoots = new Polynomial(c12.x, c11.x, c10.x - c20.x - s * c21.x - s * s * c22.x - s * s * s * c23.x).getRoots();
      var yRoots = new Polynomial(c12.y, c11.y, c10.y - c20.y - s * c21.y - s * s * c22.y - s * s * s * c23.y).getRoots();
      if (xRoots.length > 0 && yRoots.length > 0) {
        var TOLERANCE = 1e-4;
        checkRoots:for (var j = 0; j < xRoots.length; j++) {
          var xRoot = xRoots[j];
          if (0 <= xRoot && xRoot <= 1) {
            for (var k = 0; k < yRoots.length; k++) {
              if (Math.abs(xRoot - yRoots[k]) < TOLERANCE) {
                result.points.push(c23.multiply(s * s * s).add(c22.multiply(s * s).add(c21.multiply(s).add(c20))));
                break checkRoots;
              }
            }
          }
        }
      }
    }
    return result;
  }

  static intersectBezier2Circle(p1, p2, p3, c, r) {
    return Intersection.intersectBezier2Ellipse(p1, p2, p3, c, r, r);
  }

  static intersectBezier2Ellipse(p1, p2, p3, ec, rx, ry) {
    var a, b;
    var c2, c1, c0;
    var result = new Intersection();
    a = p2.multiply(-2);
    c2 = p1.add(a.add(p3));
    a = p1.multiply(-2);
    b = p2.multiply(2);
    c1 = a.add(b);
    c0 = new Vector2D(p1.x, p1.y);
    var rxrx = rx * rx;
    var ryry = ry * ry;
    var roots = new Polynomial(ryry * c2.x * c2.x + rxrx * c2.y * c2.y, 2 * (ryry * c2.x * c1.x + rxrx * c2.y * c1.y), ryry * (2 * c2.x * c0.x + c1.x * c1.x) + rxrx * (2 * c2.y * c0.y + c1.y * c1.y) - 2 * (ryry * ec.x * c2.x + rxrx * ec.y * c2.y), 2 * (ryry * c1.x * (c0.x - ec.x) + rxrx * c1.y * (c0.y - ec.y)), ryry * (c0.x * c0.x + ec.x * ec.x) + rxrx * (c0.y * c0.y + ec.y * ec.y) - 2 * (ryry * ec.x * c0.x + rxrx * ec.y * c0.y) - rxrx * ryry).getRoots();
    for (var i = 0; i < roots.length; i++) {
      var t = roots[i];
      if (0 <= t && t <= 1) {
        result.points.push(c2.multiply(t * t).add(c1.multiply(t).add(c0)));
      }
    }
    return result;
  }

  static intersectBezier2Line(p1, p2, p3, a1, a2) {
    var a, b;
    var c2, c1, c0;
    var cl;
    var n;
    var min = a1.min(a2);
    var max = a1.max(a2);
    var result = new Intersection();
    a = p2.multiply(-2);
    c2 = p1.add(a.add(p3));
    a = p1.multiply(-2);
    b = p2.multiply(2);
    c1 = a.add(b);
    c0 = new Vector2D(p1.x, p1.y);
    n = new Vector2D(a1.y - a2.y, a2.x - a1.x);
    cl = a1.x * a2.y - a2.x * a1.y;
    var roots = new Polynomial(n.dot(c2), n.dot(c1), n.dot(c0) + cl).getRoots();
    for (var i = 0; i < roots.length; i++) {
      var t = roots[i];
      if (0 <= t && t <= 1) {
        var p4 = p1.lerp(p2, t);
        var p5 = p2.lerp(p3, t);
        var p6 = p4.lerp(p5, t);
        if (a1.x === a2.x) {
          if (min.y <= p6.y && p6.y <= max.y) {
            result.appendPoint(p6);
          }
        } else if (a1.y === a2.y) {
          if (min.x <= p6.x && p6.x <= max.x) {
            result.appendPoint(p6);
          }
        } else if (p6.gte(min) && p6.lte(max)) {
          result.appendPoint(p6);
        }
      }
    }
    return result;
  }

  intersectBezier2Polygon(p1, p2, p3, points) {
    var result = new Intersection();
    var length = points.length;
    for (var i = 0; i < length; i++) {
      var a1 = points[i];
      var a2 = points[(i + 1) % length];
      var inter = Intersection.intersectBezier2Line(p1, p2, p3, a1, a2);
      result.appendPoints(inter.points);
    }
    return result;
  }

  static intersectBezier2Rectangle(p1, p2, p3, r1, r2) {
    var min = r1.min(r2);
    var max = r1.max(r2);
    var topRight = new Vector2D(max.x, min.y);
    var bottomLeft = new Vector2D(min.x, max.y);
    var inter1 = Intersection.intersectBezier2Line(p1, p2, p3, min, topRight);
    var inter2 = Intersection.intersectBezier2Line(p1, p2, p3, topRight, max);
    var inter3 = Intersection.intersectBezier2Line(p1, p2, p3, max, bottomLeft);
    var inter4 = Intersection.intersectBezier2Line(p1, p2, p3, bottomLeft, min);
    var result = new Intersection();
    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);
    return result;
  }

  static intersectBezier3Bezier3(a1, a2, a3, a4, b1, b2, b3, b4) {
    var a, b, c, d;
    var c13, c12, c11, c10;
    var c23, c22, c21, c20;
    var result = new Intersection();
    a = a1.multiply(-1);
    b = a2.multiply(3);
    c = a3.multiply(-3);
    d = a.add(b.add(c.add(a4)));
    c13 = new Vector2D(d.x, d.y);
    a = a1.multiply(3);
    b = a2.multiply(-6);
    c = a3.multiply(3);
    d = a.add(b.add(c));
    c12 = new Vector2D(d.x, d.y);
    a = a1.multiply(-3);
    b = a2.multiply(3);
    c = a.add(b);
    c11 = new Vector2D(c.x, c.y);
    c10 = new Vector2D(a1.x, a1.y);
    a = b1.multiply(-1);
    b = b2.multiply(3);
    c = b3.multiply(-3);
    d = a.add(b.add(c.add(b4)));
    c23 = new Vector2D(d.x, d.y);
    a = b1.multiply(3);
    b = b2.multiply(-6);
    c = b3.multiply(3);
    d = a.add(b.add(c));
    c22 = new Vector2D(d.x, d.y);
    a = b1.multiply(-3);
    b = b2.multiply(3);
    c = a.add(b);
    c21 = new Vector2D(c.x, c.y);
    c20 = new Vector2D(b1.x, b1.y);
    var c10x2 = c10.x * c10.x;
    var c10x3 = c10.x * c10.x * c10.x;
    var c10y2 = c10.y * c10.y;
    var c10y3 = c10.y * c10.y * c10.y;
    var c11x2 = c11.x * c11.x;
    var c11x3 = c11.x * c11.x * c11.x;
    var c11y2 = c11.y * c11.y;
    var c11y3 = c11.y * c11.y * c11.y;
    var c12x2 = c12.x * c12.x;
    var c12x3 = c12.x * c12.x * c12.x;
    var c12y2 = c12.y * c12.y;
    var c12y3 = c12.y * c12.y * c12.y;
    var c13x2 = c13.x * c13.x;
    var c13x3 = c13.x * c13.x * c13.x;
    var c13y2 = c13.y * c13.y;
    var c13y3 = c13.y * c13.y * c13.y;
    var c20x2 = c20.x * c20.x;
    var c20x3 = c20.x * c20.x * c20.x;
    var c20y2 = c20.y * c20.y;
    var c20y3 = c20.y * c20.y * c20.y;
    var c21x2 = c21.x * c21.x;
    var c21x3 = c21.x * c21.x * c21.x;
    var c21y2 = c21.y * c21.y;
    var c22x2 = c22.x * c22.x;
    var c22x3 = c22.x * c22.x * c22.x;
    var c22y2 = c22.y * c22.y;
    var c23x2 = c23.x * c23.x;
    var c23x3 = c23.x * c23.x * c23.x;
    var c23y2 = c23.y * c23.y;
    var c23y3 = c23.y * c23.y * c23.y;
    var poly = new Polynomial(-c13x3 * c23y3 + c13y3 * c23x3 - 3 * c13.x * c13y2 * c23x2 * c23.y + 3 * c13x2 * c13.y * c23.x * c23y2, -6 * c13.x * c22.x * c13y2 * c23.x * c23.y + 6 * c13x2 * c13.y * c22.y * c23.x * c23.y + 3 * c22.x * c13y3 * c23x2 - 3 * c13x3 * c22.y * c23y2 - 3 * c13.x * c13y2 * c22.y * c23x2 + 3 * c13x2 * c22.x * c13.y * c23y2, -6 * c21.x * c13.x * c13y2 * c23.x * c23.y - 6 * c13.x * c22.x * c13y2 * c22.y * c23.x + 6 * c13x2 * c22.x * c13.y * c22.y * c23.y + 3 * c21.x * c13y3 * c23x2 + 3 * c22x2 * c13y3 * c23.x + 3 * c21.x * c13x2 * c13.y * c23y2 - 3 * c13.x * c21.y * c13y2 * c23x2 - 3 * c13.x * c22x2 * c13y2 * c23.y + c13x2 * c13.y * c23.x * (6 * c21.y * c23.y + 3 * c22y2) + c13x3 * (-c21.y * c23y2 - 2 * c22y2 * c23.y - c23.y * (2 * c21.y * c23.y + c22y2)), c11.x * c12.y * c13.x * c13.y * c23.x * c23.y - c11.y * c12.x * c13.x * c13.y * c23.x * c23.y + 6 * c21.x * c22.x * c13y3 * c23.x + 3 * c11.x * c12.x * c13.x * c13.y * c23y2 + 6 * c10.x * c13.x * c13y2 * c23.x * c23.y - 3 * c11.x * c12.x * c13y2 * c23.x * c23.y - 3 * c11.y * c12.y * c13.x * c13.y * c23x2 - 6 * c10.y * c13x2 * c13.y * c23.x * c23.y - 6 * c20.x * c13.x * c13y2 * c23.x * c23.y + 3 * c11.y * c12.y * c13x2 * c23.x * c23.y - 2 * c12.x * c12y2 * c13.x * c23.x * c23.y - 6 * c21.x * c13.x * c22.x * c13y2 * c23.y - 6 * c21.x * c13.x * c13y2 * c22.y * c23.x - 6 * c13.x * c21.y * c22.x * c13y2 * c23.x + 6 * c21.x * c13x2 * c13.y * c22.y * c23.y + 2 * c12x2 * c12.y * c13.y * c23.x * c23.y + c22x3 * c13y3 - 3 * c10.x * c13y3 * c23x2 + 3 * c10.y * c13x3 * c23y2 + 3 * c20.x * c13y3 * c23x2 + c12y3 * c13.x * c23x2 - c12x3 * c13.y * c23y2 - 3 * c10.x * c13x2 * c13.y * c23y2 + 3 * c10.y * c13.x * c13y2 * c23x2 - 2 * c11.x * c12.y * c13x2 * c23y2 + c11.x * c12.y * c13y2 * c23x2 - c11.y * c12.x * c13x2 * c23y2 + 2 * c11.y * c12.x * c13y2 * c23x2 + 3 * c20.x * c13x2 * c13.y * c23y2 - c12.x * c12y2 * c13.y * c23x2 - 3 * c20.y * c13.x * c13y2 * c23x2 + c12x2 * c12.y * c13.x * c23y2 - 3 * c13.x * c22x2 * c13y2 * c22.y + c13x2 * c13.y * c23.x * (6 * c20.y * c23.y + 6 * c21.y * c22.y) + c13x2 * c22.x * c13.y * (6 * c21.y * c23.y + 3 * c22y2) + c13x3 * (-2 * c21.y * c22.y * c23.y - c20.y * c23y2 - c22.y * (2 * c21.y * c23.y + c22y2) - c23.y * (2 * c20.y * c23.y + 2 * c21.y * c22.y)), 6 * c11.x * c12.x * c13.x * c13.y * c22.y * c23.y + c11.x * c12.y * c13.x * c22.x * c13.y * c23.y + c11.x * c12.y * c13.x * c13.y * c22.y * c23.x - c11.y * c12.x * c13.x * c22.x * c13.y * c23.y - c11.y * c12.x * c13.x * c13.y * c22.y * c23.x - 6 * c11.y * c12.y * c13.x * c22.x * c13.y * c23.x - 6 * c10.x * c22.x * c13y3 * c23.x + 6 * c20.x * c22.x * c13y3 * c23.x + 6 * c10.y * c13x3 * c22.y * c23.y + 2 * c12y3 * c13.x * c22.x * c23.x - 2 * c12x3 * c13.y * c22.y * c23.y + 6 * c10.x * c13.x * c22.x * c13y2 * c23.y + 6 * c10.x * c13.x * c13y2 * c22.y * c23.x + 6 * c10.y * c13.x * c22.x * c13y2 * c23.x - 3 * c11.x * c12.x * c22.x * c13y2 * c23.y - 3 * c11.x * c12.x * c13y2 * c22.y * c23.x + 2 * c11.x * c12.y * c22.x * c13y2 * c23.x + 4 * c11.y * c12.x * c22.x * c13y2 * c23.x - 6 * c10.x * c13x2 * c13.y * c22.y * c23.y - 6 * c10.y * c13x2 * c22.x * c13.y * c23.y - 6 * c10.y * c13x2 * c13.y * c22.y * c23.x - 4 * c11.x * c12.y * c13x2 * c22.y * c23.y - 6 * c20.x * c13.x * c22.x * c13y2 * c23.y - 6 * c20.x * c13.x * c13y2 * c22.y * c23.x - 2 * c11.y * c12.x * c13x2 * c22.y * c23.y + 3 * c11.y * c12.y * c13x2 * c22.x * c23.y + 3 * c11.y * c12.y * c13x2 * c22.y * c23.x - 2 * c12.x * c12y2 * c13.x * c22.x * c23.y - 2 * c12.x * c12y2 * c13.x * c22.y * c23.x - 2 * c12.x * c12y2 * c22.x * c13.y * c23.x - 6 * c20.y * c13.x * c22.x * c13y2 * c23.x - 6 * c21.x * c13.x * c21.y * c13y2 * c23.x - 6 * c21.x * c13.x * c22.x * c13y2 * c22.y + 6 * c20.x * c13x2 * c13.y * c22.y * c23.y + 2 * c12x2 * c12.y * c13.x * c22.y * c23.y + 2 * c12x2 * c12.y * c22.x * c13.y * c23.y + 2 * c12x2 * c12.y * c13.y * c22.y * c23.x + 3 * c21.x * c22x2 * c13y3 + 3 * c21x2 * c13y3 * c23.x - 3 * c13.x * c21.y * c22x2 * c13y2 - 3 * c21x2 * c13.x * c13y2 * c23.y + c13x2 * c22.x * c13.y * (6 * c20.y * c23.y + 6 * c21.y * c22.y) + c13x2 * c13.y * c23.x * (6 * c20.y * c22.y + 3 * c21y2) + c21.x * c13x2 * c13.y * (6 * c21.y * c23.y + 3 * c22y2) + c13x3 * (-2 * c20.y * c22.y * c23.y - c23.y * (2 * c20.y * c22.y + c21y2) - c21.y * (2 * c21.y * c23.y + c22y2) - c22.y * (2 * c20.y * c23.y + 2 * c21.y * c22.y)), c11.x * c21.x * c12.y * c13.x * c13.y * c23.y + c11.x * c12.y * c13.x * c21.y * c13.y * c23.x + c11.x * c12.y * c13.x * c22.x * c13.y * c22.y - c11.y * c12.x * c21.x * c13.x * c13.y * c23.y - c11.y * c12.x * c13.x * c21.y * c13.y * c23.x - c11.y * c12.x * c13.x * c22.x * c13.y * c22.y - 6 * c11.y * c21.x * c12.y * c13.x * c13.y * c23.x - 6 * c10.x * c21.x * c13y3 * c23.x + 6 * c20.x * c21.x * c13y3 * c23.x + 2 * c21.x * c12y3 * c13.x * c23.x + 6 * c10.x * c21.x * c13.x * c13y2 * c23.y + 6 * c10.x * c13.x * c21.y * c13y2 * c23.x + 6 * c10.x * c13.x * c22.x * c13y2 * c22.y + 6 * c10.y * c21.x * c13.x * c13y2 * c23.x - 3 * c11.x * c12.x * c21.x * c13y2 * c23.y - 3 * c11.x * c12.x * c21.y * c13y2 * c23.x - 3 * c11.x * c12.x * c22.x * c13y2 * c22.y + 2 * c11.x * c21.x * c12.y * c13y2 * c23.x + 4 * c11.y * c12.x * c21.x * c13y2 * c23.x - 6 * c10.y * c21.x * c13x2 * c13.y * c23.y - 6 * c10.y * c13x2 * c21.y * c13.y * c23.x - 6 * c10.y * c13x2 * c22.x * c13.y * c22.y - 6 * c20.x * c21.x * c13.x * c13y2 * c23.y - 6 * c20.x * c13.x * c21.y * c13y2 * c23.x - 6 * c20.x * c13.x * c22.x * c13y2 * c22.y + 3 * c11.y * c21.x * c12.y * c13x2 * c23.y - 3 * c11.y * c12.y * c13.x * c22x2 * c13.y + 3 * c11.y * c12.y * c13x2 * c21.y * c23.x + 3 * c11.y * c12.y * c13x2 * c22.x * c22.y - 2 * c12.x * c21.x * c12y2 * c13.x * c23.y - 2 * c12.x * c21.x * c12y2 * c13.y * c23.x - 2 * c12.x * c12y2 * c13.x * c21.y * c23.x - 2 * c12.x * c12y2 * c13.x * c22.x * c22.y - 6 * c20.y * c21.x * c13.x * c13y2 * c23.x - 6 * c21.x * c13.x * c21.y * c22.x * c13y2 + 6 * c20.y * c13x2 * c21.y * c13.y * c23.x + 2 * c12x2 * c21.x * c12.y * c13.y * c23.y + 2 * c12x2 * c12.y * c21.y * c13.y * c23.x + 2 * c12x2 * c12.y * c22.x * c13.y * c22.y - 3 * c10.x * c22x2 * c13y3 + 3 * c20.x * c22x2 * c13y3 + 3 * c21x2 * c22.x * c13y3 + c12y3 * c13.x * c22x2 + 3 * c10.y * c13.x * c22x2 * c13y2 + c11.x * c12.y * c22x2 * c13y2 + 2 * c11.y * c12.x * c22x2 * c13y2 - c12.x * c12y2 * c22x2 * c13.y - 3 * c20.y * c13.x * c22x2 * c13y2 - 3 * c21x2 * c13.x * c13y2 * c22.y + c12x2 * c12.y * c13.x * (2 * c21.y * c23.y + c22y2) + c11.x * c12.x * c13.x * c13.y * (6 * c21.y * c23.y + 3 * c22y2) + c21.x * c13x2 * c13.y * (6 * c20.y * c23.y + 6 * c21.y * c22.y) + c12x3 * c13.y * (-2 * c21.y * c23.y - c22y2) + c10.y * c13x3 * (6 * c21.y * c23.y + 3 * c22y2) + c11.y * c12.x * c13x2 * (-2 * c21.y * c23.y - c22y2) + c11.x * c12.y * c13x2 * (-4 * c21.y * c23.y - 2 * c22y2) + c10.x * c13x2 * c13.y * (-6 * c21.y * c23.y - 3 * c22y2) + c13x2 * c22.x * c13.y * (6 * c20.y * c22.y + 3 * c21y2) + c20.x * c13x2 * c13.y * (6 * c21.y * c23.y + 3 * c22y2) + c13x3 * (-2 * c20.y * c21.y * c23.y - c22.y * (2 * c20.y * c22.y + c21y2) - c20.y * (2 * c21.y * c23.y + c22y2) - c21.y * (2 * c20.y * c23.y + 2 * c21.y * c22.y)), -c10.x * c11.x * c12.y * c13.x * c13.y * c23.y + c10.x * c11.y * c12.x * c13.x * c13.y * c23.y + 6 * c10.x * c11.y * c12.y * c13.x * c13.y * c23.x - 6 * c10.y * c11.x * c12.x * c13.x * c13.y * c23.y - c10.y * c11.x * c12.y * c13.x * c13.y * c23.x + c10.y * c11.y * c12.x * c13.x * c13.y * c23.x + c11.x * c11.y * c12.x * c12.y * c13.x * c23.y - c11.x * c11.y * c12.x * c12.y * c13.y * c23.x + c11.x * c20.x * c12.y * c13.x * c13.y * c23.y + c11.x * c20.y * c12.y * c13.x * c13.y * c23.x + c11.x * c21.x * c12.y * c13.x * c13.y * c22.y + c11.x * c12.y * c13.x * c21.y * c22.x * c13.y - c20.x * c11.y * c12.x * c13.x * c13.y * c23.y - 6 * c20.x * c11.y * c12.y * c13.x * c13.y * c23.x - c11.y * c12.x * c20.y * c13.x * c13.y * c23.x - c11.y * c12.x * c21.x * c13.x * c13.y * c22.y - c11.y * c12.x * c13.x * c21.y * c22.x * c13.y - 6 * c11.y * c21.x * c12.y * c13.x * c22.x * c13.y - 6 * c10.x * c20.x * c13y3 * c23.x - 6 * c10.x * c21.x * c22.x * c13y3 - 2 * c10.x * c12y3 * c13.x * c23.x + 6 * c20.x * c21.x * c22.x * c13y3 + 2 * c20.x * c12y3 * c13.x * c23.x + 2 * c21.x * c12y3 * c13.x * c22.x + 2 * c10.y * c12x3 * c13.y * c23.y - 6 * c10.x * c10.y * c13.x * c13y2 * c23.x + 3 * c10.x * c11.x * c12.x * c13y2 * c23.y - 2 * c10.x * c11.x * c12.y * c13y2 * c23.x - 4 * c10.x * c11.y * c12.x * c13y2 * c23.x + 3 * c10.y * c11.x * c12.x * c13y2 * c23.x + 6 * c10.x * c10.y * c13x2 * c13.y * c23.y + 6 * c10.x * c20.x * c13.x * c13y2 * c23.y - 3 * c10.x * c11.y * c12.y * c13x2 * c23.y + 2 * c10.x * c12.x * c12y2 * c13.x * c23.y + 2 * c10.x * c12.x * c12y2 * c13.y * c23.x + 6 * c10.x * c20.y * c13.x * c13y2 * c23.x + 6 * c10.x * c21.x * c13.x * c13y2 * c22.y + 6 * c10.x * c13.x * c21.y * c22.x * c13y2 + 4 * c10.y * c11.x * c12.y * c13x2 * c23.y + 6 * c10.y * c20.x * c13.x * c13y2 * c23.x + 2 * c10.y * c11.y * c12.x * c13x2 * c23.y - 3 * c10.y * c11.y * c12.y * c13x2 * c23.x + 2 * c10.y * c12.x * c12y2 * c13.x * c23.x + 6 * c10.y * c21.x * c13.x * c22.x * c13y2 - 3 * c11.x * c20.x * c12.x * c13y2 * c23.y + 2 * c11.x * c20.x * c12.y * c13y2 * c23.x + c11.x * c11.y * c12y2 * c13.x * c23.x - 3 * c11.x * c12.x * c20.y * c13y2 * c23.x - 3 * c11.x * c12.x * c21.x * c13y2 * c22.y - 3 * c11.x * c12.x * c21.y * c22.x * c13y2 + 2 * c11.x * c21.x * c12.y * c22.x * c13y2 + 4 * c20.x * c11.y * c12.x * c13y2 * c23.x + 4 * c11.y * c12.x * c21.x * c22.x * c13y2 - 2 * c10.x * c12x2 * c12.y * c13.y * c23.y - 6 * c10.y * c20.x * c13x2 * c13.y * c23.y - 6 * c10.y * c20.y * c13x2 * c13.y * c23.x - 6 * c10.y * c21.x * c13x2 * c13.y * c22.y - 2 * c10.y * c12x2 * c12.y * c13.x * c23.y - 2 * c10.y * c12x2 * c12.y * c13.y * c23.x - 6 * c10.y * c13x2 * c21.y * c22.x * c13.y - c11.x * c11.y * c12x2 * c13.y * c23.y - 2 * c11.x * c11y2 * c13.x * c13.y * c23.x + 3 * c20.x * c11.y * c12.y * c13x2 * c23.y - 2 * c20.x * c12.x * c12y2 * c13.x * c23.y - 2 * c20.x * c12.x * c12y2 * c13.y * c23.x - 6 * c20.x * c20.y * c13.x * c13y2 * c23.x - 6 * c20.x * c21.x * c13.x * c13y2 * c22.y - 6 * c20.x * c13.x * c21.y * c22.x * c13y2 + 3 * c11.y * c20.y * c12.y * c13x2 * c23.x + 3 * c11.y * c21.x * c12.y * c13x2 * c22.y + 3 * c11.y * c12.y * c13x2 * c21.y * c22.x - 2 * c12.x * c20.y * c12y2 * c13.x * c23.x - 2 * c12.x * c21.x * c12y2 * c13.x * c22.y - 2 * c12.x * c21.x * c12y2 * c22.x * c13.y - 2 * c12.x * c12y2 * c13.x * c21.y * c22.x - 6 * c20.y * c21.x * c13.x * c22.x * c13y2 - c11y2 * c12.x * c12.y * c13.x * c23.x + 2 * c20.x * c12x2 * c12.y * c13.y * c23.y + 6 * c20.y * c13x2 * c21.y * c22.x * c13.y + 2 * c11x2 * c11.y * c13.x * c13.y * c23.y + c11x2 * c12.x * c12.y * c13.y * c23.y + 2 * c12x2 * c20.y * c12.y * c13.y * c23.x + 2 * c12x2 * c21.x * c12.y * c13.y * c22.y + 2 * c12x2 * c12.y * c21.y * c22.x * c13.y + c21x3 * c13y3 + 3 * c10x2 * c13y3 * c23.x - 3 * c10y2 * c13x3 * c23.y + 3 * c20x2 * c13y3 * c23.x + c11y3 * c13x2 * c23.x - c11x3 * c13y2 * c23.y - c11.x * c11y2 * c13x2 * c23.y + c11x2 * c11.y * c13y2 * c23.x - 3 * c10x2 * c13.x * c13y2 * c23.y + 3 * c10y2 * c13x2 * c13.y * c23.x - c11x2 * c12y2 * c13.x * c23.y + c11y2 * c12x2 * c13.y * c23.x - 3 * c21x2 * c13.x * c21.y * c13y2 - 3 * c20x2 * c13.x * c13y2 * c23.y + 3 * c20y2 * c13x2 * c13.y * c23.x + c11.x * c12.x * c13.x * c13.y * (6 * c20.y * c23.y + 6 * c21.y * c22.y) + c12x3 * c13.y * (-2 * c20.y * c23.y - 2 * c21.y * c22.y) + c10.y * c13x3 * (6 * c20.y * c23.y + 6 * c21.y * c22.y) + c11.y * c12.x * c13x2 * (-2 * c20.y * c23.y - 2 * c21.y * c22.y) + c12x2 * c12.y * c13.x * (2 * c20.y * c23.y + 2 * c21.y * c22.y) + c11.x * c12.y * c13x2 * (-4 * c20.y * c23.y - 4 * c21.y * c22.y) + c10.x * c13x2 * c13.y * (-6 * c20.y * c23.y - 6 * c21.y * c22.y) + c20.x * c13x2 * c13.y * (6 * c20.y * c23.y + 6 * c21.y * c22.y) + c21.x * c13x2 * c13.y * (6 * c20.y * c22.y + 3 * c21y2) + c13x3 * (-2 * c20.y * c21.y * c22.y - c20y2 * c23.y - c21.y * (2 * c20.y * c22.y + c21y2) - c20.y * (2 * c20.y * c23.y + 2 * c21.y * c22.y)), -c10.x * c11.x * c12.y * c13.x * c13.y * c22.y + c10.x * c11.y * c12.x * c13.x * c13.y * c22.y + 6 * c10.x * c11.y * c12.y * c13.x * c22.x * c13.y - 6 * c10.y * c11.x * c12.x * c13.x * c13.y * c22.y - c10.y * c11.x * c12.y * c13.x * c22.x * c13.y + c10.y * c11.y * c12.x * c13.x * c22.x * c13.y + c11.x * c11.y * c12.x * c12.y * c13.x * c22.y - c11.x * c11.y * c12.x * c12.y * c22.x * c13.y + c11.x * c20.x * c12.y * c13.x * c13.y * c22.y + c11.x * c20.y * c12.y * c13.x * c22.x * c13.y + c11.x * c21.x * c12.y * c13.x * c21.y * c13.y - c20.x * c11.y * c12.x * c13.x * c13.y * c22.y - 6 * c20.x * c11.y * c12.y * c13.x * c22.x * c13.y - c11.y * c12.x * c20.y * c13.x * c22.x * c13.y - c11.y * c12.x * c21.x * c13.x * c21.y * c13.y - 6 * c10.x * c20.x * c22.x * c13y3 - 2 * c10.x * c12y3 * c13.x * c22.x + 2 * c20.x * c12y3 * c13.x * c22.x + 2 * c10.y * c12x3 * c13.y * c22.y - 6 * c10.x * c10.y * c13.x * c22.x * c13y2 + 3 * c10.x * c11.x * c12.x * c13y2 * c22.y - 2 * c10.x * c11.x * c12.y * c22.x * c13y2 - 4 * c10.x * c11.y * c12.x * c22.x * c13y2 + 3 * c10.y * c11.x * c12.x * c22.x * c13y2 + 6 * c10.x * c10.y * c13x2 * c13.y * c22.y + 6 * c10.x * c20.x * c13.x * c13y2 * c22.y - 3 * c10.x * c11.y * c12.y * c13x2 * c22.y + 2 * c10.x * c12.x * c12y2 * c13.x * c22.y + 2 * c10.x * c12.x * c12y2 * c22.x * c13.y + 6 * c10.x * c20.y * c13.x * c22.x * c13y2 + 6 * c10.x * c21.x * c13.x * c21.y * c13y2 + 4 * c10.y * c11.x * c12.y * c13x2 * c22.y + 6 * c10.y * c20.x * c13.x * c22.x * c13y2 + 2 * c10.y * c11.y * c12.x * c13x2 * c22.y - 3 * c10.y * c11.y * c12.y * c13x2 * c22.x + 2 * c10.y * c12.x * c12y2 * c13.x * c22.x - 3 * c11.x * c20.x * c12.x * c13y2 * c22.y + 2 * c11.x * c20.x * c12.y * c22.x * c13y2 + c11.x * c11.y * c12y2 * c13.x * c22.x - 3 * c11.x * c12.x * c20.y * c22.x * c13y2 - 3 * c11.x * c12.x * c21.x * c21.y * c13y2 + 4 * c20.x * c11.y * c12.x * c22.x * c13y2 - 2 * c10.x * c12x2 * c12.y * c13.y * c22.y - 6 * c10.y * c20.x * c13x2 * c13.y * c22.y - 6 * c10.y * c20.y * c13x2 * c22.x * c13.y - 6 * c10.y * c21.x * c13x2 * c21.y * c13.y - 2 * c10.y * c12x2 * c12.y * c13.x * c22.y - 2 * c10.y * c12x2 * c12.y * c22.x * c13.y - c11.x * c11.y * c12x2 * c13.y * c22.y - 2 * c11.x * c11y2 * c13.x * c22.x * c13.y + 3 * c20.x * c11.y * c12.y * c13x2 * c22.y - 2 * c20.x * c12.x * c12y2 * c13.x * c22.y - 2 * c20.x * c12.x * c12y2 * c22.x * c13.y - 6 * c20.x * c20.y * c13.x * c22.x * c13y2 - 6 * c20.x * c21.x * c13.x * c21.y * c13y2 + 3 * c11.y * c20.y * c12.y * c13x2 * c22.x + 3 * c11.y * c21.x * c12.y * c13x2 * c21.y - 2 * c12.x * c20.y * c12y2 * c13.x * c22.x - 2 * c12.x * c21.x * c12y2 * c13.x * c21.y - c11y2 * c12.x * c12.y * c13.x * c22.x + 2 * c20.x * c12x2 * c12.y * c13.y * c22.y - 3 * c11.y * c21x2 * c12.y * c13.x * c13.y + 6 * c20.y * c21.x * c13x2 * c21.y * c13.y + 2 * c11x2 * c11.y * c13.x * c13.y * c22.y + c11x2 * c12.x * c12.y * c13.y * c22.y + 2 * c12x2 * c20.y * c12.y * c22.x * c13.y + 2 * c12x2 * c21.x * c12.y * c21.y * c13.y - 3 * c10.x * c21x2 * c13y3 + 3 * c20.x * c21x2 * c13y3 + 3 * c10x2 * c22.x * c13y3 - 3 * c10y2 * c13x3 * c22.y + 3 * c20x2 * c22.x * c13y3 + c21x2 * c12y3 * c13.x + c11y3 * c13x2 * c22.x - c11x3 * c13y2 * c22.y + 3 * c10.y * c21x2 * c13.x * c13y2 - c11.x * c11y2 * c13x2 * c22.y + c11.x * c21x2 * c12.y * c13y2 + 2 * c11.y * c12.x * c21x2 * c13y2 + c11x2 * c11.y * c22.x * c13y2 - c12.x * c21x2 * c12y2 * c13.y - 3 * c20.y * c21x2 * c13.x * c13y2 - 3 * c10x2 * c13.x * c13y2 * c22.y + 3 * c10y2 * c13x2 * c22.x * c13.y - c11x2 * c12y2 * c13.x * c22.y + c11y2 * c12x2 * c22.x * c13.y - 3 * c20x2 * c13.x * c13y2 * c22.y + 3 * c20y2 * c13x2 * c22.x * c13.y + c12x2 * c12.y * c13.x * (2 * c20.y * c22.y + c21y2) + c11.x * c12.x * c13.x * c13.y * (6 * c20.y * c22.y + 3 * c21y2) + c12x3 * c13.y * (-2 * c20.y * c22.y - c21y2) + c10.y * c13x3 * (6 * c20.y * c22.y + 3 * c21y2) + c11.y * c12.x * c13x2 * (-2 * c20.y * c22.y - c21y2) + c11.x * c12.y * c13x2 * (-4 * c20.y * c22.y - 2 * c21y2) + c10.x * c13x2 * c13.y * (-6 * c20.y * c22.y - 3 * c21y2) + c20.x * c13x2 * c13.y * (6 * c20.y * c22.y + 3 * c21y2) + c13x3 * (-2 * c20.y * c21y2 - c20y2 * c22.y - c20.y * (2 * c20.y * c22.y + c21y2)), -c10.x * c11.x * c12.y * c13.x * c21.y * c13.y + c10.x * c11.y * c12.x * c13.x * c21.y * c13.y + 6 * c10.x * c11.y * c21.x * c12.y * c13.x * c13.y - 6 * c10.y * c11.x * c12.x * c13.x * c21.y * c13.y - c10.y * c11.x * c21.x * c12.y * c13.x * c13.y + c10.y * c11.y * c12.x * c21.x * c13.x * c13.y - c11.x * c11.y * c12.x * c21.x * c12.y * c13.y + c11.x * c11.y * c12.x * c12.y * c13.x * c21.y + c11.x * c20.x * c12.y * c13.x * c21.y * c13.y + 6 * c11.x * c12.x * c20.y * c13.x * c21.y * c13.y + c11.x * c20.y * c21.x * c12.y * c13.x * c13.y - c20.x * c11.y * c12.x * c13.x * c21.y * c13.y - 6 * c20.x * c11.y * c21.x * c12.y * c13.x * c13.y - c11.y * c12.x * c20.y * c21.x * c13.x * c13.y - 6 * c10.x * c20.x * c21.x * c13y3 - 2 * c10.x * c21.x * c12y3 * c13.x + 6 * c10.y * c20.y * c13x3 * c21.y + 2 * c20.x * c21.x * c12y3 * c13.x + 2 * c10.y * c12x3 * c21.y * c13.y - 2 * c12x3 * c20.y * c21.y * c13.y - 6 * c10.x * c10.y * c21.x * c13.x * c13y2 + 3 * c10.x * c11.x * c12.x * c21.y * c13y2 - 2 * c10.x * c11.x * c21.x * c12.y * c13y2 - 4 * c10.x * c11.y * c12.x * c21.x * c13y2 + 3 * c10.y * c11.x * c12.x * c21.x * c13y2 + 6 * c10.x * c10.y * c13x2 * c21.y * c13.y + 6 * c10.x * c20.x * c13.x * c21.y * c13y2 - 3 * c10.x * c11.y * c12.y * c13x2 * c21.y + 2 * c10.x * c12.x * c21.x * c12y2 * c13.y + 2 * c10.x * c12.x * c12y2 * c13.x * c21.y + 6 * c10.x * c20.y * c21.x * c13.x * c13y2 + 4 * c10.y * c11.x * c12.y * c13x2 * c21.y + 6 * c10.y * c20.x * c21.x * c13.x * c13y2 + 2 * c10.y * c11.y * c12.x * c13x2 * c21.y - 3 * c10.y * c11.y * c21.x * c12.y * c13x2 + 2 * c10.y * c12.x * c21.x * c12y2 * c13.x - 3 * c11.x * c20.x * c12.x * c21.y * c13y2 + 2 * c11.x * c20.x * c21.x * c12.y * c13y2 + c11.x * c11.y * c21.x * c12y2 * c13.x - 3 * c11.x * c12.x * c20.y * c21.x * c13y2 + 4 * c20.x * c11.y * c12.x * c21.x * c13y2 - 6 * c10.x * c20.y * c13x2 * c21.y * c13.y - 2 * c10.x * c12x2 * c12.y * c21.y * c13.y - 6 * c10.y * c20.x * c13x2 * c21.y * c13.y - 6 * c10.y * c20.y * c21.x * c13x2 * c13.y - 2 * c10.y * c12x2 * c21.x * c12.y * c13.y - 2 * c10.y * c12x2 * c12.y * c13.x * c21.y - c11.x * c11.y * c12x2 * c21.y * c13.y - 4 * c11.x * c20.y * c12.y * c13x2 * c21.y - 2 * c11.x * c11y2 * c21.x * c13.x * c13.y + 3 * c20.x * c11.y * c12.y * c13x2 * c21.y - 2 * c20.x * c12.x * c21.x * c12y2 * c13.y - 2 * c20.x * c12.x * c12y2 * c13.x * c21.y - 6 * c20.x * c20.y * c21.x * c13.x * c13y2 - 2 * c11.y * c12.x * c20.y * c13x2 * c21.y + 3 * c11.y * c20.y * c21.x * c12.y * c13x2 - 2 * c12.x * c20.y * c21.x * c12y2 * c13.x - c11y2 * c12.x * c21.x * c12.y * c13.x + 6 * c20.x * c20.y * c13x2 * c21.y * c13.y + 2 * c20.x * c12x2 * c12.y * c21.y * c13.y + 2 * c11x2 * c11.y * c13.x * c21.y * c13.y + c11x2 * c12.x * c12.y * c21.y * c13.y + 2 * c12x2 * c20.y * c21.x * c12.y * c13.y + 2 * c12x2 * c20.y * c12.y * c13.x * c21.y + 3 * c10x2 * c21.x * c13y3 - 3 * c10y2 * c13x3 * c21.y + 3 * c20x2 * c21.x * c13y3 + c11y3 * c21.x * c13x2 - c11x3 * c21.y * c13y2 - 3 * c20y2 * c13x3 * c21.y - c11.x * c11y2 * c13x2 * c21.y + c11x2 * c11.y * c21.x * c13y2 - 3 * c10x2 * c13.x * c21.y * c13y2 + 3 * c10y2 * c21.x * c13x2 * c13.y - c11x2 * c12y2 * c13.x * c21.y + c11y2 * c12x2 * c21.x * c13.y - 3 * c20x2 * c13.x * c21.y * c13y2 + 3 * c20y2 * c21.x * c13x2 * c13.y, c10.x * c10.y * c11.x * c12.y * c13.x * c13.y - c10.x * c10.y * c11.y * c12.x * c13.x * c13.y + c10.x * c11.x * c11.y * c12.x * c12.y * c13.y - c10.y * c11.x * c11.y * c12.x * c12.y * c13.x - c10.x * c11.x * c20.y * c12.y * c13.x * c13.y + 6 * c10.x * c20.x * c11.y * c12.y * c13.x * c13.y + c10.x * c11.y * c12.x * c20.y * c13.x * c13.y - c10.y * c11.x * c20.x * c12.y * c13.x * c13.y - 6 * c10.y * c11.x * c12.x * c20.y * c13.x * c13.y + c10.y * c20.x * c11.y * c12.x * c13.x * c13.y - c11.x * c20.x * c11.y * c12.x * c12.y * c13.y + c11.x * c11.y * c12.x * c20.y * c12.y * c13.x + c11.x * c20.x * c20.y * c12.y * c13.x * c13.y - c20.x * c11.y * c12.x * c20.y * c13.x * c13.y - 2 * c10.x * c20.x * c12y3 * c13.x + 2 * c10.y * c12x3 * c20.y * c13.y - 3 * c10.x * c10.y * c11.x * c12.x * c13y2 - 6 * c10.x * c10.y * c20.x * c13.x * c13y2 + 3 * c10.x * c10.y * c11.y * c12.y * c13x2 - 2 * c10.x * c10.y * c12.x * c12y2 * c13.x - 2 * c10.x * c11.x * c20.x * c12.y * c13y2 - c10.x * c11.x * c11.y * c12y2 * c13.x + 3 * c10.x * c11.x * c12.x * c20.y * c13y2 - 4 * c10.x * c20.x * c11.y * c12.x * c13y2 + 3 * c10.y * c11.x * c20.x * c12.x * c13y2 + 6 * c10.x * c10.y * c20.y * c13x2 * c13.y + 2 * c10.x * c10.y * c12x2 * c12.y * c13.y + 2 * c10.x * c11.x * c11y2 * c13.x * c13.y + 2 * c10.x * c20.x * c12.x * c12y2 * c13.y + 6 * c10.x * c20.x * c20.y * c13.x * c13y2 - 3 * c10.x * c11.y * c20.y * c12.y * c13x2 + 2 * c10.x * c12.x * c20.y * c12y2 * c13.x + c10.x * c11y2 * c12.x * c12.y * c13.x + c10.y * c11.x * c11.y * c12x2 * c13.y + 4 * c10.y * c11.x * c20.y * c12.y * c13x2 - 3 * c10.y * c20.x * c11.y * c12.y * c13x2 + 2 * c10.y * c20.x * c12.x * c12y2 * c13.x + 2 * c10.y * c11.y * c12.x * c20.y * c13x2 + c11.x * c20.x * c11.y * c12y2 * c13.x - 3 * c11.x * c20.x * c12.x * c20.y * c13y2 - 2 * c10.x * c12x2 * c20.y * c12.y * c13.y - 6 * c10.y * c20.x * c20.y * c13x2 * c13.y - 2 * c10.y * c20.x * c12x2 * c12.y * c13.y - 2 * c10.y * c11x2 * c11.y * c13.x * c13.y - c10.y * c11x2 * c12.x * c12.y * c13.y - 2 * c10.y * c12x2 * c20.y * c12.y * c13.x - 2 * c11.x * c20.x * c11y2 * c13.x * c13.y - c11.x * c11.y * c12x2 * c20.y * c13.y + 3 * c20.x * c11.y * c20.y * c12.y * c13x2 - 2 * c20.x * c12.x * c20.y * c12y2 * c13.x - c20.x * c11y2 * c12.x * c12.y * c13.x + 3 * c10y2 * c11.x * c12.x * c13.x * c13.y + 3 * c11.x * c12.x * c20y2 * c13.x * c13.y + 2 * c20.x * c12x2 * c20.y * c12.y * c13.y - 3 * c10x2 * c11.y * c12.y * c13.x * c13.y + 2 * c11x2 * c11.y * c20.y * c13.x * c13.y + c11x2 * c12.x * c20.y * c12.y * c13.y - 3 * c20x2 * c11.y * c12.y * c13.x * c13.y - c10x3 * c13y3 + c10y3 * c13x3 + c20x3 * c13y3 - c20y3 * c13x3 - 3 * c10.x * c20x2 * c13y3 - c10.x * c11y3 * c13x2 + 3 * c10x2 * c20.x * c13y3 + c10.y * c11x3 * c13y2 + 3 * c10.y * c20y2 * c13x3 + c20.x * c11y3 * c13x2 + c10x2 * c12y3 * c13.x - 3 * c10y2 * c20.y * c13x3 - c10y2 * c12x3 * c13.y + c20x2 * c12y3 * c13.x - c11x3 * c20.y * c13y2 - c12x3 * c20y2 * c13.y - c10.x * c11x2 * c11.y * c13y2 + c10.y * c11.x * c11y2 * c13x2 - 3 * c10.x * c10y2 * c13x2 * c13.y - c10.x * c11y2 * c12x2 * c13.y + c10.y * c11x2 * c12y2 * c13.x - c11.x * c11y2 * c20.y * c13x2 + 3 * c10x2 * c10.y * c13.x * c13y2 + c10x2 * c11.x * c12.y * c13y2 + 2 * c10x2 * c11.y * c12.x * c13y2 - 2 * c10y2 * c11.x * c12.y * c13x2 - c10y2 * c11.y * c12.x * c13x2 + c11x2 * c20.x * c11.y * c13y2 - 3 * c10.x * c20y2 * c13x2 * c13.y + 3 * c10.y * c20x2 * c13.x * c13y2 + c11.x * c20x2 * c12.y * c13y2 - 2 * c11.x * c20y2 * c12.y * c13x2 + c20.x * c11y2 * c12x2 * c13.y - c11.y * c12.x * c20y2 * c13x2 - c10x2 * c12.x * c12y2 * c13.y - 3 * c10x2 * c20.y * c13.x * c13y2 + 3 * c10y2 * c20.x * c13x2 * c13.y + c10y2 * c12x2 * c12.y * c13.x - c11x2 * c20.y * c12y2 * c13.x + 2 * c20x2 * c11.y * c12.x * c13y2 + 3 * c20.x * c20y2 * c13x2 * c13.y - c20x2 * c12.x * c12y2 * c13.y - 3 * c20x2 * c20.y * c13.x * c13y2 + c12x2 * c20y2 * c12.y * c13.x);
    var roots = poly.getRootsInInterval(0, 1);
    for (var i = 0; i < roots.length; i++) {
      var s = roots[i];
      var xRoots = new Polynomial(c13.x, c12.x, c11.x, c10.x - c20.x - s * c21.x - s * s * c22.x - s * s * s * c23.x).getRoots();
      var yRoots = new Polynomial(c13.y, c12.y, c11.y, c10.y - c20.y - s * c21.y - s * s * c22.y - s * s * s * c23.y).getRoots();
      if (xRoots.length > 0 && yRoots.length > 0) {
        var TOLERANCE = 1e-4;
        checkRoots:for (var j = 0; j < xRoots.length; j++) {
          var xRoot = xRoots[j];
          if (0 <= xRoot && xRoot <= 1) {
            for (var k = 0; k < yRoots.length; k++) {
              if (Math.abs(xRoot - yRoots[k]) < TOLERANCE) {
                result.points.push(c23.multiply(s * s * s).add(c22.multiply(s * s).add(c21.multiply(s).add(c20))));
                break checkRoots;
              }
            }
          }
        }
      }
    }
    return result;
  }

  static intersectBezier3Circle(p1, p2, p3, p4, c, r) {
    return Intersection.intersectBezier3Ellipse(p1, p2, p3, p4, c, r, r);
  }

  static intersectBezier3Ellipse(p1, p2, p3, p4, ec, rx, ry) {
    var a, b, c, d;
    var c3, c2, c1, c0;
    var result = new Intersection();
    a = p1.multiply(-1);
    b = p2.multiply(3);
    c = p3.multiply(-3);
    d = a.add(b.add(c.add(p4)));
    c3 = new Vector2D(d.x, d.y);
    a = p1.multiply(3);
    b = p2.multiply(-6);
    c = p3.multiply(3);
    d = a.add(b.add(c));
    c2 = new Vector2D(d.x, d.y);
    a = p1.multiply(-3);
    b = p2.multiply(3);
    c = a.add(b);
    c1 = new Vector2D(c.x, c.y);
    c0 = new Vector2D(p1.x, p1.y);
    var rxrx = rx * rx;
    var ryry = ry * ry;
    var poly = new Polynomial(c3.x * c3.x * ryry + c3.y * c3.y * rxrx, 2 * (c3.x * c2.x * ryry + c3.y * c2.y * rxrx), 2 * (c3.x * c1.x * ryry + c3.y * c1.y * rxrx) + c2.x * c2.x * ryry + c2.y * c2.y * rxrx, 2 * c3.x * ryry * (c0.x - ec.x) + 2 * c3.y * rxrx * (c0.y - ec.y) + 2 * (c2.x * c1.x * ryry + c2.y * c1.y * rxrx), 2 * c2.x * ryry * (c0.x - ec.x) + 2 * c2.y * rxrx * (c0.y - ec.y) + c1.x * c1.x * ryry + c1.y * c1.y * rxrx, 2 * c1.x * ryry * (c0.x - ec.x) + 2 * c1.y * rxrx * (c0.y - ec.y), c0.x * c0.x * ryry - 2 * c0.y * ec.y * rxrx - 2 * c0.x * ec.x * ryry + c0.y * c0.y * rxrx + ec.x * ec.x * ryry + ec.y * ec.y * rxrx - rxrx * ryry);
    var roots = poly.getRootsInInterval(0, 1);
    for (var i = 0; i < roots.length; i++) {
      var t = roots[i];
      result.points.push(c3.multiply(t * t * t).add(c2.multiply(t * t).add(c1.multiply(t).add(c0))));
    }
    return result;
  }

  static intersectBezier3Line(p1, p2, p3, p4, a1, a2) {
    var a, b, c, d;
    var c3, c2, c1, c0;
    var cl;
    var n;
    var min = a1.min(a2);
    var max = a1.max(a2);
    var result = new Intersection();
    a = p1.multiply(-1);
    b = p2.multiply(3);
    c = p3.multiply(-3);
    d = a.add(b.add(c.add(p4)));
    c3 = new Vector2D(d.x, d.y);
    a = p1.multiply(3);
    b = p2.multiply(-6);
    c = p3.multiply(3);
    d = a.add(b.add(c));
    c2 = new Vector2D(d.x, d.y);
    a = p1.multiply(-3);
    b = p2.multiply(3);
    c = a.add(b);
    c1 = new Vector2D(c.x, c.y);
    c0 = new Vector2D(p1.x, p1.y);
    n = new Vector2D(a1.y - a2.y, a2.x - a1.x);
    cl = a1.x * a2.y - a2.x * a1.y;
    var roots = new Polynomial(n.dot(c3), n.dot(c2), n.dot(c1), n.dot(c0) + cl).getRoots();
    for (var i = 0; i < roots.length; i++) {
      var t = roots[i];
      if (0 <= t && t <= 1) {
        var p5 = p1.lerp(p2, t);
        var p6 = p2.lerp(p3, t);
        var p7 = p3.lerp(p4, t);
        var p8 = p5.lerp(p6, t);
        var p9 = p6.lerp(p7, t);
        var p10 = p8.lerp(p9, t);
        if (a1.x === a2.x) {
          if (min.y <= p10.y && p10.y <= max.y) {
            result.appendPoint(p10);
          }
        } else if (a1.y === a2.y) {
          if (min.x <= p10.x && p10.x <= max.x) {
            result.appendPoint(p10);
          }
        } else if (p10.gte(min) && p10.lte(max)) {
          result.appendPoint(p10);
        }
      }
    }
    return result;
  }

  static intersectBezier3Polygon(p1, p2, p3, p4, points) {
    var result = new Intersection();
    var length = points.length;
    for (var i = 0; i < length; i++) {
      var a1 = points[i];
      var a2 = points[(i + 1) % length];
      var inter = Intersection.intersectBezier3Line(p1, p2, p3, p4, a1, a2);
      result.appendPoints(inter.points);
    }
    return result;
  }

  static intersectBezier3Rectangle(p1, p2, p3, p4, r1, r2) {
    var min = r1.min(r2);
    var max = r1.max(r2);
    var topRight = new Vector2D(max.x, min.y);
    var bottomLeft = new Vector2D(min.x, max.y);
    var inter1 = Intersection.intersectBezier3Line(p1, p2, p3, p4, min, topRight);
    var inter2 = Intersection.intersectBezier3Line(p1, p2, p3, p4, topRight, max);
    var inter3 = Intersection.intersectBezier3Line(p1, p2, p3, p4, max, bottomLeft);
    var inter4 = Intersection.intersectBezier3Line(p1, p2, p3, p4, bottomLeft, min);
    var result = new Intersection();
    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);
    return result;
  }

  static intersectCircleCircle(c1, r1, c2, r2) {
    var result;
    var r_max = r1 + r2;
    var r_min = Math.abs(r1 - r2);
    var c_dist = c1.distanceFrom(c2);
    if (c_dist > r_max) {
      result = new Intersection('Outside');
    } else if (c_dist < r_min) {
      result = new Intersection('Inside');
    } else {
      result = new Intersection('Intersection');
      var a = (r1 * r1 - r2 * r2 + c_dist * c_dist) / (2 * c_dist);
      var h = Math.sqrt(r1 * r1 - a * a);
      var p = c1.lerp(c2, a / c_dist);
      var b = h / c_dist;
      result.points.push(new Vector2D(p.x - b * (c2.y - c1.y), p.y + b * (c2.x - c1.x)));
      result.points.push(new Vector2D(p.x + b * (c2.y - c1.y), p.y - b * (c2.x - c1.x)));
    }
    return result;
  }

  static intersectCircleEllipse(cc, r, ec, rx, ry) {
    return Intersection.intersectEllipseEllipse(cc, r, r, ec, rx, ry);
  }

  static intersectCircleLine(c, r, a1, a2) {
    var result;
    var a = (a2.x - a1.x) * (a2.x - a1.x) + (a2.y - a1.y) * (a2.y - a1.y);
    var b = 2 * ((a2.x - a1.x) * (a1.x - c.x) + (a2.y - a1.y) * (a1.y - c.y));
    var cc = c.x * c.x + c.y * c.y + a1.x * a1.x + a1.y * a1.y - 2 * (c.x * a1.x + c.y * a1.y) - r * r;
    var deter = b * b - 4 * a * cc;
    if (deter < 0) {
      result = new Intersection('Outside');
    } else if (deter === 0) {
      result = new Intersection('Tangent');
    } else {
      var e = Math.sqrt(deter);
      var u1 = (-b + e) / (2 * a);
      var u2 = (-b - e) / (2 * a);
      if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
        if ((u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1)) {
          result = new Intersection('Outside');
        } else {
          result = new Intersection('Inside');
        }
      } else {
        result = new Intersection('Intersection');
        if (0 <= u1 && u1 <= 1) {
          result.points.push(a1.lerp(a2, u1));
        }
        if (0 <= u2 && u2 <= 1) {
          result.points.push(a1.lerp(a2, u2));
        }
      }
    }
    return result;
  }

  static intersectCirclePolygon(c, r, points) {
    var result = new Intersection();
    var length = points.length;
    var inter;
    for (var i = 0; i < length; i++) {
      var a1 = points[i];
      var a2 = points[(i + 1) % length];
      inter = Intersection.intersectCircleLine(c, r, a1, a2);
      result.appendPoints(inter.points);
    }
    if (result.points.length > 0) {
      result.status = 'Intersection';
    } else {
      result.status = inter.status;
    }
    return result;
  }

  static intersectCircleRectangle(c, r, r1, r2) {
    var min = r1.min(r2);
    var max = r1.max(r2);
    var topRight = new Vector2D(max.x, min.y);
    var bottomLeft = new Vector2D(min.x, max.y);
    var inter1 = Intersection.intersectCircleLine(c, r, min, topRight);
    var inter2 = Intersection.intersectCircleLine(c, r, topRight, max);
    var inter3 = Intersection.intersectCircleLine(c, r, max, bottomLeft);
    var inter4 = Intersection.intersectCircleLine(c, r, bottomLeft, min);
    var result = new Intersection();
    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);
    if (result.points.length > 0) {
      result.status = 'Intersection';
    } else {
      result.status = inter1.status;
    }
    return result;
  }

  static intersectEllipseEllipse(c1, rx1, ry1, c2, rx2, ry2) {
    var a = [ry1 * ry1, 0, rx1 * rx1, -2 * ry1 * ry1 * c1.x, -2 * rx1 * rx1 * c1.y, ry1 * ry1 * c1.x * c1.x + rx1 * rx1 * c1.y * c1.y - rx1 * rx1 * ry1 * ry1];
    var b = [ry2 * ry2, 0, rx2 * rx2, -2 * ry2 * ry2 * c2.x, -2 * rx2 * rx2 * c2.y, ry2 * ry2 * c2.x * c2.x + rx2 * rx2 * c2.y * c2.y - rx2 * rx2 * ry2 * ry2];
    var yPoly = Intersection.bezout(a, b);
    var yRoots = yPoly.getRoots();
    var epsilon = 1e-3;
    var norm0 = (a[0] * a[0] + 2 * a[1] * a[1] + a[2] * a[2]) * epsilon;
    var norm1 = (b[0] * b[0] + 2 * b[1] * b[1] + b[2] * b[2]) * epsilon;
    var result = new Intersection();
    for (var y = 0; y < yRoots.length; y++) {
      var xPoly = new Polynomial(a[0], a[3] + yRoots[y] * a[1], a[5] + yRoots[y] * (a[4] + yRoots[y] * a[2]));
      var xRoots = xPoly.getRoots();
      for (var x = 0; x < xRoots.length; x++) {
        var test = (a[0] * xRoots[x] + a[1] * yRoots[y] + a[3]) * xRoots[x] + (a[2] * yRoots[y] + a[4]) * yRoots[y] + a[5];
        if (Math.abs(test) < norm0) {
          test = (b[0] * xRoots[x] + b[1] * yRoots[y] + b[3]) * xRoots[x] + (b[2] * yRoots[y] + b[4]) * yRoots[y] + b[5];
          if (Math.abs(test) < norm1) {
            result.appendPoint(new Vector2D(xRoots[x], yRoots[y]));
          }
        }
      }
    }
    return result;
  }

  static intersectEllipseLine(c, rx, ry, a1, a2) {
    var result;
    var origin = new Vector2D(a1.x, a1.y);
    var dir = Vector2D.fromPoints(a1, a2);
    var center = new Vector2D(c.x, c.y);
    var diff = origin.subtract(center);
    var mDir = new Vector2D(dir.x / (rx * rx), dir.y / (ry * ry));
    var mDiff = new Vector2D(diff.x / (rx * rx), diff.y / (ry * ry));
    var a = dir.dot(mDir);
    var b = dir.dot(mDiff);
    c = diff.dot(mDiff) - 1.0;
    var d = b * b - a * c;
    if (d < 0) {
      result = new Intersection('Outside');
    } else if (d > 0) {
      var root = Math.sqrt(d);
      var t_a = (-b - root) / a;
      var t_b = (-b + root) / a;
      if ((t_a < 0 || 1 < t_a) && (t_b < 0 || 1 < t_b)) {
        if ((t_a < 0 && t_b < 0) || (t_a > 1 && t_b > 1)) {
          result = new Intersection('Outside');
        } else {
          result = new Intersection('Inside');
        }
      } else {
        result = new Intersection('Intersection');
        if (0 <= t_a && t_a <= 1) {
          result.appendPoint(a1.lerp(a2, t_a));
        }
        if (0 <= t_b && t_b <= 1) {
          result.appendPoint(a1.lerp(a2, t_b));
        }
      }
    } else {
      var t = -b / a;
      if (0 <= t && t <= 1) {
        result = new Intersection('Intersection');
        result.appendPoint(a1.lerp(a2, t));
      } else {
        result = new Intersection('Outside');
      }
    }
    return result;
  }

  static intersectEllipsePolygon(c, rx, ry, points) {
    var result = new Intersection();
    var length = points.length;
    for (var i = 0; i < length; i++) {
      var b1 = points[i];
      var b2 = points[(i + 1) % length];
      var inter = Intersection.intersectEllipseLine(c, rx, ry, b1, b2);
      result.appendPoints(inter.points);
    }
    return result;
  }

  static intersectEllipseRectangle(c, rx, ry, r1, r2) {
    var min = r1.min(r2);
    var max = r1.max(r2);
    var topRight = new Vector2D(max.x, min.y);
    var bottomLeft = new Vector2D(min.x, max.y);
    var inter1 = Intersection.intersectEllipseLine(c, rx, ry, min, topRight);
    var inter2 = Intersection.intersectEllipseLine(c, rx, ry, topRight, max);
    var inter3 = Intersection.intersectEllipseLine(c, rx, ry, max, bottomLeft);
    var inter4 = Intersection.intersectEllipseLine(c, rx, ry, bottomLeft, min);
    var result = new Intersection();
    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);
    return result;
  }

  static intersectLineLine(a1, a2, b1, b2) {
    var result;
    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
    if (u_b !== 0) {
      var ua = ua_t / u_b;
      var ub = ub_t / u_b;
      if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
        result = new Intersection('Intersection');
        result.points.push(new Vector2D(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
      } else {
        result = new Intersection();
      }
    } else {
      if (ua_t === 0 || ub_t === 0) {
        result = new Intersection('Coincident');
      } else {
        result = new Intersection('Parallel');
      }
    }
    return result;
  }

  static intersectLinePolygon(a1, a2, points) {
    var result = new Intersection();
    var length = points.length;
    for (var i = 0; i < length; i++) {
      var b1 = points[i];
      var b2 = points[(i + 1) % length];
      var inter = Intersection.intersectLineLine(a1, a2, b1, b2);
      result.appendPoints(inter.points);
    }
    return result;
  }

  static intersectLineRectangle(a1, a2, r1, r2) {
    var min = r1.min(r2);
    var max = r1.max(r2);
    var topRight = new Vector2D(max.x, min.y);
    var bottomLeft = new Vector2D(min.x, max.y);
    var inter1 = Intersection.intersectLineLine(min, topRight, a1, a2);
    var inter2 = Intersection.intersectLineLine(topRight, max, a1, a2);
    var inter3 = Intersection.intersectLineLine(max, bottomLeft, a1, a2);
    var inter4 = Intersection.intersectLineLine(bottomLeft, min, a1, a2);
    var result = new Intersection();
    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);
    return result;
  }

  static intersectPolygonPolygon(points1, points2) {
    var result = new Intersection();
    var length = points1.length;
    for (var i = 0; i < length; i++) {
      var a1 = points1[i];
      var a2 = points1[(i + 1) % length];
      var inter = Intersection.intersectLinePolygon(a1, a2, points2);
      result.appendPoints(inter.points);
    }
    return result;
  }

  static intersectPolygonRectangle(points, r1, r2) {
    var min = r1.min(r2);
    var max = r1.max(r2);
    var topRight = new Vector2D(max.x, min.y);
    var bottomLeft = new Vector2D(min.x, max.y);
    var inter1 = Intersection.intersectLinePolygon(min, topRight, points);
    var inter2 = Intersection.intersectLinePolygon(topRight, max, points);
    var inter3 = Intersection.intersectLinePolygon(max, bottomLeft, points);
    var inter4 = Intersection.intersectLinePolygon(bottomLeft, min, points);
    var result = new Intersection();
    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);
    return result;
  }

  static intersectRayRay(a1, a2, b1, b2) {
    var result;
    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
    if (u_b !== 0) {
      var ua = ua_t / u_b;
      result = new Intersection('Intersection');
      result.points.push(new Vector2D(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
    } else {
      if (ua_t === 0 || ub_t === 0) {
        result = new Intersection('Coincident');
      } else {
        result = new Intersection('Parallel');
      }
    }
    return result;
  }

  static intersectRectangleRectangle(a1, a2, b1, b2) {
    var min = a1.min(a2);
    var max = a1.max(a2);
    var topRight = new Vector2D(max.x, min.y);
    var bottomLeft = new Vector2D(min.x, max.y);
    var inter1 = Intersection.intersectLineRectangle(min, topRight, b1, b2);
    var inter2 = Intersection.intersectLineRectangle(topRight, max, b1, b2);
    var inter3 = Intersection.intersectLineRectangle(max, bottomLeft, b1, b2);
    var inter4 = Intersection.intersectLineRectangle(bottomLeft, min, b1, b2);
    var result = new Intersection();
    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);
    return result;
  }

  static bezout(e1, e2) {
    var AB = e1[0] * e2[1] - e2[0] * e1[1];
    var AC = e1[0] * e2[2] - e2[0] * e1[2];
    var AD = e1[0] * e2[3] - e2[0] * e1[3];
    var AE = e1[0] * e2[4] - e2[0] * e1[4];
    var AF = e1[0] * e2[5] - e2[0] * e1[5];
    var BC = e1[1] * e2[2] - e2[1] * e1[2];
    var BE = e1[1] * e2[4] - e2[1] * e1[4];
    var BF = e1[1] * e2[5] - e2[1] * e1[5];
    var CD = e1[2] * e2[3] - e2[2] * e1[3];
    var DE = e1[3] * e2[4] - e2[3] * e1[4];
    var DF = e1[3] * e2[5] - e2[3] * e1[5];
    var BFpDE = BF + DE;
    var BEmCD = BE - CD;
    return new Polynomial(AB * BC - AC * AC, AB * BEmCD + AD * BC - 2 * AC * AE, AB * BFpDE + AD * BEmCD - AE * AE - 2 * AC * AF, AB * DF + AD * BFpDE - 2 * AE * AF, AD * DF - AF * AF);
  }
}

export function vec(x : number, y: number): Vector2D;
export function vec(vec: { x: number; y: number}): Vector2D;
export function vec(x: any, y: number = Number.NaN): Vector2D {
  if (typeof x === 'number') {
    return new Vector2D(<number>x,y);
  } else {
    return new Vector2D(x.x, x.y);
  }
}

export class Vector2D {
  constructor(public x = 0, public y = 0) {

  }

  add(that : Vector2D) {
    return new Vector2D(this.x + that.x, this.y + that.y);
  }

  addEquals(that : Vector2D) {
    this.x += that.x;
    this.y += that.y;
    return this;
  }

  scalarAdd(scalar : number) {
    return new Vector2D(this.x + scalar, this.y + scalar);
  }

  scalarAddEquals(scalar: number) {
    this.x += scalar;
    this.y += scalar;
    return this;
  }

  subtract(that : Vector2D) {
    return new Vector2D(this.x - that.x, this.y - that.y);
  }

  subtractEquals(that : Vector2D) {
    this.x -= that.x;
    this.y -= that.y;
    return this;
  }

  scalarSubtract(scalar: number) {
    return new Vector2D(this.x - scalar, this.y - scalar);
  }

  scalarSubtractEquals(scalar: number) {
    this.x -= scalar;
    this.y -= scalar;
    return this;
  }

  multiply(scalar: number) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  multiplyEquals(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  divide(scalar: number) {
    return new Vector2D(this.x / scalar, this.y / scalar);
  }

  divideEquals(scalar: number) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  eq(that : Vector2D) {
    return (this.x === that.x && this.y === that.y);
  }

  lt(that : Vector2D) {
    return (this.x < that.x && this.y < that.y);
  }

  lte(that : Vector2D) {
    return (this.x <= that.x && this.y <= that.y);
  }

  gt(that : Vector2D) {
    return (this.x > that.x && this.y > that.y);
  }

  gte(that : Vector2D) {
    return (this.x >= that.x && this.y >= that.y);
  }

  lerp(that : Vector2D, t: number) {
    return new Vector2D(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
  }

  distanceFrom(that : Vector2D) {
    var dx = this.x - that.x;
    var dy = this.y - that.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  min(that : Vector2D) {
    return new Vector2D(Math.min(this.x, that.x), Math.min(this.y, that.y));
  }

  max(that : Vector2D) {
    return new Vector2D(Math.max(this.x, that.x), Math.max(this.y, that.y));
  }

  toString() {
    return this.x + ',' + this.y;
  }

  setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setFromPoint(that : Vector2D) {
    this.x = that.x;
    this.y = that.y;
  }

  swap(that : Vector2D) {
    var x = this.x;
    var y = this.y;
    this.x = that.x;
    this.y = that.y;
    that.x = x;
    that.y = y;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  dot(that: Vector2D) {
    return this.x * that.x + this.y * that.y;
  }

  cross(that : Vector2D) {
    return this.x * that.y - this.y * that.x;
  }
  unit() {
    return this.divide(this.length());
  }
  unitEquals() {
    this.divideEquals(this.length());
    return this;
  }
  perp() {
    return new Vector2D(-this.y, this.x);
  }

  static fromPoints(p1, p2): Vector2D {
    return new Vector2D(p2.x - p1.x, p2.y - p1.y);
  }
}

class Polynomial {
  static TOLERANCE = 1e-6;
  static ACCURACY = 6;

  coefs:any[] = [];

  constructor(...coefs:number[]) {
    for (var i = coefs.length - 1; i >= 0; i--) {
      this.coefs.push(coefs[i]);
    }
  }

  eval(x) {
    var result = 0;
    for (var i = this.coefs.length - 1; i >= 0; i--) {
      result = result * x + this.coefs[i];
    }
    return result;
  }

  multiply(that) {
    var result = new Polynomial();
    var i;
    for (i = 0; i <= this.getDegree() + that.getDegree(); i++) {
      result.coefs.push(0);
    }
    for (i = 0; i <= this.getDegree(); i++) {
      for (var j = 0; j <= that.getDegree(); j++) {
        result.coefs[i + j] += this.coefs[i] * that.coefs[j];
      }
    }
    return result;
  }

  divide_scalar(scalar) {
    for (var i = 0; i < this.coefs.length; i++) {
      this.coefs[i] /= scalar;
    }
  }

  simplify() {
    for (var i = this.getDegree(); i >= 0; i--) {
      if (Math.abs(this.coefs[i]) <= Polynomial.TOLERANCE) {
        this.coefs.pop();
      } else {
        break;
      }
    }
  }

  bisection(min, max) {
    var minValue = this.eval(min);
    var maxValue = this.eval(max);
    var result;
    if (Math.abs(minValue) <= Polynomial.TOLERANCE) {
      result = min;
    } else if (Math.abs(maxValue) <= Polynomial.TOLERANCE) {
      result = max;
    } else if (minValue * maxValue <= 0) {
      var tmp1 = Math.log(max - min);
      var tmp2 = Math.log(10) * Polynomial.ACCURACY;
      var iters = Math.ceil((tmp1 + tmp2) / Math.log(2));
      for (var i = 0; i < iters; i++) {
        result = 0.5 * (min + max);
        var value = this.eval(result);
        if (Math.abs(value) <= Polynomial.TOLERANCE) {
          break;
        }
        if (value * minValue < 0) {
          max = result;
          maxValue = value;
        } else {
          min = result;
          minValue = value;
        }
      }
    }
    return result;
  }

  toString() {
    var coefs = new Array();
    var signs = new Array();
    var i;
    for (i = this.coefs.length - 1; i >= 0; i--) {
      var value = this.coefs[i];
      if (value !== 0) {
        var sign = (value < 0) ? ' - ' : ' + ';
        value = Math.abs(value);
        if (i > 0 && value === 1) {
          value = 'x';
        } else {
          value += 'x';
        }
        if (i > 1) {
          value += '^' + i;
        }
        signs.push(sign);
        coefs.push(value);
      }
    }
    signs[0] = (signs[0] === ' + ') ? '' : '-';
    var result = '';
    for (i = 0; i < coefs.length; i++) {
      result += signs[i] + coefs[i];
    }
    return result;
  }

  getDegree() {
    return this.coefs.length - 1;
  }

  getDerivative() {
    var derivative = new Polynomial();
    for (var i = 1; i < this.coefs.length; i++) {
      derivative.coefs.push(i * this.coefs[i]);
    }
    return derivative;
  }

  getRoots() {
    var result;
    this.simplify();
    switch (this.getDegree()) {
      case 0:
        result = new Array();
        break;
      case 1:
        result = this.getLinearRoot();
        break;
      case 2:
        result = this.getQuadraticRoots();
        break;
      case 3:
        result = this.getCubicRoots();
        break;
      case 4:
        result = this.getQuarticRoots();
        break;
      default:
        result = new Array();
    }
    return result;
  }

  getRootsInInterval(min, max) {
    var roots = new Array(), i;
    var root;
    if (this.getDegree() === 1) {
      root = this.bisection(min, max);
      if (root != null) {
        roots.push(root);
      }
    } else {
      var deriv = this.getDerivative();
      var droots = deriv.getRootsInInterval(min, max);
      if (droots.length > 0) {
        root = this.bisection(min, droots[0]);
        if (root != null) {
          roots.push(root);
        }
        for (i = 0; i <= droots.length - 2; i++) {
          root = this.bisection(droots[i], droots[i + 1]);
          if (root != null) {
            roots.push(root);
          }
        }
        root = this.bisection(droots[droots.length - 1], max);
        if (root != null) {
          roots.push(root);
        }
      } else {
        root = this.bisection(min, max);
        if (root != null) {
          roots.push(root);
        }
      }
    }
    return roots;
  }

  getLinearRoot() {
    var result = new Array();
    var a = this.coefs[1];
    if (a !== 0) {
      result.push(-this.coefs[0] / a);
    }
    return result;
  }

  getQuadraticRoots() {
    var results = new Array();
    if (this.getDegree() === 2) {
      var a = this.coefs[2];
      var b = this.coefs[1] / a;
      var c = this.coefs[0] / a;
      var d = b * b - 4 * c;
      if (d > 0) {
        var e = Math.sqrt(d);
        results.push(0.5 * (-b + e));
        results.push(0.5 * (-b - e));
      } else if (d === 0) {
        results.push(0.5 * -b);
      }
    }
    return results;
  }

  getCubicRoots() {
    var results = new Array(), disrim;
    if (this.getDegree() === 3) {
      var c3 = this.coefs[3];
      var c2 = this.coefs[2] / c3;
      var c1 = this.coefs[1] / c3;
      var c0 = this.coefs[0] / c3;
      var a = (3 * c1 - c2 * c2) / 3;
      var b = (2 * c2 * c2 * c2 - 9 * c1 * c2 + 27 * c0) / 27;
      var offset = c2 / 3;
      var discrim = b * b / 4 + a * a * a / 27;
      var halfB = b / 2;
      if (Math.abs(discrim) <= Polynomial.TOLERANCE) {
        disrim = 0;
      }
      var tmp;
      if (discrim > 0) {
        var e = Math.sqrt(discrim);
        var root;
        tmp = -halfB + e;
        if (tmp >= 0) {
          root = Math.pow(tmp, 1 / 3);
        } else {
          root = -Math.pow(-tmp, 1 / 3);
        }
        tmp = -halfB - e;
        if (tmp >= 0) {
          root += Math.pow(tmp, 1 / 3);
        } else {
          root -= Math.pow(-tmp, 1 / 3);
        }
        results.push(root - offset);
      } else if (discrim < 0) {
        var distance = Math.sqrt(-a / 3);
        var angle = Math.atan2(Math.sqrt(-discrim), -halfB) / 3;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var sqrt3 = Math.sqrt(3);
        results.push(2 * distance * cos - offset);
        results.push(-distance * (cos + sqrt3 * sin) - offset);
        results.push(-distance * (cos - sqrt3 * sin) - offset);
      } else {
        if (halfB >= 0) {
          tmp = -Math.pow(halfB, 1 / 3);
        } else {
          tmp = Math.pow(-halfB, 1 / 3);
        }
        results.push(2 * tmp - offset);
        results.push(-tmp - offset);
      }
    }
    return results;
  }

  getQuarticRoots() {
    var results = new Array();
    if (this.getDegree() === 4) {
      var c4 = this.coefs[4];
      var c3 = this.coefs[3] / c4;
      var c2 = this.coefs[2] / c4;
      var c1 = this.coefs[1] / c4;
      var c0 = this.coefs[0] / c4;
      var resolveRoots = new Polynomial(1, -c2, c3 * c1 - 4 * c0, -c3 * c3 * c0 + 4 * c2 * c0 - c1 * c1).getCubicRoots();
      var y = resolveRoots[0];
      var discrim = c3 * c3 / 4 - c2 + y;
      if (Math.abs(discrim) <= Polynomial.TOLERANCE) {
        discrim = 0;
      }

      var t2;
      var d : number;
      if (discrim > 0) {
        var e = Math.sqrt(discrim);
        var t1 = 3 * c3 * c3 / 4 - e * e - 2 * c2;
        t2 = (4 * c3 * c2 - 8 * c1 - c3 * c3 * c3) / (4 * e);
        var plus = t1 + t2;
        var minus = t1 - t2;
        var f : number;
        if (Math.abs(plus) <= Polynomial.TOLERANCE) {
          plus = 0;
        }
        if (Math.abs(minus) <= Polynomial.TOLERANCE) {
          minus = 0;
        }
        if (plus >= 0) {
          f = Math.sqrt(plus);
          results.push(-c3 / 4 + (e + f) / 2);
          results.push(-c3 / 4 + (e - f) / 2);
        }
        if (minus >= 0) {
          f = Math.sqrt(minus);
          results.push(-c3 / 4 + (f - e) / 2);
          results.push(-c3 / 4 - (f + e) / 2);
        }
      } else if (discrim >= 0) {
        t2 = y * y - 4 * c0;
        if (t2 >= -Polynomial.TOLERANCE) {
          if (t2 < 0) {
            t2 = 0;
          }
          t2 = 2 * Math.sqrt(t2);
          t1 = 3 * c3 * c3 / 4 - 2 * c2;
          if (t1 + t2 >= Polynomial.TOLERANCE) {
            d = Math.sqrt(t1 + t2);
            results.push(-c3 / 4 + d / 2);
            results.push(-c3 / 4 - d / 2);
          }
          if (t1 - t2 >= Polynomial.TOLERANCE) {
            d = Math.sqrt(t1 - t2);
            results.push(-c3 / 4 + d / 2);
            results.push(-c3 / 4 - d / 2);
          }
        }
      }
    }
    return results;
  }
}

class Token {
  constructor(public type: number, public text: any) {

  }

  typeis(t: number) {
    return this.type === t;
  }
}


export class Path {
  static COMMAND = 0;
  static NUMBER = 1;
  static EOD = 2;
  static PARAMS = {
    A: ['rx', 'ry', 'x-axis-rotation', 'large-arc-flag', 'sweep-flag', 'x', 'y'],
    a: ['rx', 'ry', 'x-axis-rotation', 'large-arc-flag', 'sweep-flag', 'x', 'y'],
    C: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
    c: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
    H: ['x'],
    h: ['x'],
    L: ['x', 'y'],
    l: ['x', 'y'],
    M: ['x', 'y'],
    m: ['x', 'y'],
    Q: ['x1', 'y1', 'x', 'y'],
    q: ['x1', 'y1', 'x', 'y'],
    S: ['x2', 'y2', 'x', 'y'],
    s: ['x2', 'y2', 'x', 'y'],
    T: ['x', 'y'],
    t: ['x', 'y'],
    V: ['y'],
    v: ['y'],
    Z: [],
    z: []
  };

  private segments:IPathSegment[];

  constructor(path:string) {
    this.segments = null;
    this.parseData(path);
  }

  appendPathSegment(segment) {
    segment.previous = this.segments[this.segments.length - 1];
    this.segments.push(segment);
  }

  parseData(d) {
    var tokens = this.tokenize(d);
    var index = 0;
    var token = tokens[index];
    var mode = 'BOD';
    this.segments = new Array();
    while (!token.typeis(Path.EOD)) {
      var param_length;
      var params = new Array();
      if (mode === 'BOD') {
        if (token.text === 'M' || token.text === 'm') {
          index++;
          param_length = Path.PARAMS[token.text].length;
          mode = token.text;
        } else {
          throw new Error('Path data must begin with a moveto command');
        }
      } else {
        if (token.typeis(Path.NUMBER)) {
          param_length = Path.PARAMS[mode].length;
        } else {
          index++;
          param_length = Path.PARAMS[token.text].length;
          mode = token.text;
        }
      }
      if ((index + param_length) < tokens.length) {
        for (var i = index; i < index + param_length; i++) {
          var n = tokens[i];
          if (n.typeis(Path.NUMBER)) {
            params[params.length] = n.text;
          } else {
            throw new Error('Parameter type is not a number: ' + mode + ',' + n.text);
          }
        }
        var segment;
        var length = this.segments.length;
        var previous = (length === 0) ? null : this.segments[length - 1];
        switch (mode) {
          case'A':
            segment = new AbsoluteArcPath(params, this, previous);
            break;
          case'C':
            segment = new AbsoluteCurveto3(params, this, previous);
            break;
          case'c':
            segment = new RelativeCurveto3(params, this, previous);
            break;
          case'H':
            segment = new AbsoluteHLineto(params, this, previous);
            break;
          case'L':
            segment = new AbsoluteLineto(params, this, previous);
            break;
          case'l':
            segment = new RelativeLineto(params, this, previous);
            break;
          case'M':
            segment = new AbsoluteMoveto(params, this, previous);
            break;
          case'm':
            segment = new RelativeMoveto(params, this, previous);
            break;
          case'Q':
            segment = new AbsoluteCurveto2(params, this, previous);
            break;
          case'q':
            segment = new RelativeCurveto2(params, this, previous);
            break;
          case'S':
            segment = new AbsoluteSmoothCurveto3(params, this, previous);
            break;
          case's':
            segment = new RelativeSmoothCurveto3(params, this, previous);
            break;
          case'T':
            segment = new AbsoluteSmoothCurveto2(params, this, previous);
            break;
          case't':
            segment = new RelativeSmoothCurveto2(params, this, previous);
            break;
          case'Z':
            segment = new RelativeClosePath(params, this, previous);
            break;
          case'z':
            segment = new RelativeClosePath(params, this, previous);
            break;
          default:
            throw new Error('Unsupported segment type: ' + mode);
        }
        this.segments.push(segment);
        index += param_length;
        token = tokens[index];
        if (mode === 'M') {
          mode = 'L';
        }
        if (mode === 'm') {
          mode = 'l';
        }
      } else {
        throw new Error('Path data ended before all parameters were found');
      }
    }
  }

  tokenize(d) {
    var tokens = new Array();
    while (d !== '') {
      if (d.match(/^([ \t\r\n,]+)/)) {
        d = d.substr(RegExp.$1.length);
      } else if (d.match(/^([aAcChHlLmMqQsStTvVzZ])/)) {
        tokens[tokens.length] = new Token(Path.COMMAND, RegExp.$1);
        d = d.substr(RegExp.$1.length);
      } else if (d.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) {
        tokens[tokens.length] = new Token(Path.NUMBER, parseFloat(RegExp.$1));
        d = d.substr(RegExp.$1.length);
      } else {
        throw new Error('Unrecognized segment command: ' + d);
      }
    }
    tokens[tokens.length] = new Token(Path.EOD, null);
    return tokens;
  }

  intersectShape(shape: IShape) {
    var result = new Intersection();
    for (var i = 0; i < this.segments.length; i++) {
      var inter = Intersection.intersectShapes(this.segments[i], shape);
      result.appendPoints(inter.points);
    }
    return result;
  }

  asIntersectionParams() {
    return new IntersectionParams('Path', []);
  }
}

interface IPathSegment extends IShape {
  command: string;
  lastPoint: Vector2D;
  previous: IPathSegment;
}

class AbsolutePathSegment implements IPathSegment {
  points:Vector2D[] = [];

  constructor(public command:string, params, public owner:Path, public previous:IPathSegment) {
    var index = 0;
    while (index < params.length) {
      this.points.push(new Vector2D(parseFloat(params[index]), parseFloat(params[index + 1])));
      index += 2;
    }
  }

  toString() {
    var points = this.points.map((v) => v.toString());
    var command = '';
    if (this.previous.command !== this.command) {
      command = this.command;
    }
    return command + points.join(' ');
  }

  get lastPoint() {
    return this.points[this.points.length - 1];
  }

  asIntersectionParams():IIntersectionParam {
    return null;
  }
}

class AbsoluteArcPath extends AbsolutePathSegment {
  rx:number;
  ry:number;
  angle:number;
  arcFlag:number;
  sweepFlag:number;

  constructor(params, owner, previous) {
    super('A', params.slice(params.length - 2), owner, previous);
    this.rx = parseFloat(params.shift());
    this.ry = parseFloat(params.shift());
    this.angle = parseFloat(params.shift());
    this.arcFlag = parseFloat(params.shift());
    this.sweepFlag = parseFloat(params.shift());
  }

  toString() {
    var command = '';
    if (this.previous.command !== this.command) {
      command = this.command;
    }
    return command + [this.rx, this.ry, this.angle, this.arcFlag, this.sweepFlag, this.points[0].toString()].join(',');
  }

  asIntersectionParams() {
    return new IntersectionParams('Ellipse', [this.center, this.rx, this.ry]);
  }

  get center() {
    var startPoint = this.previous.lastPoint;
    var endPoint = this.points[0];
    var rx = this.rx;
    var ry = this.ry;
    var angle = this.angle * Math.PI / 180;
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var TOLERANCE = 1e-6;
    var halfDiff = startPoint.subtract(endPoint).divide(2);
    var x1p = halfDiff.x * c + halfDiff.y * s;
    var y1p = halfDiff.x * -s + halfDiff.y * c;
    var x1px1p = x1p * x1p;
    var y1py1p = y1p * y1p;
    var lambda = (x1px1p / (rx * rx) ) + ( y1py1p / (ry * ry));
    var factor : number;
    if (lambda > 1) {
      factor = Math.sqrt(lambda);
      rx *= factor;
      ry *= factor;
    }
    var rxrx = rx * rx;
    var ryry = ry * ry;
    var rxy1 = rxrx * y1py1p;
    var ryx1 = ryry * x1px1p;
    factor = (rxrx * ryry - rxy1 - ryx1) / (rxy1 + ryx1);
    if (Math.abs(factor) < TOLERANCE) {
      factor = 0;
    }
    var sq = Math.sqrt(factor);
    if (this.arcFlag === this.sweepFlag) {
      sq = -sq;
    }
    var mid = startPoint.add(endPoint).divide(2);
    var cxp = sq * rx * y1p / ry;
    var cyp = sq * -ry * x1p / rx;
    return new Vector2D(cxp * c - cyp * s + mid.x, cxp * s + cyp * c + mid.y);
  }
}
class AbsoluteCurveto2 extends AbsolutePathSegment {
  constructor(params, owner, previous) {
    super('Q', params, owner, previous);
  }

  get controlPoint() {
    return this.points[0];
  }

  asIntersectionParams() {
    return new IntersectionParams('Bezier2', [this.previous.lastPoint, this.points[0], this.points[1]]);
  }
}
class AbsoluteCurveto3 extends AbsolutePathSegment {
  constructor(params, owner, previous) {
    super('C', params, owner, previous);
  }

  get lastControlPoint() {
    return this.points[1];
  }

  asIntersectionParams() {
    return new IntersectionParams('Bezier3', [this.previous.lastPoint, this.points[0], this.points[1], this.points[2]]);
  }
}
class AbsoluteHLineto extends AbsolutePathSegment {
  constructor(params, owner, previous) {
    super('H', [params.pop(), previous.lastPoint.y], owner, previous);
  }

  toString() {
    var command = '';
    if (this.previous.command !== this.command) {
      command = this.command;
    }
    return command + this.points[0].x;
  }
}
class AbsoluteLineto extends AbsolutePathSegment {
  constructor(params, owner, previous) {
    super('L', params, owner, previous);
  }

  toString() {
    var command = '';
    if (this.previous.command !== this.command && this.previous.command !== 'M') {
      command = this.command;
    }
    return command + this.points[0].toString();
  }

  asIntersectionParams() {
    return new IntersectionParams('Line', [this.previous.lastPoint, this.points[0]]);
  }
}
class AbsoluteMoveto extends AbsolutePathSegment {
  constructor(params, owner, previous) {
    super('M', params, owner, previous);
  }

  toString() {
    return 'M' + this.points[0].toString();
  }
}
class AbsoluteSmoothCurveto2 extends AbsolutePathSegment {
  constructor(params, owner, previous) {
    super('T', params, owner, previous);
  }

  get controlPoint() {
    var lastPoint = this.previous.lastPoint;
    var point;
    if (this.previous.command.match(/^[QqTt]$/)) {
      var ctrlPoint = (<any>this.previous).controlPoint;
      var diff = ctrlPoint.subtract(lastPoint);
      point = lastPoint.subtract(diff);
    } else {
      point = lastPoint;
    }
    return point;
  }

  asIntersectionParams() {
    return new IntersectionParams('Bezier2', [this.previous.lastPoint, this.controlPoint, this.points[0]]);
  }
}
class AbsoluteSmoothCurveto3 extends AbsolutePathSegment {
  constructor(params, owner, previous) {
    super('S', params, owner, previous);
  }

  get firstControlPoint() {
    var lastPoint = this.previous.lastPoint;
    var point;
    if (this.previous.command.match(/^[SsCc]$/)) {
      var lastControl = (<any>this.previous).lastControlPoint;
      var diff = lastControl.subtract(lastPoint);
      point = lastPoint.subtract(diff);
    } else {
      point = lastPoint;
    }
    return point;
  }

  get lastControlPoint() {
    return this.points[0];
  }

  asIntersectionParams() {
    return new IntersectionParams('Bezier3', [this.previous.lastPoint, this.firstControlPoint, this.points[0], this.points[1]]);
  }
}

class RelativePathSegment implements IPathSegment {
  points:Vector2D[] = [];

  constructor(public command:string, params, public owner:Path, public previous:IPathSegment) {
    var lastPoint = this.previous ? this.previous.lastPoint : new Vector2D(0, 0);
    var index = 0;
    while (index < params.length) {
      var handle = new Vector2D(lastPoint.x + parseFloat(params[index]), lastPoint.y + parseFloat(params[index + 1]));
      this.points.push(handle);
      index += 2;
    }
  }

  toString() {
    var points = new Array();
    var command = '';
    var lastPoint = this.previous ? this.previous.lastPoint : new Vector2D(0, 0);
    if (this.previous == null || this.previous.command !== this.command) {
      command = this.command;
    }
    for (var i = 0; i < this.points.length; i++) {
      var point = this.points[i].subtract(lastPoint);
      points.push(point.toString());
    }
    return command + points.join(' ');
  }

  get lastPoint() {
    return this.points[this.points.length - 1];
  }

  asIntersectionParams():IIntersectionParam {
    return null;
  }
}

class RelativeClosePath extends RelativePathSegment {
  constructor(params, owner, previous) {
    super('z', params, owner, previous);
  }

  get lastPoint() {
    var current = this.previous;
    var point;
    while (current) {
      if (current.command.match(/^[mMzZ]$/)) {
        point = current.lastPoint;
        break;
      }
      current = current.previous;
    }
    return point;
  }

  asIntersectionParams() {
    return new IntersectionParams('Line', [this.previous.lastPoint, this.lastPoint]);
  }
}
class RelativeCurveto2 extends RelativePathSegment {
  constructor(params, owner, previous) {
    super('q', params, owner, previous);
  }

  get controlPoint() {
    return this.points[0];
  }

  asIntersectionParams() {
    return new IntersectionParams('Bezier2', [this.previous.lastPoint, this.points[0], this.points[1]]);
  }
}
class RelativeCurveto3 extends RelativePathSegment {
  constructor(params, owner, previous) {
    super('c', params, owner, previous);
  }

  get lastControlPoint() {
    return this.points[1];
  }

  asIntersectionParams() {
    return new IntersectionParams('Bezier3', [this.previous.lastPoint, this.points[0], this.points[1], this.points[2]]);
  }
}
class RelativeLineto extends RelativePathSegment {
  constructor(params, owner, previous) {
    super('l', params, owner, previous);
  }

  toString() {
    var lastPoint = this.previous ? this.previous.lastPoint : new Vector2D(0, 0);
    var point = this.points[0].subtract(lastPoint);
    var command = '';
    if (this.previous.command !== this.command &&this.previous.command !== 'm') {
      command = this.command;
    }
    return command + point.toString();
  }

  asIntersectionParams() {
    return new IntersectionParams('Line', [this.previous.lastPoint, this.points[0]]);
  }
}
class RelativeMoveto extends RelativePathSegment {

  constructor(params, owner, previous) {
    super('m', params, owner, previous);
  }

  toString() {
    return 'm' + this.points[0].toString();
  }
}
class RelativeSmoothCurveto2 extends RelativePathSegment {
  constructor(params, owner, previous) {
    super('t', params, owner, previous);
  }

  get controlPoint() {
    var lastPoint = this.previous.lastPoint;
    var point;
    if (this.previous.command.match(/^[QqTt]$/)) {
      var ctrlPoint = (<any>this.previous).controlPoint;
      var diff = ctrlPoint.subtract(lastPoint);
      point = lastPoint.subtract(diff);
    } else {
      point = lastPoint;
    }
    return point;
  }

  asIntersectionParams() {
    return new IntersectionParams('Bezier2', [this.previous.lastPoint, this.controlPoint, this.points[0]]);
  }
}

class RelativeSmoothCurveto3 extends RelativePathSegment {
  constructor(params, owner, previous) {
    super('s', params, owner, previous);
  }

  get firstControlPoint() {
    var lastPoint = this.previous.lastPoint;
    var point;
    if (this.previous.command.match(/^[SsCc]$/)) {
      var lastControl = (<any>this.previous).lastControlPoint;
      var diff = lastControl.subtract(lastPoint);
      point = lastPoint.subtract(diff);
    } else {
      point = lastPoint;
    }
    return point;
  }

  get lastControlPoint() {
    return this.points[0];
  }

  asIntersectionParams() {
    return new IntersectionParams('Bezier3', [this.previous.lastPoint, this.firstControlPoint, this.points[0], this.points[1]]);
  }
}

