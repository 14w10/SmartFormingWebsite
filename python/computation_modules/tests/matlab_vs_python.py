from pathlib import Path
import numpy as np
import scipy.io as sio

def analyse_autoformdata(target_directory):
    forming_file = 'exp_variables.npz'
    quenching_file = 'exp_quenching.npz'

    forming_data = np.load(target_directory.joinpath(forming_file))
    quenching_data = np.load(target_directory.joinpath(quenching_file))

    expected_forming_files = ['number_of_output_stages', 'data_col_labels',
        'sorted_data_steps', 'data_step_13', 'data_step_15', 'data_step_18',
        'data_step_21', 'data_step_25', 'data_step_28', 'data_step_32',
        'data_step_34', 'data_step_36', 'data_step_38', 'data_step_41',
        'data_step_43', 'data_step_48']

    expected_quenching_files = ['number_of_output_stages', 'data_col_labels',
        'sorted_data_steps', 'data_step_56', 'data_step_58', 'data_step_61',
        'data_step_65']

    assert forming_data.files == expected_forming_files
    assert quenching_data.files == expected_quenching_files

def analyse_formability(target_directory):
    # Formability takes 170 seconds with an i7-10750H in Python
    original_failure_points = np.genfromtxt(target_directory.joinpath('exp_formability_failure_points_py.csv'), delimiter=',')
    updated_failure_points = np.genfromtxt(target_directory.joinpath('exp_formability_failure_points.csv'), delimiter=',')
    matlab_failure_points = sio.loadmat(target_directory.joinpath('exp_formability_failure_points.mat'))

    original_failure_points_nonzero = original_failure_points[~np.all(original_failure_points == 0., axis=1)]
    updated_failure_points_nonzero = updated_failure_points[~np.all(updated_failure_points == 0., axis=1)]

    np.testing.assert_allclose(original_failure_points_nonzero, updated_failure_points_nonzero)

    print('MATLAB Formability Keys:')
    print(matlab_failure_points.keys())
    matlab_failure_points_1A = matlab_failure_points['element_failure_point1A']
    matlab_failure_points_2A = matlab_failure_points['element_failure_point2A']
    matlab_failure_points = np.concatenate([matlab_failure_points_1A, matlab_failure_points_2A], axis=1)

    matlab_failure_points_nonzero = matlab_failure_points[~np.all(matlab_failure_points == 0., axis=1)]
    print(updated_failure_points_nonzero.shape)

    # Result from asserting matlab and updated_failure_points_nonzero
    """
    np.testing.assert_allclose(matlab_failure_points_nonzero, updated_failure_points_nonzero)

    Not equal to tolerance rtol=1e-07, atol=0

    Mismatched elements: 422 / 432 (97.7%)
    Max absolute difference: 0.24386612
    Max relative difference: 0.01486462
    x: array([[ 9.558715, 10.551517],
        [26.243645, 27.00566 ],
        [ 8.803144, 10.002482],...
    y: array([[ 9.576822, 10.571724],
        [26.283582, 27.046802],
        [ 8.801732, 10.000854],...
    """

def analyse_ihtc(target_directory):
    pass

def analyse_toolmaker(target_directory):
    pass

def analyse_tailor(target_directory):
    # 53 to 12 seconds for 1st loop if it is parallelised
    # 52 to 1.064 seconds for 2nd loop if it is parallelised
    mat_tailor_result_filename = 'postformstrength.mat'
    py_tailor_result_filename = 'exp_postformstrength.npz'

    tailor_results_mat = sio.loadmat(target_directory.joinpath(mat_tailor_result_filename))
    tailor_results_py = np.load(target_directory.joinpath(py_tailor_result_filename))

    dislocation_density_mat = tailor_results_mat['dislocation_density']
    dislocation_density_py = tailor_results_py['dislocation_density']

    hardness_mat = tailor_results_mat['hardness']
    hardness_py = tailor_results_py['hardness']

    hardness_modified_mat = tailor_results_mat['hardness_modified']
    hardness_modified_py = tailor_results_py['hardness_modified']

    # 1. Dislocation density passes this test
    np.testing.assert_allclose(dislocation_density_mat, dislocation_density_py)

    # 2. Hardness doesn't pass the test
    np.testing.assert_allclose(hardness_mat, hardness_py)
    """     
    AssertionError:
    Not equal to tolerance rtol=1e-07, atol=0

    Mismatched elements: 8251 / 8251 (100%)
    Max absolute difference: 0.02239875
    Max relative difference: 0.0001859
    x: array([[120.789043],
        [121.035287],
        [121.254429],...
    y: array([[120.776368],
        [121.022088],
        [121.240703],... 
    """

    # 3. Modified hardness doesn't pass the test
    np.testing.assert_allclose(hardness_modified_mat, hardness_modified_py)
    """     
    AssertionError:
    Not equal to tolerance rtol=1e-07, atol=0

    Mismatched elements: 8251 / 8251 (100%)
    Max absolute difference: 0.02099227
    Max relative difference: 0.0001859
    x: array([[113.204351],
        [113.435133],
        [113.640514],...
    y: array([[113.192472],
        [113.422763],
        [113.627651],... 
    """

if __name__ == "__main__":
    target_directory = Path(__file__).resolve().parents[0].joinpath('data')
    analyse_autoformdata(target_directory)
    analyse_formability(target_directory)
    analyse_ihtc(target_directory)
    analyse_toolmaker(target_directory)
    analyse_tailor(target_directory)
