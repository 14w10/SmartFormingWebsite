"""
=====================================
Module: autoformdata (pre-processing)
=====================================

This module contains functions for pre-processing of autoform data before
it is used by the other functional modules.

Useful link for this process to ensure correct outputs:
https://stackoverflow.com/questions/32527861/python-unit-test-that-uses-an-external-data-file

"""
import numpy as np
from pathlib import Path
import pandas as pd
import re

from .utils import print_saving_file_text
from .abstract_modules import AbstractModuleDataPreparer
from .data_file_objects import StagePairedDataFiles, StageDataFile


class Autoformdata(AbstractModuleDataPreparer):

    npz_filename_pattern = fr'(.+)?_(quenching|variables).npz'
    npz_filename_pattern_matcher = re.compile(npz_filename_pattern)

    csv_data_pattern = fr'(.+)?_(\w+-\d+)_(\d+)_(.*).csv'
    csv_data_pattern_matcher = re.compile(csv_data_pattern)

    csv_element_node_pattern = r'(.*)_(\w+-\d+)_(\d+)_Sheet_(ElementData|NodeData).csv'
    csv_element_node_matcher = re.compile(csv_element_node_pattern)

    def run(self, data_files, create_file, target_directory, **kwargs):
        """ Should return a dict with the parsed data. Input is a dictionary. """
        self.data_files = data_files
        self.create_file = create_file
        self.target_directory = target_directory
        self.csv_stage_filenames = None
        self.model_name = None
        self.paired_element_node_files = []
        self.element_node_files_matched_files_by_stage = {}
        self.shortcode_mappings = {'D-20': 'forming', 'D-30': 'quenching'}

        stage_processed_data_files = []
        if all([item.endswith('.csv') for item in data_files.keys()]):
            ### Steps for if there are csv files
            # Step 1: Only get the stage csv file files and filter the valid csv files
            self.set_csv_stage_filenames()

            # Step 2: Get the model name from csv files.
            # Also check that the csv files it recieves are from the same simulation model.
            self.check_set_model_name_csv()

            # Step 3: Match the stages (element and node data) from the csv files
            self.create_element_node_matched_files()

            # Step 4: Sort the files by timestep. Thi is a list
            self.paired_element_node_files.sort(key=self.timestep_num)

            # Step 5: Group the data as necessary (could be D-20, D-30).
            # This is a dict with the keys being the stage_name (i.e. forming, quenching)
            self.group_element_node_files_by_stage()

            for stage_name, stage_paired_data_files in self.element_node_files_matched_files_by_stage.items():
                output_filename, npz_data = autoformdata(
                    model_name=self.model_name,
                    stage_name=stage_name,
                    data_files=stage_paired_data_files,
                    target_directory=self.target_directory,
                    create_file=self.create_file
                )

                stage_processed_data_files.append(StageDataFile(filename=output_filename, data=npz_data, stage_name=stage_name))

        elif all([filename.endswith('.npz') for filename in data_files.keys()]):
            for filename in data_files.keys():
                # Get & set the model name (it will assume the standard naming style for .npz files)
                simulation_names = [self.npz_filename_pattern_matcher.match(str(f)).group(1) for f in data_files if self.npz_filename_pattern_matcher.match(str(f))]
                assert all(x == simulation_names[0] for x in simulation_names)

                self.model_name = simulation_names[0]

                # Stage name hardcoded for now, assuming that filename is either (.+)?_variables.npz or (.+)?_quenching.npz
                stage_name = self.npz_filename_pattern_matcher.match(filename).group(2)
                if stage_name == 'variables':
                    # If it uses variables in its name, it is forming data
                    stage_name = 'forming'
                stage_processed_data_files.append(StageDataFile(filename=filename, data=data_files[filename], stage_name=stage_name))
        else:
            raise Exception("Assumption that data files can only be either .csv or .npz only is not met")

        return {'data_files': stage_processed_data_files, 'model_name': self.model_name}

    def group_element_node_files_by_stage(self):
        # For each pair (they are already sorted so there is no need to worry about them being in the wrong order)
        for paired_data_file in self.paired_element_node_files:
            if self.element_node_files_matched_files_by_stage.get(paired_data_file.stage_name) is None:
                self.element_node_files_matched_files_by_stage[paired_data_file.stage_name] = []
                self.element_node_files_matched_files_by_stage[paired_data_file.stage_name].append(paired_data_file)
            else:
                self.element_node_files_matched_files_by_stage[paired_data_file.stage_name].append(paired_data_file)

        # For each, get the stage_name
        # return a dict

    def set_csv_stage_filenames(self):
        csv_filenames = self.data_files.keys()
        csv_filename_data_matches = [self.csv_data_pattern_matcher.match(str(f)) for f in csv_filenames if self.csv_data_pattern_matcher.match(str(f))]

        self.csv_stage_filenames = [match.group(0) for match in csv_filename_data_matches]

    def create_element_node_matched_files(self):
        """ The stages will be matched based on filename """
        # Make a copy of the csv_stage_filenames to iterate over
        csv_stage_filenames = self.csv_stage_filenames.copy()
        # This while loop is necessary otherwise for some reason it can skip some files
        # This ensures that everything is matched
        while len(csv_stage_filenames) > 0:
            for potential_filename in csv_stage_filenames:
                input_match = self.csv_element_node_matcher.match(potential_filename)

                # If current one is element, the matching one is node. Vice versa.
                if input_match.group(4) == 'ElementData':
                    # result = re.sub(pattern, r'\4', data_type_pair[1])
                    matching_filename = rf'{input_match.group(1)}_{input_match.group(2)}_{input_match.group(3)}_Sheet_NodeData.csv'

                    # If anything goes wrong here it is because a file is missing its matching counterpart (e.g. element has node)
                    element_data_file = StageDataFile(filename=input_match.group(0), data=self.data_files[input_match.group(0)], dtype='ElementData')
                    node_data_file = StageDataFile(filename=matching_filename, data=self.data_files[matching_filename], dtype='NodeData')

                    csv_stage_filenames.remove(matching_filename)
                    csv_stage_filenames.remove(input_match.group(0))

                elif input_match.group(4) == 'NodeData':
                    # result = re.sub(input_match, r'\4', data_type_pair[0])
                    matching_filename = rf'{input_match.group(1)}_{input_match.group(2)}_{input_match.group(3)}_Sheet_ElementData.csv'

                    node_data_file = StageDataFile(filename=input_match.group(0), data=self.data_files[input_match.group(0)], dtype='NodeData')
                    element_data_file = StageDataFile(filename=matching_filename, data=self.data_files[matching_filename], dtype='ElementData')


                    csv_stage_filenames.remove(input_match.group(0))
                    csv_stage_filenames.remove(matching_filename)

                else:
                    # This actually should never happen as input data should only be valid filenames
                    # Its a useful exception to make sure that everything has a paired file
                    raise Exception('It should have NodeData or ElementData at the end of its name!')

                paired_element_node_file = StagePairedDataFiles(shortcode_mappings=self.shortcode_mappings, element_file=element_data_file, node_file=node_data_file)
                paired_element_node_file.shortcode = input_match.group(2)
                self.paired_element_node_files.append(paired_element_node_file)

    def check_set_model_name_csv(self):
        # Assert that all the model names used are the same (If there is incorrect model data used it could go wrong)
        # Example: exp_D-90_15_Sheet_ElementData.csv and incorrect_D-90_15_Sheet_ElementData.csv can pass the test
        simulation_names = [self.csv_data_pattern_matcher.match(str(f)).group(1) for f in self.csv_stage_filenames if self.csv_data_pattern_matcher.match(str(f))]

        assert all(x == simulation_names[0] for x in simulation_names)

        self.model_name = simulation_names[0]

    def timestep_num(self, paired_data_file):

        return int(self.csv_data_pattern_matcher.match(paired_data_file.element_file.filename).group(3))


def autoformdata(model_name, stage_name, data_files, target_directory, create_file=True):
    """ Processes the raw csv file output from autoform.

    Parameters
    ----------
    data_files: list
        A list containing ConfigStagePairedDataFiles objects.
    output_folder: str
        If set to default, assumes standard folder structure is used. In
        this case the folder 'data' in the script location is used.
        Otherwise user inputs the path to the folder containing raw csv data.
        If create_file is set to True, this is the output path for results.
    create_file: bool
        Flag to determine if an output npz file is created with the results.

    Returns
    -------
    dict
        Dictionary containing stamping/forming and quenching processed data.

    """
    if stage_name != 'forming' and stage_name != 'quenching':
        raise Exception('Stage name must either be forming or quenching!')

    target_directory = Path(target_directory)

    # Check if data files are stored in the object. If there is none,
    # it needs to read the files in from the target folder.
    if not isinstance(data_files, list) and all(isinstance(data_file, StagePairedDataFiles) for data_file in data_files):
        raise Exception('Incorrect input! It needs to be a list of StagePairedDataFiles objects.')

    csv_data_pattern = fr'(.*)_(\w+-\d+)_(\d+)_Sheet_(\w+).csv'
    csv_data_matcher = re.compile(csv_data_pattern)

    # stage_name will either be 'forming' or 'quenching' or only 'forming'
    requires_3d_ndata = False
    if stage_name == 'forming':
        output_filename = f'{model_name}_variables.npz'
        output_filepath = target_directory.joinpath(output_filename)
        requires_3d_ndata = True
    elif stage_name == 'quenching':
        output_filename = f'{model_name}_quenching.npz'
        output_filepath = target_directory.joinpath(output_filename)
    else:
        raise Exception('forming or quenching is required for stage_name')

    processed_data_files = []
    npz_data = {}
    npz_data['number_of_output_stages'] = len(data_files)
    npz_data['data_col_labels'] = np.array(['element_idx', 'x_coordinate', 'y_coordinate',
        'z_coordinate', 'major_strain', 'minor_strain', 'temperature'])
    npz_data['sorted_data_steps'] = []

    # Get filenames
    for idx, paired_data_files in enumerate(data_files, 1):
        print(f'Processing: {paired_data_files.element_file.filename}, {paired_data_files.node_file.filename}')
        # exp_D-20_13_Sheet_ElementData.csv / exp_D-20_18_Sheet_NodeData.csv
        # Get the step number
        regex_result = csv_data_matcher.match(paired_data_files.element_file.filename)
        step_index = regex_result.group(3)

        # Check if the data is loaded or not
        if not isinstance(paired_data_files.element_file.data, pd.DataFrame):
            print('No data stored in element file object! Loading data.')
            paired_data_files.element_file.data = pd.read_csv(target_directory.joinpath(paired_data_files.element_file.filename))
        if not isinstance(paired_data_files.node_file.data, pd.DataFrame):
            print('No data stored in node file object! Loading data.')
            paired_data_files.node_file.data = pd.read_csv(target_directory.joinpath(paired_data_files.node_file.filename))

        # Element Idx, Node Idx 1, Node Idx 2, Node Idx 3, Zones, minorstrain, majorstrain, temperature
        fdata = process_element_node_data(paired_data_files.element_file.data, paired_data_files.node_file.data)
        processed_data_files.append(npz_data)

        if requires_3d_ndata == True and idx == len(data_files):
            final_step_elem_points = np.hstack(
                (paired_data_files.element_file.data['Node Idx 1'].values.reshape((-1, 1)),
                paired_data_files.element_file.data['Node Idx 2'].values.reshape((-1, 1)),
                paired_data_files.element_file.data['Node Idx 3'].values.reshape((-1, 1))
                )
            )

            final_step_node_data = np.hstack(
                (paired_data_files.node_file.data['Node Idx'].values.reshape((-1, 1)),
                paired_data_files.node_file.data['XCoord'].values.reshape((-1, 1)),
                paired_data_files.node_file.data['YCoord'].values.reshape((-1, 1)),
                paired_data_files.node_file.data['ZCoord'].values.reshape((-1, 1)),
                paired_data_files.node_file.data['Initial XCoord'].values.reshape((-1, 1)),
                paired_data_files.node_file.data['Initial YCoord'].values.reshape((-1, 1))
                )
            )

            num_elements = paired_data_files.element_file.data['Element Idx'].shape[0]
            num_nodes = paired_data_files.node_file.data['Node Idx'].shape[0]
            npz_data[f'final_step_elem_points'] = final_step_elem_points
            npz_data[f'final_step_node_data'] = final_step_node_data
            npz_data[f'num_elements'] = num_elements
            npz_data[f'num_nodes'] = num_nodes

        npz_data[f'data_step_{step_index}'] = fdata
        npz_data['sorted_data_steps'].append(f'data_step_{step_index}')

    npz_data['sorted_data_steps'] = sorted_alphanumerically(npz_data['sorted_data_steps'])

    if create_file == True:
        print_saving_file_text(output_filepath)
        np.savez(output_filepath, **npz_data)

    return output_filename, npz_data


def process_element_node_data(element_df, node_df):

    element_df.set_index('Element Idx')

    element_df['XCoord_Centroid'] = element_df.apply(calculate_centroid, args=(node_df, 'XCoord'), axis=1)
    element_df['YCoord_Centroid'] = element_df.apply(calculate_centroid, args=(node_df, 'YCoord'), axis=1)
    element_df['ZCoord_Centroid'] = element_df.apply(calculate_centroid, args=(node_df, 'ZCoord'), axis=1)

    element_df.reset_index(inplace=True)

    # Save the generally used data
    fdata_array = np.hstack(
        (element_df['Element Idx'].values.reshape((-1, 1)),
        element_df['XCoord_Centroid'].values.reshape((-1, 1)),
        element_df['YCoord_Centroid'].values.reshape((-1, 1)),
        element_df['ZCoord_Centroid'].values.reshape((-1, 1)),
        element_df['majorstrain'].values.reshape((-1, 1)),
        element_df['minorstrain'].values.reshape((-1, 1)),
        element_df['temperature'].values.reshape((-1, 1))
        )
    )

    return fdata_array


def autoformdata_regex(model_name, short_code, stage_type, directory=None):
    """ Autoformdata script """
    if directory == None:
        output_directory = Path('.')
    else:
        output_directory = directory

    if stage_type == 'forming':
        output_filename = output_directory.joinpath(f'{model_name}_variables.npz')
        print("Running autoformdata")

    elif stage_type == 'quenching':
        output_filename = output_directory.joinpath(f'{model_name}_quenching.npz')
        print("Running autoformdataQ")

    else:
        raise Exception('forming or quenching is required for stage_type')

    csv_files = list(output_directory.glob('*.csv'))
    element_match_results = filter_element_data(model_name, short_code, csv_files)
    node_match_results = filter_node_data(model_name, short_code, csv_files)

    data_dict = {}
    data_dict['number_of_output_stages'] = len(element_match_results)
    data_dict['col_labels'] = np.array(['element_idx', 'x_coordinate', 'y_coordinate',
        'z_coordinate', 'major_strain', 'minor_strain', 'temperature'])

    # Sheet_ElementData
    # Element Idx, Node Idx 1, Node Idx 2, Node Idx 3, Zones, minorstrain, majorstrain, temperature
    for element_filename, node_filename in zip(element_match_results, node_match_results):
        print(f'Processing: {Path(element_filename).name}, {Path(node_filename).name}')
        node_df = pd.read_csv(node_filename)
        element_df = pd.read_csv(element_filename, index_col='Element Idx')

        info_col = node_df['Info'].dropna()
        matcher = re.compile(r'.*Step Index: (\d+)')
        step_index = matcher.match(info_col[info_col.str.contains('Step Index')].values[0]).group(1)

        data_dict['number_of_elements'] = element_df.shape[0]

        element_df['XCoord_Centroid'] = element_df.apply(calculate_centroid, args=(node_df, 'XCoord'), axis=1)
        element_df['YCoord_Centroid'] = element_df.apply(calculate_centroid, args=(node_df, 'YCoord'), axis=1)
        element_df['ZCoord_Centroid'] = element_df.apply(calculate_centroid, args=(node_df, 'ZCoord'), axis=1)

        element_df.reset_index(inplace=True)

        # Save the generally used data
        fdata_array = np.hstack(
            (element_df['Element Idx'].values.reshape((-1, 1)),
            element_df['XCoord_Centroid'].values.reshape((-1, 1)),
            element_df['YCoord_Centroid'].values.reshape((-1, 1)),
            element_df['ZCoord_Centroid'].values.reshape((-1, 1)),
            element_df['majorstrain'].values.reshape((-1, 1)),
            element_df['minorstrain'].values.reshape((-1, 1)),
            element_df['temperature'].values.reshape((-1, 1))
            )
        )

        # Save the node data (Does reset_index do anything here?)
        # IF ANYTHING GOES WRONG HERE, READ THIS LINE FIRST
        # RESET INDEX WAS REMOVED
        ndata_array = node_df.iloc[:, 0:6].values
        data_dict[f'fdata_step_{step_index}'] = fdata_array
        data_dict[f'ndata_step_{step_index}'] = ndata_array

    np.savez(output_filename, **data_dict)


def get_simulation_csv_files(model_name, short_code, target_directory):

    target_directory = Path(target_directory)

    csv_paths = list(target_directory.glob('*.csv'))
    csv_files = [Path(csv_path).name for csv_path in csv_paths]

    stage_match_results = filter_stage_data(model_name, short_code, csv_files)
    return stage_match_results


def load_data_premodule(data_filenames, target_directory):
    """
    data_files : ConfigDataFiles
        A class containing data files (in a list) for different stages.
    target_directory : str
        Target directory containing the physical data files.
    """
    target_directory = Path(target_directory)

    data_files = {}

    for filename in data_filenames:
        if filename.endswith('.csv'):
            data_files[filename] = pd.read_csv(target_directory.joinpath(filename))
        elif filename.endswith('.npz') or filename.endswith('.npy'):
            data_files[filename] = np.load(target_directory.joinpath(filename))
        else:
            msg = 'Unsupported filetype used. Use: .csv, .npz, .npy'
            raise Exception(msg)

    return data_files


def get_model_name(autoform_csv_filename):
    pattern = fr'(.*)_(\w+-\d+)_(\d+)_Sheet_(.*).csv'
    matcher = re.compile(pattern)
    matches = matcher.match(autoform_csv_filename)
    return matches.group(1)


def filter_stage_data(model_name, short_code, csv_files):
    csv_data_pattern = fr'.*{model_name}_(\w+-\d+)_(\d+)_(.*).csv'
    csv_filename_data_matches = pattern_matcher(csv_data_pattern, csv_files)
    return [match.group(0) for match in csv_filename_data_matches if match.group(1) == short_code]


def filter_element_data(model_name, short_code, csv_files):
    element_data_pattern = fr'.*{model_name}_(\w+-\d+)_(\d+)_Sheet_ElementData.csv'
    element_data_matches = pattern_matcher(element_data_pattern, csv_files)
    return [match.group(0) for match in element_data_matches if match.group(1) == short_code]


def filter_node_data(model_name, short_code, csv_files):
    node_data_pattern = fr'.*{model_name}_(\w+-\d+)_(\d+)_Sheet_NodeData.csv'
    node_data_matches = pattern_matcher(node_data_pattern, csv_files)
    return [match.group(0) for match in node_data_matches if match.group(1) == short_code]


def pattern_matcher(pattern, files):
    matcher = re.compile(pattern)
    return [matcher.match(str(f)) for f in files if matcher.match(str(f))]


def sorted_alphanumerically(l):
    """ Sort the given iterable in the way that humans expect."""
    convert = lambda text: int(text) if text.isdigit() else text
    alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', key) ]
    return sorted(l, key = alphanum_key)


def calculate_centroid(row, reference_df, returned_coord):
    """ Calculate centroid (Assuming Triangular Mesh) """
    # Assume always triangular mesh
    # Get the x coord for all 3 nodes and average
    x_1 = reference_df[returned_coord][row['Node Idx 1']]
    x_2 = reference_df[returned_coord][row['Node Idx 2']]
    x_3 = reference_df[returned_coord][row['Node Idx 3']]

    return (x_1 + x_2 + x_3) / 3
