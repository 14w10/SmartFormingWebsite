"""
=============================
Module: toolmaker (post-fe)
=============================

This module contains functions for the post-fe module toolmaker which is
used to determine whether a material fails. This simulates an ageing process.

"""
import re
import base64
import numpy as np
from pathlib import Path
import matplotlib.pyplot as plt
from numpy.lib.npyio import NpzFile
from scipy.spatial import Delaunay
from plotly import figure_factory as ff
import plotly
import json
from scipy import interpolate
import plotly.graph_objects as go

from .utils import print_formatted_header, print_saving_file_text
from .abstract_modules import AbstractModulePostFe

class Toolmaker(AbstractModulePostFe):
    is_data_preparer = False
    is_pre_simulation = False

    def run(self, data_files, data_preparer, toolmaker_total_stroke,
            toolmaker_stamping_speed, toolmaker_quenching_time, toolmaker_blank_temperature,
            target_directory=None, create_file=False,
            **kwargs):

        # You should normally always run post_initialise for post_fe,
        # unless a specialised method needs to be implemented by the user
        data_file_objects, model_name = self.post_initialise(
            data_preparer=data_preparer,
            data_files=data_files,
            create_file=create_file,
            target_directory=target_directory
        )

        forming_data_contents = None
        forming_sorted_steps = None
        quenching_data_contents = None
        quenching_sorted_steps = None
        for data_file_object in data_file_objects:
            if (data_file_object.filename.endswith(".npz") and isinstance(data_file_object.data, dict)) or (isinstance(data_file_object.data, NpzFile)):
                if data_file_object.stage_name == 'forming':
                    forming_data_contents = data_file_object.data
                    forming_sorted_steps = data_file_object.data['sorted_data_steps']
                elif data_file_object.stage_name == 'quenching':
                    quenching_data_contents = data_file_object.data
                    quenching_sorted_steps = data_file_object.data['sorted_data_steps']

        assert forming_data_contents is not None
        assert forming_sorted_steps is not None
        assert quenching_data_contents is not None
        assert quenching_sorted_steps is not None

        evaluation_stage = forming_sorted_steps[-1].split("_")[-1]

        total_stroke = toolmaker_total_stroke
        stamping_speed = toolmaker_stamping_speed
        time_quench = toolmaker_quenching_time
        blank_temperature = toolmaker_blank_temperature

        ct1 = 1.6
        cT1 = 350
        ct2 = 7.6
        cT2 = 250

        forming_data_contents = forming_data_contents
        forming_sorted_steps = forming_sorted_steps
        quenching_data_contents = quenching_data_contents
        quenching_sorted_steps = quenching_sorted_steps

        if target_directory == None:
            # If user doesn't set target_directory, the output will be saved in the current folder.
            # It will also assume the data is stored in the current folder if that information is
            #   required. This is not always required as something the user will send the data
            #   in the ConfigStageDataFile.
            target_directory = Path('.')
        else:
            target_directory = Path(target_directory)

        # Initialising blank temperature array (temperature changing with time)
        # The array is initialised with the right size first
        blank_temperature_array = forming_data_contents[forming_sorted_steps[0]][:, 6].reshape(-1, 1)
        for step in forming_sorted_steps[1:]:
            blank_temperature_array = np.append(blank_temperature_array, forming_data_contents[step][:, 6].reshape(-1, 1), axis=1)

        for step in quenching_sorted_steps[1:]:
            blank_temperature_array = np.append(blank_temperature_array, quenching_data_contents[step][:, 6].reshape(-1, 1), axis=1)

        cT0 = blank_temperature

        critical_Ti = cT0
        critical_Tm = cT1
        critical_Tf = cT2
        critical_tm = ct1
        critical_tf = ct2

        k1 = -(cT0-cT1)/ct1             # NOTE: This is unused
        k2 = -(cT1-cT2)/(ct2-ct1)
        b1 = cT0                        # NOTE: This is unused
        b2 = cT1

        time_FE1 = np.arange(0, forming_data_contents['number_of_output_stages']) / (forming_data_contents['number_of_output_stages'] - 1) * (total_stroke/stamping_speed)
        time_FE2 = np.arange(1, quenching_data_contents['number_of_output_stages']) / (quenching_data_contents['number_of_output_stages'] - 1) * time_quench + time_FE1[-1]
        time_FE = np.append(time_FE1, time_FE2)

        xdata1 = np.linspace(critical_tm-0.01, critical_tm, 50)
        ydata1 = np.linspace(critical_Ti, critical_Tm, 50)

        xdata2 = np.linspace(critical_tm, critical_tf, 50)
        ydata2 = k2 * (xdata2 - critical_tm) + b2

        xdata3 = np.linspace(critical_tf, max(critical_tf+2, time_FE[-1]), 50)
        ydata3 = xdata3 * 0 + critical_Tf

        # Double check why this is done
        xdata2 = np.delete(xdata2, 0)
        xdata3 = np.delete(xdata3, 0)
        ydata2 = np.delete(ydata2, 0)
        ydata3 = np.delete(ydata3, 0)

        xdata_all = np.concatenate((xdata1, xdata2, xdata3))
        ydata_all = np.concatenate((ydata1, ydata2, ydata3))

        # Plot the line definining elements that are safe
        fig, ax = plt.subplots()
        ax.plot(xdata_all, ydata_all)

        # Plot the temperature lines of all the elements (-8000 to speed up plotting)
        for element in range(blank_temperature_array.shape[0]):
            ax.plot(time_FE, blank_temperature_array[element])

        ax.set_xlim(0)
        ax.set_xlabel('Time (s)')
        ax.set_ylabel('Temperature (Degrees Celcius)')
        ax.set_title('CCT All Elements')
        plt.tight_layout()

        cct_all_filepath = target_directory.joinpath(f'{model_name}_cct_all_elements.png')
        # print_saving_file_text(cct_all_filepath)
        fig.savefig(cct_all_filepath)

        with open(target_directory.joinpath(f'{model_name}_cct_all_elements.png'), 'rb') as imageFile:
            bytes_cct_all_string = base64.b64encode(imageFile.read())

        if create_file is not True:
            # print("Deleting file")
            target_directory.joinpath(f'{model_name}_cct_all_elements.png').unlink()

        fit0 = interpolate.interp1d(xdata_all,ydata_all,fill_value='extrapolate')

        if critical_tf > time_FE[len(time_FE)-1]:
            ct2 = time_FE[len(time_FE)-1] - 0.001
            cT2 = fit0(ct2)

        np.sort(np.append(time_FE,ct1))

        t1_step2=max(np.where((np.sort(np.append(time_FE,ct1)))==ct1)[0])
        t1_step1=t1_step2-1
        t2_step2=max(np.where((np.sort(np.append(time_FE,ct2)))==ct2)[0])
        t2_step1=t2_step2-1
        t1_t1=time_FE[t1_step1];
        t1_t2=time_FE[t1_step2];
        t2_t1=time_FE[t2_step1];
        t2_t2=time_FE[t2_step2];

        Filter_ele=np.zeros(len(blank_temperature_array))
        for element in range(len(blank_temperature_array)):
            t1_T1=blank_temperature_array[element,t1_step1];
            t1_T2=blank_temperature_array[element,t1_step2];
            T1=((t1_T2-t1_T1)/(t1_t2-t1_t1)*(ct1-t1_t1)+t1_T1);
            t2_T1=blank_temperature_array[element,t2_step1];
            t2_T2=blank_temperature_array[element,t2_step2];
            T2=((t2_T2-t2_T1)/(t2_t2-t2_t1)*(ct2-t2_t1)+t2_T1);
            if T1 > cT1 or T2 > cT2:
                Filter_ele[element] = 1

        Filter_ele = 1 - Filter_ele

        forming_data = forming_data_contents

        RES = Filter_ele

        nonodes = forming_data['num_nodes']
        nodeidx = forming_data['final_step_node_data'][:, 0].reshape(-1, 1)
        points = forming_data['final_step_elem_points']
        noelements = forming_data['num_elements']
        NODE = forming_data['final_step_node_data']

        NODERES = []
        suum =  np.zeros(shape=(len(nodeidx),len(points.T)))
        counter = np.zeros(shape=(len(nodeidx),len(points.T)))
        g = np.arange(0,nonodes)
        h = np.arange(0,3)

        def toolmaker(data1):
            for e in h:
                z = np.argwhere(np.in1d(points[:, e], nodeidx[data1, 0]))
                if z.shape == (0,1):
                    continue
                else:
                    suum[data1,e] = np.sum(np.fromiter((RES[[x][0]] for x in z), dtype=np.float64))
                    counter[data1,e] = len(z)
            NODERES.append(np.divide(np.sum(suum[data1]),np.sum(counter[data1]),dtype=np.float16))
            return NODERES

        for d in g:
            toolmaker(d)

        NODERES = np.asarray(NODERES)

        for node in range(nonodes):
            if NODERES[node] > 0:
                NODERES[node] == 1

        x = [NODE[i][1] for i in range(0,len(NODE))]
        x = np.asarray(x)

        ox = [NODE[i][4] for i in range(0,len(NODE))]

        y = [NODE[i][2] for i in range(0,len(NODE))]
        y = np.asarray(y)

        oy = [NODE[i][5] for i in range(0,len(NODE))]

        z = [NODE[i][3] for i in range(0,len(NODE))]
        z= np.asarray(z)

        tri = Delaunay(np.vstack([ox,oy]).T)

        colors = np.mean(NODERES[tri.simplices], axis=1)

        # If they are all the same it will fail plotting because vmin ! <= vmax
        # A range is required
        if np.all(colors == 1) or np.all(colors == 0):
            colorfunc = []
            for i in range(len(tri.simplices)):
                colorfunc.append((0,0,1))
            fig = ff.create_trisurf(x=x,y=y,z=z,simplices=tri.simplices,color_func=colorfunc,
                plot_edges=False,
                title=title, gridcolor='rgb(255,255,255)',
                backgroundcolor='rgb(255,255,255)')
            fig.layout.template = None # to slim down the output
            fig.update_layout(title_x=0.5, scene=dict(aspectmode='data'))
            fig.update_layout(scene=dict(
            xaxis=dict(title = '',showticklabels=False),
            yaxis=dict(title = '',showticklabels=False),
            zaxis=dict(title = '',showticklabels=False)))
            fig.update_layout(scene = dict(camera = dict(eye = dict(x=1.5, y=1.8, z = 5.5))))
        else:
            fig = ff.create_trisurf(x=x,y=y,z=z,simplices=tri.simplices,color_func=colors,colormap=('rgb(255,0,0)','rgb(0,0,255)'),show_colorbar=False,plot_edges=False,aspectratio=dict(x=1.5, y=1, z=0.3),title='SmartForming Displayer: Toolmaker Quenching Prediction',gridcolor='rgb(255,255,255)',backgroundcolor='rgb(255,255,255)')

            fig.add_annotation(text="Sufficient Quench",
                    xref="x domain",
                    yref="y domain",
                    x=1.0,
                    y=1.0,
                    font=dict(
                        family="Courier New, monospace",
                        size=16,
                        color="rgb(255,255,255)"
                        ),
                    showarrow=False,bordercolor="rgb(255,255,255)",
                    borderwidth=2,
                    borderpad=4,
                    bgcolor="rgb(0, 0, 255)",
                    opacity=1)

            fig.add_annotation(text="Hot Spot",
                    xref="x domain",
                    yref="y domain",
                    x=1,
                    y=1.1,
                    font=dict(
                        family="Courier New, monospace",
                        size=16,
                        color="rgb(255,255,255)"
                        ),
                    showarrow=False,bordercolor="rgb(255,255,255)",
                    borderwidth=2,
                    borderpad=4,
                    bgcolor="rgb(255, 0, 0)",
                    opacity=1)
            
            fig.update_layout(title_x=0.5, scene=dict(aspectmode='data'))
            fig.update_layout(scene=dict(
            xaxis=dict(title = '',showticklabels=False),
            yaxis=dict(title = '',showticklabels=False),
            zaxis=dict(title = '',showticklabels=False)))
            fig.update_layout(scene = dict(camera = dict(eye = dict(x=1.5, y=1.8, z = 5.5))))
       
        #fig = go.Figure((colorbar= dict(
       # tick0= 0,
        #tickmode= 'array',
        #tickvals= [0, 1]))
        fig_asdict = json.loads(plotly.io.to_json(fig))

        return {
            'files': [
                {'filename': f'{model_name}_cct_all_elements.png', 'data': bytes_cct_all_string.decode('ascii')}
            ],
            'figures': [
                {'figurename': 'toolmaker_figure', 'figure': fig_asdict}
            ]
        }

    def _filter_sort_steps(self, npz_file_keys, type):
        """ Takes in the keys of an npz file and returns sorted list
        of keys matching steps in the forming process """
        if type == 'fdata' or type == 'ndata':
            pass
        else:
            raise Exception('Type needs to be fdata or ndata')

        matcher = re.compile(rf'{type}_step_([0-9]+)')
        step_nums = [int(matcher.match(str(key)).group(1)) for key in npz_file_keys if matcher.match(str(key))]
        step_nums.sort()

        step_strings = [rf'{type}_step_{num}' for num in step_nums]
        return step_strings
