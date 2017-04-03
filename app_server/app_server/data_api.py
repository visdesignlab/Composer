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


@app.route('/getData/<id>')
def _get_data(id):
    return data_handler.get_data(id)


# Not working
@app.route('/removeDataSet/<id>')
def _remove_dataset(id):
    return data_handler.remove_dataset(id)


@app.route('/phoveaServerDataFunction')
def _get_phovea_server_data_function():
    return data_handler.get_general_info()


@app.route('/getDatasetInfoByFunctions/<id>')
def _get_dataset_info(id):
    return data_handler.get_dataset_info_by_functions(id)


# useful APIs

@app.route('/getColByName/<id>/<col_name>')
def _get_col_by_name(id, col_name):
    return data_handler.get_col_by_name(id, col_name)


@app.route('/getColTitles/<id>')
def _get_col_titles(id):
    return data_handler.get_col_titles(id)


@app.route('/getAllRows/<id>')
def _get_all_rows(id):
    return data_handler.get_all_rows(id)


# Not Working
@app.route('/getRowById/<id>/<rowid>')
def _get_row_by_id(id, rowid):
    return data_handler.get_row_by_id(id, rowid)


@app.route('/getRowByIndex/<id>/<index>')
def _get_row_by_index(id, index):
    return data_handler.get_row_by_index(id, int(index))


@app.route('/getRowByColValue/<id>/<col_name>/<col_value>')
def _get_row_by_col_value(id, col_name, col_value):
    return data_handler.get_row_by_col_value(id, col_name, col_value)


@app.route('/getSimilarRowsByColValue/<id>/<col_name>/<col_value>')
def _get_similar_rows(id, col_name, col_value):
    return data_handler.get_similar_rows(id, col_name, col_value)


@app.route('/getSimilarRowsByIndex/<id>/<index>')
def _get_similar_rows_by_index(id, index):
    return data_handler.get_similar_rows_by_index(id, int(index))


@app.route('/getClusterByIndex/<id>/<index>')
def _get_cluster_by_index(id, index):
    return data_handler.get_cluster_by_index(id, int(index))


@app.route('/getInfoByColValue/<id>/<col_name>/<col_value>')
def _get_info_by_col_value(id, col_name, col_value):
    return data_handler.get_info_by_col_value(id, col_name, col_value)


@app.route('/getWeights/<id>')
def _get_weights(id):
    return data_handler.get_weights(id)


@app.route('/updateWeights/<id>/<values>')
def _update_weights(id, values):
    return data_handler.update_weights(id, values)


def create():
    return app
