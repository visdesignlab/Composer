/**
 * Created by sam on 12.02.2015.
 */
import {resolve as idtypes_resolve} from '../idtype';
import {ADataType} from '../datatype';
import {all, none, RangeLike} from '../range';
import {AGraph, IDTYPE_EDGES, IDTYPE_NODES, DIM_EDGES, DIM_NODES} from './graph';
import {defaultGraphFactory, IGraphFactory, IGraphDataDescription} from './GraphBase';
import RemoteStoreGraph from './RemoteStorageGraph';
import MemoryGraph from './MemoryGraph';
import LocalStorageGraph from './LocalStorageGraph';

export default class GraphProxy extends ADataType<IGraphDataDescription> {
  private cache: Promise<AGraph> = null;
  private loaded: AGraph = null;

  constructor(desc: IGraphDataDescription) {
    super(desc);
  }

  get nnodes(): number {
    if (this.loaded) {
      return this.loaded.nnodes;
    }
    const size = this.desc.size;
    return size[DIM_NODES] || 0;
  }

  get nedges(): number {
    if (this.loaded) {
      return this.loaded.nedges;
    }
    const size = this.desc.size;
    return size[DIM_EDGES] || 0;
  }

  get dim() {
    return [this.nnodes, this.nedges];
  }

  impl(factory: IGraphFactory = defaultGraphFactory): Promise<AGraph> {
    if (this.cache) {
      return this.cache;
    }
    const type = this.desc.storage || 'remote';
    if (type === 'memory') {
      //memory only
      this.loaded = new MemoryGraph(this.desc, [], [], factory);
      this.cache = Promise.resolve(this.loaded);
    } else if (type === 'local') {
      this.loaded = LocalStorageGraph.load(this.desc, factory, localStorage);
      this.cache = Promise.resolve(this.loaded);
    } else if (type === 'session') {
      this.loaded = LocalStorageGraph.load(this.desc, factory, sessionStorage);
      this.cache = Promise.resolve(this.loaded);
    } else if (type === 'given' && this.desc.graph instanceof AGraph) {
      this.loaded = this.desc.graph;
      this.cache = Promise.resolve(this.loaded);
    } else {
      this.cache = RemoteStoreGraph.load(this.desc, factory).then((graph: AGraph) => this.loaded = graph);
    }
    return this.cache;
  }

  ids(range: RangeLike = all()) {
    if (this.cache) {
      return this.cache.then((i) => i.ids(range));
    }
    return Promise.resolve(none());
  }

  get idtypes() {
    return [IDTYPE_NODES, IDTYPE_EDGES].map(idtypes_resolve);
  }
}

/**
 * module entry point for creating a datatype
 * @param desc
 * @returns {IMatrix}
 */
export function create(desc: IGraphDataDescription): GraphProxy {
  return new GraphProxy(desc);
}
