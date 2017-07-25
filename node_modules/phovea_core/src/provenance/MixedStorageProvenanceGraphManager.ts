/**
 * Created by sam on 12.02.2015.
 */
import ProvenanceGraph, {IProvenanceGraphManager, IProvenanceGraphDataDescription} from './ProvenanceGraph';
import LocalStorageProvenanceGraphManager from './LocalStorageProvenanceGraphManager';
import RemoteStorageProvenanceGraphManager from './RemoteStorageProvenanceGraphManager';
import GraphBase from '../graph/GraphBase';

export default class MixedStorageProvenanceGraphManager implements IProvenanceGraphManager {
  private remote: RemoteStorageProvenanceGraphManager;
  private local: LocalStorageProvenanceGraphManager;

  constructor(options = {}) {
    this.remote = new RemoteStorageProvenanceGraphManager(options);
    this.local = new LocalStorageProvenanceGraphManager(options);
  }

  listRemote() {
    return this.remote.list();
  }

  listLocal() {
    return this.local.list();
  }

  list(): Promise<IProvenanceGraphDataDescription[]> {
    return Promise.all([this.listLocal(), this.listRemote()]).then((arr) => arr[0].concat(arr[1]));
  }

  delete(desc: IProvenanceGraphDataDescription): Promise<boolean> {
    if (desc.local) {
      return this.local.delete(desc);
    } else {
      return this.remote.delete(desc);
    }
  }

  get(desc: IProvenanceGraphDataDescription): Promise<ProvenanceGraph> {
    if ((<any>desc).local) {
      return this.local.get(desc);
    } else {
      return this.remote.get(desc);
    }
  }

  getGraph(desc: IProvenanceGraphDataDescription): Promise<GraphBase> {
    if (desc.local) {
      return this.local.getGraph(desc);
    } else {
      return this.remote.getGraph(desc);
    }
  }

  edit(graph: IProvenanceGraphDataDescription | ProvenanceGraph, desc: any): Promise<IProvenanceGraphDataDescription> {
    const base = graph instanceof ProvenanceGraph ? graph.desc : graph;
    if (base.local) {
      return this.local.edit(base, desc);
    } else {
      return this.remote.edit(base, desc);
    }
  }

  async cloneLocal(desc: IProvenanceGraphDataDescription, extras: any = {}): Promise<ProvenanceGraph> {
    return this.local.clone(await this.getGraph(desc), extras);
  }

  async cloneRemote(desc: IProvenanceGraphDataDescription, extras: any = {}): Promise<ProvenanceGraph> {
    return this.remote.clone(await this.getGraph(desc), extras);
  }

  migrateRemote(graph: ProvenanceGraph, extras: any = {}): Promise<ProvenanceGraph> {
    return this.remote.migrate(graph, extras);
  }

  importLocal(json: any, desc: any = {}) {
    return this.local.import(json, desc);
  }

  importRemote(json: any, desc: any = {}) {
    return this.remote.import(json, desc);
  }

  import(json: any, desc: any = {}) {
    return this.importLocal(json, desc);
  }

  createLocal(desc: any = {}) {
    return this.local.create(desc);
  }

  createRemote(desc: any = {}) {
    return this.remote.create(desc);
  }

  create(desc: any = {}) {
    return this.createLocal(desc);
  }

  createInMemory(): ProvenanceGraph {
    return this.local.createInMemory();
  }

  cloneInMemory(desc: IProvenanceGraphDataDescription): Promise<ProvenanceGraph> {
    return this.getGraph(desc).then((graph) => this.local.cloneInMemory(graph));
  }
}
