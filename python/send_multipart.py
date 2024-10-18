import requests
import json
import numpy as np
from pathlib import Path

url = 'http://127.0.0.1:5000'

def send_json_presimulation():
    # https://medium.com/@jjkoh95/multipart-form-data-64b7dcdad72c

    json_filename = 'ihtc_42.json'

    # Send ihtc data
    with open(json_filename, 'rb') as f:
        json_data = f.read()

    response = requests.post(url, files={json_filename: json_data})
    print(response.content)
    print(f'Status Code: {response.status_code}')

def send_json_zip_postsimulation():

    # https://medium.com/dev-bits/ultimate-guide-for-working-with-i-o-streams-and-zip-archives-in-python-3-6f3cf96dca50
    json_filename = 'toolmaker_420.json'
    zip_filename = 'smartforming_data.zip'

    # Send json data
    with open(json_filename, 'rb') as f:
        json_data = f.read()

    # Send zip data
    with open(zip_filename, 'rb') as f:
        zip_data = f.read()

    response = requests.post(url, files={json_filename: json_data, zip_filename: zip_data})
    print(response.content)
    print(f'Status Code: {response.status_code}')


def send_json_zip_postsimulation_formability():

    json_filename = 'formability_17.json'
    zip_filename = 'smartforming_data.zip'

    # Send json data
    with open(json_filename, 'rb') as f:
        json_data = f.read()

    # Send zip data
    with open(zip_filename, 'rb') as f:
        zip_data = f.read()

    response = requests.post(url, files={json_filename: json_data, zip_filename: zip_data})
    print(response.content)
    print(f'Status Code: {response.status_code}')

def send_json_zip_postsimulation_tailor():

    # https://medium.com/dev-bits/ultimate-guide-for-working-with-i-o-streams-and-zip-archives-in-python-3-6f3cf96dca50
    json_filename = 'tailor_actual.json'
    zip_filename = 'smartforming_data.zip'

    # Send json data
    with open(json_filename, 'rb') as f:
        json_data = f.read()

    # Send zip data
    with open(zip_filename, 'rb') as f:
        zip_data = f.read()

    response = requests.post(url, files={json_filename: json_data, zip_filename: zip_data})
    print(response.content)
    print(f'Status Code: {response.status_code}')

def send_json_presimulation_material_mate():
    json_filename = 'material_mate_82.json'

    # Send ihtc data
    with open(json_filename, 'rb') as f:
        json_data = f.read()

    response = requests.post(url, files={json_filename: json_data})
    print(response.content)
    print(f'Status Code: {response.status_code}')

if __name__ == "__main__":
    # send_json_presimulation()
    # send_json_zip_postsimulation()
    # send_json_zip_postsimulation_formability()
    # send_json_zip_postsimulation_tailor()
    send_json_presimulation_material_mate()
