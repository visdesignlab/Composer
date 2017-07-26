import phovea_server.dataset as dt
from phovea_server.util import jsonify

from sklearn.cluster import DBSCAN
import numpy as np
import pandas as pd

weights_PRO = {"SCORE": 35}

# used in get_similarity_score
def get_first_info(PAT_ID):
    data = dt.get('PRO').aslist()
    # find the first entry for each patient
    first_ent = []
    first_time = pd.datetime.today()
    for row in data:
        if row['PAT_ID'] == PAT_ID:
            if to_date_time(row['ASSESSMENT_START_DTM']) < first_time:
                first_ent = row
                first_time = to_date_time(row['ASSESSMENT_START_DTM'])

    return first_ent


# used in data_handler.get_similar_rows
def get_similarity_score(PAT_ID, dataset_id):
    data = dt.get(dataset_id).aslist()

    # divide data to 3 groups
    # find the first entry for each patient in each group

    pat_ids = set([int(d['PAT_ID']) for d in data])
    groups = {'PROMIS Bank v1.2 - Physical Function': {},
              'Oswestry Index (ODI)': {},
              'PROMIS Bank v1.0 - Depression': {}
             }

    for row in data:
        promisType = row['FORM']
        if int(row['PAT_ID']) in groups[promisType]:
            if to_date_time(groups[promisType][row['PAT_ID']]['ASSESSMENT_START_DTM']) > to_date_time(row['ASSESSMENT_START_DTM']):
                groups[promisType][int(row['PAT_ID'])] = row
        else:
            groups[promisType][int(row['PAT_ID'])] = row

    physical = groups['PROMIS Bank v1.2 - Physical Function'][int(PAT_ID)]
    oswerstry = groups['Oswestry Index (ODI)'][int(PAT_ID)]
    depression = groups['PROMIS Bank v1.0 - Depression'][int(PAT_ID)]
    scores = {}

    for id in pat_ids:

        if id == int(PAT_ID):
            continue

        # only promis score
        similarity_score = 0
        if physical and id in groups['PROMIS Bank v1.2 - Physical Function']:
            similarity_score += weights_PRO['SCORE'] if abs(int(physical['SCORE'])
                            - int(groups['PROMIS Bank v1.2 - Physical Function'][id]['SCORE'])) <= 10 else 0 ## within range of 10
        else:
            similarity_score += weights_PRO['SCORE'] * 0.5

        if oswerstry and id in groups['Oswestry Index (ODI)']:
            similarity_score += weights_PRO['SCORE'] if abs(int(oswerstry['SCORE']) 
                            - int(groups['Oswestry Index (ODI)'][id]['SCORE'])) <= 10 else 0 ## within range of 10
        else:
             similarity_score += weights_PRO['SCORE'] * 0.5

        if depression and id in groups['PROMIS Bank v1.0 - Depression']:
                    similarity_score += weights_PRO['SCORE'] if abs(int(depression['SCORE']) 
                                    - int(groups['PROMIS Bank v1.0 - Depression'][id]['SCORE'])) <= 10 else 0 ## within range of 10
        else:
            similarity_score += weights_PRO['SCORE'] * 0.5

        scores[id] =  similarity_score

    return scores

##============= utility functions
def extract_year(date):
    time = pd.datetime.strptime(date, '%m/%d/%Y %I:%M:%S %p')
    return time.year

def to_date_time(date):
    if ':' in date:
        time = pd.datetime.strptime(date, '%m/%d/%Y %I:%M:%S %p')
    elif '/' in date:
        time = pd.datetime.strptime(date, '%m/%d/%Y')
    else:
        time = pd.datetime.strptime('01/01/0001', '%m/%d/%Y')
    return time
