import abc

from .object_factory import ObjectFactory

# Alternative thinking to solve this problem:
# 1. create a Parser()
# 2. create a list of form_objects
# 3. for each form_object, run .parse() on it
class FormParser():

    def __init__(self) -> None:
        self.form_parsers = FormParsers()
        self.form_parsers.register_builder("blank", FormParserBlank)
        self.form_parsers.register_builder("tool", FormParserTool)
        self.form_parsers.register_builder("lubricant", FormParserLubricant)
        self.form_parsers.register_builder("coating", FormParserCoating)
        self.form_parsers.register_builder("blanking", FormParserBlanking)
        self.form_parsers.register_builder("heating", FormParserHeating)
        self.form_parsers.register_builder("transfer_1", FormParserTransfer1)
        self.form_parsers.register_builder("transfer_2", FormParserTransfer2)
        self.form_parsers.register_builder("press", FormParserPress)
        self.form_parsers.register_builder("paint_bake", FormParserPaintBake)
        self.form_parsers.register_builder("toolmaker", FormParserToolmaker)
        self.form_parsers.register_builder("formability", FormParserFormability)
        self.form_parsers.register_builder("material_mate", FormParserMaterialMate)
        self.form_parsers.register_builder("strain_rate_range", FormParserStrainRate)
        self.form_parsers.register_builder("temperature_range", FormParserTemperature)
        self.form_parsers.register_builder("materials", FormParserMaterialSelection)
        self.form_parsers.register_builder("lubricants", FormParserLubricantSelection)
        self.form_parsers.register_builder("changing_temperature_condition", FormParserTemperatureConditions)
        self.form_parsers.register_builder("other_contact_conditions", FormParserOtherConditions)
        self.form_parsers.register_builder("changing_pressure_condition", FormParserPressureConditions)
        self.form_parsers.register_builder("other_contact_conditions_than_pressure", FormParserOtherPressureConditions)
        self.form_parsers.register_builder("changing_speed_condition", FormParserSpeedConditions)
        self.form_parsers.register_builder("other_contact_conditions_than_speed", FormParserOtherSpeedConditions)
        self.form_parsers.register_builder("multi_contact_conditions", FormParserMultiConditions)
        self.form_parsers.register_builder("materials_relaxation", FormParserMaterialsRelaxationConditions)
        self.form_parsers.register_builder("parameters_in_stress_relaxation_age_forming", FormParserParamatersStressRelaxation)
        self.form_parsers.register_builder("application_process", FormParserApplicationProcess)
        self.form_parsers.register_builder("lubricant_properties", FormParserLubricantProperties)
        self.form_parsers.register_builder("material_name", FormParserMaterialSchuler)
        self.form_parsers.register_builder("group_selection", FormParserGroupSelection)
        self.form_parsers.register_builder("low_temperature_constants", FormParserLowTemperatureConstants)
        self.form_parsers.register_builder("high_temperature_constants", FormParserHighTemperatureConstants)
        self.form_parsers.register_builder("temperature_threshold", FormParserTemperatureThreshold)
        self.form_parsers.register_builder("heating_rate", FormParserHeatingRate)



    # It is assumed currently only the form data will be parsed
    # Only json data will be input, so there is a low chance this method will change
    def parse(self, raw_input):
        form_stages = self._initialise_from_json(raw_input)
        parameter_variables = {}

        for form_stage in form_stages:
            parser = self.form_parsers.get(form_stage.top_heading.lower().rstrip(" ").replace(" ", "_"))
            parameter_variables.update(parser.parse_stage(form_stage))

        return parameter_variables

    def _initialise_from_json(self, raw_input):
        form_stages = []
        for idx in range(0, len(raw_input) - 1, 2):
            form_stages.append(FormStageJson(top_heading=raw_input[idx], data=raw_input[idx + 1]))

        return form_stages


class FormStageJson():

    def __init__(self, top_heading, data) -> None:
        """ Creates a FormStageJson object which will be used with the parsers """
        # It was considered that the parser is stored in here so a .parse() method could be called on itself
        # But that seems unecessary because it is very unlikely to change

        # Assert early that the input data is in the right form
        # It is assumed no one will reassign these values externally

        try:
            assert isinstance(top_heading, str)                 # The top_heading must be a string
            assert isinstance(data, dict)                   # The form stage data is in a dict
            assert len(data) == 1                           # Only one item in the dict
            assert isinstance(data[next(iter(data))], list) # The item in a dict is a list
        except AssertionError:
            raise Exception("Checks to ensure the input json data is correctly formatted failed")

        self.top_heading = top_heading
        self.tab_heading = next(iter(data))
        self.tab_data_entries = []

        for form_data_pair in data[next(iter(data))]:
            # Units is separated by comma. If no units found, set to None
            # There should only be one comma so parsing of units works properly
            assert form_data_pair[0].count(',') == 1 or form_data_pair[0].count(',') == 0
            if form_data_pair[0].count(',') == 1:
                units = form_data_pair[0].split(',')[1].strip()
            else:
                units = None

            tab_data_entry = TabDataEntry(label=form_data_pair[0], value=form_data_pair[1], units=units)
            self.tab_data_entries.append(tab_data_entry)

class TabDataEntry():

    def __init__(self, label, value, units) -> None:
        """ Units should either be a string or None """
        self.label = label
        self.value = value
        self.units = units

### Factory
class FormParsers(ObjectFactory):
    def get(self, service_id, **kwargs):
        return self.create(service_id, **kwargs)


### Abstract Classes
class AbstractFormParser(abc.ABC):

    # The following properties must be created
    @property
    @abc.abstractmethod
    def name_prefix(self):
        pass

    @property
    @abc.abstractmethod
    def field_mappings(self):
        pass

    # The following method must be created
    @abc.abstractmethod
    def parse_stage(self):
        pass


### Methods that must be implemented (modules in Ruby)
class ParserMethodMultitab():

    def parse_stage(self, form_stage):
        parameter_variables = {}
        parameter_variables[f'{self.name_prefix}_name'] = form_stage.tab_heading

        # There is only 1 tab (which has been asserted earlier on)
        tab_data_entries = form_stage.tab_data_entries
        for tab_data_entry in tab_data_entries:
            property_name = self.field_mappings[tab_data_entry.label]
            parameter_variables[f'{self.name_prefix}_{property_name}'] = tab_data_entry.value

        return parameter_variables


class ParserMethodSingletab():

    def parse_stage(self, form_stage):
        parameter_variables = {}

        # There is only 1 tab (which has been asserted earlier on)
        tab_data_entries = form_stage.tab_data_entries
        for tab_data_entry in tab_data_entries:
            property_name = self.field_mappings[tab_data_entry.label]
            parameter_variables[f'{self.name_prefix}_{property_name}'] = tab_data_entry.value

        return parameter_variables


class ParserMethodCycle():

    def parse_stage(self, form_stage):
        parameter_variables = {}

        # There is only 1 tab (which has been asserted earlier on)
        current_cycle = 0
        num_grouped_fields = len(self.field_mappings)
        tab_data_entries = form_stage.tab_data_entries
        for idx, tab_data_entry in enumerate(tab_data_entries):
            if idx % num_grouped_fields == 0:
                current_cycle += 1

            property_name = self.field_mappings[tab_data_entry.label]
            parameter_variables[f'{self.name_prefix}_cycle_{current_cycle}_{property_name}'] = tab_data_entry.value

        return parameter_variables


### Concrete Classes
class FormParserBlank(ParserMethodMultitab, AbstractFormParser):
    name_prefix = "blank"
    field_mappings = {
        "Thermal conductivity (at 490°), kW/mK":         "thermal_conductivity_490_degc",
        "Ultimate tensile strength (at 490°C), MPa":     "ultimate_tensile_strength_490_degc",
        "Blank thickness, mm":                           "thickness",
        "Density (at 490°C), kg/m3":                     "density_490_degc",
        "Specific heat capacity (at 490°C), J/kgK":      "specific_heat_capacity_490_degc",
        "Average surface roughness (Ra), nm":            "avg_surface_roughness",
        "Forming temperature (initial blank temp.), °C": "temperature"
    }


class FormParserTool(ParserMethodMultitab, AbstractFormParser):
    name_prefix = "tool"
    field_mappings = {
        "Hardness (Optional), HRC":                       "hardness",
        "Average surface roughness (Ra), nm":             "avg_surface_roughness",
        "Initial forming temperature (Optional), °C":     "temperature",
        "Thermal conductivity, kW/mK":                    "thermal_conductivity"
    }


class FormParserLubricant(ParserMethodMultitab, AbstractFormParser):
    name_prefix = "lubricant"
    field_mappings = {
        "Layer thickness, μm":                            "thickness",
        "Thermal conductivity, kW/mK":                    "conductivity"
    }


class FormParserCoating(ParserMethodMultitab, AbstractFormParser):
    name_prefix = "coating"
    field_mappings = {
        "Layer thickness, μm":                            "thickness",
        "Thermal conductivity, kW/mK":                    "conductivity"
    }


class FormParserBlanking(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "blanking"
    field_mappings = {
        "Select Blank Material":                          "material_name",
        "Length (m)":                                     "length",
        "Width (m)":                                      "width",
        "Thickness (mm)":                                 "thickness",
        "Layer thickness, μm":                            "thickness",
        "Thermal conductivity, kW/mK":                    "conductivity"
    }


class FormParserHeating(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "heating"
    field_mappings = {
        "Heating technology":                            "technology",
        "Heating rate (degrees celcius per second)":     "rate",
        "Soaking temperature (Celcius)":                 "temperature",
        "Soaking time (minutes)":                        "time"
    }


# NOTE: In the form data room temperature naming is not standardised
# Otherwise it should inherit from a single Class with name_prefix being different
class FormParserTransfer1(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "transfer_1"
    field_mappings = {
        "Time on air (seconds)":                        "time",
        "Room temperature":                             "temperature"
    }


class FormParserTransfer2(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "transfer_2"
    field_mappings = {
        "Time on air (seconds)":                        "time",
        "Room temperature (celcius)":                   "temperature"
    }


class FormParserPress(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "press"
    field_mappings = {
        "Workpiece material":                            "technology",
        "Initial coating thickness (mm)":                "coating_thickness",
        "Lubricant":                                     "lubricant_name",
        "Select die materal":                            "tool_name",
        "Stamping speed (mm/s)":                         "stamping_speed",
        "Stroke (mm)":                                   "stamping_stroke",
        "Surface roughness (micro m)":                   "surface_roughness",
        "Lubricant density (g per mm squared)":          "lubricant_density"
    }

class FormParserToolmaker(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "toolmaker"
    field_mappings = {
        "Total Stroke, mm":                 "total_stroke",
        "Stamping Speed, mm/s":             "stamping_speed",
        "Quenching time, s":                "quenching_time",
        "Blank Temperature, degrees C":     "blank_temperature"
    }

class FormParserPaintBake(ParserMethodCycle, AbstractFormParser):
    name_prefix = "paint_bake"
    field_mappings = {
        "Heating rate (degrees celcius per second)":    "rate",
        "Soaking temperature (Celcius)":                "temperature",
        "Soaking time (minutes)":                       "time"
    }

class FormParserFormability(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "formability"
    field_mappings = {
        "Total Stroke, mm":                             "total_stroke",
        "Stamping Speed , mm/s":                        "stamping_speed",
        "Blank Material":                               "blank_material",
        "Cut off strain":                               "cut_off_strain",
        "Blank Temperature, degrees C":                 "blank_temperature"
    }

class FormParserMaterialMate(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "blank_material"
    field_mappings = {
        "Blank Material":                               "name",
        "Material Thickness (mm)":                      "thickness",
        "Material Supplier":                            "supplier"
    }

class FormParserStrainRate(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "strain_rate"
    field_mappings = {
        "Minimum Strain Rate (/s)":                     "min",
        "Maximum Strain Rate (/s)":                     "max"
    }

class FormParserTemperature(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "temperature"
    field_mappings = {
        "Minimum Temperature (Celcius)":                "min",
        "Maximum Temperature (Celcius)":                "max"
    }

class FormParserMaterialSelection(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "material"
    field_mappings = {
        "select supplier of the workpiece material":   "workpiece_supplier",
        "select the workpiece material":                "workpiece_name",
        "select supplier of the tool material":         "tool_supplier",
        "select the tool material":                     "tool_name"
    }
    
class FormParserLubricantSelection(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "lubricants"
    field_mappings = {
        "select supplier of the lubricant":             "lubricant_supplier",
        "select the lubricant":                         "lubricant_name"
    }    
   
class FormParserTemperatureConditions(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "temperatureconditions"
    field_mappings = {
        "minimum temperature (C)":                      "tmin",
        "maximum temperature (C)":                      "tmax",
        "changing type":                                "type",
        "temperature changing rate (C/mm)":             "rate"      
    }

class FormParserOtherConditions(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "otherconditions"
    field_mappings = {
        "pressure (MPa)":                               "p",
        "speed (mm/s)":                                 "v"      
    }        

class FormParserPressureConditions(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "pressureconditions"
    field_mappings = {
        "minimum pressure (MPa)":                       "pmin",
        "maximum pressure (MPa)":                       "pmax",
        "changing type":                                "type",
        "pressure jump point (mm)":                     "rate"      
    }

class FormParserOtherPressureConditions(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "otherpressureconditions"
    field_mappings = {
        "temperature (C)":                              "t",
        "speed (mm/s)":                                 "v"      
    }     

class FormParserSpeedConditions(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "speedconditions"
    field_mappings = {
        "minimum speed (mm/s)":                         "smin",
        "maximum speed (mm/s)":                         "smax",
        "changing type":                                "type",
        "speed jump point (mm)":                        "rate"      
    }

class FormParserOtherSpeedConditions(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "otherspeedconditions"
    field_mappings = {
        "temperature (C)":                              "t",
        "pressure (MPa)":                               "p"      
    }

class FormParserMultiConditions(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "multiconditions"
    field_mappings = {
        "minimum temperature (C)":                      "tmin",
        "maximum temperature (C)":                      "tmax",
        "minimum pressure (MPa)":                       "pmin",
        "maximum pressure (MPa)":                       "pmax",
        "minimum speed (mm/s)":                         "smin",
        "maximum speed (mm/s)":                         "smax"
    }

class FormParserMaterialsRelaxationConditions(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "materialsrelaxation"
    field_mappings = {
        "Select the workpiece material":                "name"
    }  

class FormParserParamatersStressRelaxation(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "parametersstressrelaxation"
    field_mappings = {
        "Minimum initial stress (MPa)":                 "smin",
        "Maximum initial stress (MPa)":                 "smax",
        "Ageing time (h)":                              "time"
    }                       

class FormParserApplicationProcess(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "application"
    field_mappings = {
        "select the specific forming process":          "data"
    }     

class FormParserLubricantProperties(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "lubricantproperties"
    field_mappings = {
        "viscosity at 300C (cSt)":                      "visc300",
        "viscosity at 450C (cSt)":                      "visc450",
        "evaporation point (C)":                        "evap",  
        "evaporation rate at 450C (um/s)":              "evaprate"    
    }     

class FormParserMaterialSchuler(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "material_schuler"
    field_mappings = {
        "Blank Material":                               "name"
    }

class FormParserGroupSelection(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "group_selection"
    field_mappings = {
        "Group Number":                                 "number"
    }
    
class FormParserLowTemperatureConstants(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "matconst1"
    field_mappings = {
        "Capital_K0_lo":                                "Capital_K0_lo",
        "QCapital_K_lo":                                "QCapital_K_lo",
        "k0_lo":                                        "k0_lo",
        "Qk_lo":                                        "Qk_lo",
        "B0_lo":                                        "B0_lo",
        "QB_lo":                                        "QB_lo",
        "C0_lo":                                        "C0_lo",
        "QC_lo":                                        "QC_lo",
        "E0_lo":                                        "E0_lo",
        "QE_lo":                                        "QE_lo",
        "A0_lo":                                        "A0_lo",
        "QA_lo":                                        "QA_lo",
        "n0_lo":                                        "n0_lo",
        "Qn_lo":                                        "Qn_lo",
        "n2_lo":                                        "n2_lo"
    }

class FormParserHighTemperatureConstants(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "matconst2"
    field_mappings = {
        "Capital_K0_hi":                                "Capital_K0_hi",
        "QCapital_K_hi":                                "QCapital_K_hi",
        "k0_hi":                                        "k0_hi",
        "Qk_hi":                                        "Qk_hi",
        "B0_hi":                                        "B0_hi",
        "QB_hi":                                        "QB_hi",
        "C0_hi":                                        "C0_hi",
        "QC_hi":                                        "QC_hi",
        "E0_hi":                                        "E0_hi",
        "QE_hi":                                        "QE_hi",
        "A0_hi":                                        "A0_hi",
        "QA_hi":                                        "QA_hi",
        "n0_hi":                                        "n0_hi",
        "Qn_hi":                                        "Qn_hi",
        "n2_hi":                                        "n2_hi"
    }

class FormParserTemperatureThreshold(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "matconst3"
    field_mappings = {
        "Temperature Threshold":                        "threshold"
    }

class FormParserHeatingRate(ParserMethodSingletab, AbstractFormParser):
    name_prefix = "heating"
    field_mappings = {
        "Heating Rate":                                 "rate"
    }
    