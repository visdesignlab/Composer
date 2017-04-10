import phovea_server.dataset as dt
from phovea_server.util import jsonify

from sklearn.cluster import DBSCAN
import numpy as np
import pandas as pd


weights = {"INDEX": 0, "PAT_ID": 0, "VISIT_NO": 0, "PAT_BIRTHDATE": 5,
           "PAT_GENDER": 10, "PAT_ETHNICITY": 1, "D_ETHNICITY_DESC": 1,
           "PAT_RACE": 1, "D_RACE_DESC": 1, "PAT_ZIP": 0,
           "PAT_MARITAL_STAT": 5, "PAT_DEATH_DATE": 0,
           "PAT_DEATH_IND": 2, "BMI": 10, "HEIGHT_CM": 10,
           "WEIGHT_KG": 10, "VISIT_NO_1": 0, "ADM_DATE": 5,
           "DSCH_DATE": 0, "ATT_PROV_ID": 0, "ATT_PROV_FULLNAME": 0,
           "INS_PAY_CAT": 0, "INS_PAY_GRP": 0, "TOBACCO_USER": 5,
           "ALCOHOL_USER": 5, "ILLICIT_DRUG_USER": 5}

categorical_data = ["PAT_GENDER", "PAT_ETHNICITY", "D_ETHNICITY_DESC", "PAT_RACE", "D_RACE_DESC",
                    "PAT_MARITAL_STAT", "PAT_DEATH_IND", "TOBACCO_USER", "ALCOHOL_USER", "ILLICIT_DRUG_USER"]

numerical_data = ["BMI", "HEIGHT_CM", "WEIGHT_KG"]

years = ["PAT_BIRTHDATE", "ADM_DATE", "DSCH_DATE"]

category_replacement = {
  "PAT_GENDER": {'M': 1, 'F': 2},
  "PAT_ETHNICITY": {'W': 1, 'H': 2, 'R': 3, 'U': 4},
  "D_ETHNICITY_DESC": {'Not Hispanic/Latino': 1, 'Hispanic/Latino': 2,
                       'Patient Opts Out': 3, 'Unknown/Information Not Available': 4},
  "PAT_RACE": {'C': 1, 'O': 2, 'X': 3, 'B': 4, 'I': 5, 'R': 6, 'V': 7},
  "D_RACE_DESC": {'White or Caucasian': 1, 'Other': 2, 'Asian': 3,
                  'Black or African American': 4,
                  'American Indian and Alaska Native': 5,
                  'Patient Refused': 6,
                  'Native Hawaiian and Other Pacific Islander': 7},
  "PAT_MARITAL_STAT": {'M': 1, 'S': 2, 'D': 3, 'W': 4, 'X': 5,
                       'P': 6, 'O': 7, 'U': 8},
  "PAT_DEATH_IND": {'Y': 1, 'N': 0},
  "TOBACCO_USER": {'Yes': 1, 'Quit': 2, 'Never': 3, 'Not Asked': 4, 'Passive': 5},
  "ALCOHOL_USER": {'No': 1, 'Yes': 2, 'Not Asked': 3},
  "ILLICIT_DRUG_USER": {'No': 1, 'Yes': 2, 'Not Asked': 3}
}


header = ["PAT_ID", "VISIT_NO", "PAT_BIRTHDATE", "PAT_GENDER", "PAT_ETHNICITY",
          "D_ETHNICITY_DESC", "PAT_RACE", "D_RACE_DESC", "PAT_ZIP", "PAT_MARITAL_STAT",
          "PAT_DEATH_DATE", "PAT_DEATH_IND", "BMI", "HEIGHT_CM", "WEIGHT_KG", "VISIT_NO_1",
          "ADM_DATE", "DSCH_DATE", "ATT_PROV_ID", "ATT_PROV_FULLNAME", "INS_PAY_CAT",
          "INS_PAY_GRP", "TOBACCO_USER", "ALCOHOL_USER", "ILLICIT_DRUG_USER"]


def process_data(data):  # only values!!
    processed_data = []

    for row in data:
        tmp_row = []
        for i in range(len(header)):
            h = header[i]
            if weights[h] != 0:
                if h == "PAT_BIRTHDATE":
                    tmp_value = float(extract_year(row[h])) * weights[h]
                elif h in category_replacement.keys():
                    tmp_value = 0 if not row[h] else category_replacement[h][row[h]] * weights[h]
                elif row[h]:
                    tmp_value = float(row[h]) * weights[h]
                else:
                    tmp_value = 0
            else:
                tmp_value = 0
            tmp_row.append(tmp_value)
        processed_data.append(tmp_row)

    return processed_data


def find_cluster(original_data, processed_data, index):
    cluster_indices = []
    cluster = []

    db = DBSCAN(eps=0.3, min_samples=10).fit(processed_data)
    core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
    core_samples_mask[db.core_sample_indices_] = True
    labels = db.labels_
    n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)

    cluster_indices.append(index)

    for i in range(0, len(labels)):
        if i == index:
            continue
        if labels[i] == labels[index]:
            cluster_indices.append(i)

    for d in cluster_indices:
        cluster.append(original_data[d])

    return jsonify({
      'cluster': cluster[:20],
      'cluster_size': len(cluster),
      'n_clusters': n_clusters_,
      'cluster_indices': cluster_indices,
      'label': labels[index]
    })


def find_similar(original_data, processed_data, index):
    my_row = processed_data[index]
    dist = []

    for i in range(0, len(processed_data)):
        dist.append([i, np.linalg.norm(np.array(my_row)
                                       - np.array(processed_data[i]))])

    sorted_dist = sorted(dist, key=lambda x: x[1])
    similar_index = [row[0] for row in sorted_dist]

    similar_rows = []
    difference = []  # array of [-1 or +1 or 0] difference with the original data
    for i in range(0, 20):
        tmp_row = original_data[similar_index[i]]
        similar_rows.append(tmp_row)
        tmp_diff = []
        for j in range(0, len(tmp_row)):
            diff = np.sign(my_row[j]
                           - processed_data[similar_index[i]][j])
            tmp_diff.append(diff)
        difference.append(tmp_diff)

    return jsonify({
      'row': original_data[index],
      'similar_rows': similar_rows[0:20],
      'difference': difference,
      'indices': similar_index[0:20]
    })


def find_similar_new(data, index):
    similar_rows = []
    dist = []
    target_row = data[index]

    for num in range(len(data)):
        row = data[num]
        tmp_row = []
        for h in header:
            if not row[h] and not target_row[h]:
                tmp_value = 0
            elif weights[h] != 0:
                if h in years:
                    if not row[h]:
                        tmp_value = float(extract_year(target_row[h])) * weights[h]
                    elif not target_row[h]:
                        tmp_value = float(extract_year(row[h])) * weights[h]
                    else:
                        tmp_value = (float(extract_year(row[h])) - float(extract_year(target_row[h]))) * weights[h]
                elif h in numerical_data:
                    if not row[h]:
                        tmp_value = float(target_row[h]) * weights[h]
                    elif not target_row[h]:
                        tmp_value = float(row[h]) * weights[h]
                    else:
                        tmp_value = (float(row[h]) - float(target_row[h])) * weights[h]
                else:
                    tmp_value = 0 if target_row[h] == row[h] else weights[h]
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
      'row': target_row,
      'similar_rows': similar_rows[0:20],
      'difference': difference,
      'indices': similar_index[0:20]
    })


def get_cluster_demo(index):
    data = dt.get('Demo').aslist()
    processed_data = process_data(data)
    return find_cluster(data, processed_data, index)


def get_similar_demo(index):
    data = dt.get('Demo').aslist()
    return find_similar_new(data, index)
    #processed_data = process_data(data)
    #return find_similar(data, processed_data, index)


def get_weights():
    return jsonify({
      'weights': weights
    })


def update_weights(values):
    partial_header = ["PAT_BIRTHDATE", "PAT_GENDER", "PAT_ETHNICITY", "D_ETHNICITY_DESC",
                      "PAT_RACE", "D_RACE_DESC", "PAT_MARITAL_STAT", "PAT_DEATH_IND", "BMI",
                      "HEIGHT_CM", "WEIGHT_KG", "ADM_DATE", "DSCH_DATE", "TOBACCO_USER",
                      "ALCOHOL_USER", "ILLICIT_DRUG_USER"]

    split_values = values.split('+')
    for i in range(0, len(partial_header)):
        weights[partial_header[i]] = int(split_values[i])

    return jsonify({
      'weights': weights
    })


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
      'latest_info': pats,
      'weights': pat_weights
    })
