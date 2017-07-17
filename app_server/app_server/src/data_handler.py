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
def get_all_rows(dataset_id):
    my_data = dt.get(dataset_id)
    rows = my_data.aslist()
    return jsonify({
      dataset_id: rows[:50]
    })


# access directly from API: '/getPatInfo/<PAT_ID>'
def get_pat_info(PAT_ID):
    return jsonify({
      'Demo': get_info([int(PAT_ID)], 'Demo'),
      'Orders': get_info([int(PAT_ID)], 'Orders'),
      'PRO': get_info([int(PAT_ID)], 'PRO'),
      'CCI': get_info([int(PAT_ID)], 'CCI')
    })


# access directly from API: '/getSimilarRows/<PAT_ID>'
def get_similar_rows(PAT_ID, number):

    Demo_score = handle_Demo.get_similarity_score(int(PAT_ID))
    CCI_score = handle_CCI.get_similarity_score(int(PAT_ID))
    #Pro_score = handle_Pro.get_similarity_score(int(PAT_ID)) #TODO
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
    ids = [d[0] for d in id_scores[:number]]
    scores = [d[1] for d in id_scores[:number]]

    pat_demo_info = get_info([int(PAT_ID)], 'Demo')
    demo_info = get_info(ids, 'Demo')
    pat_pro_info = get_info([int(PAT_ID)], 'PRO')
    pro_info = get_info(ids, 'PRO')
    pat_orders_info = get_info([int(PAT_ID)], 'Orders')
    orders_info = get_info(ids, 'Orders')
    pat_cci_info = get_info([int(PAT_ID)], 'CCI')
    cci_info = get_info(ids, 'CCI')

    #difference = handle_Demo.get_difference(int(PAT_ID), ids) # maybe in the client?!

    return jsonify({
        'PAT_ID': PAT_ID,
        'ids': ids,
        'similarity_scores': scores,

        'pat_Demo': pat_demo_info,
        'pat_PRO': pat_pro_info,
        'pat_Orders': pat_orders_info,
        'pat_CCI': pat_cci_info,

        'similar_Demo': demo_info,
        'similar_PRO': pro_info,
        'similar_Orders': orders_info,
        'similar_CCI': cci_info

        #'difference': difference
        #'all_pro_rows': sum(pro_rows, get_all_info_for_pat('PRO', int(PAT_ID)))
    })


# access directly from API: '/getWeights/<id>'
def get_weights(dataset_id):
    if dataset_id == 'Demo':
        return handle_Demo.get_weights()
    if dataset_id == 'CCI':
        return handle_CCI.get_weights()
    return jsonify({'message': 'error'})


# access directly from API: '/updateWeights/<id>/<values>'
def update_weights(dataset_id, values):
    if dataset_id == 'Demo':
        return handle_Demo.update_weights(values)
    if dataset_id == 'CCI':
        return handle_CCI.update_weights(values)
    return jsonify({'message': 'error'})


# access directly from API: '/getLatestInfo/<id>'
def get_latest_info(dataset_id):
    if dataset_id == 'Demo':
        return handle_Demo.get_latest_info()
    return jsonify({'message': 'error'})


# access directly from API: '/getStat'
def get_stat():
    my_data = dt.get('Demo')
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
        elif row['BMI'] > 18 and row['BMI'] <= 21:
            bmi[2] += 1
        elif row['BMI'] > 21 and row['BMI'] <= 24:
            bmi[3] += 1
        elif row['BMI'] > 24 and row['BMI'] <= 27:
            bmi[4] += 1
        elif row['BMI'] > 27 and row['BMI'] <= 30:
            bmi[5] += 1
        elif row['BMI'] > 30:
            bmi[6] += 1
        pat_age = int((today - to_data_time(row['PAT_BIRTHDATE'])).days / 365.25)
        if pat_age <= 10:
            age[0] += 1
        elif pat_age > 10 and pat_age <=20:
            age[1] += 1
        elif pat_age > 20 and pat_age <=30:
            age[2] += 1
        elif pat_age > 30 and pat_age <=40:
            age[3] += 1
        elif pat_age > 40 and pat_age <=50:
            age[4] += 1
        elif pat_age > 50 and pat_age <=60:
            age[5] += 1
        elif pat_age > 60 and pat_age <=70:
            age[6] += 1
        elif pat_age > 70 and pat_age <=80:
            age[7] += 1
        elif pat_age > 80 and pat_age <=90:
            age[8] += 1
        elif pat_age > 90 and pat_age <=100:
            age[9] += 1
        elif pat_age > 100:
            age[10] += 1


    return jsonify ({
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
        info_rows.sort(key=lambda r: to_data_time(r["ADM_DATE"]))
    elif dataset_id == 'PRO':
        info_rows.sort(key=lambda r: to_data_time(r["ASSESSMENT_START_DTM"]))
    elif dataset_id == 'PT':
        info_rows.sort(key=lambda r: to_data_time(r["ADM_DATE"]))
    elif dataset_id == 'VAS':
        info_rows.sort(key=lambda r: to_data_time(r["RECORDED_TIME"]))

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


def to_data_time(date):
    if not date:
        return pd.datetime.strptime('01/01/0001', '%m/%d/%Y')
    if ':' in date:
        time = pd.datetime.strptime(date, '%m/%d/%Y %I:%M:%S %p')
    elif '/' in date:
        time = pd.datetime.strptime(date, '%m/%d/%Y')
    else:
        time = pd.datetime.strptime('01/01/0001', '%m/%d/%Y')
    return time
