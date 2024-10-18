
class StagePairedDataFiles():

    def __init__(self, shortcode_mappings, element_file, node_file):
        """
        Stores a pair of node and element files. This exists because they
        are processed together

        Parameters
        ----------
        element_file : ConfigStageDataFile
            Class containing element data.
        node_file : ConfigStageDataFile
            Class containing node data.

        Attributes
        ----------
        element_file : ConfigStageDataFile
            Class containing element data.
        node_file : ConfigStageDataFile
            Class containing node data.

        """
        self.shortcode_mappings = shortcode_mappings
        self.element_file = element_file
        self.node_file = node_file
        self.shortcode = None
        self.stage_name = None

    @property
    def shortcode(self):
        return self._shortcode

    @shortcode.setter
    def shortcode(self, new_shortcode):
        if new_shortcode == None:
            self._shortcode = new_shortcode
        elif new_shortcode not in self.shortcode_mappings.keys():
            raise Exception(f"Shortcode {new_shortcode} not in existing valid mappings")
        else:
            self._shortcode = new_shortcode
            self._stage_name = self.shortcode_mappings[new_shortcode]

    @property
    def stage_name(self):
        return self._stage_name

    @stage_name.setter
    def stage_name(self, new_stage_name):
        if new_stage_name == None:
            self._stage_name = new_stage_name
        elif new_stage_name not in self.shortcode_mappings.values():
            raise Exception(f"Stage name {new_stage_name} not in existing valid mappings")
        else:
            self._stage_name = new_stage_name
            self._shortcode = list(self.shortcode_mappings.keys())[list(self.shortcode_mappings.values()).index(new_stage_name)]


class StageDataFile():

    def __init__(self, filename=None, data=None, stage_name=None, dtype=None):
        """
        This should store a dictionary of the file names that it should
        produce as the key and the data as the values. It is either a dict
        or a list. If it is a dict it contains the data within the files,
        if it is a list, it only contains the filenames.
        """
        self.filename = filename
        self.data = data
        self.stage_name = stage_name
        self.dtype = dtype
