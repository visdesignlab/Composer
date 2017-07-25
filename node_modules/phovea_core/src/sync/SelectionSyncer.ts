/**
 * Created by Samuel Gratzl on 01.12.2016.
 */

import {mixin} from '../';
import Store from './Store';
import {list as listIDTypes, defaultSelectionType} from '../idtype';
import IDType from '../idtype/IDType';
import Range from '../range/Range';
import {on as globalOn} from '../event';

const PREFIX = 'selection-idtype-';

export interface ISelectionSyncerOptions {
  filter?(idType: IDType): boolean;
  selectionTypes?: string[];
}

function syncIDType(store: Store, idType: IDType, options: ISelectionSyncerOptions) {
  options.selectionTypes.forEach((type) => {
    const key = `${PREFIX}${idType.id}-${type}`;
    let disable = false;
    idType.on('select-' + type, (event, type: string, selection: Range) => {
      if (disable) {
        return;
      }
      // sync just the latest state
      store.setValue(key, selection.toString());
    });
    store.on(key, (event: any, newValue: string) => {
      disable = true; //don't track on changes
      idType.select(type, newValue);
      disable = false;
    });
  });
}


export function create(store: Store, options?: ISelectionSyncerOptions) {
  options = mixin({
    filter: () => true,
    selectionTypes: [defaultSelectionType] // by default just selections
  }, options);

  // store existing
  const toSync = listIDTypes().filter((idType) => (idType instanceof IDType && options.filter(<IDType>idType)));
  toSync.forEach((idType) => syncIDType(store, <IDType>idType, options));

  // watch new ones
  globalOn('register.idtype', (event: any, idType: IDType) => {
    if (options.filter(idType)) {
      syncIDType(store, idType, options);
    }
  });
  return null;
}
