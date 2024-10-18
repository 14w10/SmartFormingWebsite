import numpy as np
import scipy.io as sci
from scipy import stats
import numpy_groupies as ng
import plotly.graph_objects as go
import plotly.io as pio
from .abstract_modules import AbstractModulePreFe
from pathlib import Path

pio.renderers.default='browser'

class LubricantLimit(AbstractModulePreFe):

    def run(self, application_data, lubricantproperties_visc300,
        lubricantproperties_visc450, lubricantproperties_evap, lubricantproperties_evaprate,
        create_file=True, target_directory=None, **kwargs):

        if (application_data == 'aluminium hot forging'):
            template_file_path = str(Path(__file__).resolve().parents[0].joinpath('CDF_hot_fridata.mat').absolute())
        else:
            template_file_path = str(Path(__file__).resolve().parents[0].joinpath('tool_dataext.mat').absolute())

        mat = sci.loadmat(template_file_path)        
        # load the interactive friction model parameters
        x = [2, 1.1, 1.2, 2.05, 2.98, 5.3]        
        lambda1 = x[0]*10
        lambda2 = x[1]
        c = x[2]/100
        k1 = x[3]
        k2 = x[4]
        k3 = x[5]
        
        # user input parameters
        ita_300=lubricantproperties_visc300; # viscosity at 300C (cSt)
        ita_450=lubricantproperties_visc450; # viscosity at 450C (cSt)
        T1=300;
        T2=450;
        # evaporation point(C)
        Te=lubricantproperties_evap;
        # evaporation rate at 450C
        eva_rate_450C=lubricantproperties_evaprate;
        
        # lubricant viscosity
        ita0 = 0.12 # viscosity coefficient
        A = 1435 # A=Q/R, Q:activation energy, R:universal gas constant
        # evaporation point(C)
        Te = 350
        # evaporation factor/coefficient
        Ef = 0.08
        
        cof = []
        grade = []
        
        for i in range(8):
            
            # calculate time step of each frame
            SD = np.diff(mat['CDF_hot']['SD'][0][i] * mat['CDF_hot']['stroke'][0][i],axis=1)
            SD = np.hstack((np.zeros(shape=(mat['CDF_hot']['t_sliding'][0][i].shape)),SD))
            t_step = SD/mat['CDF_hot']['SV'][0][i]
            
            # the unit of contact pressure in interactive friction model is 'GPa'
            mat['CDF_hot']['P'][0][i] = mat['CDF_hot']['P'][0][i]/1000;
            
            u = np.zeros(shape=(len(mat['CDF_hot']['t_sliding'][0][i]),50))
            
            v = np.zeros(shape=(len(mat['CDF_hot']['t_sliding'][0][i]),50))
            
            for j in range(len(mat['CDF_hot']['t_sliding'][0][i])):
                
                sliding_distance = np.zeros(shape=(1,51))
                ita = np.zeros(shape=(1,50))
                ht_dot  =np.zeros(shape=(1,50))
                ht = np.zeros(shape=(1,51))
                beta = np.zeros(shape=(1,50))
                ul = np.zeros(shape=(1,50))
                ud = np.zeros(shape=(1,50))
                #u = np.zeros(shape=(len(mat['CDF_hot']['t_sliding'][0][i]),50))
                
                # set initial film thickness
                ht[0,0] = 50
                
                # calculate COF evolutions of each node following its varying
                # contact conditions
                for k in range(50):
                    sliding_distance_step = t_step[j,k] * mat['CDF_hot']['SV'][0][i][j][k]
                    sliding_distance[0,k+1] = sliding_distance[0,k] + sliding_distance_step
                    
                    # applying the interactive friction model
                    ita[0,k] = ita0 * np.exp (A/(mat['CDF_hot']['temp'][0][i][j][k]+273.1))
                    ht_dot[0,k] = -ht[0,k] * (c*(mat['CDF_hot']['P'][0][i][j][k] ** k1) * (mat['CDF_hot']['SV'][0][i][j][k] ** k2)/ ( ita[0,k] ** k3))
                    
                    #temp>Te: increasing film diminution rate due to evaporation
                    if mat['CDF_hot']['temp'][0][i][j][k] <= Te:
                        ht[0,k+1] = ht[0,k] + ht_dot[0,k] * t_step[j,k]
                    else:
                        # consider the evaporation factor/coefficient
                        ht[0,k+1] = ht[0,k] + ht_dot[0,k] * t_step[j,k] * ( 1 + (mat['CDF_hot']['temp'][0][i][j][k] - Te) * Ef )
                    
                    
                    # in case of huge value of ht_dot
                    if ht[0,k+1] < 0: 
                        ht[0,k+1] = 0
                    
                    beta[0,k] = np.exp(-(lambda1*ht[0,k])**lambda2)
                    
                    ul[0,k] = 1.592 * np.exp(-1056.2/(mat['CDF_hot']['temp'][0][i][j][k] + 273.1))
                    ud[0,k] = 3.432 * np.exp(-514.46/(mat['CDF_hot']['temp'][0][i][j][k] + 273.1))
                    u[j,k] = (1 - beta[0,k]) * ul[0,k] + beta[0,k] * ud[0,k]
                    
                    ###    
                
                #calculate the performance grade for all the frames of each node
                for m in range (50):
                    if beta[0,m] <= 0.02:
                        v[j,m] = 100
                    elif beta[0,m] >= 0.99:
                        v[j,m] = 1
                    else:
                        v[j,m] = ( 1-beta[0,m]) * 100 
                    
            cof.append(u)
            grade.append(v)        
            
            del t_step, SD
        
        Pbin = 75
        SDbin = 50
        Pedges = np.linspace(0,1000,Pbin+1)
        SDedges = np.linspace(0,1,SDbin+1)
        Paxis = np.linspace(0,1000,Pbin)
        SDaxis = np.linspace(0,1,SDbin)
        
        num_of_file_tested = 8
        
        no_gg=np.zeros(shape=(Pbin,SDbin))
        meanGG=np.zeros(shape=(Pbin,SDbin))
        Probb=np.zeros(shape=(Pbin,SDbin))
        
        for i in range(8):
            P_data = mat['CDF_hot']['P'][0][i] * 1000
            SD_data = mat['CDF_hot']['SD'][0][i]
            grade_data = grade[i]
            
            P_data = P_data.flatten('F')
            SD_data = SD_data.flatten('F')
            grade_data = grade_data.flatten('F')
            
            ret = stats.binned_statistic_2d(P_data, SD_data, None, 'count', bins=[Pedges, SDedges], expand_binnumbers=True)                 
            
            Prob = ret.statistic/np.sum(np.sum(ret.statistic))
            
            subs = np.column_stack((ret.binnumber[0],ret.binnumber[1]))
            
            subs[np.where(subs[:,0]==76)[0],1] = SDbin+1
            
            meanG = ng.aggregate(group_idx=subs.T, a= grade_data.T, func='mean')
            
            meanG = np.delete(meanG, 0, 0)
            
            meanG = np.delete(meanG, 0, 1)
            
            meanG = meanG[0:Pbin, 0:SDbin]
            
            no_g = (meanG > 0)*1
            
            no_gg = no_gg + no_g
            
            meanGG = meanGG + meanG
            
            Probb = Probb + Prob
            
            
        no_gg[np.where(no_gg == 0)] = 1e25
        
        meanGG=meanGG/no_gg
        
        Probb=Probb/num_of_file_tested
        
        Probb[np.where(Probb<1e-7)] = 0
        
        overall_grades = sum(sum(meanGG*Probb))
        
        Origin_Output=np.zeros(shape=(Pbin+1,SDbin+1))
        
        Origin_Output[0,1:len(Origin_Output.T)] = SDaxis
        
        Origin_Output[1:len(Origin_Output),0] = Paxis
        
        Origin_Output[1:len(Origin_Output),1:len(Origin_Output.T)] = meanGG
        
        colorscale = [[0, 'white'], [0.1, 'red'], [0.3, 'yellow'], [0.7, 'cyan'], [1, 'blue']]
        
        fig = go.Figure(data =
            go.Contour(
            z = meanGG,
            x = SDaxis,
            y = Paxis,
            colorscale = colorscale,
            connectgaps = True,
            line_smoothing=0.5,
            line_width = 0.05,
            contours=dict(
                    start=0,
                    end = 100,
                    size=10
                    ),
            colorbar=dict(
                    title='Performance grades',
                    titleside='top',
                    titlefont=dict(
                        size=14,
                        family='Arial, sans-serif')
            )))
        
        fig.update_layout(title='Lubricant Limit Diagram', title_x = 0.5,
                                       xaxis=dict(title='Normalised Sliding Distance',showgrid=False),
                                       yaxis=dict(title='Contact Pressure (MPa)', showgrid=False),
                                       plot_bgcolor='white'
                                       )
                    
        
        fig_asdict = fig.to_dict()
        
        meanGGoutput = meanGG.tolist()
    
        return {
                'files': [
                    {'filename': 'LLD_raw.csv', 'data': meanGGoutput}
                ],
                'figures': [
                    {'figurename': 'LLD_figure', 'figure': fig_asdict}
                ]
                }
