/**
 * Created by Samuel Gratzl on 16.03.2017.
 */
import {AVector} from '../AVector';
import {IStringValueTypeDesc, IDataType} from '../../datatype';
import {IVector, IVectorDataDescription} from '../';
import {RangeLike, parse, all, list as rlist} from '../../range';
import {argSort, argFilter} from '../../';
import IDType from '../../idtype/IDType';

export declare type IStringVector = IVector<string, IStringValueTypeDesc>;

export abstract class ANameVector<T extends IDataType> extends AVector<string, IStringValueTypeDesc> {
  readonly desc: IVectorDataDescription<IStringValueTypeDesc>;

  constructor(protected base: T) {
    super(null);
    this.desc = {
      type: 'vector',
      name: base.desc.name,
      fqname: base.desc.fqname,
      description: base.desc.description,
      id: base.desc.id + '_names',
      value: {
        type: 'string'
      },
      idtype: this.idtype.id,
      size: this.length,
      ts: base.desc.ts,
      creator: base.desc.creator,
      group: base.desc.group,
      permissions: base.desc.permissions
    };
  }

  get valuetype() {
    return this.desc.value;
  }

  abstract get idtype(): IDType;

  get idtypes() {
    return [this.idtype];
  }

  persist(): any {
    return {
      root: this.base.persist(),
      names: true
    };
  }

  restore(persisted: any) {
    let r: IVector<string, IStringValueTypeDesc> = this;
    if (persisted && persisted.range) { //some view onto it
      r = r.view(parse(persisted.range));
    }
    return r;
  }

  at(i: number) {
    return this.data(rlist(i)).then((names) => names[0]);
  }

  abstract names(range?: RangeLike): Promise<string[]>;

  data(range: RangeLike = all()) {
    return this.names(range);
  }

  async sort(compareFn?: (a: string, b: string) => number, thisArg?: any): Promise<IStringVector> {
    const d = await this.data();
    const indices = argSort(d, compareFn, thisArg);
    return this.view(rlist(indices));
  }

  async filter(callbackfn: (value: string, index: number) => boolean, thisArg?: any): Promise<IStringVector> {
    const d = await this.data();
    const indices = argFilter(d, callbackfn, thisArg);
    return this.view(rlist(indices));
  }
}

export default ANameVector;
