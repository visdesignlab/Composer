import phovea_server.dataset as dt
from phovea_server.util import jsonify
#import phovea_server.range as rng

import pandas as pd
import operator
import json
import math

import handle_Demo
import handle_CCI
import handle_Orders
import handle_pro

__author__ = 'Sahar'

dataset_hash = {'Demo': {'all': 'Demo', 'selected': 'Demo_selected'},
                'Orders': {'all': 'Orders', 'selected': 'Orders_selected'},
                'PRO': {'all': 'PRO', 'selected': 'PRO_selected'},
                'CCI': {'all': 'CCI', 'selected': 'CCI_selected'}
                }

# TODO from and to: '/getRows/<dataset_id>/<frm>/<t>'
# access directly from API: '/getAllRows/<dataset_id>'
def get_all_rows(dataset_id):
    my_data = dt.get(dataset_id)
    rows = my_data.aslist()
    return jsonify({
      dataset_id: rows[:50]
    })


# access directly from API: '/getPatInfo/<PAT_ID>/<dataset>'
def get_pat_info(PAT_ID, dataset):
    return jsonify({
      'Demo': get_info([int(PAT_ID)], dataset_hash['Demo'][dataset]),
      'Orders': get_info([int(PAT_ID)], dataset_hash['Orders'][dataset]),
      'PRO': get_info([int(PAT_ID)], dataset_hash['PRO'][dataset])
    })


# access directly from API: '/getSimilarRows/<PAT_ID>/<number>/<dataset>'
def get_similar_rows(PAT_ID, number, dataset):

    Demo_score = handle_Demo.get_similarity_score(int(PAT_ID), dataset_hash['Demo'][dataset])
    CCI_score = handle_CCI.get_similarity_score(int(PAT_ID), dataset_hash['CCI'][dataset])
    Pro_score = handle_pro.get_similarity_score(int(PAT_ID), dataset_hash['PRO'][dataset])
    id_scores = []

    pat_ids = set(list(Demo_score.keys()) + (list(CCI_score.keys())))

    for id in pat_ids:
        temp = 0
        if id in Demo_score:
            temp += Demo_score[id]
        if id in CCI_score:
            temp += CCI_score[id]
        if id in Pro_score:
            temp += Pro_score[id]
        id_scores.append([id, temp])

    id_scores.sort(key=lambda r: r[1], reverse=True)
    ids = [d[0] for d in id_scores[:number]]
    scores = [d[1] for d in id_scores[:number]]

    pat_demo_info = get_info([int(PAT_ID)], dataset_hash['Demo'][dataset])
    demo_info = get_info(ids, dataset_hash['Demo'][dataset])
    pat_pro_info = get_info([int(PAT_ID)], dataset_hash['PRO'][dataset])
    pro_info = get_info(ids, dataset_hash['PRO'][dataset])
    pat_orders_info = get_info([int(PAT_ID)], dataset_hash['Orders'][dataset])
    orders_info = get_info(ids, dataset_hash['Orders'][dataset])

    #difference = handle_Demo.get_difference(int(PAT_ID), ids) # maybe in the client?!

    return jsonify({
        'PAT_ID': PAT_ID,
        'ids': ids,
        'scores': scores,
        'similarity_scores': scores,

        'pat_Demo': pat_demo_info,
        'pat_PRO': pat_pro_info,
        'pat_Orders': pat_orders_info,

        'similar_Demo': demo_info,
        'similar_PRO': pro_info,
        'similar_Orders': orders_info#,

        #'difference': difference
        #'all_pro_rows': sum(pro_rows, get_all_info_for_pat('PRO', int(PAT_ID)))
    })


# access directly from API: '/getWeights/<dataset_id>'
def get_weights(dataset_id):
    if dataset_id == 'Demo':
        return handle_Demo.get_weights()
    if dataset_id == 'CCI':
        return handle_CCI.get_weights()
    return jsonify({'message': 'error'})


# access directly from API: '/updateWeights/<dataset_id>/<values>'
def update_weights(dataset_id, values):
    if dataset_id == 'Demo':
        return handle_Demo.update_weights(values)
    if dataset_id == 'CCI':
        return handle_CCI.update_weights(values)
    return jsonify({'message': 'error'})


# access directly from API: '/getLatestInfo/<dataset_id>'
def get_latest_info(dataset_id):
    if dataset_id == 'Demo':
        return handle_Demo.get_latest_info()
    return jsonify({'message': 'error'})


# access directly from API: '/getStat/<dataset>'
def get_stat(dataset):
    my_data = dt.get(dataset_hash['Demo'][dataset])
    data = my_data.aslist()
    length = 0
    gender = [0, 0]
    bmi = [0, 0, 0, 0, 0, 0, 0]
    age = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    today = pd.datetime.today()

    for row in data:
        length += 1
        if row['PAT_GENDER'] == 'F':
            gender[0] += 1
        elif row['PAT_GENDER'] == 'M':
            gender[1] += 1
        if not row['BMI']:
            bmi[0] += 1
        elif row['BMI'] <= 18:
            bmi[1] += 1
        elif row['BMI'] > 30:
            bmi[6] += 1
        else:
            bmi[int(math.ceil((row['BMI']-15) / 3))] += 1

        pat_age = int((today - to_date_time(row['PAT_BIRTHDATE'])).days / 365.25)
        if pat_age <= 10:
            age[0] += 1
        elif pat_age > 100:
            age[10] += 1
        else:
            age[int(math.floor((pat_age - 1) / 10))] += 1

    return jsonify({
       'length': length,
       'GENDER': gender,
       'BMI': bmi,
       'AGE': age
       })


##=========== helper functions

# NEVER USED!
def get_all_info_for_pat(dataset_id, PAT_ID):
    my_data = dt.get(dataset_id)

    info_rows = []
    indices = []
    for i in range(0, len(my_data.rows())):
        if int(my_data.aspandas()['PAT_ID'][my_data.rows()[i]]) == int(PAT_ID):
            indices.append(i)
            info_rows.append(my_data.aslist()[i])

    if dataset_id == 'Demo':
        info_rows.sort(key=lambda r: to_date_time(r["ADM_DATE"]))
    elif dataset_id == 'PRO':
        info_rows.sort(key=lambda r: to_date_time(r["ASSESSMENT_START_DTM"]))
    elif dataset_id == 'PT':
        info_rows.sort(key=lambda r: to_date_time(r["ADM_DATE"]))
    elif dataset_id == 'VAS':
        info_rows.sort(key=lambda r: to_date_time(r["RECORDED_TIME"]))

    return info_rows


# used in many methods
def get_info(ids, dataset_id):
    data = dt.get(dataset_id).aslist()
    # find the first entry for each patient
    result = {}
    for id in ids:
        result[id] = []
    for row in data:
        if int(row['PAT_ID']) in ids:
            result[int(row['PAT_ID'])].append(row)
    return result



##============= utility functions
# NEVER USED!
def verify_int(s):
    try:
        int(s)
        return int(s)
    except ValueError:
        return 0


# NEVER USED
def parse_date_time(date):
    if not date:
        return pd.datetime.strptime('01/01/0001', '%m/%d/%Y')
    return pd.datetime.strptime(date, '%m/%d/%Y %I:%M:%S %p')


# NEVER USED
def parse_date(date):
    if not date:
      return pd.datetime.strptime('01/01/0001', '%m/%d/%Y')
    return pd.datetime.strptime(date, '%m/%d/%Y')


def to_date_time(date):
    if not date:
        return pd.datetime.strptime('01/01/0001', '%m/%d/%Y')
    if ':' in date:
        time = pd.datetime.strptime(date, '%m/%d/%Y %I:%M:%S %p')
    elif '/' in date:
        time = pd.datetime.strptime(date, '%m/%d/%Y')
    else:
        time = pd.datetime.strptime('01/01/0001', '%m/%d/%Y')
    return time
