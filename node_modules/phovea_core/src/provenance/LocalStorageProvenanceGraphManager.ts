/**
 * Created by sam on 12.02.2015.
 */
import {mixin} from '../index';
import ProvenanceGraph, {
  IProvenanceGraphManager,
  provenanceGraphFactory,
  IProvenanceGraphDataDescription
} from './ProvenanceGraph';
import GraphBase from '../graph/GraphBase';
import LocalStorageGraph from '../graph/LocalStorageGraph';
import {ALL_READ_NONE, currentUserNameOrAnonymous} from '../security';
import MemoryGraph from '../graph/MemoryGraph';

export default class LocalStorageProvenanceGraphManager implements IProvenanceGraphManager {
  private options = {
    storage: localStorage,
    prefix: 'clue',
    application: 'unknown'
  };

  constructor(options = {}) {
    mixin(this.options, options);
  }

  private loadFromLocalStorage<T>(suffix: string, defaultValue: T): T {
    try {
      const item = this.options.storage.getItem(this.options.prefix + suffix);
      if(item === undefined || item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch(e) {
      console.error(e);
      return defaultValue;
    }
  }

  list() {
    const lists : string[] = this.loadFromLocalStorage('_provenance_graphs', []);
    const l = lists
      .map((id) => this.loadFromLocalStorage('_provenance_graph.' + id, {}))
      // filter to right application
      .filter((d: IProvenanceGraphDataDescription) => d.attrs && d.attrs.of === this.options.application);
    return Promise.resolve(l);
  }


  getGraph(desc: IProvenanceGraphDataDescription): Promise<LocalStorageGraph> {
    return Promise.resolve(LocalStorageGraph.load(desc, provenanceGraphFactory(), this.options.storage));
  }

  async get(desc: IProvenanceGraphDataDescription): Promise<ProvenanceGraph> {
    return new ProvenanceGraph(desc, await this.getGraph(desc));
  }

  async clone(graph: GraphBase, desc: any = {}): Promise<ProvenanceGraph> {
    const description = `Cloned from ${graph.desc.name} created by ${graph.desc.creator}\n${(graph.desc.description || '')}`;
    const pdesc = this.createDesc(mixin({name: graph.desc.name, description}, desc));
    const newGraph = await this.getGraph(pdesc);
    newGraph.restoreDump(graph.persist(), provenanceGraphFactory());
    return new ProvenanceGraph(pdesc, newGraph);
  }

  async import(json: any, desc: any = {}): Promise<ProvenanceGraph> {
    const pdesc = this.createDesc(desc);
    const newGraph = await this.getGraph(pdesc);
    newGraph.restoreDump(json, provenanceGraphFactory());
    return new ProvenanceGraph(pdesc, newGraph);
  }

  delete(desc: IProvenanceGraphDataDescription) {
    const lists = JSON.parse(this.options.storage.getItem(this.options.prefix + '_provenance_graphs') || '[]');
    lists.splice(lists.indexOf(desc.id), 1);
    LocalStorageGraph.delete(desc, this.options.storage);
    //just remove from the list
    this.options.storage.removeItem(this.options.prefix + '_provenance_graph.' + desc.id);
    this.options.storage.setItem(this.options.prefix + '_provenance_graphs', JSON.stringify(lists));
    return Promise.resolve(true);
  }

  edit(graph: ProvenanceGraph|IProvenanceGraphDataDescription, desc: any = {}) {
    const base = graph instanceof ProvenanceGraph ? graph.desc : graph;
    mixin(base, desc);
    this.options.storage.setItem(this.options.prefix + '_provenance_graph.' + base.id, JSON.stringify(base));
    return Promise.resolve(base);
  }

  private createDesc(overrides: any = {}) {
    const lists: string[] = JSON.parse(this.options.storage.getItem(this.options.prefix + '_provenance_graphs') || '[]');
    const uid = (lists.length > 0 ? String(1 + Math.max(...lists.map((d) => parseInt(d.slice(this.options.prefix.length), 10)))) : '0');
    const id = this.options.prefix + uid;
    const desc: IProvenanceGraphDataDescription = mixin({
      type: 'provenance_graph',
      name: 'Temporary Session ' + uid,
      fqname: this.options.prefix + 'Temporary Session ' + uid,
      id,
      local: true,
      size: <[number, number]>[0, 0],
      attrs: {
        graphtype: 'provenance_graph',
        of: this.options.application
      },
      creator: currentUserNameOrAnonymous(),
      permissions: ALL_READ_NONE,
      ts: Date.now(),
      description: ''
    }, overrides);
    lists.push(id);
    this.options.storage.setItem(this.options.prefix + '_provenance_graphs', JSON.stringify(lists));
    this.options.storage.setItem(this.options.prefix + '_provenance_graph.' + id, JSON.stringify(desc));
    return desc;
  }

  create(desc: any = {}) {
    const pdesc = this.createDesc(desc);
    return this.get(pdesc);
  }

  private createInMemoryDesc(base?: IProvenanceGraphDataDescription): IProvenanceGraphDataDescription {
    return mixin({
      type: 'provenance_graph',
      name: 'In Memory Session',
      fqname: 'In Memory Session',
      id: 'memory',
      local: true,
      size: <[number, number]>[0, 0],
      attrs: {
        graphtype: 'provenance_graph',
        of: this.options.application
      },
      creator: currentUserNameOrAnonymous(),
      permissions: ALL_READ_NONE,
      ts: Date.now(),
      description: ''
    }, base? base : {}, {
      id: 'memory',
      local: true
    });
  }

  createInMemory() {
    const desc = this.createInMemoryDesc();
    return new ProvenanceGraph(desc, new MemoryGraph(desc, [], [], provenanceGraphFactory()));
  }

  cloneInMemory(graph: GraphBase) {
    const desc = this.createInMemoryDesc(<IProvenanceGraphDataDescription>graph.desc);
    const m = new MemoryGraph(desc, [], [], provenanceGraphFactory());
    m.restore(graph.persist());
    return new ProvenanceGraph(desc, m);
  }
}
