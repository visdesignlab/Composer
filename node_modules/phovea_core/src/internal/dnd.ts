/**
 * Created by Samuel Gratzl on 27.12.2016.
 */


/**
 * utility for drag-n-drop support
 * @param e
 * @param type
 * @returns {any}
 */
export function hasDnDType(e: DragEvent, type: string) {
  const types: any= e.dataTransfer.types;

  /*
   * In Chrome datatransfer.types is an Array,
   * while in Firefox it is a DOMStringList
   * that only implements a contains-method!
   */
  if (typeof(types.indexOf) === 'function') {
    return types.indexOf(type) >= 0;
  }
  if (typeof(types.includes) === 'function') {
    return types.includes(type);
  }
  if (typeof(types.contains) === 'function') {
    return types.contains(type);
  }
  return false;
}

/**
 * checks whether it is a copy operation
 * @param e
 * @returns {boolean|RegExpMatchArray}
 */
export function copyDnD(e: DragEvent) {
  const dT = e.dataTransfer;
  return (e.ctrlKey && dT.effectAllowed.match(/copy/gi)) || (!dT.effectAllowed.match(/move/gi));
}
/**
 * updates the drop effect accoriding to the current copyDnD state
 * @param e
 */
export function updateDropEffect(e: DragEvent) {
  const dT = e.dataTransfer;
  if (copyDnD(e)) {
    dT.dropEffect = 'copy';
  } else {
    dT.dropEffect = 'move';
  }
}
