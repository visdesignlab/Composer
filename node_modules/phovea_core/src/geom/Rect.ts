/**
 * Created by Samuel Gratzl on 27.12.2016.
 */

import {IIntersectionParam, Vector2D} from '../2D';
import AShape from './AShape';
import Circle from './Circle';

/**
 * a simple bounding rect
 */
export default class Rect extends AShape {
  constructor(public x = 0, public y = 0, public w = 0, public h = 0) {
    super();
  }

  eq(that: Rect) {
    return this.x === that.x && this.y === that.y && this.w === that.w && this.h === that.h;
  }

  toString() {
    return `Rect(x=${this.x},y=${this.y},w=${this.w},h=${this.h})`;
  }

  get xy() {
    return new Vector2D(this.x, this.y);
  }

  get x2y2() {
    return new Vector2D(this.x2, this.y2);
  }

  get size() {
    return new Vector2D(this.w, this.h);
  }

  get cx(): number {
    return this.x + this.w / 2;
  }

  get cy() {
    return this.y + this.h / 2;
  }

  set cx(val: number) {
    this.x = val - this.w / 2;
  }

  set cy(val: number) {
    this.y = val - this.y / 2;
  }

  get x2(): number {
    return this.x + this.w;
  }

  get y2() {
    return this.y + this.h;
  }

  set x2(val: number) {
    this.w = val - this.x;
  }

  set y2(val: number) {
    this.h = val - this.y;
  }

  protected shiftImpl(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  aabb(): Rect {
    return this;
  }

  bs(): Circle {
    return new Circle(this.cx, this.cy, Math.sqrt(this.w * 2 + this.h * 2) / 2);
  }

  transform(scale: number[], rotate: number) {
    //TODO rotate
    return new Rect(this.x * scale[0], this.y * scale[1], this.w * scale[0], this.h * scale[1]);
  }

  asIntersectionParams(): IIntersectionParam {
    return {
      name: 'Rectangle',
      params: [this.xy, this.x2y2]
    };
  }

}
