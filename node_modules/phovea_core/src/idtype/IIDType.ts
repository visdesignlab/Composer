/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

import {IPersistable} from '../index';
import {IEventHandler} from '../event';
import {Range, Range1D} from '../range';

export const defaultSelectionType = 'selected';
export const hoverSelectionType = 'hovered';

export enum SelectOperation {
  SET, ADD, REMOVE
}

/**
 * converts the given mouse event to a select operation
 * @param event the mouse event to examine
 */
export function toSelectOperation(event: MouseEvent): SelectOperation;
/**
 * converts the given key modifiers to select operation
 * @param ctryKey
 * @param altKey
 * @param shiftKey
 * @param metaKey
 */
export function toSelectOperation(ctryKey: boolean, altKey: boolean, shiftKey: boolean, metaKey: boolean): SelectOperation;
export function toSelectOperation(event: any) {
  let ctryKeyDown, shiftDown, altDown, metaDown;
  if (typeof event === 'boolean') {
    ctryKeyDown = event;
    altDown = arguments[1] || false;
    shiftDown = arguments[2] || false;
    metaDown = arguments[3] || false;
  } else {
    ctryKeyDown = event.ctrlKey || false;
    altDown = event.altKey || false;
    shiftDown = event.shiftKey || false;
    metaDown = event.metaKey || false;
  }
  if (ctryKeyDown || shiftDown) {
    return SelectOperation.ADD;
  } else if (altDown || metaDown) {
    return SelectOperation.REMOVE;
  }
  return SelectOperation.SET;
}

export interface IIDType extends IEventHandler, IPersistable {
  readonly id: string;
  readonly name: string;
  readonly names: string;
  readonly internal: boolean;
  toString(): string;

  selectionTypes(): string[];

  clear(): void;
  clear(type: string): void;
}


export function asSelectOperation(v: any) {
  if (!v) {
    return SelectOperation.SET;
  }
  if (typeof v === 'string') {
    switch (v.toLowerCase()) {
      case 'add' :
        return SelectOperation.ADD;
      case 'remove' :
        return SelectOperation.REMOVE;
      default :
        return SelectOperation.SET;
    }
  }
  return +v;
}

export function fillWithNone(r: Range, ndim: number) {
  while (r.ndim < ndim) {
    r.dims[r.ndim] = Range1D.none();
  }
  return r;
}
