import csv
import numpy as np
import phovea_server.dataset as dt

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
    return dt.remove("clinical_2")


# TODO: dt.update()
# TODO: dt.add()
