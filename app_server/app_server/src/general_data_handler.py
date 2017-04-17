import phovea_server.dataset as dt
from phovea_server.util import jsonify
#import phovea_server.range as rng

import pandas as pd
import operator
import json


__author__ = 'Sahar'


def get_data(id):
    return jsonify({
        'data': dt.get(id)
    })


def get_general_info():
    return jsonify({
      'all datasets': dt.list_datasets(),
      'id types': dt.list_idtypes(),
      'id manager': dt.get_idmanager(),
      'mapping manager': dt.get_mappingmanager()
    })


# functions from https://github.com/phovea/phovea_server/blob/develop/phovea_server/dataset_csv.py#L351
def get_info_by_functions(id):
    my_data = dt.get(id)
    #range = rng.RangeElem(2, 5, 1)

    return jsonify({
      'id': id,
      'my_data': my_data,
      'rows': my_data.rows(),
      'data': my_data.asjson(),
      'rowids': my_data.rowids(),
      'aslist': my_data.aslist(),
      'aspandas': my_data.aspandas(),
      'columns': my_data.columns,
      'CSVEntry.to_description': my_data.to_description(),
      'CSVEntry.idtypes': my_data.idtypes()#,
      #'asList( range(2,5,1) )': my_data.aslist(range),
      #'rows( range(2,5,1) )': my_data.rows(range),
      #'aspandas( range(2,5,1) )': my_data.aspandas(range)
    })


def get_col_by_name(id, col_name):
    my_data = dt.get(id)
    cols = my_data.aspandas()

    return jsonify({
      'cols': cols[col_name]
    })


def get_col_titles(id):
    my_data = dt.get(id)
    return jsonify({
      'cols': my_data.columns
    })


def get_row_by_index(id, index):
    my_data = dt.get(id)
    rows = my_data.aslist()

    return jsonify({
      'row': rows[int(index)]
    })
