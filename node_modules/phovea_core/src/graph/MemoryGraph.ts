/**
 * Created by sam on 12.02.2015.
 */
/**
 * Created by Samuel Gratzl on 22.10.2014.
 */
import {IPersistable} from '../index';
import GraphBase, {defaultGraphFactory, IGraphDataDescription} from './GraphBase';
import {GraphEdge, GraphNode} from './graph';

export default class MemoryGraph extends GraphBase implements IPersistable {
  constructor(desc: IGraphDataDescription, nodes: GraphNode[] = [], edges: GraphEdge[] = [], private factory = defaultGraphFactory) {
    super(desc, nodes, edges);
  }

  restore(persisted: any) {
    const lookup = new Map<number, GraphNode>();
    persisted.nodes.forEach((p: any) => {
      const n = this.factory.makeNode(p);
      lookup.set(n.id, n);
      this.addNode(n);
    });

    persisted.edges.forEach((p: any) => {
      const n = this.factory.makeEdge(p, lookup.get.bind(lookup));
      this.addEdge(n);
    });
    return this;
  }
}
