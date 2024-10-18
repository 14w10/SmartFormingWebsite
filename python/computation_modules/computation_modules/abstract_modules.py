import abc
from pathlib import Path

from .data_file_objects import StageDataFile

class AbstractModule(metaclass=abc.ABCMeta):

    def __init__(self) -> None:
        # Implement some defaults
        pass

    def post_initialise(self, **kwargs):
        """
        This is a post initialisation function
        """
        pass

    @abc.abstractmethod
    def run(self):
        pass

    @property
    @abc.abstractmethod
    def is_pre_simulation(self):
        """ Should return True or False """
        pass

    @property
    @abc.abstractmethod
    def is_data_preparer(self):
        """ Should return True or False """
        pass

class AbstractModulePreFe(AbstractModule):

    is_pre_simulation = True
    is_data_preparer = False

    def post_initialise(self, **kwargs):
        pass

class AbstractModulePostFe(AbstractModule):

    is_pre_simulation = False
    is_data_preparer = False

    def post_initialise(self, **kwargs):
        assert Path(kwargs['target_directory']).is_dir()

        result_dict = kwargs['data_preparer'].run(data_files=kwargs['data_files'], create_file=kwargs['create_file'], target_directory=kwargs['target_directory'])

        assert all([isinstance(item, StageDataFile) for item in result_dict['data_files']])

        return result_dict['data_files'], result_dict['model_name']

class AbstractModuleDataPreparer(AbstractModule):

    is_pre_simulation = False
    is_data_preparer = True

    def post_initialise(self, **kwargs):
        pass