/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */

import {register} from './src/plugin';

/**
 * build a registry by registering all phovea modules
 */
//other modules

//self
register('phovea_core',require('./phovea.js'));
