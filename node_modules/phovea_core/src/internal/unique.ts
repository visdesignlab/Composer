/**
 * Created by Samuel Gratzl on 27.12.2016.
 */


/**
 * unique id container
 * @type {{}}
 */
const idCounter = new Map<string, number>();
/**
 * returns a unique id for the given domain
 * @param domain
 * @return {number}
 */
export function uniqueId(domain: string = '_default') {
  if (!idCounter.has(domain)) {
    idCounter.set(domain, 0);
  }
  const v = idCounter.get(domain);
  idCounter.set(domain, v + 1);
  return v;
}

export function flagId(domain: string, id: number) {
  if (isNaN(id) || id < 0) {
    return id;
  }
  if (!idCounter.has(domain)) {
    idCounter.set(domain, id + 1);
  } else {
    idCounter.set(domain, Math.max(idCounter.get(domain), id + 1)); //use the next one afterwards
  }
  return id;
}

/**
 * returns a string, which is a unique id for the given domain
 * @param domain
 * @return {string}
 */
export function uniqueString(domain: string = '_default') {
  return domain + uniqueId(domain);
}
