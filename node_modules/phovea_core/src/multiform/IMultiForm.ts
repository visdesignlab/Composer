/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 27.08.2014.
 */

import {IVisInstance, IVisPluginDesc} from '../vis';
import {createNode} from './internal';

export interface IMultiForm extends IVisInstance {
  readonly act: IVisPluginDesc;
  readonly actLoader: Promise<IVisInstance>;
  readonly visses: IVisPluginDesc[];
  switchTo(id: string): Promise<IVisInstance|IVisInstance[]>;
  switchTo(index: number): Promise<IVisInstance|IVisInstance[]>;
  switchTo(vis: IVisPluginDesc): Promise<IVisInstance|IVisInstance[]>;

  addIconVisChooser(toolbar: Element): void;
  addSelectVisChooser(toolbar: Element): void;
}


/**
 * computes the selectable vis techniques for a given set of multi form objects
 * @param forms
 * @return {*}
 */
function toAvailableVisses(forms: IMultiForm[]) {
  if (forms.length === 0) {
    return [];
  }
  if (forms.length === 1) {
    return forms[0].visses;
  }
  //intersection of all
  return forms[0].visses.filter((vis) => forms.every((f) => f.visses.indexOf(vis) >= 0));
}

export function addIconVisChooser(toolbar: HTMLElement, ...forms: IMultiForm[]) {
  const s = toolbar.ownerDocument.createElement('div');
  toolbar.insertBefore(s, toolbar.firstChild);
  const visses = toAvailableVisses(forms);

  visses.forEach((v) => {
    const child = createNode(s, 'i');
    v.iconify(child);
    child.onclick = () => forms.forEach((f) => f.switchTo(v));
  });
}

export function addSelectVisChooser(toolbar: HTMLElement, ...forms: IMultiForm[]) {
  const s = toolbar.ownerDocument.createElement('select');
  toolbar.insertBefore(s, toolbar.firstChild);
  const visses = toAvailableVisses(forms);

  visses.forEach((v, i) => {
    const child = createNode(s, 'option');
    child.setAttribute('value', String(i));
    child.textContent = v.name;
  });
  // use only the current selection of the first form
  if (forms[0]) {
    s.selectedIndex = visses.indexOf(forms[0].act);
  }
  s.onchange = () => forms.forEach((f) => f.switchTo(visses[s.selectedIndex]));
}

export interface IMultiFormOptions {
  /**
   * initial visualization
   */
  initialVis?: string|number|IVisPluginDesc;
  /**
   * configuration for all visualizations
   */
  all?: any;
  /**
   * custom config for individual visualizations identified by their id
   */
  [visPluginId: string]: any;
  /**
   * optionally filter the list of visualizations
   * @param vis
   */
  filter?(vis: IVisPluginDesc): boolean;
}
