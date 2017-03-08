import csv
import numpy as np
import phovea_server.dataset as dt
from phovea_server.util import jsonify
import phovea_server.dataset_def as dd
import phovea_server.dataset_specific as ds
import phovea_server.range as rng


__author__ = 'Sahar'


def get_data(id):
    return jsonify({
        'data': dt.get(id)
    })


def get_all_datasets():
    return dt.list_datasets()


def get_id_types():
    return dt.list_idtypes()


def get_id_manager():
    return dt.get_idmanager()


def get_mapping_manager():
    return dt.get_mappingmanager()


# Not Working!
def remove_dataset(id):
    dataset = dt.get(id)
    result = dt.remove(dataset)
    return jsonify({
      'data': data_handler.get_all_datasets(),
      'result': result
    })


# functions from https://github.com/phovea/phovea_server/blob/develop/phovea_server/dataset_csv.py#L341
def get_info_by_functions(id):
    my_data = dt.get(id)
    return jsonify({
      'rows': my_data.rows(),
      'data': my_data.asjson(),
      'rowids': my_data.rowids(),
      'aslist': my_data.aslist(),
      'aspandas': my_data.aspandas(),
      'columns': my_data.columns,
      'CSVEntry.to_description': my_data.to_description(),
      'CSVEntry.idtypes': my_data.idtypes()
    })


def get_row_by_index(id, index):
    my_data = dt.get(id)
    range = rng.RangeElem(2, 5, 1)

    rows = my_data.aslist()
    rows_range = my_data.aslist(range)

    return jsonify({
      'asList()[index=' + index + ']': rows[int(index)],
      'asList( range(2,5,1) )' + index: rows_range,
      'rows( range(2,5,1) )': my_data.rows(range)
    })


def get_col_by_name(id, col_name):
    my_data = dt.get(id)
    cols = my_data.aspandas()

    range = rng.RangeElem(2, 5, 1)
    cols_range = my_data.aspandas(range)

    return jsonify({
      'aspandas()[' + col_name + ']': cols[col_name],
      'aspandas( range(2,5,1) )': cols_range
    })


def get_row_by_id(id, rowid):
    my_data = dt.get(id)
    return jsonify({
      'row[' + rowid + ']': "I don't know how"
    })

# TODO: dt.update()
# TODO: dt.add()

