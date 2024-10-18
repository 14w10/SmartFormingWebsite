import json
import numpy as np

# https://stackoverflow.com/questions/5160077/encoding-nested-python-object-in-json
# https://stackoverflow.com/questions/65354137/how-to-convert-nested-dictionary-with-numpy-array-to-json-and-back
class ComplexEncoder(json.JSONEncoder):
    # NOTE:, no NpzFile encoder yet
    def default(self, obj):
        if hasattr(obj,'reprJSON'):
            return obj.reprJSON()
        if hasattr(obj, "tolist"):  # numpy arrays have this
            return {"$array": obj.tolist()}  # Make a tagged object
        else:
            return json.JSONEncoder.default(self, obj)

    @staticmethod
    def deconvert(x):
        if len(x) == 1:  # Might be a tagged object...
            key, value = next(iter(x.items()))  # Grab the tag and value
            if key == "$array":  # If the tag is correct,
                return np.array(value)  # cast back to array
        return x

class EndpointJsonEncoder(json.JSONEncoder):
    # NOTE:, no NpzFile encoder yet
    def default(self, obj):
        if hasattr(obj,'reprJSON'):
            return obj.reprJSON()
        if hasattr(obj, "tolist"):  # numpy arrays have this
            return obj.tolist()  # Make a tagged object
        else:
            return json.JSONEncoder.default(self, obj)

    @staticmethod
    def deconvert(x):
        if len(x) == 1:  # Might be a tagged object...
            key, value = next(iter(x.items()))  # Grab the tag and value
            if key == "$array":  # If the tag is correct,
                return np.array(value)  # cast back to array
        return x