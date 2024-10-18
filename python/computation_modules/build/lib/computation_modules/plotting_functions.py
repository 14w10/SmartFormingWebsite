import json
import numpy as np
import plotly.io
from scipy.spatial import Delaunay
from plotly import figure_factory as ff

class PlotlyPlotter():

    def __init__(self) -> None:
        pass

    def get_3d_json(self, forming_data_contents, colourbar_results, title=None):
        """ colourbar_results should have dimensions (??? x 1) """
        if title is None:
            title = ""

        RES = colourbar_results

        nonodes = forming_data_contents['num_nodes']
        nodeidx = forming_data_contents['final_step_node_data'][:, 0].reshape(-1, 1)
        points = forming_data_contents['final_step_elem_points']
        NODE = forming_data_contents['final_step_node_data']

        NODERES = []
        suum =  np.zeros(shape=(len(nodeidx),len(points.T)))
        counter = np.zeros(shape=(len(nodeidx),len(points.T)))
        g = np.arange(0,nonodes)
        h = np.arange(0,3)

        def process_node_data(data1):
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
            process_node_data(d)

        NODERES = np.asarray(NODERES)

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

        if np.all(colors == 0):
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
            fig.update_coloraxes(cmax=10)
            fig.update_coloraxes(cmin=1)
        else:
            fig = ff.create_trisurf(x=x,y=y,z=z,simplices=tri.simplices,
                color_func=colors,colormap='Jet',#colormap=('rgb(230,0,0)','rgb(51,0,0)'),
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
            fig.update_coloraxes(cmax=10)
            fig.update_coloraxes(cmin=1)
        fig_asdict = fig.to_dict()

        return fig_asdict
