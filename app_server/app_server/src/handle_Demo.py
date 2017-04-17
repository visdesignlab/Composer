import phovea_server.dataset as dt
from phovea_server.util import jsonify

from sklearn.cluster import DBSCAN
import numpy as np
import pandas as pd


weights_Demo = {"PAT_ID": 0, "VISIT_NO": 0, "PAT_BIRTHDATE": 5,
           "PAT_GENDER": 10, "PAT_ETHNICITY": 1, "D_ETHNICITY_DESC": 1,
           "PAT_RACE": 1, "D_RACE_DESC": 1, "PAT_ZIP": 0,
           "PAT_MARITAL_STAT": 5, "PAT_DEATH_DATE": 0,
           "PAT_DEATH_IND": 2, "BMI": 10, "HEIGHT_CM": 10,
           "WEIGHT_KG": 10, "ADM_DATE": 5,
           "DSCH_DATE": 0, "ATT_PROV_ID": 0, "ATT_PROV_FULLNAME": 0,
           "INS_PAY_CAT": 0, "INS_PAY_GRP": 0, "TOBACCO_USER": 5,
           "ALCOHOL_USER": 5, "ILLICIT_DRUG_USER": 5}

categorical_data = ["PAT_GENDER", "PAT_ETHNICITY", "D_ETHNICITY_DESC", "PAT_RACE", "D_RACE_DESC",
                    "PAT_MARITAL_STAT", "PAT_DEATH_IND", "TOBACCO_USER", "ALCOHOL_USER", "ILLICIT_DRUG_USER"]

numerical_data = ["BMI", "HEIGHT_CM", "WEIGHT_KG"]

years = ["PAT_BIRTHDATE", "ADM_DATE", "DSCH_DATE"]


def find_similar(data, PAT_ID):
    similar_rows = []
    dist = []

    index = 0
    for i in range(0, len(data)):
        if int(data[i]['PAT_ID']) == int(PAT_ID):
            index = i
            break

    target_row = data[index]

    header = list(weights_Demo.keys())

    for num in range(len(data)):
        row = data[num]
        tmp_row = []
        for h in header:
            if not row[h] and not target_row[h]:
                tmp_value = 0
            elif weights_Demo[h] != 0:
                if h in years:
                    if not row[h]:
                        tmp_value = float(extract_year(target_row[h])) * weights_Demo[h]
                    elif not target_row[h]:
                        tmp_value = float(extract_year(row[h])) * weights_Demo[h]
                    else:
                        tmp_value = (float(extract_year(row[h])) - float(extract_year(target_row[h]))) * weights_Demo[h]
                elif h in numerical_data:
                    if not row[h]:
                        tmp_value = float(target_row[h]) * weights_Demo[h]
                    elif not target_row[h]:
                        tmp_value = float(row[h]) * weights_Demo[h]
                    else:
                        tmp_value = (float(row[h]) - float(target_row[h])) * weights_Demo[h]
                else:
                    tmp_value = 0 if target_row[h] == row[h] else weights_Demo[h]
            else:
                tmp_value = 0
            tmp_row.append(tmp_value)
        dist.append([num, np.linalg.norm(tmp_row)])

    sorted_dist = sorted(dist, key=lambda x: x[1])
    similar_index = [row[0] for row in sorted_dist]

    difference = []  # array of [-1 or +1 or 0] difference with the original data
    for i in range(0, 20):
        tmp_row = data[similar_index[i]]
        similar_rows.append(tmp_row)
        tmp_diff = []
        for h in header:
            if not tmp_row[h] and not target_row[h]:
                diff = 0
            elif not tmp_row[h] or not target_row[h]:
                diff = -1
            elif h in years:
                diff = np.sign((float(extract_year(tmp_row[h])) - float(extract_year(target_row[h]))))
            elif h in categorical_data:
                diff = 0 if target_row[h] == tmp_row[h] else -1
            elif h in numerical_data:
                diff = np.sign((float(tmp_row[h]) - float(target_row[h])))
            else:
                diff = 0 if target_row[h] == tmp_row[h] else -1
            tmp_diff.append(diff)

        difference.append(tmp_diff)

    return jsonify({
      'PAT_ID': PAT_ID,
      'row': target_row,
      'rows': similar_rows[0:20],
      'difference': difference,
      'indices': similar_index[0:20]
    })


def get_latest_info():
    data = dt.get('Demo').aslist()
    pat_ids = set([int(d['PAT_ID']) for d in data])

    pats = []
    pat_weights = []
    for id in pat_ids:
        temp_pat = []
        for row in data:
            if row['PAT_ID'] == id:
                temp_pat.append(row)
        temp_pat.sort(key=lambda x: to_data_time(x['ADM_DATE']), reverse=True)
        pats.append(temp_pat[0])
        pat_weights.append([t['WEIGHT_KG'] for t in temp_pat if t['WEIGHT_KG']])

    return jsonify({
      'rows': pats,
      'WEIGHT_KG': pat_weights
    })

#####=======================

def get_similar_demo(PAT_ID):
    data = dt.get('Demo').aslist()
    return find_similar(data, PAT_ID)


def get_weights():
    return jsonify({
      'weights': weights_Demo
    })


def update_weights(values):
    partial_header = ["AGE", "PAT_GENDER", "PAT_ETHNICITY",
                      "PAT_RACE", "PAT_MARITAL_STAT", "BMI",
                      "HEIGHT_CM", "WEIGHT_KG", "TOBACCO_USER",
                      "ALCOHOL_USER", "ILLICIT_DRUG_USER"]

    split_values = values.split('+')
    for i in range(0, len(partial_header)):
        weights_Demo[partial_header[i]] = int(split_values[i])

    return jsonify({
      'weights': weights_Demo
    })


def get_first_info(PAT_ID):
    data = dt.get('Demo').aslist()
    # find the first entry for each patient
    first_ent = []
    first_time = pd.datetime.today()
    for row in data:
        if row['PAT_ID'] == PAT_ID:
            if to_data_time(row['ADM_DATE']) < first_time:
                first_ent = row
                first_time = to_data_time(row['ADM_DATE'])

    return first_ent


def get_similarity_score(PAT_ID):
    data = dt.get('Demo').aslist()
    pat_ids = set([int(d['PAT_ID']) for d in data])

    # find the first entry for each patient
    pats = {}
    for id in pat_ids:
        pats[id] = get_first_info(id)

    scores = {}
    target_pat = pats[PAT_ID]

    for id in pat_ids:
        similarity_score = 0
        if id == PAT_ID:  ## NOTE!
            continue
        curr_pat = pats[id]
        for h in list(weights_Demo.keys()):
            if weights_Demo[h] == 0:
                continue
            if not curr_pat[h] or not target_pat[h]:
                similarity_score += 0.5 * weights_Demo[h]

            if h in categorical_data:
                similarity_score += weights_Demo[h] if target_pat[h] == curr_pat[h] else 0
            elif h in numerical_data:
                similarity_score += weights_Demo[h] if target_pat[h] == curr_pat[h] else 0 ## within range
            elif h in years: ## age! ## within range
                similarity_score += weights_Demo[h] if float(extract_year(target_pat[h])) == float(extract_year(curr_pat[h])) else 0
            else:
                similarity_score += weights_Demo[h] if target_pat[h] == curr_pat[h] else 0

        scores[id] =  similarity_score

    return scores

#####=======================

def extract_year(date):
    time = to_data_time(date)
    return time.year


def to_data_time(date):
    if ':' in date:
        time = pd.datetime.strptime(date, '%m/%d/%Y %I:%M:%S %p')
    elif '/' in date:
        time = pd.datetime.strptime(date, '%m/%d/%Y')
    else:
        time = pd.datetime.strptime('01/01/0001', '%m/%d/%Y')
    return time
