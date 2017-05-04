import phovea_server.dataset as dt
from phovea_server.util import jsonify

import numpy as np
import pandas as pd


# used in data_handler.get_similar_rows
def get_first_info(PAT_ID):
    data = dt.get('Orders').aslist()
    # find the first entry for each patient
    first_ent = []
    first_time = pd.datetime.today()
    for row in data:
        if row['PAT_ID'] == PAT_ID:
            if to_data_time(row['ORDER_DTM']) < first_time:
                first_ent = row
                first_time = to_data_time(row['ORDER_DTM'])

    return first_ent


##============= utility functions
def to_data_time(date):
    if ':' in date:
        time = pd.datetime.strptime(date, '%m/%d/%Y %I:%M:%S %p')
    elif '/' in date:
        time = pd.datetime.strptime(date, '%m/%d/%Y')
    else:
        time = pd.datetime.strptime('01/01/0001', '%m/%d/%Y')
    return time
