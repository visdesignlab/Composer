import phovea_server.dataset as dt
from phovea_server.util import jsonify
#import phovea_server.range as rng

import pandas as pd
import operator
import json

import handle_Demo
import handle_CCI
import handle_Orders

__author__ = 'Sahar'


# TODO from and to: '/getRows/<id>/<frm>/<t>'
# access directly from API: '/getAllRows/<id>'
def get_all_rows(id):
    my_data = dt.get(id)
    rows = my_data.aslist()
    return jsonify({
      'rows': rows[:50]
    })


# access directly from API: '/getPatInfo/<id>/<PAT_ID>'
def get_pat_info(id, PAT_ID):
    info_rows = get_all_info_for_pat(id, PAT_ID)
    return jsonify({
      'PAT_ID': PAT_ID,
      'rows': info_rows,
      #'indices': indices,
      'dataset id': id
    })


# access directly from API: '/getSimilarRows/<PAT_ID>'
def get_similar_rows(PAT_ID):

    Demo_score = handle_Demo.get_similarity_score(int(PAT_ID))
    CCI_score = handle_CCI.get_similarity_score(int(PAT_ID))
    #Pro_score = handle_Pro.get_similarity_score(int(PAT_ID))
    id_scores = []

    pat_ids = set(list(Demo_score.keys()) + (list(CCI_score.keys())))

    for id in pat_ids:
        temp = 0
        if id in Demo_score:
            temp += Demo_score[id]
        if id in CCI_score:
            temp += CCI_score[id]
        id_scores.append([id, temp])

    id_scores.sort(key=lambda r: r[1], reverse=True)
    ids = [d[0] for d in id_scores[:20]]
    scores = [d[1] for d in id_scores[:20]]

    pat_Demo_first = [handle_Demo.get_first_info(id) for id in ([int(PAT_ID)] + ids)]
    difference = handle_Demo.get_difference(int(PAT_ID), ids)

    pro_rows = [[id, get_all_info_for_pat('PRO', id)] for id in ids]


    # group them based on first ORDER_CATALOG_TYPE in Orders: Medication, Procedure        Orders_rows = {}
    ##Orders_rows = {}
    ##for id in ids:
    ##    Orders_rows[id] = handle_Orders.get_first_info(id)

    # group by CPT codes
    status = {}
    status_data = dt.get('Status').aslist()
    for row in status_data:
        status[int(row['PAT_ID'])] = row['STATUS']

    med_rows = [r[1] for r in pro_rows if status[int(r[0])] == 'Medication']
    pro_rows = [r[1] for r in pro_rows if status[int(r[0])] == 'Procedure']


    return jsonify({
        'PAT_ID': PAT_ID,
        'ids': ids,
        'similarity_scores': scores,
        'target_Demo': handle_Demo.get_first_info(int(PAT_ID)),
        'rows': pat_Demo_first,
        'difference': difference,
         #entries for score diagram
        'target_PRO': get_all_info_for_pat('PRO', int(PAT_ID)),
        'med_rows': med_rows,
        'pro_rows': pro_rows
    })


# access directly from API: '/getWeights/<id>'
def get_weights(id):
    if id == 'Demo':
        return handle_Demo.get_weights()
    if id == 'CCI':
        return handle_CCI.get_weights()
    return jsonify({'message': 'error'})


# access directly from API: '/updateWeights/<id>/<values>'
def update_weights(id, values):
    if id == 'Demo':
        return handle_Demo.update_weights(values)
    if id == 'CCI':
        return handle_CCI.update_weights(values)
    return jsonify({'message': 'error'})


# access directly from API: '/getLatestInfo/<id>'
def get_latest_info(id):
    if id == 'Demo':
        return handle_Demo.get_latest_info()
    return jsonify({'message': 'error'})


##=========== helper functions

# used in several functions
def get_all_info_for_pat(id, PAT_ID):
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

    return info_rows


##============= utility functions
# NEVER USED!
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
