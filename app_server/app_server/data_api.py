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


@app.route('/getAllRows/<dataset_id>')
def _get_all_rows(dataset_id):
    return data_handler.get_all_rows(dataset_id)


@app.route('/getRows/<dataset_id>/<frm>/<t>') # NOT USED YET
def _get_rows(dataset_id, frm, t):
    return data_handler.get_rows(dataset_id, frm, t) # TODO implement


@app.route('/getPatInfo/<PAT_ID>/<dataset>') # dataset: all/selected
def _get_pat_info(PAT_ID, dataset):
    return data_handler.get_pat_info(PAT_ID, dataset)


@app.route('/getSimilarRows/<PAT_ID>/<number>/<dataset>')
def _get_similar_rows(PAT_ID, number, dataset):
    return data_handler.get_similar_rows(PAT_ID, int(number), dataset)


@app.route('/getWeights/<dataset_id>')
def _get_weights(dataset_id):
    return data_handler.get_weights(dataset_id)


@app.route('/updateWeights/<dataset_id>/<values>')
def _update_weights(dataset_id, values):
    return data_handler.update_weights(id, values)


@app.route('/getLatestInfo/<dataset_id>')
def _get_latest_info(dataset_id):
    return data_handler.get_latest_info(dataset_id)


@app.route('/getStat/<dataset>')
def _get_stat(dataset):
    return data_handler.get_stat(dataset)

@app.route('/filteredOrdersByMonth/<dataset_id>/<order>')
def _get_filtered_orders_by_month(dataset_id, order):
    return data_handler.get_filtered_orders_by_month(dataset_id, order)

def create():
    return app
