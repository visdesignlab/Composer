/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */

const path = require('path');
const glob = require('glob').sync;

function findPlugins() {
  const files = glob('*/webpack.config.js');
  return files.map(path.dirname);
}

function patchEntries(plugin, entries) {
  const transform = (entry) => `./${plugin}/${entry}`;
  if (typeof entries === 'string') {
    return transform(entries);
  }
  if (Array.isArray(entries)) {
    return entries.map(transform);
  }
  var r = {};
  Object.keys(entries).forEach((entry) => {
    const v = entries[entry];
    r[entry] = Array.isArray(v) ? v.map(transform) : transform(v);
  });
  return r;
}

function patchConfig(plugin, config) {
  const patch = (c) => {
    c.output.path= path.resolve(__dirname, plugin, 'build');
    c.devServer.contentBase = path.resolve(__dirname, 'build');
    c.entry = patchEntries(plugin, c.entry);
    // console.log(c);
    return c;
  };
  return Array.isArray(config) ? config.map(patch): patch(config);
}

function generateWebpackConfig(env) {
  const plugins = findPlugins();
  const createConfig = (p) => {
    const config = require(path.resolve(p, 'webpack.config.js'))(env);
    return patchConfig(p, config);
  };

  if (env === 'test' && plugins.length > 0) {
    //return just the first one since entries and output doesn't matter
    return createConfig(plugins[0]);
  }
  return [].concat(...plugins.map(createConfig));
}

module.exports = generateWebpackConfig;
module.exports.plugins = findPlugins;
