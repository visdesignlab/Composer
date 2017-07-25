/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */

//register all extensions in the registry following the given pattern
module.exports = function(registry) {
  //registry.push('extension-type', 'extension-id', function() { return System.import('./src/extension_impl'); }, {});
  registry.push('datatype', 'matrix', function() { return System.import('./src/matrix/Matrix'); }, {});

  registry.push('datatype', 'table', function() { return System.import('./src/table/Table'); }, {});

  registry.push('datatype', 'vector', function() { return System.import('./src/vector/Vector'); }, {});

  registry.push('datatype', 'stratification', function() { return System.import('./src/stratification/Stratification'); }, {});

  registry.push('datatype', 'graph', function() { return System.import('./src/graph/GraphProxy'); }, {});

  registry.push('datatype', 'atom', function() { return System.import('./src/atom/Atom'); }, {});

  registry.push('tabSyncer', 'selection', function() { return System.import('./src/sync/SelectionSyncer'); }, {});
};

