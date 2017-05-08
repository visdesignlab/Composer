import phovea_server.dataset as dt
from phovea_server.util import jsonify

from sklearn.cluster import DBSCAN
import numpy as np
import pandas as pd

weights_PRO = {"INDEX": 0, "PAT_ID": 0, "VISIT_NO": 0, "ASSESSMENT_ID": 0,
           "ASSESSMENT_START_DTM": 5, "FORM_ID": 0, "FORM": 1, "SCORE": 20
           }

category_replacement = {
  "FORM": {'PROMIS Bank v1.2 - Physical Function': 0,
           'PROMIS Bank v1.0 - Depression': 1, 'Oswestry Index (ODI)': 2,
           'PROMIS SF v1.2 - Physical Function 8b': 3,
           'PROMIS Bank v1.2 - Physical Function (Expectations)': 4,
           'ODI (Bisson)': 5, 'PROMIS-Ca Bank v1.1 - Physical Function': 6,
           'ODI for Lumbar Spine (Owestry Disability Index) Neurosurgery': 7}
}


categorical_data = ["FORM_ID"]

numerical_data = ["SCORE"]

years = ["ASSESSMENT_START_DTM"]


# used in get_similarity_score
def get_first_info(PAT_ID):
    data = dt.get('PRO').aslist()
    # find the first entry for each patient
    first_ent = []
    first_time = pd.datetime.today()
    for row in data:
        if row['PAT_ID'] == PAT_ID:
            if to_data_time(row['ASSESSMENT_START_DTM']) < first_time:
                first_ent = row
                first_time = to_data_time(row['ASSESSMENT_START_DTM'])

    return first_ent


# used in data_handler.get_similar_rows
def get_similarity_score(PAT_ID):
    data = dt.get('PRO').aslist()

    # divide data to 3 groups
    # 3 sets of pat ids

    pat_ids = set([int(d['PAT_ID']) for d in data])

    # find the first entry for each patient in each group

    pats = {}
    for id in pat_ids:
        pats[id] = get_first_info(id)

    for row in data:
        pats[int(row['PAT_ID'])] = row

    scores = {}

    # first in each group

    target_pat = pats[PAT_ID]

    for id in pat_ids:

        # only promis score

        similarity_score = 0
        if id == PAT_ID:  ## NOTE!
            continue
        curr_pat = pats[id]
        for h in list(weights_PRO.keys()):
            if weights_PRO[h] == 0:
                continue
            elif not curr_pat[h] or not target_pat[h]:
                similarity_score += 0.5 * weights_PRO[h]

            elif h in categorical_data:
                similarity_score += weights_PRO[h] if target_pat[h] == curr_pat[h] else 0
            elif h in numerical_data:
                similarity_score += weights_PRO[h] if target_pat[h] == curr_pat[h] else 0 ## within range
            elif h in years: ## age! ## within range
                similarity_score += weights_PRO[h] if float(extract_year(target_pat[h])) == float(extract_year(curr_pat[h])) else 0
            else:
                similarity_score += weights_PRO[h] if target_pat[h] == curr_pat[h] else 0

        scores[id] =  similarity_score

    return scores

##============= utility functions
def extract_year(date):
    time = pd.datetime.strptime(date, '%m/%d/%Y %I:%M:%S %p')
    return time.year
