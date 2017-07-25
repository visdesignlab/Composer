/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by sam on 10.02.2015.
 */

/**
 * Use the browser's sessionStorage
 * @type {Storage}
 */
const context: Storage = sessionStorage;

/**
 * Store any value for a given key and returns the previous stored value.
 * Returns `null` if no previous value was found.
 * @param key
 * @param value
 * @returns {any}
 */
export function store(key: string, value: any) {
  const bak = context.getItem(key);
  context.setItem(key, JSON.stringify(value));
  return bak;
}

/**
 * Removes the key-value pair from the session
 * @param key
 */
export function remove(key: string) {
  context.removeItem(key);
}

/**
 * Returns true if the key exists in the session. Otherwise returns false.
 * @param key
 * @returns {boolean}
 */
export function has(key: string) {
  return (context.getItem(key) !== null);
}

/**
 * Returns the value for the given key if it exists in the session.
 * Otherwise returns the `default_` parameter, which is by default `null`.
 * @param key
 * @param defaultValue
 * @returns {T}
 */
export function retrieve<T>(key: string, defaultValue: T = null): T {
  return has(key) ? JSON.parse(context.getItem(key)) : defaultValue;
}
