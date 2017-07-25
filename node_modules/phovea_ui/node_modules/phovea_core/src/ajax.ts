/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
/**
 * Created by Samuel Gratzl on 04.08.2014.
 */
import {offline as isOffline, server_url, server_json_suffix} from '.';

class AjaxError extends Error {
  constructor(public response: any, message?: string) {
    super(message ? message : response.statusText);
  }
}

function checkStatus(response) {
  if (response.ok) {
    return response;
  } else {
    throw new AjaxError(response);
  }
}

function parseType(expectedDataType: string, response) {
  switch (expectedDataType.trim().toLowerCase()) {
    case 'json':
    case 'application/json':
      return response.json();
    case 'text':
    case 'text/plain':
      return response.text();
    case 'blob':
      return response.blob();
    case 'formdata':
      return response.formData();
    case 'arraybuffer':
      return response.arrayBuffer();
    default:
      throw new AjaxError(response, `unknown expected data type: "${expectedDataType}"`);
  }
}

/**
 * sends an XML http request to the server
 * @param url url
 * @param data arguments
 * @param method the http method
 * @param expectedDataType expected data type to return, in case of JSON it will be parsed using JSON.parse
 * @returns {Promise<any>}
 */
export function send(url: string, data: any = {}, method = 'GET', expectedDataType = 'json'): Promise<any> {
  // for compatibility
  method = method.toUpperCase();

  // need to encode the body in the url in case of GET and HEAD
  if (method === 'GET' || method === 'HEAD') {
    data = encodeParams(data); //encode in url
    if (data) {
      url += (/\?/.test(url) ? '&' : '?') + data;
      data = null;
    }
  }

  const options: any = {
    credentials: 'same-origin',
    method: method,
    headers: {
      'Accept': 'application/json'
    },
  };
  if (data && !(data instanceof FormData)) {
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    options.body = encodeParams(data);
  } else if (data) {
    options.body = data;
  }

  // there are no typings for fetch so far
  return (<any>self).fetch(url, options)
    .then(checkStatus)
    .then(parseType.bind(null, expectedDataType));
}
/**
 * to get some ajax json file
 * @param url
 * @param data
 * @returns {any}
 */
export function getJSON(url: string, data: any = {}): Promise<any> {
  return send(url, data);
}
/**
 * get some generic data via ajax
 * @param url
 * @param data
 * @param expectedDataType
 * @returns {any}
 */
export function getData(url: string, data: any = {}, expectedDataType = 'json'): Promise<any> {
  return send(url, data, 'get', expectedDataType);
}

/**
 * converts the given api url to an absolute with optional get parameters
 * @param url
 * @param data
 * @returns {string}
 */
export function api2absURL(url: string, data: any = null) {
  url = `${server_url}${url}${server_json_suffix}`;
  data = encodeParams(data);
  if (data) {
    url += (/\?/.test(url) ? '&' : '?') + data;
  }
  return url;
}


/**
 * convert a given object to url data similar to JQuery
 * @param url
 * @param data
 * @returns {any}
 */
export function encodeParams(data = null) {
  if (data === null) {
    return null;
  }
  if (typeof data === 'string') {
    return encodeURIComponent(data);
  }
  var keys = Object.keys(data);
  if (keys.length === 0) {
    return null;
  }
  var s = [];

  function add(prefix, key, value) {
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (typeof v === 'object') {
          add(prefix, key + '[' + i + ']', v);
        } else {
          //primitive values uses the same key
          add(prefix, key + '[]', v);
        }
      });
    } else if (typeof value === 'object') {
      Object.keys(value).forEach((v) => {
        add(prefix, key + '[' + v + ']', value[v]);
      });
    } else {
      s.push(encodeURIComponent(prefix + key) + '=' + encodeURIComponent(value));
    }
  }

  keys.forEach((key) => {
    add('', key, data[key]);
  });

  // Return the resulting serialization
  return s.join('&').replace(/%20/g, '+');
}

type OfflineGenerator = ((data: any) => Promise<any>)|Promise<any>|any;

function defaultOfflineGenerator() {
  return Promise.reject('offline');
}

function offline(generator: OfflineGenerator, data: any = {}) {
  return Promise.resolve(typeof generator === 'function' ? generator(data) : generator);
}

/**
 * api version of send
 * @param url api relative url
 * @param data arguments
 * @param method http method
 * @param expectedDataType expected data type to return, in case of JSON it will be parsed using JSON.parse
 * @returns {Promise<any>}
 */
export function sendAPI(url: string, data: any = {}, method = 'get', expectedDataType = 'json', offlineGenerator: OfflineGenerator = defaultOfflineGenerator): Promise<any> {
  if (isOffline) {
    return offline(offlineGenerator, data);
  }
  return send(api2absURL(url), data, method, expectedDataType);
}

/**
 * api version of getJSON
 * @param url api relative url
 * @param data arguments
 * @returns {Promise<any>}
 */
export function getAPIJSON(url: string, data: any = {}, offlineGenerator: OfflineGenerator = defaultOfflineGenerator): Promise<any> {
  if (isOffline) {
    return offline(offlineGenerator, data);
  }
  return getJSON(api2absURL(url), data);
}

/**
 * api version of getData
 * @param url api relative url
 * @param data arguments
 * @param expectedDataType expected data type to return, in case of JSON it will be parsed using JSON.parse
 * @returns {Promise<any>}
 */
export function getAPIData(url: string, data: any = {}, expectedDataType = 'json', offlineGenerator: OfflineGenerator = () => defaultOfflineGenerator): Promise<any> {
  if (isOffline) {
    return offline(offlineGenerator, data);
  }
  return getData(api2absURL(url), data, expectedDataType);
}
