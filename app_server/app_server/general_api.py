from phovea_server.ns import Namespace
from phovea_server.util import jsonify
import os.path
import datetime
import logging

from src import general_data_handler

app = Namespace(__name__)
_log = logging.getLogger(__name__)


@app.route('/', methods=['GET'])
def _func():
    return jsonify({
        'message': 'Get method'
    })


@app.route('/getData/<id>')
def _get_data(id):
    return general_data_handler.get_data(id)


@app.route('/phoveaServerDataFunctions')
def _get_phovea_server_data_function():
    return general_data_handler.get_general_info()


@app.route('/getDatasetInfoByFunctions/<id>')
def _get_dataset_info(id):
    return general_data_handler.get_info_by_functions(id)


@app.route('/getColByName/<id>/<col_name>')
def _get_col_by_name(id, col_name):
    return general_data_handler.get_col_by_name(id, col_name)


@app.route('/getColTitles/<id>')
def _get_col_titles(id):
    return general_data_handler.get_col_titles(id)


@app.route('/getRowByIndex/<id>/<index>')
def _get_row_by_index(id, index):
    return general_data_handler.get_row_by_index(id, int(index))
