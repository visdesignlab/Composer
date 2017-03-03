
from sklearn import datasets
from sklearn.cluster import KMeans
import numpy as np

__author__ = 'Sahar'


def init_function():

    # import some data to play with
    iris = datasets.load_iris()

    return len(iris)


def get_data():
    return datasets.load_iris()


def cluster_data():
    iris = datasets.load_iris()
    x = iris.data

    y_prediction = KMeans(n_clusters=3, n_init=1, init='random').fit_predict(x)

    return y_prediction


def group_data(index1, index2):
    iris = datasets.load_iris()
    return np.array(iris['data'])[:, [index1, index2]]
