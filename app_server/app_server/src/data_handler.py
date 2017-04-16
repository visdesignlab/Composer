import phovea_server.dataset as dt
from phovea_server.util import jsonify
#import phovea_server.range as rng

import pandas as pd
import operator
import json

import handle_Demo

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


# useful functions #################

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


# add column index to the data
def get_all_rows(id):
    my_data = dt.get(id)
    rows = my_data.aslist()
    return jsonify({
      'rows': rows[:50]
    })


# Not Working!
def get_row_by_id(id, rowid):
    my_data = dt.get(id)
    return jsonify({
      'row[' + rowid + ']': "I don't know how"
    })


def get_row_by_index(id, index):
    my_data = dt.get(id)
    rows = my_data.aslist()

    return jsonify({
      'row': rows[int(index)]
    })


def get_row_by_col_value(id, col_name, col_value):
    my_data = dt.get(id)
    index = 0

    for i in range(0, len(my_data.rows())):
        if my_data.aspandas()[col_name][my_data.rows()[i]] == col_value:
            index = i
            break

    return jsonify({
      'index': index,
      'row': my_data.aslist()[index]
    })


def get_info_by_col_value(id, col_name, col_value):
    my_data = dt.get(id)

    info_rows = []
    indices = []
    for i in range(0, len(my_data.rows())):
        if int(my_data.aspandas()[col_name][my_data.rows()[i]]) == int(col_value):
            indices.append(i)
            info_rows.append(my_data.aslist()[i])

    if id == 'Demo':
        info_rows.sort(key=lambda r: parse_date_time(r["ADM_DATE"]))
    elif id == 'PRO':
        info_rows.sort(key=lambda r: parse_date_time(r["ASSESSMENT_START_DTM"]))
    elif id == 'PT':
        info_rows.sort(key=lambda r: parse_date_time(r["ADM_DATE"]))
    elif id == 'VAS':
        info_rows.sort(key=lambda r: parse_date(r["RECORDED_TIME"]))

    return jsonify({
      'col_name': col_name,
      'col_value': col_value,
      'info_rows': info_rows,
      'indices': indices,
      'id': id
    })


# Demo dataset

def get_cluster_by_index(id, index):
    if id == 'Demo':
        return handle_Demo.get_cluster_demo(index)
    else:
        return jsonify({'message': 'error'})


def get_similar_rows_by_index(id, index):
    if id == 'Demo':
        return handle_Demo.get_similar_demo(index)
    return jsonify({'message': 'error'})


def get_weights(id):
    if id == 'Demo':
        return handle_Demo.get_weights()
    return jsonify({'message': 'error'})


def update_weights(id, values):
    if id == 'Demo':
        return handle_Demo.update_weights(values)
    return jsonify({'message': 'error'})


def get_latest_info(id):
    if id == 'Demo':
        return handle_Demo.get_latest_info()
    return jsonify({'message': 'error'})


# helper functions
def verify_int(s):
    try:
        int(s)
        return int(s)
    except ValueError:
        return 0


def parse_date_time(date):
    if not date:
        return pd.datetime.strptime('01/01/0001', '%m/%d/%Y')
    return pd.datetime.strptime(date, '%m/%d/%Y %I:%M:%S %p')


def parse_date(date):
    if not date:
      return pd.datetime.strptime('01/01/0001', '%m/%d/%Y')
    return pd.datetime.strptime(date, '%m/%d/%Y')
