from pathlib import Path
import numpy as np
import scipy.io as sio
import re

def view_autoformdata(target_directory):
    npz_forming_data = np.load(target_directory.joinpath('exp_variables.npz'))
    npz_quenching_data = np.load(target_directory.joinpath('exp_quenching.npz'))

    data_step_pattern = r'data_step_\d+'
    matcher = re.compile(data_step_pattern)

    non_data_forming_npz_keys = [
        key for key in npz_forming_data.files if not matcher.match(key)
    ]
    non_data_quenching_npz_keys = [
        key for key in npz_quenching_data.files if not matcher.match(key)
    ]

    print('=== Forming ===')
    for key in non_data_forming_npz_keys:
        print(f'- {key}')
        print(npz_forming_data[key])

    print('=== Quenching ===')
    for key in non_data_quenching_npz_keys:
        print(f'- {key}')
        print(npz_forming_data[key])

def view_tailor(target_directory):
    mat_tailor_result_filename = 'postformstrength.mat'
    py_dislocation_density_filename = 'exp_dislocation_density.npy'

    tailor_results_mat = sio.loadmat(target_directory.joinpath(mat_tailor_result_filename))
    dislocation_density_mat = tailor_results_mat['dislocation_density']
    dislocation_density_py = np.load(target_directory.joinpath(py_dislocation_density_filename))

    print(np.average(dislocation_density_py))
    print(tailor_results_mat.keys())

if __name__ == "__main__":
    target_directory = Path(__file__).resolve().parents[0].joinpath('data')
    view_autoformdata(target_directory)
    view_tailor(target_directory)
