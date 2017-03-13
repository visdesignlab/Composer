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


@app.route('/getAllDatasets')
def _get_all_datasets():
    return jsonify({
        'data': data_handler.get_all_datasets()
    })


@app.route('/getIDtypes')
def _get_id_types():
    return jsonify({
        'data': data_handler.get_id_types()
    })


@app.route('/phoveaServerDataFunction')
def _get_phovea_server_data_function():
    return jsonify({
        'list_idtypes()': data_handler.get_id_types(),
        'get_idmanager()': data_handler.get_id_manager(),
        'get_mappingmanager()': data_handler.get_mapping_manager()
    })


# Not working
@app.route('/removeDataSet/<id>')
def _remove_dataset(id):
    return data_handler.remove_dataset(id)


@app.route('/getRowByIndex/<id>/<index>')
def _get_row_by_index(id, index):
    return data_handler.get_row_by_index(id, index)


@app.route('/getRowById/<id>/<rowid>')
def _get_row_by_id(id, rowid):
    return data_handler.get_row_by_id(id, rowid)


@app.route('/getColByName/<id>/<col_name>')
def _get_row(id, col_name):
    return data_handler.get_col_by_name(id, col_name)


@app.route('/getInfoByFunctions/<id>')
def _get_info(id):
    return data_handler.get_info_by_functions(id)


@app.route('/getAllRows/<id>')
def _get_all_rows(id):
    return data_handler.get_all_rows_aslist(id)


@app.route('/getColTitles/<id>')
def _get_col_titles(id):
    return data_handler.get_column_titles(id)


@app.route('/getCol/<id>/<col_name>')
def _get_col(id, col_name):
    return data_handler.get_column(id, col_name)


@app.route('/getRowByColValue/<id>/<col_name>/<col_value>')
def _get_row_by_col_value(id, col_name, col_value):
    return data_handler.get_row_by_col_value(id, col_name, col_value)


@app.route('/getSimilarRowsByIndex/<id>/<index>')
def _get_similar_rows_by_index(id, index):
    return data_handler.get_similar_rows_by_index(id, int(index))


def create():
    return app
