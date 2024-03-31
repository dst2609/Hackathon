# -*- coding: utf-8 -*-
"""280_hack_data.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1mOhGPrJsZ66L_eiOKO_yPYPNC-yRFj__
"""

import pandas as pd
from google.colab import files

uploaded = files.upload()

# Load the CSV file into a DataFrame with error handling
file_name = list(uploaded.keys())[0]  # Get the name of the uploaded file

try:
    df = pd.read_csv(file_name, encoding='latin1', header=0)
except Exception as e:
    print(f"Error reading CSV file: {e}")
    df = pd.DataFrame()  # Create an empty DataFrame

df = df.rename(columns={'ï»¿Country Name': 'Country Name'})
filtered_df = df[df.apply(lambda row: 'India' in row.values or 'China' in row.values or 'USA' in row.values, axis=1)]
filtered_df = filtered_df.T
filtered_df
filtered_df.drop(["Country Code", "Indicator Name", "Indicator Code"], inplace=True)
new_header = filtered_df.iloc[0] #grab the first row for the header
filtered_df = filtered_df[1:] #take the data less the header row
filtered_df.columns = new_header #set the header row as the df header

filtered_df

filtered_file_name = 'filtered_countries.csv'

filtered_df.to_csv(filtered_file_name, encoding='utf-8')

files.download(filtered_file_name)


