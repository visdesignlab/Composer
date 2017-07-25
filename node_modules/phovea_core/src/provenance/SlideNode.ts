/**
 * Created by sam on 12.02.2015.
 */
import {GraphNode, isType} from '../graph/graph';
import StateNode from './StateNode';

export const DEFAULT_DURATION = 1500; //ms
export const DEFAULT_TRANSITION = 0; //ms


export interface IStateAnnotation {
  readonly type: string;
  pos: [number, number] | {anchor: string, offset: [number, number]} ;
  readonly styles?: {[key: string]: string;};

  readonly [key: string]: any;
}

export interface ITextStateAnnotation extends IStateAnnotation {
  text: string;
  size?: [number, number];
  rotation?: number;
}

export interface IArrowStateAnnotation extends IStateAnnotation {
  at: [number, number];
}

export interface IFrameStateAnnotation extends IStateAnnotation {
  size?: [number, number];
  pos2?: [number, number];
  rotation?: number;
}


export default class SlideNode extends GraphNode {
  constructor() {
    super('story');
  }

  get name(): string {
    return super.getAttr('name', '');
  }

  set name(value: string) {
    super.setAttr('name', value);
  }

  get description(): string {
    return super.getAttr('description', '');
  }

  set description(value: string) {
    super.setAttr('description', value);
  }

  get isTextOnly() {
    return !this.outgoing.some(isType('jumpTo'));
  }

  get state() {
    const edge = this.outgoing.filter(isType('jumpTo'))[0];
    return edge ? <StateNode>edge.target : null;
  }

  static restore(dump: any) {
    return new SlideNode().restore(dump);
  }

  get next() {
    const n = this.outgoing.filter(isType('next'))[0];
    return n ? <SlideNode>n.target : null;
  }

  get nexts() {
    return this.outgoing.filter(isType('next')).map((n) => <SlideNode>n.target);
  }

  get previous() {
    const n = this.incoming.filter(isType('next'))[0];
    return n ? <SlideNode>n.source : null;
  }

  get slideIndex(): number {
    const p = this.previous;
    return 1 + (p ? p.slideIndex : 0);
  }

  get duration() {
    return <number>this.getAttr('duration', DEFAULT_DURATION);
  }

  set duration(value: number) {
    this.setAttr('duration', value);
  }

  /**
   * the number of milliseconds for the transitions
   * @returns {number}
   */
  get transition() {
    return <number>this.getAttr('transition', DEFAULT_TRANSITION);
  }

  set transition(value: number) {
    this.setAttr('transition', value);
  }

  get annotations() {
    return <IStateAnnotation[]>this.getAttr('annotations', []);
  }

  setAnnotation(index: number, ann: IStateAnnotation) {
    const old = this.annotations;
    old[index] = ann;
    this.setAttr('annotations', old);
  }

  updateAnnotation(ann: IStateAnnotation) {
    //since it is a reference just updated
    this.setAttr('annotations', this.annotations);
  }

  removeAnnotation(index: number) {
    const old = this.annotations;
    old.splice(index, 1);
    this.setAttr('annotations', old);
  }

  removeAnnotationElem(elem: IStateAnnotation) {
    const old = this.annotations;
    old.splice(old.indexOf(elem), 1);
    this.setAttr('annotations', old);
  }

  pushAnnotation(ann: IStateAnnotation) {
    const old = this.annotations;
    old.push(ann);
    this.setAttr('annotations', old);
    this.fire('push-annotations', ann, old);
  }

  get isStart() {
    return this.previous == null;
  }

  static makeText(title?: string) {
    const s = new SlideNode();
    if (title) {
      s.pushAnnotation({
        type: 'text',
        pos: [25, 25],
        text: '# ${name}'
      });
      s.name = title;
    }
    return s;
  }
}
