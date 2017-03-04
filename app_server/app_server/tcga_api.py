from phovea_server.ns import Namespace
from phovea_server.util import jsonify
import os.path
import datetime
import logging

from src import tcgaData_handler

app = Namespace(__name__)
_log = logging.getLogger(__name__)


@app.route('/', methods=['GET'])
def _func():
    return jsonify({
        'message': 'Get method'
    })


@app.route('/getTCGAData')
def _get_tcga_data():
    return jsonify({
        'data': tcgaData_handler.read_tcga_data()
    })


@app.route('/getAllDatasets')
def _get_all_datasets():
    return jsonify({
        'data': tcgaData_handler.get_all_datasets()
    })


@app.route('/getIDtypes')
def _get_id_types():
    return jsonify({
        'data': tcgaData_handler.get_id_types()
    })


@app.route('/getData38')
def _get_data_38():
    return jsonify({
        'data': tcgaData_handler.read_data_38_data()
    })


@app.route('/phoveaServerDataFunction')
def _get_phovea_server_data_function():
    return jsonify({
        'list_idtypes()': tcgaData_handler.get_id_types(),
        'get_idmanager()': tcgaData_handler.get_id_manager(),
        'get_mappingmanager()': tcgaData_handler.get_mapping_manager()
    })


# Not working
@app.route('/removeDataSet')
def _remove_dataset():
    result = tcgaData_handler.remove_dataset()
    return jsonify({
      'data': tcgaData_handler.get_all_datasets(),
      'result': result
    })


# TODO
@app.route('/getRow/<index>')
def _get_row(index):
    return tcgaData_handler.get_row_by_index(index)


@app.route('/getInfoByFunctions')
def _get_info():
    return tcgaData_handler.get_info_by_functions()


def create():
    return app
