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

# used in data_handler.get_filtered_orders_by_month
def get_filteres_orders(dataset_id, order, dateTime):
    data = dt.get(dataset_id).aslist()
    filtered_data = [x for x in data if x['ORDER_MNEMONIC'] == order and to_data_time(x['ORDER_DTM']).month == to_data_time(dateTime).month and to_data_time(x['ORDER_DTM']).year == to_data_time(dateTime).year]
    filtered_data.sort(key=lambda x: to_data_time(x['ORDER_DTM']), reverse=True)
    return filtered_data


##============= utility functions
def to_data_time(date):
    if '-' in date:
        time = pd.datetime.strptime(date, '%m-%d-%Y')
    elif ':' in date:
        time = pd.datetime.strptime(date, '%m/%d/%Y %I:%M:%S %p')
    elif '/' in date:
        time = pd.datetime.strptime(date, '%m/%d/%Y')
    else:
        time = pd.datetime.strptime('01/01/0001', '%m/%d/%Y')
    return time
