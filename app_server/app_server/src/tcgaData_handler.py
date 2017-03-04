import csv
import numpy as np
import phovea_server.dataset as dt
from phovea_server.util import jsonify
import phovea_server.dataset_def as dd
import phovea_server.dataset_specific as ds


__author__ = 'Sahar'


def read_tcga_data():
    return dt.get("clinical_patient_public_GBM")


def get_all_datasets():
    return dt.list_datasets()


def get_id_types():
    return dt.list_idtypes()


# Temporary
def read_data_38_data():
    return dt.get("big-decent-clipped-38")


def get_id_manager():
    return dt.get_idmanager()


def get_mapping_manager():
    return dt.get_mappingmanager()


# Not Working!
def remove_dataset():
    dataset = dt.get("clinical_2")
    return dt.remove(dataset)


# functions from https://github.com/phovea/phovea_server/blob/develop/phovea_server/dataset_csv.py#L341
def get_info_by_functions():
    my_data = dt.get("big-decent-clipped-38")
    json = my_data.asjson()
    return jsonify({
      'row': my_data.rows(),
      'data': my_data.asjson(),
      'rowids': my_data.rowids(),
      'aslist': my_data.aslist(),
      'aspandas': my_data.aspandas()
    })


# TODO
def get_row_by_index(index):
    return [index]

# TODO: dt.update()
# TODO: dt.add()

