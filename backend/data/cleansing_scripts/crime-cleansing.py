import pandas as pd

def columnSelection(data):
    colIndex = [1, 4, 5, 7, 9]
    colKeep = data.columns[colIndex]
    data = data[colKeep]
    return data