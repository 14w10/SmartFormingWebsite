"""
=====================
Module: ihtc (pre-fe)
=====================

This module contains functions for the pre-fe module ihtc which is used to
obtain the pressure dependent ihtc curves.

"""
from pathlib import Path
import numpy as np
import math

from .utils import print_saving_file_text
from .abstract_modules import AbstractModulePreFe

# We know the file name
class Ihtc(AbstractModulePreFe):
    is_pre_simulation = True
    is_data_preparer = False

    def run(self, blank_name, blank_density_490_degc,
        blank_thermal_conductivity_490_degc, blank_thickness,
        blank_specific_heat_capacity_490_degc,
        blank_avg_surface_roughness, blank_temperature, tool_name,
        tool_avg_surface_roughness, tool_thermal_conductivity,
        lubricant_name, lubricant_thickness, lubricant_conductivity,
        create_file=True, target_directory=None, **kwargs):

        # Normally the ihtc code should all be in here
        # But previously ihtc was written as a function so it is just passed on
        result = ihtc(
            blank_name, blank_density_490_degc,
            blank_thermal_conductivity_490_degc, blank_thickness,
            blank_specific_heat_capacity_490_degc,
            blank_avg_surface_roughness, blank_temperature, tool_name,
            tool_avg_surface_roughness, tool_thermal_conductivity,
            lubricant_name, lubricant_thickness, lubricant_conductivity,
            create_file, target_directory
        )

        result_dict = {
            'hmax': result[0],
            'psf_matrix':
                {
                'x': result[1][0][:],
                'y': result[1][1][:], #added *result[0]/100. now removed (07/02/2021)
                },
            'labels': {
                'x': 'Contact Pressure, MPa',  # added this as a makeshift
                'y': 'Heat transfer scaling factor, with HTC to Tool {:.2f} kW/m{}K'.format(result[0]/100,'\u00B2')
            },
            'forming_condition_string': result[2],
            'psf_matrix_xml': result[3]
        }

        return result_dict

    def _write_calibrated_constant(self, hmax, forming_condition_string, target_directory):
        write_calibrated_constant(hmax, forming_condition_string, target_directory)

        return None

    def _write_pressure_scaling_factor(self, A, forming_condition_string, target_directory):
        write_pressure_scaling_factor(A, forming_condition_string, target_directory)

        return None

def ihtc(blank_name, blank_density_490_degc,
    blank_thermal_conductivity_490_degc, blank_thickness,
    blank_specific_heat_capacity_490_degc,
    blank_avg_surface_roughness, blank_temperature, tool_name,
    tool_avg_surface_roughness, tool_thermal_conductivity,
    lubricant_name, lubricant_thickness, lubricant_conductivity,
    create_file, target_directory):


    coating_name='WCC'
    coating_thickness=28
    coating_conductivity=0.2
    # Because in the form the units are in micrometers and nanometers it must be converted
    # to m to be compatible with ihtc
    blank_avg_surface_roughness = blank_avg_surface_roughness / (10 ** 9)
    tool_avg_surface_roughness = tool_avg_surface_roughness / (10 ** 9)
    lubricant_thickness = lubricant_thickness / (10 ** 6)
    coating_thickness = coating_thickness / (10 ** 6)

    sigmaus = 48.98
    Qsigma = 14031.435
    sigma0 = 6.059334648
    ha = 1.4
    m = 0.641
    n = 0.556
    b0 = 1.684721048
    Qb = -1730.2251
    lambda_ = 5
    omega = 4.2e-5
    gamma_l = 1.5e+5
    beta = 8.3e+03
    A = 5e-4
    theta_rs_less_than_rt = 20.5
    theta_otherwise = 69.5
    ### Initialisation ###
    P = np.concatenate(([0.0, 5.0], np.linspace(10.0, 100.0, num=10), np.linspace(120.0,180.0,num=3),[200.0,250.0]))
    R = 8.314

    blank_thickness = float(blank_thickness)
    blank_temperature_kelvin = float(blank_temperature) + 273

    ### 1. Use values determined from blank temperature ###
    sigmau = sigma0 * math.exp ( ( Qsigma ) / ( R * blank_temperature_kelvin ) )
    sigmau535 = sigma0 * math.exp ( ( Qsigma ) / ( R * (535 + 273) ) )
    f = sigmaus / sigmau535

    ### 2. Use values determined by blank thickness ###
    L = ( m * math.log(blank_thickness) ) + n
    B = b0 * 1000 * math.exp ( ( Qb ) / ( R * blank_temperature_kelvin ) )
    alpha = B * ( ( blank_thermal_conductivity_490_degc ) / ( blank_density_490_degc * blank_specific_heat_capacity_490_degc ) )

    ### 3. Use values determined by tool material ###
    K_st = 2 / ( ( 1 / blank_thermal_conductivity_490_degc ) + ( 1 / tool_thermal_conductivity ))

    if blank_avg_surface_roughness < tool_avg_surface_roughness:
        theta = theta_rs_less_than_rt
    else:
        theta = theta_otherwise

    R_st = math.sin(math.radians(theta)) * math.sqrt ( ( blank_avg_surface_roughness ** 2) + ( tool_avg_surface_roughness ** 2) )
    N_p = 1 - ( np.exp ( -lambda_ * ( P ) / ( f * sigmau ) ) )
    hs = alpha * ( K_st / R_st ) * N_p * L

    ### 4. Use values determined by lubricant ###
    Ndelta = 1 - ( np.exp ( - gamma_l * lubricant_thickness ) )
    K_slt = 3 / ( ( 1 / blank_thermal_conductivity_490_degc ) + ( 1 / lubricant_conductivity ) + ( 1 / tool_thermal_conductivity ) )
    hl = omega * ( K_slt / R_st ) * Ndelta

    ### 5. Use values determined by tool coating ###
    hc = beta * ( ( blank_thermal_conductivity_490_degc * math.log ( coating_conductivity / tool_thermal_conductivity )  ) / A ) * math.tan(math.radians(theta)) * coating_thickness * N_p

    ### 6. Calculate overall IHTC ###
    h = ha + hs + hl + hc

    hmax = max(h)

    scale = np.round(h/hmax, 2)
    scount = 1
    for si in ( range (0, len(h)-1 ) ):
        if scale [si+1] > scale [si]:
            scount = scount + 1

    psf_matrix = np.stack((P[0:scount], scale[0:scount]), axis=0)

    # Create filename strings
    forming_condition_string = f'{blank_name}_{blank_temperature}_{blank_thickness}_{tool_name}_{lubricant_name}_{coating_name}'

    if bool(create_file) == True:
        write_calibrated_constant(hmax, forming_condition_string, target_directory)
        write_pressure_scaling_factor(psf_matrix, forming_condition_string, target_directory)

    psf_matrix_xml = create_psf_xml_string(psf_matrix)

    return hmax, psf_matrix, forming_condition_string, psf_matrix_xml

def write_calibrated_constant(hmax, forming_condition_string, target_directory):
    """ Writes the calibrated constant to a .txt file """
    if bool(target_directory):
        target_directory = Path(target_directory)
    else:
        target_directory = Path('.')

    file_path = target_directory.joinpath(f'{forming_condition_string}_Constant_Set_Autoform.txt')

    with open(file_path, 'w') as file:
        file.write("%.3f" % hmax)
    file.close()

    print_saving_file_text(file_path)

def write_pressure_scaling_factor(A, forming_condition_string, target_directory):
    """ Writes the pressure dependent scaling factors to a .psf file """
    if bool(target_directory):
        target_directory = Path(target_directory)
    else:
        target_directory = Path('.')

    file_path = target_directory.joinpath(f'{forming_condition_string}_pressure_dependent_IHTC.psf')

    with open(file_path, 'w') as file:
        file.write ("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?>\n<PressureDependentScalingFactors>\n\n")
        for index_value in range(len( np.transpose(A) ) ):
            file.write ("  <PressureDependentScalingFactor Pressure=\"%d\" ScalingFactor=\"%4.2f\"/>\n\n" % ( (A[0,index_value]), (A[1,index_value]) ) )
        file.write ("</PressureDependentScalingFactors>\n")
    file.close()

    print_saving_file_text(file_path)

def create_psf_xml_string(psf_matrix):
    """ Creates the psf xml string """
    psf_matrix_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?>\n<PressureDependentScalingFactors>\n\n"
    for index_value in range(len( np.transpose(psf_matrix) ) ):
        psf_matrix_xml = psf_matrix_xml + "  <PressureDependentScalingFactor Pressure=\"%d\" ScalingFactor=\"%4.2f\"/>\n\n" % ( (psf_matrix[0,index_value]), (psf_matrix[1,index_value]) )
    psf_matrix_xml = psf_matrix_xml + "</PressureDependentScalingFactors>\n"

    return psf_matrix_xml
