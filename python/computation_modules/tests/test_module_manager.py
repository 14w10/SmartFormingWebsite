from pathlib import Path
import json
import pytest
import numpy as np

from computation_modules.module_manager import ModuleManager
from computation_modules.parsers import FormParser
from computation_modules.autoformdata import Autoformdata
import pandas as pd

target_directory = [
    Path(__file__).resolve().parents[0].joinpath('data')
]
@pytest.mark.parametrize('target_directory', target_directory)
def test_module_manager_ihtc(target_directory):
    with open(target_directory.joinpath('ihtc_correct_values_units.json'), 'r', encoding='utf-8') as f:
        json_data = json.load(f)

    form_parser = FormParser()
    module_manager = ModuleManager(package_name="computation_modules", target_directory=target_directory)
    result = module_manager.parse_run_module(module_name='ihtc', raw_input=json_data, parser=form_parser)

    expected_result = {
        'hmax': 10.85389622896719,
        'psf_matrix':
            {
            'x': np.array([ 0.,  5., 10., 20., 30., 40., 50., 60.]),
            'y': np.array([0.44, 0.63, 0.75, 0.89, 0.95, 0.98, 0.99, 1.  ]),
            },
        'labels': {
            'x': 'Pressure, MPa',
            'y': 'Thermal Conductivity, W/mK'
        },
        'forming_condition_string': 'AA6082_450_1.5_H13_Omega 35_CrN',
        "psf_matrix_xml": '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<PressureDependentScalingFactors>\n\n  <PressureDependentScalingFactor Pressure="0" ScalingFactor="0.44"/>\n\n  <PressureDependentScalingFactor Pressure="5" ScalingFactor="0.63"/>\n\n  <PressureDependentScalingFactor Pressure="10" ScalingFactor="0.75"/>\n\n  <PressureDependentScalingFactor Pressure="20" ScalingFactor="0.89"/>\n\n  <PressureDependentScalingFactor Pressure="30" ScalingFactor="0.95"/>\n\n  <PressureDependentScalingFactor Pressure="40" ScalingFactor="0.98"/>\n\n  <PressureDependentScalingFactor Pressure="50" ScalingFactor="0.99"/>\n\n  <PressureDependentScalingFactor Pressure="60" ScalingFactor="1.00"/>\n\n</PressureDependentScalingFactors>\n'
    }

    assert result['psf_matrix_xml'] == expected_result['psf_matrix_xml']
    assert result['hmax'] == expected_result['hmax']
    assert result['labels']['x'] == expected_result['labels']['x']
    assert result['labels']['y'] == expected_result['labels']['y']
    assert result['forming_condition_string'] == expected_result['forming_condition_string']

    np.testing.assert_allclose(result['psf_matrix']['x'], expected_result['psf_matrix']['x'])
    np.testing.assert_allclose(result['psf_matrix']['y'], expected_result['psf_matrix']['y'])


@pytest.mark.parametrize('target_directory', target_directory)
def test_module_manager_autoformdata(target_directory):

    module_manager = ModuleManager(package_name="computation_modules", target_directory=target_directory)
    module_name = 'autoformdata'
    data_files = {
        'exp_D-20_13_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_13_Sheet_ElementData.csv')), 'exp_D-20_13_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_13_Sheet_NodeData.csv')),
        'exp_D-20_18_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_18_Sheet_ElementData.csv')), 'exp_D-20_18_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_18_Sheet_NodeData.csv')),
        'exp_D-20_21_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_21_Sheet_ElementData.csv')), 'exp_D-20_21_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_21_Sheet_NodeData.csv')),
        'exp_D-20_25_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_25_Sheet_ElementData.csv')), 'exp_D-20_25_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_25_Sheet_NodeData.csv')),
        'exp_D-20_28_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_28_Sheet_ElementData.csv')), 'exp_D-20_28_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_28_Sheet_NodeData.csv')),
        'exp_D-20_32_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_32_Sheet_ElementData.csv')), 'exp_D-20_32_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_32_Sheet_NodeData.csv')),
        'exp_D-20_34_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_34_Sheet_ElementData.csv')), 'exp_D-20_34_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_34_Sheet_NodeData.csv')),
        'exp_D-20_36_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_36_Sheet_ElementData.csv')), 'exp_D-20_36_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_36_Sheet_NodeData.csv')),
        'exp_D-20_38_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_38_Sheet_ElementData.csv')), 'exp_D-20_38_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_38_Sheet_NodeData.csv')),
        'exp_D-20_41_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_41_Sheet_ElementData.csv')), 'exp_D-20_41_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_41_Sheet_NodeData.csv')),
        'exp_D-20_43_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_43_Sheet_ElementData.csv')), 'exp_D-20_43_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_43_Sheet_NodeData.csv')),
        'exp_D-20_48_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_48_Sheet_ElementData.csv')), 'exp_D-20_48_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_48_Sheet_NodeData.csv')),
        'exp_D-20_15_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_15_Sheet_ElementData.csv')), 'exp_D-20_15_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_15_Sheet_NodeData.csv')),
        'exp_D-30_56_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_56_Sheet_ElementData.csv')), 'exp_D-30_56_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_56_Sheet_NodeData.csv')),
        'exp_D-30_58_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_58_Sheet_ElementData.csv')), 'exp_D-30_58_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_58_Sheet_NodeData.csv')),
        'exp_D-30_61_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_61_Sheet_ElementData.csv')), 'exp_D-30_61_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_61_Sheet_NodeData.csv')),
        'exp_D-30_65_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_65_Sheet_ElementData.csv')), 'exp_D-30_65_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_65_Sheet_NodeData.csv')),
    }

    input_parameters = {}
    input_parameters['data_files'] = data_files

    results = module_manager.run_module(module_name, input_parameters)

    # Assert that at least one of them are the same
    forming_data = np.load(target_directory.joinpath('exp_variables.npz'))
    quenching_data = np.load(target_directory.joinpath('exp_quenching.npz'))

    for stage_data_file in results['data_files']:
        if stage_data_file.stage_name == 'forming':
            stage_data_file.data['sorted_data_steps'] == forming_data['sorted_data_steps']
            np.testing.assert_array_equal(stage_data_file.data['data_step_21'], forming_data['data_step_21'])
            np.testing.assert_array_equal(stage_data_file.data['data_step_48'], forming_data['data_step_48'])
            assert list(stage_data_file.data.keys()) == ['number_of_output_stages', 'data_col_labels',
                                                         'sorted_data_steps', 'data_step_13', 'data_step_15',
                                                         'data_step_18', 'data_step_21', 'data_step_25',
                                                         'data_step_28', 'data_step_32', 'data_step_34',
                                                         'data_step_36', 'data_step_38', 'data_step_41',
                                                         'data_step_43', 'final_step_elem_points',
                                                         'final_step_node_data', 'num_elements', 'num_nodes',
                                                         'data_step_48']
        elif stage_data_file.stage_name == 'quenching':
            stage_data_file.data['sorted_data_steps'] == quenching_data['sorted_data_steps']
            np.testing.assert_array_equal(stage_data_file.data['data_step_56'], quenching_data['data_step_56'])
            np.testing.assert_array_equal(stage_data_file.data['data_step_65'], quenching_data['data_step_65'])
            assert list(stage_data_file.data.keys()) == ['number_of_output_stages', 'data_col_labels',
                                                         'sorted_data_steps', 'data_step_56', 'data_step_58',
                                                         'data_step_61', 'data_step_65']
        else:
            raise Exception("It should either be forming or quenching data")


@pytest.mark.parametrize('target_directory', target_directory)
def test_module_manager_toolmaker_csv(target_directory):

    module_manager = ModuleManager(package_name="computation_modules", target_directory=target_directory)
    module_name = 'toolmaker'

    data_files = {
        'exp_D-20_13_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_13_Sheet_ElementData.csv')), 'exp_D-20_13_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_13_Sheet_NodeData.csv')),
        'exp_D-20_18_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_18_Sheet_ElementData.csv')), 'exp_D-20_18_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_18_Sheet_NodeData.csv')),
        'exp_D-20_21_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_21_Sheet_ElementData.csv')), 'exp_D-20_21_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_21_Sheet_NodeData.csv')),
        'exp_D-20_25_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_25_Sheet_ElementData.csv')), 'exp_D-20_25_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_25_Sheet_NodeData.csv')),
        'exp_D-20_28_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_28_Sheet_ElementData.csv')), 'exp_D-20_28_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_28_Sheet_NodeData.csv')),
        'exp_D-20_32_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_32_Sheet_ElementData.csv')), 'exp_D-20_32_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_32_Sheet_NodeData.csv')),
        'exp_D-20_34_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_34_Sheet_ElementData.csv')), 'exp_D-20_34_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_34_Sheet_NodeData.csv')),
        'exp_D-20_36_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_36_Sheet_ElementData.csv')), 'exp_D-20_36_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_36_Sheet_NodeData.csv')),
        'exp_D-20_38_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_38_Sheet_ElementData.csv')), 'exp_D-20_38_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_38_Sheet_NodeData.csv')),
        'exp_D-20_41_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_41_Sheet_ElementData.csv')), 'exp_D-20_41_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_41_Sheet_NodeData.csv')),
        'exp_D-20_43_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_43_Sheet_ElementData.csv')), 'exp_D-20_43_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_43_Sheet_NodeData.csv')),
        'exp_D-20_48_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_48_Sheet_ElementData.csv')), 'exp_D-20_48_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_48_Sheet_NodeData.csv')),
        'exp_D-20_15_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_15_Sheet_ElementData.csv')), 'exp_D-20_15_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_15_Sheet_NodeData.csv')),
        'exp_D-30_56_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_56_Sheet_ElementData.csv')), 'exp_D-30_56_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_56_Sheet_NodeData.csv')),
        'exp_D-30_58_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_58_Sheet_ElementData.csv')), 'exp_D-30_58_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_58_Sheet_NodeData.csv')),
        'exp_D-30_61_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_61_Sheet_ElementData.csv')), 'exp_D-30_61_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_61_Sheet_NodeData.csv')),
        'exp_D-30_65_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_65_Sheet_ElementData.csv')), 'exp_D-30_65_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_65_Sheet_NodeData.csv')),
    }

    parameters_from_json = {
        'model_name': 'exp',
        'total_stroke': 350,
        'stamping_speed': 450,
        'time_quench': 10,
        'blank_temperature': 450,
        'evaluation_stage': 48,
        'ct1': 1.6,
        'cT1': 350,
        'ct2': 7.6,
        'cT2': 250,
        'create_file': False,                   # Defaults to False in the modules
        'target_directory': None    # Defaults to current directory in the modules
    }

    input_parameters = {}
    input_parameters.update(parameters_from_json)
    input_parameters.update({'data_files': data_files})
    input_parameters.update({'toolmaker_total_stroke': 350, 'toolmaker_stamping_speed': 450, 'toolmaker_quenching_time': 10, 'toolmaker_blank_temperature': 450})

    # A data preparer as an argument useful if it is post-fe
    # If the data is already parsed, this is not necessary
    data_preparer = Autoformdata()
    input_parameters.update({'data_preparer': data_preparer})

    results = module_manager.run_module(module_name, input_parameters)

@pytest.mark.parametrize('target_directory', target_directory)
def test_module_manager_toolmaker_npz(target_directory):
    module_manager = ModuleManager(package_name="computation_modules", target_directory=target_directory)
    module_name = 'toolmaker'

    data_files = {
        'exp_variables.npz': np.load(target_directory.joinpath('exp_variables.npz')),
        'exp_quenching.npz': np.load(target_directory.joinpath('exp_quenching.npz')),
    }

    parameters_from_json = {
        'model_name': 'exp',
        'total_stroke': 350,
        'stamping_speed': 450,
        'time_quench': 10,
        'blank_temperature': 450,
        'evaluation_stage': 48,
        'ct1': 1.6,
        'cT1': 350,
        'ct2': 7.6,
        'cT2': 250,
        'create_file': False,                   # Defaults to False in the modules
        'target_directory': None    # Defaults to current directory in the modules
    }

    input_parameters = {}
    input_parameters.update(parameters_from_json)
    input_parameters.update({'data_files': data_files})
    input_parameters.update({'toolmaker_total_stroke': 350, 'toolmaker_stamping_speed': 450, 'toolmaker_quenching_time': 10, 'toolmaker_blank_temperature': 450})

    # A data preparer as an argument useful if it is post-fe
    # If the data is already parsed, this is not necessary
    data_preparer = Autoformdata()
    input_parameters.update({'data_preparer': data_preparer})

    results = module_manager.run_module(module_name, input_parameters)

@pytest.mark.parametrize('target_directory', target_directory)
def test_module_manager_tailor_npz(target_directory):

    data_files = {
        'exp_variables.npz': np.load(target_directory.joinpath('exp_variables.npz')),
        'exp_quenching.npz': np.load(target_directory.joinpath('exp_quenching.npz')),
    }

    filename = 'tailor_actual.json'
    filepath = target_directory.joinpath(filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        json_data = json.load(f)

    input_parameters = {}
    input_parameters.update({'data_files': data_files})

    form_parser = FormParser()
    module_manager = ModuleManager(package_name="computation_modules", target_directory=target_directory_2)
    result = module_manager.parse_run_module(module_name='tailor', raw_input=json_data, parser=form_parser, data_files=data_files)

    expected_result_npz = np.load(target_directory.joinpath("exp_postformstrength.npz"))

    np.testing.assert_allclose(np.array(result['files'][0]['data'][1:])[:, 0].reshape(-1, 1), expected_result_npz['dislocation_density'])
    np.testing.assert_allclose(np.array(result['files'][0]['data'][1:])[:, 1].reshape(-1, 1), expected_result_npz['hardness'])
    np.testing.assert_allclose(np.array(result['files'][0]['data'][1:])[:, 2].reshape(-1, 1), expected_result_npz['hardness_modified'])


@pytest.mark.parametrize('target_directory', target_directory)
def test_module_manager_tailor_csv(target_directory):

    data_files = {
        'exp_D-20_13_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_13_Sheet_ElementData.csv')), 'exp_D-20_13_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_13_Sheet_NodeData.csv')),
        'exp_D-20_18_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_18_Sheet_ElementData.csv')), 'exp_D-20_18_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_18_Sheet_NodeData.csv')),
        'exp_D-20_21_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_21_Sheet_ElementData.csv')), 'exp_D-20_21_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_21_Sheet_NodeData.csv')),
        'exp_D-20_25_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_25_Sheet_ElementData.csv')), 'exp_D-20_25_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_25_Sheet_NodeData.csv')),
        'exp_D-20_28_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_28_Sheet_ElementData.csv')), 'exp_D-20_28_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_28_Sheet_NodeData.csv')),
        'exp_D-20_32_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_32_Sheet_ElementData.csv')), 'exp_D-20_32_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_32_Sheet_NodeData.csv')),
        'exp_D-20_34_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_34_Sheet_ElementData.csv')), 'exp_D-20_34_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_34_Sheet_NodeData.csv')),
        'exp_D-20_36_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_36_Sheet_ElementData.csv')), 'exp_D-20_36_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_36_Sheet_NodeData.csv')),
        'exp_D-20_38_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_38_Sheet_ElementData.csv')), 'exp_D-20_38_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_38_Sheet_NodeData.csv')),
        'exp_D-20_41_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_41_Sheet_ElementData.csv')), 'exp_D-20_41_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_41_Sheet_NodeData.csv')),
        'exp_D-20_43_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_43_Sheet_ElementData.csv')), 'exp_D-20_43_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_43_Sheet_NodeData.csv')),
        'exp_D-20_48_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_48_Sheet_ElementData.csv')), 'exp_D-20_48_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_48_Sheet_NodeData.csv')),
        'exp_D-20_15_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_15_Sheet_ElementData.csv')), 'exp_D-20_15_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_15_Sheet_NodeData.csv')),
        'exp_D-30_56_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_56_Sheet_ElementData.csv')), 'exp_D-30_56_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_56_Sheet_NodeData.csv')),
        'exp_D-30_58_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_58_Sheet_ElementData.csv')), 'exp_D-30_58_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_58_Sheet_NodeData.csv')),
        'exp_D-30_61_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_61_Sheet_ElementData.csv')), 'exp_D-30_61_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_61_Sheet_NodeData.csv')),
        'exp_D-30_65_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_65_Sheet_ElementData.csv')), 'exp_D-30_65_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_65_Sheet_NodeData.csv')),
    }

    filename = 'tailor_actual.json'
    filepath = target_directory.joinpath(filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        json_data = json.load(f)

    input_parameters = {}
    input_parameters.update({'data_files': data_files})

    form_parser = FormParser()
    module_manager = ModuleManager(package_name="computation_modules", target_directory=target_directory_2)
    result = module_manager.parse_run_module(module_name='tailor', raw_input=json_data, parser=form_parser, data_files=data_files)

    expected_result_npz = np.load(target_directory.joinpath("exp_postformstrength.npz"))

    np.testing.assert_allclose(np.array(result['files'][0]['data'][1:])[:, 0].reshape(-1, 1), expected_result_npz['dislocation_density'])
    np.testing.assert_allclose(np.array(result['files'][0]['data'][1:])[:, 1].reshape(-1, 1), expected_result_npz['hardness'])
    np.testing.assert_allclose(np.array(result['files'][0]['data'][1:])[:, 2].reshape(-1, 1), expected_result_npz['hardness_modified'])


@pytest.mark.parametrize('target_directory', target_directory)
def test_module_manager_ihtc_json_datafiles(target_directory):
    with open(target_directory.joinpath('ihtc_correct_values_units.json'), 'r', encoding='utf-8') as f:
        json_data = json.load(f)

    data_files = {
        'exp_variables.npz': np.load(target_directory.joinpath('exp_variables.npz')),
        'exp_quenching.npz': np.load(target_directory.joinpath('exp_quenching.npz')),
    }

    form_parser = FormParser()
    module_manager = ModuleManager(package_name="computation_modules", target_directory=target_directory)
    result = module_manager.parse_run_module(module_name='ihtc', raw_input=json_data, parser=form_parser, data_files=data_files)


target_directory_2 = [
    Path(__file__).resolve().parents[0].joinpath('data_extra')
]
@pytest.mark.parametrize('target_directory_2', target_directory_2)
def test_module_manager_toolmaker_new_data(target_directory_2):

    with open(target_directory_2.joinpath('toolmaker_420.json'), 'r', encoding='utf-8') as f:
        json_data = json.load(f)

    data_files = {
        'SetUpAintComplete_D-20_25_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_25_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_25_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_25_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_27_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_27_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_27_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_27_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_29_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_29_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_29_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_29_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_31_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_31_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_31_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_31_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_32_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_32_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_32_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_32_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_33_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_33_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_33_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_33_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_35_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_35_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_35_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_35_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_37_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_37_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_37_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_37_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_39_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_39_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_39_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_39_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_42_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_42_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_42_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_42_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_44_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_44_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_44_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_44_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_46_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_46_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_46_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_46_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_48_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_48_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_48_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_48_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_53_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_53_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_53_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_53_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-30_58_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_58_Sheet_ElementData.csv')), 'SetUpAintComplete_D-30_58_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_58_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-30_61_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_61_Sheet_ElementData.csv')), 'SetUpAintComplete_D-30_61_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_61_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-30_63_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_63_Sheet_ElementData.csv')), 'SetUpAintComplete_D-30_63_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_63_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-30_68_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_68_Sheet_ElementData.csv')), 'SetUpAintComplete_D-30_68_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_68_Sheet_NodeData.csv'))
    }

    input_parameters = {}
    input_parameters.update({'data_files': data_files})
    input_parameters.update({'json_data': json_data})
    input_parameters.update({'toolmaker_total_stroke': 350, 'toolmaker_stamping_speed': 450, 'toolmaker_quenching_time': 10, 'toolmaker_blank_temperature': 450})

    form_parser = FormParser()
    module_manager = ModuleManager(package_name="computation_modules", target_directory=target_directory_2)
    result = module_manager.parse_run_module(module_name='toolmaker', raw_input=json_data, parser=form_parser, data_files=data_files)

    print(result.keys())

def test_formability_new_data(target_directory_2):
    with open(target_directory_2.joinpath('formability_17.json'), 'r', encoding='utf-8') as f:
        json_data = json.load(f)

    data_files = {
        'SetUpAintComplete_D-20_25_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_25_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_25_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_25_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_27_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_27_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_27_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_27_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_29_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_29_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_29_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_29_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_31_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_31_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_31_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_31_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_32_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_32_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_32_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_32_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_33_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_33_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_33_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_33_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_35_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_35_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_35_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_35_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_37_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_37_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_37_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_37_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_39_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_39_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_39_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_39_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_42_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_42_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_42_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_42_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_44_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_44_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_44_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_44_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_46_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_46_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_46_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_46_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_48_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_48_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_48_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_48_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-20_53_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_53_Sheet_ElementData.csv')), 'SetUpAintComplete_D-20_53_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-20_53_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-30_58_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_58_Sheet_ElementData.csv')), 'SetUpAintComplete_D-30_58_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_58_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-30_61_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_61_Sheet_ElementData.csv')), 'SetUpAintComplete_D-30_61_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_61_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-30_63_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_63_Sheet_ElementData.csv')), 'SetUpAintComplete_D-30_63_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_63_Sheet_NodeData.csv')),
        'SetUpAintComplete_D-30_68_Sheet_ElementData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_68_Sheet_ElementData.csv')), 'SetUpAintComplete_D-30_68_Sheet_NodeData.csv': pd.read_csv(target_directory_2.joinpath('SetUpAintComplete_D-30_68_Sheet_NodeData.csv'))
    }

    input_parameters = {}
    input_parameters.update({'data_files': data_files})
    input_parameters.update({'json_data': json_data})
    form_parser = FormParser()
    module_manager = ModuleManager(package_name="computation_modules", target_directory=target_directory_2)
    result = module_manager.parse_run_module(module_name='formability', raw_input=json_data, parser=form_parser, data_files=data_files)

    print(result.keys())

def test_formability_old_data(target_directory):

    with open(target_directory.joinpath('formability_17.json'), 'r', encoding='utf-8') as f:
        json_data = json.load(f)

    data_files = {
        'exp_D-20_13_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_13_Sheet_ElementData.csv')), 'exp_D-20_13_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_13_Sheet_NodeData.csv')),
        'exp_D-20_18_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_18_Sheet_ElementData.csv')), 'exp_D-20_18_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_18_Sheet_NodeData.csv')),
        'exp_D-20_21_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_21_Sheet_ElementData.csv')), 'exp_D-20_21_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_21_Sheet_NodeData.csv')),
        'exp_D-20_25_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_25_Sheet_ElementData.csv')), 'exp_D-20_25_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_25_Sheet_NodeData.csv')),
        'exp_D-20_28_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_28_Sheet_ElementData.csv')), 'exp_D-20_28_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_28_Sheet_NodeData.csv')),
        'exp_D-20_32_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_32_Sheet_ElementData.csv')), 'exp_D-20_32_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_32_Sheet_NodeData.csv')),
        'exp_D-20_34_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_34_Sheet_ElementData.csv')), 'exp_D-20_34_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_34_Sheet_NodeData.csv')),
        'exp_D-20_36_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_36_Sheet_ElementData.csv')), 'exp_D-20_36_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_36_Sheet_NodeData.csv')),
        'exp_D-20_38_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_38_Sheet_ElementData.csv')), 'exp_D-20_38_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_38_Sheet_NodeData.csv')),
        'exp_D-20_41_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_41_Sheet_ElementData.csv')), 'exp_D-20_41_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_41_Sheet_NodeData.csv')),
        'exp_D-20_43_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_43_Sheet_ElementData.csv')), 'exp_D-20_43_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_43_Sheet_NodeData.csv')),
        'exp_D-20_48_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_48_Sheet_ElementData.csv')), 'exp_D-20_48_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_48_Sheet_NodeData.csv')),
        'exp_D-20_15_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_15_Sheet_ElementData.csv')), 'exp_D-20_15_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-20_15_Sheet_NodeData.csv')),
        'exp_D-30_56_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_56_Sheet_ElementData.csv')), 'exp_D-30_56_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_56_Sheet_NodeData.csv')),
        'exp_D-30_58_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_58_Sheet_ElementData.csv')), 'exp_D-30_58_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_58_Sheet_NodeData.csv')),
        'exp_D-30_61_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_61_Sheet_ElementData.csv')), 'exp_D-30_61_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_61_Sheet_NodeData.csv')),
        'exp_D-30_65_Sheet_ElementData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_65_Sheet_ElementData.csv')), 'exp_D-30_65_Sheet_NodeData.csv': pd.read_csv(target_directory.joinpath('exp_D-30_65_Sheet_NodeData.csv')),
    }

    input_parameters = {}
    input_parameters.update({'data_files': data_files})
    input_parameters.update({'json_data': json_data})
    form_parser = FormParser()
    module_manager = ModuleManager(package_name="computation_modules", target_directory=target_directory_2)
    result = module_manager.parse_run_module(module_name='formability', raw_input=json_data, parser=form_parser, data_files=data_files)

    print(result.keys())

def test_material_mate():

    with open(target_directory.joinpath('material_mate_82.json'), 'r', encoding='utf-8') as f:
        json_data = json.load(f)

    input_parameters = {}
    input_parameters.update({'json_data': json_data})
    form_parser = FormParser()
    module_manager = ModuleManager(package_name="computation_modules", target_directory=target_directory)
    result = module_manager.parse_run_module(module_name='material_mate', raw_input=json_data, parser=form_parser)
        
if __name__ == "__main__":
    target_directory = Path(__file__).resolve().parents[0].joinpath('data')
    target_directory_2 = Path(__file__).resolve().parents[0].joinpath('data_extra')

    # test_module_manager_ihtc(target_directory)
    # test_module_manager_autoformdata(target_directory)
    # test_module_manager_toolmaker_csv(target_directory)
    # test_module_manager_toolmaker_npz(target_directory)
    # test_module_manager_tailor_npz(target_directory)
    # test_module_manager_tailor_csv(target_directory)
    # test_module_manager_ihtc_json_datafiles(target_directory)
    # test_module_manager_toolmaker_new_data(target_directory_2)
    # test_formability_new_data(target_directory_2)
    # test_formability_old_data(target_directory)
    test_material_mate()
