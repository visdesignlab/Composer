import phovea_server.dataset as dt
from phovea_server.util import jsonify
#import phovea_server.range as rng

import pandas as pd
import operator
import json

import handle_Demo
import handle_CCI

__author__ = 'Sahar'


# add column index to the data
def get_all_rows(id):
    my_data = dt.get(id)
    rows = my_data.aslist()
    return jsonify({
      'rows': rows[:50]
    })

def get_pat_info(id, PAT_ID):
    my_data = dt.get(id)

    info_rows = []
    indices = []
    for i in range(0, len(my_data.rows())):
        if int(my_data.aspandas()['PAT_ID'][my_data.rows()[i]]) == int(PAT_ID):
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
      'PAT_ID': PAT_ID,
      'rows': info_rows,
      'indices': indices,
      'dataset id': id
    })


def new_get_similar_rows(PAT_ID):

    Demo_score = handle_Demo.get_similarity_score(int(PAT_ID))
    CCI_score = handle_CCI.get_similarity_score(int(PAT_ID))
    scores = []

    pat_ids = set(list(Demo_score.keys()) + (list(CCI_score.keys())))

    for id in pat_ids:
        temp = 0
        if id in Demo_score:
            temp += Demo_score[id]
        if id in CCI_score:
            temp += CCI_score[id]
        scores.append([id, temp])

    scores.sort(key=lambda r: r[1], reverse=True)
    ids = [d[0] for d in scores]
    scores = [d[1] for d in scores]

    pat_Demo_first = [handle_Demo.get_first_info(id) for id in ids]

    return jsonify({
        'PAT_ID': PAT_ID,
        'ids': ids,
        'scores': scores,
        'rows': pat_Demo_first
    })

# Demo dataset

def get_similar_rows(id, PAT_ID):
    if id == 'Demo':
        return handle_Demo.get_similar_demo(PAT_ID)
    return jsonify({'message': 'error'})


def get_weights(id):
    if id == 'Demo':
        return handle_Demo.get_weights()
    if id == 'CCI':
        return handle_CCI.get_weights()
    return jsonify({'message': 'error'})


def update_weights(id, values):
    if id == 'Demo':
        return handle_Demo.update_weights(values)
    if id == 'CCI':
        return handle_CCI.update_weights(values)
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
