import phovea_server.dataset as dt
from phovea_server.util import jsonify

from sklearn.cluster import DBSCAN
import numpy as np
import pandas as pd

weights = {"INDEX": 0, "PAT_ID": 0, "VISIT_NO": 0, "ASSESSMENT_ID": 0,
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


# NEVER USED!
def process_data(data):  # only values!!
    processed_data = []

    for row in data:
        tmp_row = []
        for i in range(len(header)):
            h = header[i]
            if weights[h] != 0:
                if h == "ASSESSMENT_START_DTM":
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


def extract_year(date):
    time = pd.datetime.strptime(date, '%m/%d/%Y %I:%M:%S %p')
    return time.year
