import phovea_server.dataset as dt
from phovea_server.util import jsonify

import numpy as np
import pandas as pd


weights_CCI = {"PAT_ID": 0, "VISIT_NO": 0, "CCI_MI": 0, "CCI_CHF": 0, "CCI_PVD": 0,
               "CCI_CVD": 0, "CCI_DEMENTIA": 0, "CCI_COPD": 0, "CCI_RHEUM_DZ": 0,
               "CCI_PUD": 0, "CCI_DM_WO_COMPL": 0, "CCI_DM_W_COMPL": 0,
               "CCI_PARAPLEGIA": 0, "CCI_RENAL_DZ": 0, "CCI_MALIGNANT_TUMOR": 0,
               "CCI_LYMPHOMA": 0, "CCI_LEUKEMIA": 0, "CCI_LIVER_MILD_DZ": 0,
               "CCI_LIVER_SEVERE_DZ": 0, "CCI_METAST_TUMOR": 0, "CCI_HIV_AIDS": 0,
               "CCI_SCORE": 10}


numerical_data = ["CCI_SCORE"]


def get_weights():
    return jsonify({
      'weights': weights_CCI
    })


def update_weights(values):
    partial_header = ["CCI_SCORE"]

    split_values = values.split('+')
    for i in range(0, len(partial_header)):
        weights_CCI[partial_header[i]] = int(split_values[i])

    return jsonify({
      'weights': weights_CCI
    })


def get_similarity_score(PAT_ID):
    data = dt.get('CCI').aslist()
    pat_ids = set([int(d['PAT_ID']) for d in data])

    # find the first entry for each patient
    pats = {}
    for id in pat_ids:
        temp_pat = []
        for row in data:
            if row['PAT_ID'] == id:
                temp_pat.append(row)

        # get average?
        pats[id] = temp_pat[0]

    scores = {}
    target_pat = pats[PAT_ID]

    for id in pat_ids:
        similarity_score = 0
        if id == PAT_ID:  ## NOTE!
            continue
        curr_pat = pats[id]
        for h in list(weights_CCI.keys()):
            if weights_CCI[h] == 0:
                continue
            if not curr_pat[h] or not target_pat[h]:
                similarity_score += 0.5 * weights_CCI[h]

            if h in numerical_data:
                similarity_score += weights_CCI[h] if target_pat[h] == curr_pat[h] else 0 ## within range
            elif h in years: ## age! ## within range
                similarity_score += weights_CCI[h] if float(extract_year(target_pat[h])) == float(extract_year(curr_pat[h])) else 0
            else:
                similarity_score += weights_CCI[h] if target_pat[h] == curr_pat[h] else 0

        scores[id] = similarity_score

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
