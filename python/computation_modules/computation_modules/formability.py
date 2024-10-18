"""
=============================
Module: formability (post-fe)
=============================

This module contains functions for the post-fe module formability which is
used to determine whether a material fails. This uses the MK-Hosford model.

"""
import re
import time
import pandas as pd
import numpy as np
import scipy.io as sio
from numpy.lib.npyio import NpzFile
from numba import jit, prange, threading_layer, float32, float64, int32
from numba import config as numba_config
from pathlib import Path
import numpy as np

# Any issues with pylance not detecting imports, refer to this:
# https://github.com/microsoft/pylance-release/blob/main/TROUBLESHOOTING.md#unresolved-import-warnings
from .utils import print_formatted_header, print_saving_file_text
from .abstract_modules import AbstractModulePostFe
from .plotting_functions import PlotlyPlotter

# Use the workqueue instead of omp threading layer (Causes issues on Github Workflows)
numba_config.THREADING_LAYER = 'workqueue'

class Formability(AbstractModulePostFe):

    def run(self, data_files, data_preparer,
        formability_total_stroke, formability_stamping_speed,
        formability_blank_material, formability_cut_off_strain,
        target_directory=None, create_file=False, **kwargs):

        # You should normally always run post_initialise for post_fe,
        # unless a specialised method needs to be implemented by the user
        data_file_objects, model_name = self.post_initialise(
            data_preparer=data_preparer,
            data_files=data_files,
            create_file=create_file,
            target_directory=target_directory
        )

        if formability_blank_material.lower() == "aa6082":
            R1 = 0.69
            R2 = 0.73
            K_0 = 2.685589
            Q_K = 16232.75
            k_0 = 0.141961413
            Q_k = 11703.8
            B_0 = 0.0740511
            Q_B = 31048.65
            C_0 = 0.00267
            Q_C = 4141.205
            E_0 = 18840.278
            Q_E = 5865.0
            n_0 = 3.007172
            Q_n = 5876.832
            A = 14
            a = 6
            n2 = 5
            f0 = 0.995
        else:
            # This should not happen
            raise Exception("Invalid Material")

        total_stroke = formability_total_stroke
        stamping_speed = formability_stamping_speed
        cut_off_strain = formability_cut_off_strain

        for data_file_object in data_file_objects:
            if (data_file_object.filename.endswith(".npz") and isinstance(data_file_object.data, dict)) or (isinstance(data_file_object.data, NpzFile)):
                if data_file_object.stage_name == 'forming':
                    forming_data_contents = data_file_object.data

        elements_failure_points = formability_main(model_name, total_stroke, stamping_speed, cut_off_strain,
                 forming_data_contents, f0, R1, R2, K_0, Q_K, k_0, Q_k, B_0,
                 Q_B, C_0, Q_C, E_0, Q_E, n_0, Q_n, A, a, n2,
                 target_directory=None, create_file=False)

        plotter = PlotlyPlotter()
        fig_asdict = plotter.get_3d_json(forming_data_contents, np.amax(elements_failure_points, axis=1), title='Smartforming Displayer: Formability prediction')

        elements_failure_points_formatted = elements_failure_points.tolist()
        elements_failure_points_formatted.insert(0, ['element_failure_point1A', 'element_failure_point2A'])

        return {
            'files': [
                {'filename': f'{model_name}_formability_failure_points.csv', 'data': elements_failure_points_formatted}
            ],
            'figures': [
                {'figurename': model_name + '_formability_figure_1', 'figure': fig_asdict}
            ]
        }

def formability_main(model_name, total_stroke, stamping_speed, cut_off_strain,
                 forming_data_contents, f0, R1, R2, K_0, Q_K, k_0, Q_k, B_0,
                 Q_B, C_0, Q_C, E_0, Q_E, n_0, Q_n, A, a, n2,
                 target_directory=None, create_file=False):
    """ Formability

    Parameters
    ----------
    model_name : str
        Name of the simulation model file.
    total_stroke : Union(float, int)
        Total stroke in mm.
    stamping_speed : Union(float, int)
        Stamping speed in mm/s.
    cut_off_strain : Union(float, int)
        Strain above which the result will not be computed for.
    forming_data_contents : Union(dict | np.NpzFile)
        A dict or NpzFile containing the data for the forming stage.
    ...
    target_directory : str
        Directory which the data should be output to (if one is created).
        If target_directory set to None default directory is set to
        current directory.
    create_file : bool
        Flag to indicate whether an output file should be created.

    Returns
    -------
    np.array
        Numpy array with results from using the MK Hosford Model.

    """
    print_formatted_header(f"{__file__}")
    print(f'model_name: {model_name}')
    print(f'total_stroke: {total_stroke} mm')
    print(f'stamping_speed: {stamping_speed} mm/s')
    print(f'cut_off_strain: {cut_off_strain}')
    print(f'create_file: {create_file}')

    if target_directory == None:
        # If user doesn't set target_directory, the output will be saved in the current folder.
        # It will also assume the data is stored in the current folder if that information is
        #   required. This is not always required as something the user will send the data
        #   in the ConfigStageDataFile.
        target_directory = Path('.')
    else:
        target_directory = Path(target_directory)

    if not bool(forming_data_contents):
        # If there is no data, it needs to be loaded.
        # It uses the default target directory of the current folder.
        print('No data found, loading forming data from target directory')
        forming_data_contents = np.load(target_directory.joinpath(f'{model_name}_variables.npz'))
    elif isinstance(forming_data_contents, np.lib.npyio.NpzFile):
        pass
    elif isinstance(forming_data_contents, dict):
        pass
    else:
        raise Exception('An invalid type was used for forming data contents!')

    output = initialisations(forming_data_contents, total_stroke, stamping_speed, R1, R2)
    state_matrix, number_of_elements, time_FE, stamping_time, alphaB_jump, Rx = output

    failure_points_savepath = target_directory.joinpath(f'{model_name}_formability_failure_points.csv')

    number_of_loops = 1
    times_elapsed = np.zeros(number_of_loops)
    elements_failure_points = np.zeros((number_of_elements, 2))
    for i in range(number_of_loops):
        t0 = time.time()

        elements_failure_points = parallel_loop(number_of_elements, state_matrix, time_FE, alphaB_jump, cut_off_strain, stamping_time, R1, R2, Rx, K_0, Q_K, k_0, Q_k, B_0, Q_B, C_0, Q_C, E_0, Q_E, n_0, Q_n, A, a, n2)

        times_elapsed[i] = time.time() - t0

    if create_file is True:
        print_saving_file_text(failure_points_savepath)
        np.savetxt(failure_points_savepath, elements_failure_points, delimiter=',')

    elements_failure_points[elements_failure_points > 10] = 10
    print(f'avg_time_elapsed: {np.average(times_elapsed)} seconds')

    # np.savetxt('rewuifhsduifuis.csv', elements_failure_points, delimiter=',')
    return elements_failure_points

def initialisations(forming_data_contents, total_stroke, stamping_speed, R1, R2):
    """ Load all the required variables and do the preprocessing and initial steps """

    # Number of states is stored in the dict/NpzFile.
    # Get the first data step as a sample to get the number of elements.
    number_of_states = forming_data_contents['number_of_output_stages']
    number_of_elements = forming_data_contents[forming_data_contents['sorted_data_steps'][0]].shape[0]

    state_matrix = np.ones((number_of_elements, number_of_states, 4))

    Rx = R1*R2

    coeff = np.array([R1+Rx, -5*Rx, 10*Rx, -10*Rx, 5*Rx, -Rx], dtype=np.complex128)
    roots = np.roots(coeff)
    roots = roots - np.polyval(coeff,roots)/np.polyval(np.polyder(coeff),roots); #Newton method polishing of roots
    imaginaries = np.imag(roots)
    smallest_im = abs(imaginaries).min()

    ### RETURN NUMBER 1
    alphaB_jump = roots[abs(np.imag(roots)) == smallest_im].real.item()

    # Populate state matrix
    ### RETURN NUMBER 2, 3, 4
    sorted_data_steps = forming_data_contents['sorted_data_steps']
    for i in range(number_of_states):

        # Shape minor_FE, major_FE, etc shape: 8251,
        # Squeeze to get that shape from (8251, 1)
        minor_FE = forming_data_contents[sorted_data_steps[i]][:, 5]
        major_FE = forming_data_contents[sorted_data_steps[i]][:, 4]
        temperature_FE = forming_data_contents[sorted_data_steps[i]][:, 6]
        element_number = forming_data_contents[sorted_data_steps[i]][:, 0]

        # major FE is 1st level. Both are 1D arrays (e.g. (8251, ))
        # Stage matrix shape: 8251, 13, 4
        state_matrix[:, i, 0] = state_matrix[:, i, 0] * major_FE

        # minor FE is 2nd level
        state_matrix[:, i, 1] = state_matrix[:, i, 1] * minor_FE

        # temperature is 3rd level
        state_matrix[:, i, 2] = state_matrix[:, i, 2] * temperature_FE

        # element number is last level
        state_matrix[:, i, 3] = state_matrix[:, i, 3] * element_number

    # Create time_FE array (I CHANGED TO LINSPACE HERE!! NOTE ITS DIFFERENT)
    stamping_time = total_stroke/stamping_speed
    time_FE = np.linspace(0, stamping_time, number_of_states)

    # First do the swapping
    ### FOR EACH STATE
    # Switch around strains if necessary (minor and major are 0 and 1)
    t0 = time.perf_counter()
    for element_num in range(number_of_elements):
        for state in range(number_of_states):
            major = state_matrix[element_num, state, 0]
            minor = state_matrix[element_num, state, 1]
            minimum = -(major + minor)

            # Sort in descending order
            A_ = np.array([major, minor, minimum])
            B_ = np.sort(A_)[::-1]

            # Set the major values & minor values accordingly
            state_matrix[element_num, state, 0] = B_[0]
            state_matrix[element_num, state, 1] = B_[1]

    # Returns 6 items
    return (state_matrix, number_of_elements, time_FE, stamping_time, alphaB_jump, Rx)

@jit(nopython=True, fastmath=True, parallel=True)
def parallel_loop(number_of_elements, state_matrix, time_FE, alphaB_jump, cut_off_strain, stamping_time, R1, R2, Rx, K_0, Q_K, k_0, Q_k, B_0, Q_B, C_0, Q_C, E_0, Q_E, n_0, Q_n, A, a, n2):
    # This is the parallel loop for AA6082 formability module
    elements_failure_points = np.zeros((number_of_elements, 2))

    # prange is range specific to numba parallel computing
    for element_num in prange(number_of_elements):
        # print(element_num)

        element_failure_point1A, element_failure_point2A = formability(element_num, state_matrix, time_FE, alphaB_jump, cut_off_strain, stamping_time, R1, R2, Rx, K_0, Q_K, k_0, Q_k, B_0, Q_B, C_0, Q_C, E_0, Q_E, n_0, Q_n, A, a, n2)

        if element_failure_point1A != 0:
            print(element_failure_point1A, element_failure_point2A)
            elements_failure_points[element_num, 0] = element_failure_point1A
            elements_failure_points[element_num, 1] = element_failure_point2A

    return elements_failure_points

def find_nearest(array, value):
    array = np.asarray(array)
    idx = (np.abs(array-value)).argmin()
    return array[idx]

@jit(nopython=True, fastmath=True)
def evaluate_condition(alphaB0, R1, R2, a, f0, PSB, E, strainB, stress1A, strain3A, strain3B, delta_strain2B):
    f1 = (f0*np.exp(strain3B+(-(R2+R1*alphaB0**(a-1))/(R1*alphaB0**(a-1)-R1*R2*(1-alphaB0)**(a-1)))*delta_strain2B-strain3A))
    phiB1 = (1/(((R2+R1*alphaB0**a+(1-alphaB0)**a*R2*R1)/(R2*(R1+1)))**(1/a)))
    delta_strainB = delta_strain2B*((R2*(1+R1))/(R1*alphaB0**(a-1)-R1*R2*(1-alphaB0)**(a-1)))*(((R2+R1*alphaB0**a+R2*R1*(1-alphaB0)**a)/(R2*(R1+1)))**((a-1)/a))
    stressB = E*((strainB+delta_strainB)-PSB)
    return f1*phiB1*stressB-stress1A

@jit(nopython=True, fastmath=True)
def evaluate_parameters(alphaB0, R1, R2, a, f0, PSB, E, strainB, stress1A, strain3A, strain3B, delta_strain2B):
    f1 = (f0*np.exp(strain3B+(-(R2+R1*alphaB0**(a-1))/(R1*alphaB0**(a-1)-R1*R2*(1-alphaB0)**(a-1)))*delta_strain2B-strain3A))
    phiB1 = (1/(((R2+R1*alphaB0**a+(1-alphaB0)**a*R2*R1)/(R2*(R1+1)))**(1/a)))
    delta_strainB = delta_strain2B*((R2*(1+R1))/(R1*alphaB0**(a-1)-R1*R2*(1-alphaB0)**(a-1)))*(((R2+R1*alphaB0**a+R2*R1*(1-alphaB0)**a)/(R2*(R1+1)))**((a-1)/a))
    stressB = E*((strainB+delta_strainB)-PSB)
    return stressB

@jit(nopython=True, fastmath=True)
def same_sign(a, b):
    return a * b > 0

@jit(nopython=True, fastmath=True)
def bisection_method_v2(alphaB1, alphaB2, R1, R2, a, f0, PSB, E, strainB, stress1A, strain3A, strain3B, delta_strain2B, tol=0.00001):

    assert not same_sign(evaluate_condition(alphaB1, R1, R2, a, f0, PSB, E, strainB, stress1A, strain3A, strain3B, delta_strain2B),
                         evaluate_condition(alphaB2, R1, R2, a, f0, PSB, E, strainB, stress1A, strain3A, strain3B, delta_strain2B))

    eval_mid = 1
    failed_calculation = 0
    z = 0

    # alphaB1 is low, alphaB2 is high
    midpoint = (alphaB1 + alphaB2)/2
    while abs(eval_mid) > tol:
        midpoint = (alphaB1 + alphaB2)/2

        eval_lower = evaluate_condition(alphaB1, R1, R2, a, f0, PSB, E, strainB, stress1A, strain3A, strain3B, delta_strain2B)
        eval_upper = evaluate_condition(alphaB2, R1, R2, a, f0, PSB, E, strainB, stress1A, strain3A, strain3B, delta_strain2B)
        eval_mid = evaluate_condition(midpoint, R1, R2, a, f0, PSB, E, strainB, stress1A, strain3A, strain3B, delta_strain2B)

        if same_sign(eval_lower, eval_mid):
            alphaB1 = midpoint
        else:
            alphaB2 = midpoint

        if eval_lower<0 and eval_upper<0 and eval_mid<0:
            alphaB1 = alphaB1-0.000001*z
            alphaB2 = alphaB2+0.000001*z
            z = z+1

        elif eval_lower>0 and eval_upper>0 and eval_mid>0:
            alphaB1 = alphaB1-0.000001*z
            alphaB2 = alphaB2+0.000001*z
            z = z+1

        elif eval_lower==eval_upper or eval_upper==eval_mid:
            alphaB1 = alphaB1-0.000001*z
            alphaB2 = alphaB2+0.000001*z
            z = z+1

    stressB = evaluate_parameters(midpoint, R1, R2, a, f0, PSB, E, strainB, stress1A, strain3A, strain3B, delta_strain2B)

    return midpoint, failed_calculation, stressB

@jit(nopython=True, fastmath=True)
def calculate_gradient_intercept(x_array, y_array):
    y_diff = y_array[1] - y_array[0]
    x_diff = x_array[1] - x_array[0]

    x_diff = np.diff(x_array).item()
    y_diff = np.diff(y_array).item()

    gradient = y_diff/x_diff
    intercept = y_array[1].item() - gradient * x_array[1].item()

    return gradient, intercept

@jit(nopython=True, fastmath=True)
def formability(element_num, state_matrix, time_FE, alphaB_jump, cut_off_strain, stamping_time, R1, R2, Rx, K_0, Q_K, k_0, Q_k, B_0, Q_B, C_0, Q_C, E_0, Q_E, n_0, Q_n, A, a, n2):
    ### REMEMBER PYTHON STARTS AT THE ZERO INDEX ###

    if max(state_matrix[element_num, :, 0]) < cut_off_strain:
        return 0, 0

    # Create failure point variables
    element_failure_point1A = 0
    element_failure_point2A = 0

    ### FOR EACH ELEMENT ###

    # Initialise constitutive equation variables
    RA = 0
    rhoA = 0.000001
    rho_dotA = 0
    PSRateA = 0
    PSA = 0
    RB = 0
    rhoB = 0.000001
    rho_dotB = 0
    PSRateB = 0
    PSB = 0

    # Initialise strains
    strain1A = 0
    strain2A = 0
    strain3A = 0
    strain1B = 0
    strain2B = 0
    strain3B = 0
    strainA = 0
    strainB = 0
    strain1Bold = 0
    strain1Bnew = 0
    strain3Bold = 0
    strain3Bnew = 0

    # Initialise stresses
    stress1A = 0
    stress2A = 0
    stress3A = 0
    stress1B = 0
    stress2B = 0
    stress3B = 0
    stressA = 0
    stressB = 0


    delta_strain3B = 0
    delta_strain3A = 0
    delta_strain1B = 0
    delta_strain1A = 0

    # Initialise time and counters (i starts at 0 now because 0 index)
    dt = 5E-6
    t = dt

    ### BIG WHILE LOOP NUMBER 1
    while t<stamping_time and element_failure_point1A<10 and element_failure_point2A<10:

        # Note it doesnt take into account if it is equal to a state timestep
        upper_t_idx = min([idx for idx, element in enumerate((time_FE-t)>0) if element == True])
        lower_t_idx = max([idx for idx, element in enumerate((time_FE-t)<0) if element == True])

        upper_t = time_FE[upper_t_idx]
        lower_t = time_FE[lower_t_idx]
        times = np.array([lower_t, upper_t])

        # Fit major strain
        major1 = state_matrix[element_num, lower_t_idx, 0]
        major2 = state_matrix[element_num, upper_t_idx, 0]
        major_strains = np.array([major1, major2])

        gradient_major, intercept_major = calculate_gradient_intercept(times, major_strains)

        # Fit minor strain
        minor1 = state_matrix[element_num, lower_t_idx, 1]
        minor2 = state_matrix[element_num, upper_t_idx, 1]
        minor_strains = np.array([minor1, minor2])

        gradient_minor, intercept_minor = calculate_gradient_intercept(times, minor_strains)

        # Fit temperature
        temp1 = state_matrix[element_num, lower_t_idx, 2]
        temp2 = state_matrix[element_num, upper_t_idx, 2]
        temps = np.array([temp1, temp2])

        gradient_temp, intercept_temp = calculate_gradient_intercept(times, temps)

        # Reset value of a in Hosford equation
        t=t+dt

        element_failure_point1A = 0
        element_failure_point2A = 0

        while t<=upper_t and element_failure_point1A<10 and element_failure_point2A<10:
            # print(upper_t)
            # Get the interpolated temperature and strain rate
            T = gradient_temp * t + intercept_temp + 273
            SR = gradient_major

            # Avoid zero or negative values of strain rate
            if SR <= 0:
                SR = 0.01

            # Calculate delta_betaA value (ratio minor to major)
            delta_major = gradient_major*dt
            delta_minor = gradient_minor*dt
            delta_betaA = delta_minor/delta_major
            if delta_betaA == 0:
                delta_betaA_zero = 1
                failed_calculation = 1
                # Crash if this happens
                return None

            # Prevent betaA from becoming too small or too large
            # Added elif instead of if to improve efficiency
            if delta_betaA < -0.5:
                delta_betaA = -0.5
            elif delta_betaA > 1:
                delta_betaA = 1
            elif delta_betaA == 0:
                delta_betaA_zero = 1
                failed_calculation = 1
                # Crash if this happens
                return None

            f0 = 0.995

            # Find alphaA (There was an alpha_roots at the start)
            RB = Rx*(1+delta_betaA)
            coeff2 = np.array([-RB-R1, 5*RB, -10*RB, 10*RB, -5*RB, RB+R2*delta_betaA], dtype=np.complex128)
            alpha_roots2 = np.roots(coeff2)

            imaginaries = alpha_roots2.imag

            idx = (np.abs(imaginaries)).argmin()
            alphaA = alpha_roots2[idx].real

            # Calculate the constants from temperatures (6 variable, 2 constant)
            R = 8.314
            K = K_0*np.exp(Q_K/R/T)
            k = k_0*np.exp(Q_k/R/T)
            B = B_0*np.exp(Q_B/R/T)
            C = C_0*np.exp(-Q_C/R/T)
            E = E_0*np.exp(Q_E/R/T)
            n = n_0*np.exp(Q_n/R/T)

            ####################### ZONE A #######################
            delta_strain1A = SR*dt
            strain1A = strain1A+delta_strain1A # strain in 1 direction
            delta_strain2A = delta_betaA*delta_strain1A
            strain2A = strain2A+delta_strain2A # strain in 2 direction
            delta_strain3A = -1*(delta_strain1A+delta_strain2A)
            strain3A = strain3A+delta_strain3A # strain in 3 direction

            # Calculate equivalent strain at anisotropic condition
            delta_strainA = delta_strain1A*R2*(R1+1)*(((R2+alphaA**a*R1+(1-alphaA)**a*R1*R2)/(R2*(R1+1)))**((a-1)/a))/(R2+R1*R2*(1-alphaA)**(a-1))
            strainA = strainA+delta_strainA

            # Calculate istropic hardening
            RA = B*(rhoA**0.5)

            # Calculate plastic strain rate
            T1 = stressA
            T2 = k+RA

            # Replace logic of PSRateA = (((T1-T2)/K)**n)*((T1-T2)>0)
            if T1-T2 > 0:
                PSRateA = (((T1-T2)/K)**n)
            else:
                PSRateA = 0

            # Calculate dislocation density rate
            T1 = A*(1-rhoA)*abs(PSRateA)
            T2 = C*(rhoA**n2)

            # Replace logic of
            if T1-T2 >0:
                rho_dotA = (T1-T2)
            else:
                rho_dotA = 0

            # Calculate new dislocation density
            rhoA = rhoA+rho_dotA*dt

            # Calculate new plastic strain
            PSA = PSA+PSRateA*dt

            # Calculate stress
            stressA = E*(strainA-PSA)

            # Calculate stress components
            phiA = 1/(((1/R2/(R1+1))*(R2+alphaA**a*R1+(1-alphaA)**a*R1*R2))**(1/a))
            stress1A = stressA*phiA
            stress2A = stress1A*alphaA
            stress3A = 0

            ####################### ZONE B #######################

            # Use compatibility for strain in 2 direction
            delta_strain2B = delta_strain2A
            strain2B = strain2B+delta_strain2B

            # How to set range for bisection method?
            if delta_betaA <= 0:
                alphaB1 = -0.5
                alphaB2 = alphaB_jump-0.0001
            else:
                alphaB1 = alphaB_jump+0.0001
                alphaB2 = 1.5

            # Start alphaB solution loop using bisection method
            no_convergence = 0

            alphaB, failed_calculation, stressB = bisection_method_v2(alphaB1, alphaB2, R1, R2, a, f0, PSB, E, strainB, stress1A, strain3A, strain3B, delta_strain2B)

            # Identify problem element and break loop if necessary
            if no_convergence > 0:
                failed_calculation = 1
                # Crash if this happens
                return None

            # Avoid negative values of alphaB
            if alphaB < 0:
                alphaB = 0

            # Calculate equivalent strain
            # f = f0*np.exp(strain3B+(-(R2+R1*alphaB**(a-1))/(R1*alphaB**(a-1)-R1*R2*((1-alphaB)**(a-1))))*delta_strain2B-strain3A)
            betaB = (R1*alphaB**(a-1)-R1*R2*(1-alphaB)**(a-1))/(R2+R1*R2*(1-alphaB)**(a-1))
            delta_strain1B= delta_strain2B/betaB
            strain1B = strain1B+delta_strain1B
            delta_strain3B = -delta_strain1B-delta_strain2B
            strain3B = strain3B+delta_strain3B
            delta_strainB = (delta_strain2B*((R2*(1+R1))/(R1*alphaB**(a-1)-R1*R2*(1-alphaB)**(a-1)))*(((R2+R1*alphaB**a+R1*R2*(1-alphaB)**a)/(R2*(R1+1))))**((a-1)/a))
            strainB = strainB+delta_strainB

            ### Calculate stress in Zone B ###

            # Calculate istropic hardening
            RB = B*(rhoB**0.5)

            # Calculate plastic strain rate
            T1 = stressB
            T2 = k+RB

            # Replace logic of PSRateB = (((T1-T2)/K)**n)*((T1-T2)>0)
            if T1-T2 > 0:
                PSRateB = (((T1-T2)/K)**n)
            else:
                PSRateB = 0

            # Calculate dislocation density rate
            T1 = A*(1-rhoB)*abs(PSRateB)
            T2 = C*(rhoB**n2)

            # Replace logic of rho_dotB = (T1-T2)*((T1-T2)>0)
            if T1-T2 >0:
                rho_dotB = (T1-T2)*((T1-T2)>0)
            else:
                rho_dotB = 0

            # Calculate new dislocation density
            rhoB = rhoB+rho_dotB*dt

            # Calculate new plastic strain
            PSB = PSB+PSRateB*dt

            # Calculate stress
            stressB = E*(strainB-PSB)

            #Calculate stress components
            stress1B = stressB/(((R2+alphaB**a*R1+(1-alphaB)**a*R1*R2)/(R2*(R1+1)))**(1/a))
            stress2B = stress1B*alphaB
            stress3B = 0

            # Calculate new ratio of strains
            element_failure_point1A = delta_strain3B/delta_strain3A
            element_failure_point2A = delta_strain1B/delta_strain1A

            t=t+dt

        element_failure_point1A = delta_strain3B/delta_strain3A
        element_failure_point2A = delta_strain1B/delta_strain1A

    return element_failure_point1A, element_failure_point2A
