###############################################################################
# Caleydo - Visualization for Molecular Biology - http://caleydo.org
# Copyright (c) The Caleydo Team. All rights reserved.
# Licensed under the new BSD license, available at http://caleydo.org/license
###############################################################################

from phovea_server.ns import Namespace
from phovea_server.util import jsonify
import os.path
import datetime
import logging

from src import irisPythonFile

app = Namespace(__name__)
_log = logging.getLogger(__name__)


@app.route('/', methods=['GET'])
def _hello():
    return jsonify({
        'message': 'iris API'
    })


@app.route('/irisClustered')
def _iris():
    return jsonify({
        'clustered': irisPythonFile.cluster_data()
    })


@app.route('/irisData')
def _data():
    return jsonify({
        'data': irisPythonFile.get_data()
    })


@app.route('/irisDataDecomposed')
def _data_decomposed():
    return jsonify({
        'data_01': irisPythonFile.group_data(0, 1),
        'data_12': irisPythonFile.group_data(1, 2),
        'data_23': irisPythonFile.group_data(2, 3),
        'data_03': irisPythonFile.group_data(0, 3)
    })


def create():
    return app
