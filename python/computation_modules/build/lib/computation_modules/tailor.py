"""
=============================
Module: tailor (post-fe)
=============================

This module contains functions for the post-fe module tailor which is
used to determine whether a material fails. This simulates an ageing process.

"""
import math
import time
from pathlib import Path
from scipy.spatial import Delaunay
import plotly.figure_factory as ff
import numpy as np
from numba import jit, prange

from .abstract_modules import AbstractModulePostFe
from .utils import print_saving_file_text
from .plotting_functions import PlotlyPlotter

class Tailor(AbstractModulePostFe):

    def __init__(self, **kwargs) -> None:
        pass

    def run(self, data_preparer, data_files, create_file, target_directory,
        blanking_material_name, blanking_length, blanking_width,
        blanking_thickness, heating_technology, heating_rate,
        heating_temperature, heating_time, transfer_1_time,
        transfer_1_temperature, press_technology, press_coating_thickness,
        press_lubricant_name, press_tool_name, press_stamping_speed,
        press_stamping_stroke, press_surface_roughness,
        press_lubricant_density, transfer_2_time, transfer_2_temperature,
        paint_bake_cycle_1_rate, paint_bake_cycle_1_temperature,
        paint_bake_cycle_1_time, **kwargs):
        # Optionally paint bake cycle increases in number
        # There has to be at least 1 cycle though

        total_stroke = press_stamping_stroke
        stamping_speed = press_stamping_speed
        artificial_ageing_temp = paint_bake_cycle_1_temperature
        artificial_ageing_time = paint_bake_cycle_1_time * 60       # Minutes to seconds

        data_file_objects, model_name = self.post_initialise(
            data_preparer=data_preparer,
            data_files=data_files,
            create_file=create_file,
            target_directory=target_directory
        )

        # This should be refactored for all post_fe models
        for data_file_object in data_file_objects:
            if (data_file_object.filename.endswith(".npz") and isinstance(data_file_object.data, dict)) or (isinstance(data_file_object.data, np.lib.npyio.NpzFile)):
                if data_file_object.stage_name == 'forming':
                    forming_data_contents = data_file_object.data

        constants = self.get_constants(blanking_material_name.lower())

        dislocation_density, hardness, hardness_modified = tailor(
            model_name, total_stroke, stamping_speed, artificial_ageing_temp,
            artificial_ageing_time, forming_data_contents, **constants)

        plotter = PlotlyPlotter()
        fig_asdict = plotter.get_3d_json(forming_data_contents, hardness, title='SmartForming Displayer: Post Form Hardness (HV)')

        tailor_results = np.concatenate((dislocation_density, hardness, hardness_modified), axis=1)
        tailor_results_formatted = tailor_results.tolist()

        tailor_results_formatted.insert(0, ['dislocation_density', 'hardness', 'hardness_modified'])

        # np.savez("server_results.npz", **forming_data_contents)
        return {
            'files': [
                {'filename': model_name + '_tailor_results.csv', 'data': tailor_results_formatted}
            ],
            'figures': [
                {'figurename': model_name + '_random_figure_1', 'figure': fig_asdict}
            ]
        }

    def get_constants(self, material_name):
        material_database = {
            'aa6082': {
                'Capital_K0': 2.69,
                'QCapital_K': 16232.75,
                'k0': 0.142,
                'Qk': 11703.8,
                'B0': 0.074,
                'QB': 31048.65,
                'Cp0': 2.67E-02,
                'QCp': 4141.21,
                'E0': 18840.28,
                'QE': 5865.05,
                'n0': 3.007,
                'Qn': 5876.83,

                # Temperature independent constants
                'R': 8.314,
                'A0': 14,
                'QA_dislocation': 0,
                'n2_dislocation': 5,

                # Initialise ageing constants based on the ageing temperature
                'stress_i': 15,
                'stress_q': 50,           # Unusused variable in initial code,
                'QA_hardness': 140,
                'Ts': 553,
                'Qs': 25,

                'C1': 0.00045,
                'C2': 380,
                'C3': 1345000,
                'C4': 0.0769,
                'Cs': 0.0263,

                'Ci': 0.025,
                'fmax': 0.00195,

                # Initialise constants in consideration of pre-straining
                'Ad': 17,
                'n2_hardness': 5,
                'C_ageing': 0.00045,
                'A1': 1,
                'A2': 1,
                'B1': 0.00000078,
                'B2': 0.00000000000015
                }
            }
        try:
            constants = material_database[material_name.lower()]
            return constants
        except ValueError:
            raise Exception("Invalid material")

def tailor(model_name, total_stroke, stamping_speed,
           artificial_ageing_temp, artificial_ageing_time,
           forming_data_contents, Capital_K0, QCapital_K, k0, Qk, B0,
           QB, Cp0, QCp, E0, QE, n0, Qn, R, A0, QA_dislocation, n2_dislocation,
           stress_i, stress_q, QA_hardness, Ts, Qs, C1, C2, C3, C4, Cs, Ci,
           fmax, Ad, n2_hardness, C_ageing, A1, A2, B1, B2, target_directory=None,
           create_file=False, **_kwargs):
    # NOTE: stress_q is unusued in the code but is in the initial matlab version

    # Only need forming data here! (fdata, noelements, numberofoutputstages)
    total_stroke = total_stroke
    stamping_speed = stamping_speed
    AA_temp = artificial_ageing_temp     # artificial ageing time (s), default 20 hours
    AA_time = artificial_ageing_time     # artificial ageing time (s), default 20 hours

    sorted_data_steps = forming_data_contents['sorted_data_steps']
    number_of_output_stages = forming_data_contents['number_of_output_stages']

    #  USER DEFINED
    element_number = forming_data_contents[sorted_data_steps[0]].shape[0]
    steps = number_of_output_stages

    #  INTERPOLATE MAJOR STRAIN, MINOR STRAIN, TEMPERATURE AGAINST TIME
    #  CALCULATE DISLOCATION DENSITY
    dislocation_density = np.zeros((element_number, 1)) # intialize dislocation density

    # Create a state matrix
    state_matrix = np.ones((element_number, number_of_output_stages, 4))
    for i in range(number_of_output_stages):

        # Shape minor_FE, major_FE, etc shape: 8251,
        # Squeeze to get that shape from (8251, 1)
        minor_FE = forming_data_contents[sorted_data_steps[i]][:, 5]        # strain 2 = minor
        major_FE = forming_data_contents[sorted_data_steps[i]][:, 4]        # strain 1 = major
        temperature_FE = forming_data_contents[sorted_data_steps[i]][:, 6]

        # major FE is 1st level. Both are 1D arrays (e.g. (8251, ))
        # Stage matrix shape: 8251, 13, 3
        state_matrix[:, i, 0] = state_matrix[:, i, 0] * major_FE

        # minor FE is 2nd level
        state_matrix[:, i, 1] = state_matrix[:, i, 1] * minor_FE

        # temperature is 3rd level
        state_matrix[:, i, 2] = state_matrix[:, i, 2] * temperature_FE

    print('First calculation loop')
    t0 = time.perf_counter()
    dislocation_density = first_loop(total_stroke, stamping_speed, element_number, int(steps), state_matrix, Capital_K0,
        QCapital_K, R, k0, Qk, B0, QB, Cp0, QCp, E0, QE, n0, Qn, A0, QA_dislocation,
        n2_dislocation, dislocation_density)
    t1 = time.perf_counter()
    print(f'Time elapsed: {t1-t0}')

    # POST-FORM STRENGTH PREDICTION BASED ON THE PRE-STRAINING EFFECT
    T_ageing = AA_temp+273

    # Compute tp, Ce, fe and define material constants during ageing
    tp = T_ageing*np.exp(12653/T_ageing-24.475)
    time_constant = 0.5*tp
    Ce = Cs*np.exp(-Qs*1000/R*(1/T_ageing-1/Ts))
    fe = fmax*(Cs-Ce)/Cs

    dt_ageing = 10 # time interval

    print('Second calculation loop')
    t0 = time.perf_counter()
    hardness, hardness_modified = second_loop(element_number, dislocation_density,
        AA_time, dt_ageing, C_ageing, n2_hardness, Ad, A1, A2, Ce, Ci,
        time_constant, B1, fe, B2, C1, QA_hardness, T_ageing, C3, C4, C2,
        stress_i)
    t1 = time.perf_counter()
    print(f'Time elapsed: {t1-t0}')
    # np.savetxt("foo_numba.csv", hardness, delimiter=",")

    output_dict = {'hardness': hardness, 'hardness_modified': hardness_modified, 'dislocation_density': dislocation_density}

    if bool(create_file):
        filename = f'{model_name}_postformstrength.npz'
        target_path = Path(target_directory).joinpath(filename).absolute()
        print_saving_file_text(target_path)
        np.savez(target_path, **output_dict)

    return dislocation_density, hardness, hardness_modified

@jit(nopython=True, parallel=True)
def first_loop(total_stroke, stamping_speed, element_number, steps, state_matrix, Capital_K0,
    QCapital_K, R, k0, Qk, B0, QB, Cp0, QCp, E0, QE, n0, Qn, A0, QA_dislocation,
    n2_dislocation, dislocation_density):
    """ First loop """
    # First calculation loop (Loop through each element here)
    for ii in prange(element_number):
        dt_forming = 0.00001                        # time step for forming
        time = np.zeros((1,steps + 1))              # initialize time matrix
        temp = np.zeros((1,steps + 1))              # initialize temperature matrix
        temp[0,0] = 350                             # Initial temperature of sheet during heating
        strain1 = np.zeros((1,steps + 1))           # intialize strain matrix
        strain2 = np.zeros((1,steps + 1))
        strain3 = np.zeros((1,steps + 1))
        strain_equivalent = np.zeros((1,steps + 1))
        strainrate = np.zeros((1,steps))          # one less strain rate value than strain

        # Initialise variables of constitutive equations
        stress = 0
        et = 0
        ep = 0
        stress_dis = 0
        ro = 0
        dro = 0
        dep = 0

        # Cycle through each step which has already been arranged in ascending order
        for i in prange(steps):
            #  Load values of major strain, minor strain, time and temperature for the
            #  chosen element
            strain1[0, i+1] = state_matrix[ii, i, 0]     # major strain
            strain2[0, i+1] = state_matrix[ii, i, 1]     # minor strain
            temp[0, i+1] = state_matrix[ii, i, 2]        # temperature
            time[0, i+1] = (total_stroke/stamping_speed/steps)*(i+1)

        step_internal = math.floor((time[0, 1]-time[0, 0])/dt_forming) # all time steps are constant
        time_fit = np.zeros((steps, step_internal))
        temp_fit = np.zeros((steps, step_internal))

        for i in prange(steps):
            # Compute strain rate according to the delta_strain
            # in each i loop, strain rate is constant
            delta_strain1 = strain1[0, i+1] - strain1[0, i]
            delta_strain2 = strain2[0, i+1] - strain2[0, i]
            delta_strain3 = 0 - delta_strain1 - delta_strain2
            strain3[0, i+1] = strain3[0, i] + delta_strain3
            strain_equivalent[0, i+1] = math.sqrt(2/9*((strain1[0, i+1]-strain2[0, i+1]) ** 2+(strain1[0, i+1]-strain3[0, i+1]) ** 2+(strain2[0, i+1]-strain3[0, i+1]) ** 2))

            # Compute strain rate and set strain rate as 0 if SR<0
            strainrate[0, i] = (strain_equivalent[0, i+1]-strain_equivalent[0, i])/(time[0, i+1]-time[0, i])
            if strainrate[0, i] < 0:
                strainrate[0, i] = 0

            # Get the points in the time and temperature range (interpolation)
            time_fit[i, :] = np.linspace(time[0, i], time[0, i+1], step_internal)
            temp_fit[i, :] = np.linspace(temp[0, i], temp[0, i+1], step_internal)
            # print(time_fit.shape)
            for j in prange(step_internal):
                # Iterative computations of constitutive equations
                # Compute material constants according to the temperature
                temperature = temp_fit[i, j]
                K = Capital_K0 * np.exp(QCapital_K/R/(temperature+273))
                k = k0 * np.exp(Qk/R/(temperature+273))
                B = B0 * np.exp(QB/R/(temperature+273))
                Cp = Cp0 * np.exp(-QCp/R/(temperature+273))
                E = E0 * np.exp(QE/R/(temperature+273))
                n1 = n0 * np.exp(Qn/R/(temperature+273))
                A = A0 * np.exp(QA_dislocation/R/(temperature+273))

                # Compute total strain (constant SR)
                et = et + strainrate[0, i] * dt_forming
                stress = E * (et-ep)
                # if SR<0, set it as 0
                if (stress-stress_dis-k) < 0:
                    dep = 0
                else:
                    dep = ((stress-stress_dis-k)/K) ** n1

                ep = ep+dep*dt_forming
                stress_dis = B*ro ** 0.5
                dro = A*(1-ro)*dep-Cp*ro ** n2_dislocation
                ro = ro+dro*dt_forming

        # Define the value of dislocation density for each element
        dislocation_density[ii,0] = ro

    return dislocation_density


@jit(nopython=True)
def second_loop(element_number, dislocation_density, AA_time, dt_ageing,
    C_ageing, n2_hardness, Ad, A1, A2, Ce, Ci, time_constant, B1, fe, B2, C1,
    QA_hardness, T_ageing, C3, C4, C2, stress_i):
    """ Second loop """
    R = 8.314
    hardness = np.zeros((element_number, 1))
    hardness_modified = np.zeros((element_number, 1))
    for ii in range(element_number):
        # Set up initial value of ageing for each element
        r = 0
        Ct = 0.025
        ft = 0
        ro = dislocation_density[ii,0]

        # Setting them to 0 so linting errors aren't caused (vscode)
        # They should be overwritten in the below for loop
        stress_ss = 0
        stress_ppt = 0
        stress_dis = 0
        for t_ageing in range(0, AA_time, dt_ageing):
            dro = -C_ageing*ro ** n2_hardness
            if dro>0:
                ro = ro
            else:
                ro = ro+dro*dt_ageing

            stress_dis = Ad*ro ** 0.5
            dCt = A1*((Ce-Ci)/time_constant*np.exp(-t_ageing/time_constant))+B1*ro
            Ct = Ct+dCt*dt_ageing
            dft = -(fe/(Ci-Ce))*dCt
            ft = ft+dft*dt_ageing

            #to avoid dr is infinity when t = 0
            if t_ageing == 0:
                dr = B2*ro
            else:
                dr = C1*A2/3*((np.exp(-QA_hardness*1000/R/T_ageing))/T_ageing) ** (1/3)*t_ageing ** (-2/3)+B2*ro
                r = r+dr*dt_ageing

            #to avoid r = 0, resulting stress_A or stress_B = complex number
            if  r <= 0 or ft <= 0:
                stress_A = 0
                stress_B = 0
                stress_ppt = 0
            else:
                stress_A = C3*ft ** 0.5*(r/C1) ** 0.5
                stress_B = C4*ft ** 0.5*(r/C1) ** (-1)
                stress_ppt = 1/(1/stress_A+1/stress_B)

            stress_ss = C2*Ct ** (2/3)

        hardness[ii, 0] = stress_i + stress_ss + stress_ppt + stress_dis
        hardness_modified[ii, 0] = hardness[ii,0] / 1.067 #1.092 1.11  #126

    return hardness, hardness_modified
