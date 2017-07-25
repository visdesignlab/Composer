/**
 * Created by sam on 12.02.2015.
 */

import {GraphNode, AttributeContainer, isType} from '../graph/graph';
import ObjectNode, {op, cat, IObjectRef} from './ObjectNode';
import StateNode from './StateNode';
import ProvenanceGraph, {ICmdFunction, ICmdResult, IInverseActionCreator, ICmdFunctionFactory} from './ProvenanceGraph';
import {currentUserNameOrAnonymous} from '../security';

/**
 * additional data about a performed action
 */
export class ActionMetaData {
  constructor(public readonly category: string, public readonly operation: string, public readonly name: string, public readonly timestamp: number = Date.now(), public readonly user: string = currentUserNameOrAnonymous()) {

  }

  static restore(p: any) {
    return new ActionMetaData(p.category, p.operation, p.name, p.timestamp, p.user);
  }

  eq(that: ActionMetaData) {
    return this.category === that.category && this.operation === that.operation && this.name === that.name;
  }

  /**
   * checks whether this metadata are the inverse of the given one in terms of category and operation
   * @param that
   * @returns {boolean}
   */
  inv(that: ActionMetaData) {
    if (this.category !== that.category) {
      return false;
    }
    if (this.operation === op.update) {
      return that.operation === op.update;
    }
    return this.operation === op.create ? that.operation === op.remove : that.operation === op.create;
  }

  toString() {
    return `${this.category}:${this.operation} ${this.name}`;
  }
}

export function meta(name: string, category: string = cat.data, operation: string = op.update, timestamp: number = Date.now(), user: string = currentUserNameOrAnonymous()) {
  return new ActionMetaData(category, operation, name, timestamp, user);
}

export interface IAction {
  readonly meta: ActionMetaData;
  readonly id: string;
  readonly f: ICmdFunction;
  readonly inputs?: IObjectRef<any>[];
  readonly parameter?: any;
}

/**
 * creates an action given the data
 * @param meta
 * @param id
 * @param f
 * @param inputs
 * @param parameter
 * @returns {{meta: ActionMetaData, id: string, f: (function(IObjectRef<any>[], any, ProvenanceGraph): ICmdResult), inputs: IObjectRef<any>[], parameter: any}}
 */
export function action(meta: ActionMetaData, id: string, f: ICmdFunction, inputs: IObjectRef<any>[] = [], parameter: any = {}): IAction {
  return {
     meta,
    id,
    f,
    inputs,
    parameter
  };
}

/**
 * comparator by index
 * @param a
 * @param b
 * @returns {number}
 */
function byIndex(a: AttributeContainer, b: AttributeContainer) {
  const ai = +a.getAttr('index', 0);
  const bi = +b.getAttr('index', 0);
  return ai - bi;
}


export default class ActionNode extends GraphNode {
  private inverter: IInverseActionCreator;

  constructor(meta: ActionMetaData, functionId: string, private f: ICmdFunction, parameter: any = {}) {
    super('action');
    super.setAttr('meta', meta);
    super.setAttr('f_id', functionId);
    super.setAttr('parameter', parameter);
  }

  clone() {
    return new ActionNode(this.meta, this.f_id, this.f, this.parameter);
  }

  get name() {
    return this.meta.name;
  }

  get meta(): ActionMetaData {
    return super.getAttr('meta');
  }

  get f_id(): string {
    return super.getAttr('f_id');
  }

  get parameter(): any {
    return super.getAttr('parameter');
  }

  set parameter(value: any) {
    super.setAttr('parameter', value);
  }

  get onceExecuted(): boolean {
    return super.getAttr('onceExecuted', false);
  }

  set onceExecuted(value: boolean) {
    if (this.onceExecuted !== value) {
      super.setAttr('onceExecuted', value);
    }
  }

  static restore(r: any, factory: ICmdFunctionFactory) {
    const a = new ActionNode(ActionMetaData.restore(r.attrs.meta), r.attrs.f_id, factory(r.attrs.f_id), r.attrs.parameter);
    return a.restore(r);
  }

  toString() {
    return this.meta.name;
  }

  get inversedBy() {
    const r = this.incoming.filter(isType('inverses'))[0];
    return r ? <ActionNode>r.source : null;
  }

  /**
   * inverses another action
   * @returns {ActionNode}
   */
  get inverses() {
    const r = this.outgoing.filter(isType('inverses'))[0];
    return r ? <ActionNode>r.target : null;
  }

  get isInverse() {
    return this.outgoing.filter(isType('inverses'))[0] != null;
  }

  getOrCreateInverse(graph: ProvenanceGraph) {
    const i = this.inversedBy;
    if (i) {
      return i;
    }
    if (this.inverter) {
      return graph.createInverse(this, this.inverter);
    }
    this.inverter = null; //not needed anymore
    return null;
  }

  updateInverse(graph: ProvenanceGraph, inverter: IInverseActionCreator) {
    const i = this.inversedBy;
    if (i) { //update with the actual values / parameter only
      const c = inverter.call(this, this.requires, this.creates, this.removes);
      i.parameter = c.parameter;
      this.inverter = null;
    } else if (!this.isInverse) {
      //create inverse action immediatelly
      graph.createInverse(this, inverter);
      this.inverter = null;
    } else {
      this.inverter = inverter;
    }
  }

  execute(graph: ProvenanceGraph, withinMilliseconds: number): Promise<ICmdResult> {
    const r = this.f.call(this, this.requires, this.parameter, graph, <number>withinMilliseconds);
    return Promise.resolve(r);
  }

  equals(that: ActionNode): boolean {
    if (!(this.meta.category === that.meta.category && that.meta.operation === that.meta.operation)) {
      return false;
    }
    if (this.f_id !== that.f_id) {
      return false;
    }
    //TODO check parameters if they are the same
    return true;
  }

  get uses(): ObjectNode<any>[] {
    return this.outgoing.filter(isType(/(creates|removes|requires)/)).map((e) => <ObjectNode<any>>e.target);
  }

  get creates(): ObjectNode<any>[] {
    return this.outgoing.filter(isType('creates')).map((e) => <ObjectNode<any>>e.target);
  }

  get removes(): ObjectNode<any>[] {
    return this.outgoing.filter(isType('removes')).sort(byIndex).map((e) => <ObjectNode<any>>e.target);
  }

  get requires(): ObjectNode<any>[] {
    return this.outgoing.filter(isType('requires')).sort(byIndex).map((e) => <ObjectNode<any>>e.target);
  }

  get resultsIn(): StateNode {
    const r = this.outgoing.filter(isType('resultsIn'))[0];
    return r ? <StateNode>r.target : null;
  }

  get previous(): StateNode {
    const r = this.incoming.filter(isType('next'))[0];
    return r ? <StateNode>r.source : null;
  }
}
