/**
 * Created by sam on 12.02.2015.
 */
import {mixin} from '../index';
import {get as getData, remove as removeData, upload, list as listData, modify} from '../data';
import ProvenanceGraph, {
  IProvenanceGraphManager,
  provenanceGraphFactory,
  IProvenanceGraphDataDescription
} from './ProvenanceGraph';
import GraphBase from '../graph/GraphBase';
import {currentUserNameOrAnonymous} from '../security';
import GraphProxy from '../graph/GraphProxy';
import RemoteStoreGraph from '../graph/RemoteStorageGraph';

export default class RemoteStorageProvenanceGraphManager implements IProvenanceGraphManager {
  private options = {
    application: 'unknown'
  };

  constructor(options = {}) {
    mixin(this.options, options);
  }

  async list() {
    return (await listData((d) => d.desc.type === 'graph' && (<any>d.desc).attrs.graphtype === 'provenance_graph' && (<any>d.desc).attrs.of === this.options.application)).map((di) => di.desc);
  }

  async getGraph(desc: IProvenanceGraphDataDescription): Promise<GraphBase> {
    return (<any>(await getData(desc.id))).impl(provenanceGraphFactory());
  }

  async get(desc: IProvenanceGraphDataDescription): Promise<ProvenanceGraph> {
    return new ProvenanceGraph(desc, await this.getGraph(desc));
  }

  delete(desc: IProvenanceGraphDataDescription) {
    return removeData(desc);
  }

  clone(graph: GraphBase, desc: any = {}): Promise<ProvenanceGraph> {
    return this.import(graph.persist(), desc);
  }

  private importImpl(json: {nodes: any[], edges: any[]}, desc: any = {}): Promise<GraphBase> {
    const pdesc: any = mixin({
      type: 'graph',
      attrs: {
        graphtype: 'provenance_graph',
        of: this.options.application
      },
      name: 'Persistent WS',
      creator: currentUserNameOrAnonymous(),
      ts: Date.now(),
      description: '',

      nodes: json.nodes,
      edges: json.edges
    }, desc);
    return upload(pdesc).then((base: GraphProxy) => base.impl(provenanceGraphFactory()));
  }

  import(json: any, desc: any = {}): Promise<ProvenanceGraph> {
    return this.importImpl(json, desc).then((impl) => {
      return new ProvenanceGraph(<IProvenanceGraphDataDescription>impl.desc, impl);
    });
  }

  migrate(graph: ProvenanceGraph, desc: any = {}): Promise<ProvenanceGraph> {
    return this.importImpl({nodes: [], edges: []}, desc).then((backend: RemoteStoreGraph) => {
      return Promise.resolve(graph.backend.migrate())
        .then(({nodes, edges}) => {
          return backend.addAll(nodes, edges);
        }).then(() => {
          graph.migrateBackend(backend);
          return graph;
        });
    });
  }

  async edit(graph: ProvenanceGraph|IProvenanceGraphDataDescription, desc: any = {}) {
    const base = graph instanceof ProvenanceGraph ? graph.desc : graph;
    mixin(base, desc);
    const graphProxy = await getData(base.id);
    await modify(graphProxy, desc);
    return base;
  }

  async create(desc: any = {}) {
    const pdesc: IProvenanceGraphDataDescription = mixin({
      id: undefined,
      type: 'graph',
      attrs: {
        graphtype: 'provenance_graph',
        of: this.options.application
      },
      name: `Persistent WS`,
      fqname: `provenance_graphs/Persistent WS`,
      creator: currentUserNameOrAnonymous(),
      size: <[number, number]>[0, 0],
      ts: Date.now(),
      description: ''
    }, desc);

    const impl: Promise<GraphBase> = (<any>(await upload(pdesc))).impl(provenanceGraphFactory());
    return impl.then((i) => new ProvenanceGraph(<IProvenanceGraphDataDescription>i.desc, i));
  }
}
