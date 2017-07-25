/**
 * Created by sam on 12.02.2015.
 */
import * as graph from '../graph';
import {provenanceGraphFactory, default as ProvenanceGraph, IProvenanceGraphDataDescription} from './ProvenanceGraph';
import StateNode from './StateNode';
export {default as ActionNode, action, ActionMetaData, IAction, meta} from './ActionNode';
export {default as ObjectNode, cat, IObjectRef, op, ref} from './ObjectNode';
export {
  default as SlideNode,
  DEFAULT_DURATION,
  DEFAULT_TRANSITION,
  IArrowStateAnnotation,
  IFrameStateAnnotation,
  IStateAnnotation,
  ITextStateAnnotation
} from './SlideNode';
export {default as StateNode} from './StateNode';
export {
  default as ProvenanceGraph,
  IProvenanceGraphDataDescription,
  compress,
  IActionCompressor,
  ICmdFunction,
  ICmdFunctionFactory,
  ICmdResult,
  IInverseActionCreator,
  IProvenanceGraphManager,
  ProvenanceGraphDim,
  provenanceGraphFactory,
  toSlidePath
} from './ProvenanceGraph';
export {default as LocalStorageProvenanceGraphManager} from './LocalStorageProvenanceGraphManager';
export {default as RemoteStorageProvenanceGraphManager} from './RemoteStorageProvenanceGraphManager';
export {default as MixedStorageProvenanceGraphManager} from './MixedStorageProvenanceGraphManager';
export {GraphEdge} from '../graph/graph';

export const graphModule = graph;

export function findLatestPath(state: StateNode) {
  const path = state.path.slice();
  //compute the first path to the end
  while ((state = state.nextState) != null && (path.indexOf(state) < 0)) {
    path.push(state);
  }
  return path;
}

export function createDummy() {
  const desc: IProvenanceGraphDataDescription = {
    type: 'provenance_graph',
    id: 'dummy',
    name: 'dummy',
    fqname: 'dummy',
    description: '',
    creator: 'Anonymous',
    ts: Date.now(),
    size: [0, 0],
    attrs: {
      graphtype: 'provenance_graph',
      of: 'dummy'
    }
  };
  return new ProvenanceGraph(desc, new graph.MemoryGraph(desc, [], [], provenanceGraphFactory()));
}
