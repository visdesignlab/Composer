/**
 * Created by sam on 12.02.2015.
 */
/**
 * Created by Samuel Gratzl on 22.10.2014.
 */
import {mixin, IPersistable, flagId, uniqueId} from './index';
import {sendAPI} from './ajax';
import {SelectAble, SelectOperation, resolve as idtypes_resolve} from './idtype';
import {DataTypeBase, IDataDescription} from './datatype';
import {all, none, Range, list} from './range';
import {EventHandler, IEvent} from './event';

export class AttributeContainer extends EventHandler implements IPersistable {
  // TODO convert to Map
  private _attrs : { [key: string] : any } = {};

  persist():any {
    if (Object.keys(this._attrs).length > 0) {
      return {
        attrs : mixin({}, this._attrs) //copy
      };
    }
    return {

    };
  }

  setAttr(attr:string, value:any) {
    const bak = this._attrs[attr];
    if (bak === value && !Array.isArray(bak)) {
      return;
    }
    this._attrs[attr] = value;
    this.fire('attr-' + attr, value, bak);
    this.fire('setAttr', attr, value, bak);
  }
  hasAttr(attr: string) {
    return attr in this._attrs;
  }
  getAttr(attr: string, default_ : any = null) {
    if (attr in this._attrs) {
      return this._attrs[attr];
    }
    return default_;
  }
  get attrs() {
    return Object.keys(this._attrs);
  }

  restore(persisted:any) {
    if (persisted.attrs) {
      this._attrs = persisted.attrs;
    }
    return this;
  }
}
/**
 * a simple graph none
 */
export class GraphNode extends AttributeContainer {
  outgoing:GraphEdge[] = [];
  incoming:GraphEdge[] = [];

  private _id:number = NaN;

  constructor(public type:string = 'node', id:number = NaN) {
    super();
    this._id = flagId('graph_node', id);
  }

  get id() {
    if (isNaN(this._id)) {
      this._id = uniqueId('graph_node');
    }
    return this._id;
  }

  persist():any {
    const r = super.persist();
    r.type =this.type;
    r.id = this.id;
    return r;
  }

  restore(persisted:any) {
    super.restore(persisted);
    this.type = persisted.type;
    this._id = flagId('graph_node', persisted.id);
    return this;
  }
}

export class GraphEdge extends AttributeContainer {

  private _id:number = NaN;

  constructor(public type:string = 'edge', public source:GraphNode = null, public target:GraphNode = null, id:number = NaN) {
    super();
    this._id = flagId('graph_edge', id);
    if (source && target) {
      this.init();
    }
  }

  get id() {
    if (isNaN(this._id)) {
      this._id = uniqueId('graph_edge');
    }
    return this._id;
  }

  private init() {
    this.source.outgoing.push(this);
    this.target.incoming.push(this);
  }

  takeDown() {
    if (this.source) {
      this.source.outgoing.splice(this.source.outgoing.indexOf(this), 1);
    }
    if (this.target) {
      this.target.incoming.splice(this.target.incoming.indexOf(this), 1);
    }
  }

  toString() {
    return this.source + ' ' + this.type + ' ' + this.target;
  }

  persist() {
    const r = super.persist();
    r.type = this.type;
    r.id = this.id;
    r.source = this.source.id;
    r.target = this.target.id;
    return r;
  }

  restore(p:any, nodes?:(id:number) => GraphNode) {
    super.restore(p);
    this.type = p.type;
    this._id = flagId('graph_edge', p.id);
    this.source = nodes(p.source);
    this.target = nodes(p.target);
    this.init();
    return this;
  }
}

export function isType(type:string|RegExp) {
  return (edge:GraphEdge) => type instanceof RegExp ? type.test(edge.type) : edge.type === type;
}

export class AGraph extends SelectAble {

  get nodes() : GraphNode[] {
    return [];
  }

  get nnodes() {
    return this.nodes.length;
  }

  get edges(): GraphEdge[] {
    return [];
  }

  get nedges() {
    return this.edges.length;
  }
}

export interface IGraphFactory {
  makeNode(p: any): GraphNode;
  makeEdge(p: any, lookup: (id: number) => GraphNode): GraphEdge;
}

const defaultGraphFactory:IGraphFactory = {
  makeNode: (p:any) => ((new GraphNode()).restore(p)),
  makeEdge: (p:any, lookup) => ((new GraphEdge()).restore(p, lookup))
};

export class GraphProxy extends DataTypeBase {
  private _impl:Promise<AGraph> = null;
  private _loaded:AGraph = null;

  constructor(desc:IDataDescription) {
    super(desc);
  }

  get nnodes(): number {
    if (this._loaded) {
      return this._loaded.nnodes;
    }
    var size = (<any>this.desc).size;
    return size[0] || 0;
  }

  get nedges(): number {
    if (this._loaded) {
      return this._loaded.nedges;
    }
    var size = (<any>this.desc).size;
    return size[1] || 0;
  }

  get dim() {
    return [this.nnodes, this.nedges];
  }

  impl(factory: IGraphFactory = defaultGraphFactory): Promise<AGraph> {
    if (this._impl) {
      return this._impl;
    }
    const type = (<any>this.desc).storage || 'remote';
    if (type === 'memory') {
      //memory only
      this._loaded = new MemoryGraph(this.desc, [],[], factory);
      this._impl = Promise.resolve(this._loaded);
    } else if (type === 'local') {
      this._loaded = LocalStorageGraph.load(this.desc, factory, localStorage);
      this._impl = Promise.resolve(this._loaded);
    } else if (type === 'session') {
      this._loaded = LocalStorageGraph.load(this.desc, factory, sessionStorage);
      this._impl = Promise.resolve(this._loaded);
    } else if (type === 'given' && (<any>this.desc).graph instanceof GraphBase) {
      this._loaded = (<any>this.desc).graph;
      this._impl = Promise.resolve(this._loaded);
    } else {
      this._impl = RemoteStoreGraph.load(this.desc, factory).then((graph: AGraph) => {
        return this._loaded = graph;
      });
    }
    return this._impl;
  }

  ids(range:Range = all()) {
    if (this._impl) {
      return this._impl.then((i) => i.ids(range));
    }
    return Promise.resolve(none());
  }

  get idtypes() {
    return ['_nodes', '_edges'].map(idtypes_resolve);
  }
}

/**
 * module entry point for creating a datatype
 * @param desc
 * @returns {IMatrix}
 */
export function create(desc:IDataDescription):GraphProxy {
  return new GraphProxy(desc);
}


export class GraphBase extends AGraph {
  constructor(public desc:IDataDescription, private _nodes: GraphNode[] = [], private _edges:GraphEdge[] = []) {
    super();
  }

  get nodes() {
    return this._nodes;
  }

  get edges() {
    return this._edges;
  }

  addNode(n:GraphNode): any {
    this._nodes.push(n);
    this.fire('add_node', n);
    return this;
  }

  updateNode(n: GraphNode): any {
    //since we store a reference we don't need to do anything
    this.fire('update_node', n);
    return this;
  }

  updateEdge(e: GraphEdge): any {
    //since we store a reference we don't need to do anything
    this.fire('update_edge', e);
    return this;
  }

  removeNode(n: GraphNode): any {
    var i = this._nodes.indexOf(n);
    if (i < 0) {
      return null;
    }
    this._nodes.splice(i, 1);
    this.fire('remove_node', n);
    return this;
  }

  addEdge(e: GraphEdge): any;
  addEdge(s:GraphNode, type:string, t:GraphNode): any;
  addEdge(e_or_s: GraphEdge | GraphNode, type?:string, t?:GraphNode): any {
    if (e_or_s instanceof GraphEdge) {
      let e = <GraphEdge>e_or_s;
      this._edges.push(e);
      this.fire('add_edge', e, e.type, e.source, e.target);
      return;
    }
    return this.addEdge(new GraphEdge(type, <GraphNode>e_or_s, t));
  }

  removeEdge(e: GraphEdge): any {
    var i = this._edges.indexOf(e);
    if (i < 0) {
      return null;
    }
    e.takeDown();
    this._edges.splice(i, 1);
    this.fire('remove_edge', e);
    return this;
  }

  get dim() {
    return [this._nodes.length, this._edges.length];
  }

  ids(range:Range = all()) {
    return Promise.resolve(list(this._nodes.map((n) => n.id), this._edges.map((n) => n.id)));
  }

  selectNode(node: GraphNode, op = SelectOperation.SET) {
    this.select(0, [this._nodes.indexOf(node)], op);
  }

  selectedNodes() : Promise<GraphNode[]> {
    return this.selections().then((r) => {
      var nodes = [];
      r.dim(0).forEach((index) => nodes.push(this._nodes[index]));
      return nodes;
    });
  }

  selectEdge(edge: GraphEdge, op = SelectOperation.SET) {
    this.select(1, [this._edges.indexOf(edge)], op);
  }

  selectedEdges() : Promise<GraphEdge[]> {
    return this.selections().then((r) => {
      var edges = [];
      r.dim(1).forEach((index) => edges.push(this._edges[index]));
      return edges;
    });
  }

  get idtypes() {
    return ['_nodes', '_edges'].map(idtypes_resolve);
  }

  clear() : any {
    this._nodes = [];
    this._edges = [];
    return this;
  }

  persist() {
    var r:any = {
      root: this.desc.id
    };
    r.nodes = this.nodes.map((s) => s.persist());
    r.edges = this.edges.map((l) => l.persist());
    return r;
  }

}

export class MemoryGraph extends GraphBase implements IPersistable {
  constructor(desc:IDataDescription, _nodes:GraphNode[] = [], _edges:GraphEdge[] = [], private factory = defaultGraphFactory) {
    super(desc, _nodes, _edges);
  }
  restore(persisted:any) {
     var lookup = {},
       lookupFun = (id) => lookup[id];
    persisted.nodes.forEach((p) => {
      var n = this.factory.makeNode(p);
      lookup[n.id] = n;
      this.addNode(n);
    });

    persisted.edges.forEach((p) => {
      var n = this.factory.makeEdge(p, lookupFun);
      this.addEdge(n);
    });
    return this;
  }
}


export class RemoteStoreGraph extends GraphBase {
  private updateHandler = (event: IEvent) => {
    const s = event.target;
    if (s instanceof GraphNode) {
      this.updateNode(<GraphNode>s);
    }
    if (s instanceof GraphEdge) {
      this.updateEdge(<GraphEdge>s);
    }
  };

  private _wait_for_synced = 0;


  constructor(desc:IDataDescription, _nodes: GraphNode[] = [], _edges:GraphEdge[] = []) {
    super(desc, _nodes, _edges);
  }

  static load(desc, factory: IGraphFactory) {
    const r = new RemoteStoreGraph(desc, [], []);
    return r.load(factory);
  }

  private load(factory: IGraphFactory) {
    return sendAPI('/dataset/graph/' + this.desc.id + '/data').then((r) => {
      this.loadImpl(r.nodes, r.edges, factory);
      this.fire('sync_load,sync', --this._wait_for_synced);
      return this;
    });
  }

  private loadImpl(nodes: any[], edges: any[], factory: IGraphFactory) {
    const lookup = {},
      lookupFun = (id) => lookup[id];
    nodes.forEach((n) => {
      let nn = factory.makeNode(n);
      lookup[nn.id] = nn;
      nn.on('setAttr', this.updateHandler);
      super.addNode(nn);
    });
    edges.forEach((n) => {
      let nn = factory.makeEdge(n, lookupFun);
      nn.on('setAttr', this.updateHandler);
      super.addEdge(nn);
    });
    this.fire('loaded');
  }

  get activeSyncOperations() {
    return this._wait_for_synced;
  }

  addNode(n:GraphNode) {
    super.addNode(n);
    n.on('setAttr', this.updateHandler);

    this.fire('sync_start_node,sync_start', ++this._wait_for_synced, 'add_node', n);
    return sendAPI('/dataset/graph/' + this.desc.id + '/node', {
      desc: JSON.stringify(n.persist())
    }, 'post').then((r) => {
      this.fire('sync_node,sync', --this._wait_for_synced, n);
      return this;
    });
  }

  updateNode(n: GraphNode): any {
    super.updateNode(n);
    this.fire('sync_start_node,sync_start', ++this._wait_for_synced, 'update_node', n);
    return sendAPI('/dataset/graph/' + this.desc.id + '/node/'+n.id,{
      desc: JSON.stringify(n.persist())
    }, 'put').then((r) => {
      this.fire('sync_node,sync', --this._wait_for_synced,n);
      return this;
    });
  }

  removeNode(n: GraphNode) {
    if (!super.removeNode(n)) {
      return Promise.reject('invalid node');
    }
    n.off('setAttr', this.updateHandler);
    this.fire('sync_start_node,sync_start', ++this._wait_for_synced, 'remove_node', n);
    return sendAPI('/dataset/graph/' + this.desc.id + '/node/'+n.id, {}, 'delete').then((r) => {
      this.fire('sync_node,sync', --this._wait_for_synced, n);
      return this;
    });
  }

  addEdge(e_or_s: GraphEdge | GraphNode, type?:string, t?:GraphNode) {
    if (e_or_s instanceof GraphEdge) {
      super.addEdge(e_or_s);
      let e = <GraphEdge>e_or_s;
      e.on('setAttr', this.updateHandler);
      this.fire('sync_start_edge,sync_start', ++this._wait_for_synced, 'add_edge', e);
      return sendAPI('/dataset/graph/' + this.desc.id + '/edge', {
        desc: JSON.stringify(e.persist())
      }, 'post').then((r) => {
        this.fire('sync_edge,sync', --this._wait_for_synced, e);
        return this;
      });
    }
    return super.addEdge(<GraphNode>e_or_s, type, t);
  }

  removeEdge(e: GraphEdge) {
    if (!super.removeEdge(e)) {
      return Promise.reject('invalid edge');
    }
    e.off('setAttr', this.updateHandler);
    this.fire('sync_start_edge,sync_start', ++this._wait_for_synced, 'remove_edge', e);
    return sendAPI('/dataset/graph/' + this.desc.id + '/edge/'+e.id, {}, 'delete').then((r) => {
      this.fire('sync_edge,sync', --this._wait_for_synced,e);
      return this;
    });
  }

  updateEdge(e: GraphEdge): any {
    super.updateEdge(e);
    this.fire('sync_start_edge,sync_start', ++this._wait_for_synced, 'update_edge', e);
    return sendAPI('/dataset/graph/' + this.desc.id + '/edge/'+e.id, {
      desc: JSON.stringify(e.persist())
    }, 'put').then((r) => {
      this.fire('sync_edge,sync', --this._wait_for_synced,e);
      return this;
    });
  }

  clear() {
    if (this.nnodes === 0 && this.nedges === 0) {
      return Promise.resolve(this);
    }
    this.nodes.forEach((n) => n.off('setAttr', this.updateHandler));
    this.edges.forEach((n) => n.off('setAttr', this.updateHandler));
    super.clear();
    this.fire('sync_start', ++this._wait_for_synced, 'clear');
    return sendAPI('/dataset/graph/'+this.desc.id + '/node', {}, 'delete').then((r) => {
      this.fire('sync');
      return this;
    });
  }
}

export class LocalStorageGraph extends GraphBase {

  private updateHandler = (event: IEvent) => {
    const s = event.target;
    if (s instanceof GraphNode) {
      this.updateNode(<GraphNode>s);
    }
    if (s instanceof GraphEdge) {
      this.updateEdge(<GraphEdge>s);
    }
  };

  constructor(desc:IDataDescription, _nodes: GraphNode[] = [], _edges:GraphEdge[] = [], private storage: Storage = sessionStorage) {
    super(desc, _nodes, _edges);
  }

  static load(desc, factory: IGraphFactory, storage: Storage = sessionStorage, reset = false) {
    const r = new LocalStorageGraph(desc, [], [], storage);
    if (!reset) {
      r.load(factory);
    }
    return r;
  }

  static clone(graph: GraphBase, factory: IGraphFactory, storage: Storage = sessionStorage) {
    const r = new LocalStorageGraph(graph.desc, [], [], storage);
    r.restoreDump(graph.persist(), factory);
    return r;
  }

  private get uid() {
    return 'graph' + this.desc.id;
  }

  private load(factory: IGraphFactory) {
    const uid = this.uid;
    if (!this.storage.hasOwnProperty(uid+'.nodes')) {
      return;
    }
    const node_ids = JSON.parse(this.storage.getItem(uid+'.nodes'));
    const lookup = {},
      lookupFun = (id) => lookup[id];
    node_ids.forEach((id) => {
      let n = JSON.parse(this.storage.getItem(uid+'.node.'+id));
      let nn = factory.makeNode(n);
      lookup[nn.id] = nn;
      nn.on('setAttr', this.updateHandler);
      super.addNode(nn);
    });
    const edges_ids = JSON.parse(this.storage.getItem(uid+'.edges'));
    edges_ids.forEach((id) => {
      let n = JSON.parse(this.storage.getItem(uid+'.edge.'+id));
      let nn = factory.makeEdge(n, lookupFun);
      nn.on('setAttr', this.updateHandler);
      super.addEdge(nn);
    });
    this.fire('loaded');
  }

  static delete(desc:IDataDescription, storage: Storage = sessionStorage) {
    const uid = 'graph' + desc.id;
    JSON.parse(storage.getItem(uid+'.nodes')).forEach((id) => {
      storage.removeItem(uid+'.node.'+id);
    });
    storage.removeItem(uid+'.nodes');
    JSON.parse(storage.getItem(uid+'.edges')).forEach((id) => {
      storage.removeItem(uid+'.edge.'+id);
    });
    storage.removeItem(uid+'.edges');
    return true;
  }

  restoreDump(persisted:any, factory: IGraphFactory) {
     var lookup = {},
       lookupFun = (id) => lookup[id];

    persisted.nodes.forEach((p) => {
      var n = factory.makeNode(p);
      lookup[n.id] = n;
      this.addNode(n);
    });

    persisted.edges.forEach((p) => {
      var n = factory.makeEdge(p, lookupFun);
      this.addEdge(n);
    });
    return this;
  }

  addNode(n:GraphNode) {
    super.addNode(n);
    const uid = this.uid;
    this.storage.setItem(uid+'.node.'+n.id, JSON.stringify(n.persist()));
    this.storage.setItem(uid+'.nodes',JSON.stringify(this.nodes.map((d) => d.id)));
    n.on('setAttr', this.updateHandler);
    return this;
  }

  updateNode(n: GraphNode): any {
    super.updateNode(n);
    const uid = this.uid;
    this.storage.setItem(uid+'.node.'+n.id, JSON.stringify(n.persist()));
    return this;
  }

  removeNode(n: GraphNode) {
    if (!super.removeNode(n)) {
      return null;
    }
    const uid = this.uid;
    this.storage.setItem(uid+'.nodes',JSON.stringify(this.nodes.map((d) => d.id)));
    this.storage.removeItem(uid+'.node.'+n.id);
    n.off('setAttr', this.updateHandler);

    return this;
  }

  addEdge(e_or_s: GraphEdge | GraphNode, type?:string, t?:GraphNode) {
    if (e_or_s instanceof GraphEdge) {
      super.addEdge(e_or_s);
      let e = <GraphEdge>e_or_s;
      const uid = this.uid;
      this.storage.setItem(uid+'.edges', JSON.stringify(this.edges.map((d) => d.id)));
      this.storage.setItem(uid+'.edge.'+e.id, JSON.stringify(e.persist()));
      e.on('setAttr', this.updateHandler);
      return this;
    }
    return super.addEdge(<GraphNode>e_or_s, type, t);
  }

  removeEdge(e: GraphEdge) {
    if (!super.removeEdge(e)) {
      return null;
    }
    //need to shift all
    const uid = this.uid;
    this.storage.setItem(uid+'.edges', JSON.stringify(this.edges.map((d) => d.id)));
    this.storage.removeItem(uid + '.edge.'+e.id);
    e.off('setAttr', this.updateHandler);
    return this;
  }

  updateEdge(e: GraphEdge): any {
    super.updateEdge(e);
    const uid = this.uid;
    this.storage.setItem(uid+'.edge.'+e.id, JSON.stringify(e.persist()));
    return this;
  }

  clear() {
    const nnodes = this.nnodes, nedges = this.nedges;
    if (nnodes === 0 && nedges === 0) {
      return this;
    }
    this.nodes.forEach((n) => n.off('setAttr', this.updateHandler));
    this.edges.forEach((n) => n.off('setAttr', this.updateHandler));
    super.clear();
    const uid = this.uid;
    JSON.parse(this.storage.getItem(uid+'.nodes')).forEach((id) => {
      this.storage.removeItem(uid+'.node.'+id);
    });
    this.storage.removeItem(uid+'.nodes');
    JSON.parse(this.storage.getItem(uid+'.edges')).forEach((id) => {
      this.storage.removeItem(uid+'.edge.'+id);
    });
    this.storage.removeItem(uid+'.edges');
  }

  persist() {
    var r:any = {
      root: this.desc.id
    };
    r.nodes = this.nodes.map((s) => s.persist());
    r.edges = this.edges.map((l) => l.persist());
    return r;
  }
}
