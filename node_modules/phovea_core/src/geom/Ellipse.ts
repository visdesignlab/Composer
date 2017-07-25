/**
 * Created by Samuel Gratzl on 27.12.2016.
 */

import {IIntersectionParam, Vector2D} from '../2D';
import AShape from './AShape';
import Circle from './Circle';
import Rect from './Rect';

export default class Ellipse extends AShape {
  constructor(public x = 0, public y = 0, public radiusX = 0, public radiusY = 0) {
    super();
  }

  get xy() {
    return new Vector2D(this.x, this.y);
  }

  toString() {
    return `Ellipse(x=${this.x},y=${this.y},radiusX=${this.radiusX},radiusY=${this.radiusY})`;
  }

  protected shiftImpl(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  aabb(): Rect {
    return new Rect(this.x - this.radiusX, this.y - this.radiusY, this.radiusX * 2, this.radiusY * 2);
  }

  bs(): Circle {
    return new Circle(this.x, this.y, Math.max(this.radiusX, this.radiusY));
  }

  transform(scale: number[], rotate: number) {
    //TODO rotate
    return new Ellipse(this.x * scale[0], this.y * scale[1], this.radiusX * scale[0], this.radiusY * scale[1]);
  }

  asIntersectionParams(): IIntersectionParam {
    return {
      name: 'Ellipse',
      params: [this.xy, this.radiusX, this.radiusY]
    };
  }
}
