# -*- coding: utf-8 -*-
"""
Created on Wed Sep 30 13:57:10 2020

@author: saksh
"""

from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import re
import sys
from pathlib import Path
from xml.dom.minidom import Text, Element
import json
import zipfile
import pandas as pd
from io import StringIO

from computation_modules.module_manager import ModuleManager
from computation_modules.parsers import FormParser
from computation_modules.encoders import EndpointJsonEncoder

# Instantiate a ModuleManager
module_manager = ModuleManager(package_name='computation_modules')
parser = FormParser()

UPLOAD_FOLDER = os.path.dirname(os.path.realpath(__file__))
ALLOWED_EXTENSIONS = {'json'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.json_encoder = EndpointJsonEncoder

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def is_json(filename):
    return '.' in filename and \
           'json' in filename.rsplit('.', 1)[1].lower()

def is_zipfile(filename):
    return '.' in filename and \
           'zip' in filename.rsplit('.', 1)[1].lower()

@app.route('/')
def root():
    return 'Server is working!'

@app.route('/', methods=['POST'])
def post_file():
    results = {
      'message' : 'OK',
      'data' : {} }

    # https://stackoverflow.com/questions/9733638/how-to-post-json-data-with-python-requests
    # https://stackoverflow.com/questions/22947905/flask-example-with-post
    # https://stackoverflow.com/questions/22567306/python-requests-file-upload
    # https://stackoverflow.com/questions/913626/what-should-a-multipart-http-request-with-multiple-files-look-like
    # https://stackoverflow.com/questions/18179345/uploading-multiple-files-in-a-single-request-using-python-requests-module
    # check if the post request has the file part
    if bool(request.files) is None:
        results['message'] = 'No file sent'
        resp = jsonify(results)
        resp.status_code = 400
        return resp

    try:
        file_dict = request.files.to_dict()

        # What should happen is that it asserts a maximum of 2 files
            # 1. One .json
            # 2. One .zip (optional)
        assert len(file_dict) <= 2

        # The .zip file preferrably only has .csv or .npz files
        # It reads the contents of the .zip
            # pandas array (from .csv)
            # dict (from .npz)
            # string (from .txt)
            # If other, raise Exception

        module_name = None
        data_loaded = None
        data_files = None
        for filename, data in file_dict.items():
            if is_json(filename):
                data_loaded = json.loads(data.stream.read())

                # For debugging
                with open('debug1.txt', 'w+', encoding='utf-8') as f:
                    json.dump(data_loaded, f, ensure_ascii=False)

                filename_only = Path(filename).name
                if '_' in filename_only:
                    # Match everything until the first underscore for the first group
                    pattern = r'.*\_'
                    pattern_matcher = re.compile(pattern)
                    module_name = pattern_matcher.match(filename_only).group(0).strip('_')
                else:
                    # otherwise, it is the module required only and the extension
                    # e.g. tailor.json, ihtc.json, etc
                    module_name = filename.split(".")[0]

            if is_zipfile(filename):
                # https://docs.python.org/3.8/library/zipfile.html#zipinfo-objects
                client_file = request.files[filename]

                # For debugging
                with open('debug2.txt', 'w+', encoding='utf-8') as f:
                    f.write(str(request.files[filename]))

                # Assume only csv data sent for now, so pd.read_csv will work with all files uploaded
                # Need to add a stage to check the file contents before reading (e.g. if .npz or .txt is uploaded)
                with zipfile.ZipFile(client_file, 'r') as zip_ref:
                    data_files = {name: pd.read_csv(StringIO(str(zip_ref.read(name), 'utf-8'))) for name in zip_ref.namelist()}

                # # To check it actually reads the contents properly
                # for filename, contents in data_files.items():
                #     contents.to_csv(filename)

        assert module_name is not None
        assert data_loaded is not None

        results['data'] = module_manager.parse_run_module(
            module_name=module_name,
            raw_input=data_loaded,
            parser=parser,
            data_files=data_files
        )

    except:
        t = Text()
        e = Element('Error')
        t.data = sys.exc_info()[0]
        e.appendChild(t)
        results['data'] = {'error': e.toxml()}

        with open('error_message.txt', 'w+', encoding='utf-8') as f:
            json.dump(results, f, cls=EndpointJsonEncoder)

    # For debugging
    jsonified_results = json.dumps(results, cls=EndpointJsonEncoder)
    with open('results.json', 'w+') as f:
        f.write(jsonified_results)

    result_status = 200

    resp = jsonify(results)
    resp.status_code = result_status

    return resp

if __name__ == '__main__':
    app.run()
