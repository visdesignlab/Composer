from phovea_server.ns import Namespace
from phovea_server.util import jsonify
import os.path
import datetime
import logging

from src import data_handler

app = Namespace(__name__)
_log = logging.getLogger(__name__)


@app.route('/', methods=['GET'])
def _func():
    return jsonify({
        'message': 'Get method'
    })


@app.route('/getAllRows/<id>')
def _get_all_rows(id):
    return data_handler.get_all_rows(id)


@app.route('/getRows/<id>/<frm>/<t>')
def _get_rows(id, frm, t):
    return data_handler.get_rows(id, frm, t) # TODO implement


@app.route('/getPatInfo/<id>/<PAT_ID>')
def _get_pat_info(id, PAT_ID):
    return data_handler.get_pat_info(id, PAT_ID)


@app.route('/getSimilarRows/<PAT_ID>')
def _get_similar_rows(PAT_ID):
    return data_handler.get_similar_rows(PAT_ID)


@app.route('/getWeights/<id>')
def _get_weights(id):
    return data_handler.get_weights(id)


@app.route('/updateWeights/<id>/<values>')
def _update_weights(id, values):
    return data_handler.update_weights(id, values)


@app.route('/getLatestInfo/<id>')
def _get_latest_info(id):
    return data_handler.get_latest_info(id)


def create():
    return app
