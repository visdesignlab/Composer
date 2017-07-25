/**
 * Created by Samuel Gratzl on 27.12.2016.
 */
import {Vector2D, IShape, IIntersectionParam, Intersection, vec} from '../2D';
import Rect from './Rect';
import Circle from './Circle';

export const CORNER: any = <any>[];
CORNER.N = CORNER[0] = 'n';
CORNER.NE = CORNER[1] = 'ne';
CORNER.E = CORNER[2] = 'e';
CORNER.SE = CORNER[3] = 'se';
CORNER.S = CORNER[4] = 's';
CORNER.SW = CORNER[5] = 'sw';
CORNER.W = CORNER[6] = 'w';
CORNER.NW = CORNER[7] = 'nw';

/**
 * a simple basic shape
 */
export abstract class AShape implements IShape {
  /**
   * shift the shape by the given amount
   * @param x
   * @param y
   */
  shift(x: number, y: number): AShape;
  shift(xy: {x: number, y: number}): AShape;
  shift(xy: [number, number]): AShape;
  shift() {
    if (typeof arguments[0] === 'number') {
      this.shiftImpl(arguments[0], arguments[1]);
    } else if (Array.isArray(arguments[0])) {
      this.shiftImpl(arguments[0][0], arguments[0][1]);
    } else {
      this.shiftImpl(arguments[0].x, arguments[0].y);
    }
    return this;
  }

  /**
   * center of this shape
   * @returns {Circle}
   */
  get center(): Vector2D {
    return this.bs().xy;
  }

  /**
   * axis aligned bounding box (ro)
   */
  abstract aabb(): Rect;

  /**
   * a specific corner of th axis aligned bounding box
   * @param corner
   * @returns {Vector2D}
   */
  corner(corner: string): Vector2D {
    const r = this.aabb();
    switch (corner) {
      case CORNER.N:
        return vec(r.cx, r.y);
      case CORNER.S:
        return vec(r.cx, r.y2);
      case CORNER.W:
        return vec(r.x, r.cy);
      case CORNER.E:
        return vec(r.x2, r.cy);
      case CORNER.NE:
        return vec(r.x2, r.y);
      case CORNER.NW:
        return r.xy;
      case CORNER.SE:
        return vec(r.x2, r.y2);
      case CORNER.SW:
        return vec(r.x, r.y2);
    }
    return this.center;
  }

  /**
   * bounding sphere (ro)
   */
  abstract bs(): Circle;

  protected abstract shiftImpl(x: number, y: number): void;

  abstract asIntersectionParams(): IIntersectionParam;

  intersects(other: AShape) {
    return Intersection.intersectShapes(this, other);
  }
}

export default AShape;
