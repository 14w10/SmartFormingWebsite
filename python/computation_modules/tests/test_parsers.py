from json.decoder import JSONDecodeError
from computation_modules import parsers
from computation_modules.parsers import FormParser
from pathlib import Path
import pytest
import json


target_directory = [
    Path(__file__).resolve().parents[0].joinpath('data')
]
@pytest.mark.parametrize('target_directory', target_directory)
def test_parser_ihtc(target_directory):

    with open(target_directory.joinpath('ihtc_84_01066509.json'), 'r', encoding='utf-8') as f:
        json_data = json.load(f)

    form_parser = FormParser()
    parameter_variables = form_parser.parse(raw_input=json_data)

    expected_parameter_variables = {
        'blank_name': 'AA6082',
        'blank_thermal_conductivity_490_degc': 0.17,
        'blank_ultimate_tensile_strength_490_degc': 36,
        'blank_thickness': 1.5,
        'blank_density_490_degc': 2700,
        'blank_specific_heat_capacity_490_degc': 890,
        'blank_avg_surface_roughness': 4.3e-7,
        'blank_temperature': 450,
        'tool_name': 'H13',
        'tool_hardness': 52,
        'tool_avg_surface_roughness': 9.8e-7,
        'tool_temperature': 573,
        'tool_thermal_conductivity': 0.0244,
        'lubricant_name': 'Omega 35',
        'lubricant_thickness': 1.5e-5,
        'lubricant_conductivity': 0.024,
        'coating_name': 'CrN',
        'coating_thickness': 3e-6,
        'coating_conductivity': 0.012
    }

    assert parameter_variables == expected_parameter_variables

@pytest.mark.parametrize('target_directory', target_directory)
def test_parser_tailor(target_directory):

    with open(target_directory.joinpath('tailor_actual.json'), 'r', encoding='utf-8') as f:
        json_data = json.load(f)

    form_parser = FormParser()
    parameter_variables = form_parser.parse(raw_input=json_data)

    expected_parameter_variables = {
        'blanking_material_name': 'AA6082',
        'blanking_length': 1,
        'blanking_width': 1,
        'blanking_thickness': 1.5,
        'heating_technology': 'Convective heating',
        'heating_rate': 5,
        'heating_temperature': 400,
        'heating_time': 60,
        'transfer_1_time': 5,
        'transfer_1_temperature': 22,
        'press_technology': 'AA2060',
        'press_coating_thickness': 1,
        'press_lubricant_name': 'Boron nitride',
        'press_tool_name': 'P20',
        'press_stamping_speed': 450,
        'press_stamping_stroke': 350,
        'press_surface_roughness': 1,
        'press_lubricant_density': 1,
        'transfer_2_time': 5,
        'transfer_2_temperature': 22,
        'paint_bake_cycle_1_rate': 5,
        'paint_bake_cycle_1_temperature': 180,
        'paint_bake_cycle_1_time': 120,
        'paint_bake_cycle_2_rate': 5,
        'paint_bake_cycle_2_temperature': 400,
        'paint_bake_cycle_2_time': 60,
        'paint_bake_cycle_3_rate': 5,
        'paint_bake_cycle_3_temperature': 400,
        'paint_bake_cycle_3_time': 60,
        'paint_bake_cycle_4_rate': 5,
        'paint_bake_cycle_4_temperature': 400,
        'paint_bake_cycle_4_time': 60,
        'paint_bake_cycle_5_rate': 5,
        'paint_bake_cycle_5_temperature': 400,
        'paint_bake_cycle_5_time': 60
    }

    assert parameter_variables == expected_parameter_variables

if __name__ == '__main__':
    target_directory = Path(__file__).resolve().parents[0].joinpath('data')
    test_parser_ihtc(target_directory)
    test_parser_tailor(target_directory)
