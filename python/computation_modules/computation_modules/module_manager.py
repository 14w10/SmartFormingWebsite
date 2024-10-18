from pathlib import Path
import importlib
from .autoformdata import Autoformdata

class ModuleManager():

    def __init__(self, package_name, target_directory=None, create_file=False) -> None:
        self.package_name = package_name

        # Use current directory as default location
        if target_directory == None:
            target_directory = Path('.').absolute()

        self.target_directory = target_directory
        self.create_file = create_file

        self.loaded_module = None
        self.loaded_module_name = None

    def run_module(self, module_name, input_parameters):
        """ input_parameters is a dictionary of kwargs """
        self._load_module(module_name=module_name)

        # If the following don't exist as parameters, take the ModuleManager's defaults
        if input_parameters.get('target_directory') is None:
            input_parameters.update({'target_directory': self.target_directory})
        if input_parameters.get('create_file') is None:
            input_parameters.update({'create_file': self.create_file})

        # For now assume that the same data preparer is used for all inputs
        data_preparer = Autoformdata()
        input_parameters.update({'data_preparer': data_preparer})

        # Potential inputs for post-fe (Assert these possible solutions)
        # 1. csv data files (pd.read_csv them). isinstance(data, pd.DataFrame)
        #   {'exp_D-20_15_Sheet_ElementData.csv': data1
        #    'exp_D-30_65_Sheet_NodeData.csv': data2}
        # 2. dictionary with npz files
        #   {'filename.npz': np.NpzFile}
        # 3. dictionary with a dictionary of data
        #   {'filename.npz': {'wasd': 123, 'qwerty': 456} }

        result = self.loaded_module.run(**input_parameters)

        return result

    def parse_run_module(self, module_name, raw_input, parser, data_files=None):
        """ module_name: str, raw_input: json, parser: FormParser, data_files: dict """
        input_parameters = self._prepare_inputs(raw_input, parser)
        if data_files is not None:
            input_parameters['data_files'] = data_files
        result = self.run_module(module_name, input_parameters)

        return result

    def _load_module(self, module_name):
        self.loaded_module_name = module_name
        # Each module has a class that will be used to run the computations/get the result
        # The class will need to be instantiated so getattr will be used
        # Each class name will need to follow a specific naming standard
        # For example if the module/file name is ihtc, the class equivalent must be Ihtc

        # It is a class, so there is a () at the end to instantiate
        # This also enables it to check it has the abstract methods required
        # The instantiation takes no arguments
        if "_" in module_name:
            splitted = module_name.split("_")
            module_class_name = "".join([word.capitalize() for word in splitted])
        else:
            module_class_name = module_name.capitalize()

        self.loaded_module = getattr(importlib.import_module(f'{self.package_name}.{module_name}'), module_class_name)()

    def _prepare_inputs(self, raw_input, parser):
        input_parameters = parser.parse(raw_input=raw_input)

        return input_parameters

    @property
    def target_directory(self):
        return self._target_directory

    @target_directory.setter
    def target_directory(self, new_target_directory):
        if new_target_directory == None:
            self._target_directory = Path('.').absolute()
        elif Path(new_target_directory).is_dir():
            self._target_directory = Path(new_target_directory).absolute()
        else:
            raise NotADirectoryError(f"Invalid directory '{Path(new_target_directory).absolute()}'")
