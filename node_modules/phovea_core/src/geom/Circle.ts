/**
 * Created by Samuel Gratzl on 27.12.2016.
 */

import {IIntersectionParam, Vector2D} from '../2D';
import AShape from './AShape';
import Rect from './Rect';

export default class Circle extends AShape {
  constructor(public x = 0, public y = 0, public radius = 0) {
    super();
  }

  get xy() {
    return new Vector2D(this.x, this.y);
  }

  toString() {
    return `Circle(x=${this.x},y=${this.y},radius=${this.radius})`;
  }

  protected shiftImpl(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  aabb(): Rect {
    return new Rect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
  }

  bs(): Circle {
    return this;
  }

  transform(scale: number[], rotate: number) {
    return new Circle(this.x * scale[0], this.y * scale[1], this.radius * (scale[0] + scale[1]) / 2);
  }

  asIntersectionParams(): IIntersectionParam {
    return {
      name: 'Circle',
      params: [this.xy, this.radius]
    };
  }
}
