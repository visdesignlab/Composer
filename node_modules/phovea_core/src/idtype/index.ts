/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */

export {
  clearSelection,
  EVENT_REGISTER_IDTYPE,
  IDTypeLike,
  list,
  listAll,
  persist,
  register,
  restore,
  resolve,
  resolveProduct,
  isInternalIDType
} from './manager'
export {default as SelectAble, ISelectAble} from './ASelectAble';
export {
  IIDType,
  asSelectOperation,
  defaultSelectionType,
  hoverSelectionType,
  SelectOperation,
  toSelectOperation
} from './IIDType';
export {default as IDType} from './IDType';
export {default as AProductSelectAble, IProductSelectAble} from './AProductSelectAble';
export {default as ProductIDType} from './ProductIDType';
export {default as ObjectManager, IHasUniqueId, isId, toId} from './ObjectManager';
export {default as LocalIDAssigner, createLocalAssigner} from './LocalIDAssigner';
