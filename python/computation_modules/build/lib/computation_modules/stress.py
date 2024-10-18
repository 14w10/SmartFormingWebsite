"""
Created on 02/02 2022

@author: Wenbin Zhou
"""

import numpy as np
import plotly.io as pio
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
# import time
from .abstract_modules import AbstractModulePreFe

# start_time = time.time()

pio.renderers.default='browser'

class Stress(AbstractModulePreFe):

    def run(self, materialsrelaxation_name, parametersstressrelaxation_smin, parametersstressrelaxation_smax, parametersstressrelaxation_time, create_file=True, target_directory=None, **kwargs):

# if __name__ == "__main__":

        # #User Input
        # # Creep Time (h)
        # Ageing_time=12.0
        # # Minimum loading stress (MPa)
        # stressmin=120.0
        # # Maximum loading stress (MPa)
        # stressmax=225.0
        
        fig = make_subplots(specs=[[{"secondary_y": True}]])  
        
        # Number of curves
        Number1=5;
        # Time step (h)
        dt = 0.001
        
        S_relax0 = np.linspace(parametersstressrelaxation_smin,parametersstressrelaxation_smax,Number1)
        
        t,S_relax_results,YS_results=self.Stress_relaxation(parametersstressrelaxation_time,parametersstressrelaxation_smin,parametersstressrelaxation_smax,Number1,dt)

                  
        ## Plot figures: Stress and Yield strength
        labels=['Time (h)']
        
        Stress_relaxation=t.reshape(-1,1)
        
        for iplt in np.linspace(0,Number1-1,Number1):  
            fig.add_trace(go.Scatter(visible = False, x=t, y=S_relax_results[:,int(iplt)],mode='lines', line=dict(width=2),name=f'Evolution of stress for initial stress={S_relax0[int(iplt)]} MPa',yaxis = 'y1'))
            fig.add_trace(go.Scatter(visible = False, x=t, y=YS_results[:,int(iplt)],mode='lines', line=dict(width=2,dash='dashdot'),name=f'Evolution of yield strength for initial stress={S_relax0[int(iplt)]} MPa',),secondary_y=True)
            fig.data[2*int(iplt)].visible = True
            fig.data[2*int(iplt)+1].visible = True
            
            labels.append(f'Stress for initial stress = {S_relax0[int(iplt)]:,.2f} MPa')
            labels.append(f'Yield Strength for initial stress = {S_relax0[int(iplt)]:,.2f} MPa')
            
            Stress_relaxation = np.concatenate((Stress_relaxation, S_relax_results[:,int(iplt)].reshape(-1,1), YS_results[:,int(iplt)].reshape(-1,1)), axis=1)

        
        fig.update_layout(title='Stress relaxation-AA6082', title_x = 0.5,
                                xaxis=dict(title='Time (h)',showgrid=True),
                                yaxis=dict(title='Stress (MPa)', showgrid=True), 
                                plot_bgcolor='white',)            
        
        fig.update_yaxes(title_text="Yield strength (MPa)", secondary_y=True)        
        #fig.show()        
        fig_asdict = fig.to_dict()
        
        Stress_relaxation_formatted = Stress_relaxation.tolist()        
        Stress_relaxation_formatted.insert(0, labels)            
        
        return {
                'files': [
                    {'filename': 'Stress_relaxation.csv', 'data': Stress_relaxation_formatted}
                ],
                'figures': [
                    {'figurename': 'Stress_relaxation_figure', 'figure': fig_asdict}
                ]
            }        
        
    # initial value of Strain, fit of stress-strain curve
    def Strain_relax0(self,S_relax0):
        if S_relax0 < 225.0:
            Strain_relax=(S_relax0 / 70000.0) + np.dot(0.001586,(S_relax0 / 225.0) ** 31.31)
        elif S_relax0 < 227.0:
            Strain_relax=np.dot((0.006 - 0.0048) / (227.0 - 225.0),(S_relax0 - 225.0)) + 0.0048
        elif S_relax0 < 228.4:
            Strain_relax=np.dot((0.008 - 0.006) / (228.4 - 227.0),(S_relax0 - 227.0)) + 0.006
        elif S_relax0 < 228.7:
            Strain_relax=np.dot((0.012 - 0.008) / (228.7 - 228.4),(S_relax0 - 228.4)) + 0.008
        else:
            Strain_relax=np.dot((0.02 - 0.012) / (228.9 - 228.7),(S_relax0 - 228.7)) + 0.012
        return Strain_relax
    
    # Constitutive equation for CAF
    def Constitutive_equation(self,S_relax0,iloop,parametersstressrelaxation_time,dt):

        #Material constant
        A1=3.1e-06
        A2=80.0
        A3=120.0
        B1=0.0685
        B2=95.0
        Cp=0.0645
        CA=3.0
        CL=0.3
        Cth=31.0
        k1=195.0
        k2=1.1
        k3=3.3545
        m1=0.3
        m2=2.0
        m3=5.0
        m4=0.1
        n1=0.6
        n2=0.55
        n3=1.0
        n4=2.0
        Q=2.1
        gama0=6.0
        k4=0.3
        C1=0.2
        
        # Number of steps
        Number0=int(parametersstressrelaxation_time / dt)+1
        
        # Initial value of solid solution strength (MPa)
        S_solute=140.0        
        # Initial value of age stength (MPa)
        S_age0=150.0
        S_age=np.dot(S_age0,np.ones(Number0))
        S_rate_age=np.dot(0.0,np.ones(Number0))

        #dislocation density
        if S_relax0 < 225.1:
            dis0=0.0
        else:
            dis0=np.dot(k2,(self.Strain_relax0(S_relax0) - 0.004859) ** n2)    
        dis=np.dot(dis0,np.ones(Number0))
        dis_rate=np.dot(0.0,np.ones(Number0))
        
        # dislocation strength (MPa)
        S_dis0=np.dot(A2,(dis0 ** n3))
        S_dis=np.dot(S_dis0,np.ones(Number0))
        S_rate_dis=np.dot(0.0,np.ones(Number0))
        
        # yield strength (Mpa)
        YS0=S_solute + (S_age0 ** 2 + (S_dis0) ** 2) ** (0.5)
        YS=np.dot(YS0,np.ones(Number0))      
        
        # Normalised precipitate length
        L=np.ones(Number0)
        L_rate=np.dot(0.0,np.ones(Number0))
        
        # inter-particle spacing
        Lambda=np.ones(Number0)
        Lambda_rate=np.dot(0.0,np.ones(Number0))
        
        # Stress (Mpa)
        S_relax=np.dot(S_relax0,np.ones(Number0))
        S_rate_relax=np.dot(0.0,np.ones(Number0))   
        
        # Creep strain
        strain=np.dot(0.0,np.ones(Number0))
        strain_rate=np.dot(0.0,np.ones(Number0))
        
        # threshold strength (Mpa)
        S_threshold0=B2 - np.dot(k1,(dis0 ** 0.5))
        S_threshold=np.dot(S_threshold0,np.ones(Number0))        
        S_threshold_rate=np.dot(0.0,np.ones(Number0))    
        
        # Stress relaxation stage
        for mt in np.arange(1,Number0):
            # Evolution of precipitate length  
            L_rate[mt]=CL*((Q-L[mt-1])**m2)*(1+gama0*dis[mt-1]**m3)
            L[mt]=L[mt - 1] + np.dot(L_rate[mt - 1],dt)
            
            # Evolution of yield strength (Mpa)
            YS[mt]=S_solute + np.sqrt((S_age[mt - 1] ** 2) + (S_dis[mt - 1] ** 2))
            
            # Evolution of Creep Strain
            if np.dot(np.dot(B1,(abs(S_relax[mt - 1]) - S_threshold[mt - 1])),(1 - dis[mt - 1])) < 0:
                strain_rate[mt]=0.0
            else:
                strain_rate[mt]=np.dot(A1,np.sinh(np.dot(np.dot(B1,(abs(S_relax[mt-1])-S_threshold[mt-1])),(1-dis[mt-1]))))
            strain[mt]=strain[mt - 1] + np.dot(strain_rate[mt - 1],dt)
            
            # Evolution of inter-particle spacing
            Lambda_rate[mt]=np.dot(k3,L_rate[mt - 1])
            Lambda[mt]=Lambda[mt - 1] + np.dot(Lambda_rate[mt - 1],dt)
            
            # Evolution of dislocation density
            dis_rate[mt]=np.dot(np.dot(A3,(1 - dis[mt - 1])),(abs(strain_rate[mt - 1]) ** n1)) - np.dot(Cp,(dis[mt - 1] ** m4))
            dis[mt]=dis[mt - 1] + np.dot(dis_rate[mt - 1],dt)
            
            # Evolution of threshold strength (Mpa)
            S_threshold_rate[mt]=-Cth*(Lambda[mt-1])**(-2)*Lambda_rate[mt-1]-C1*n4*((dis[mt-1])**(n4-1))*(dis_rate[mt-1])
            S_threshold[mt]=S_threshold[mt - 1] + np.dot(S_threshold_rate[mt - 1],dt)
            
            # Evolution of age stength (Mpa)
            S_rate_age[mt]=np.dot(np.dot(CA,L_rate[mt - 1] ** m1),(1 - L[mt - 1]))
            S_age[mt]=S_age[mt - 1] + np.dot(S_rate_age[mt - 1],dt)
            
            # Evolution of dislocation strength (MPa)
            S_rate_dis[mt]=np.dot(np.dot(np.dot(A2,n3),(dis[mt - 1] ** (n3 - 1))),dis_rate[mt - 1])
            S_dis[mt]=S_dis[mt - 1] + np.dot(S_rate_dis[mt - 1],dt)
  
            # Evolution of stress
            S_rate_relax[mt]=np.dot(- 70000.0,strain_rate[mt - 1]) - np.dot(k4,S_rate_dis[mt - 1])
            S_relax[mt]=S_relax[mt - 1] + np.dot(S_rate_relax[mt - 1],dt)        
        return S_relax,YS

    # Loop
    def Stress_relaxation(self,parametersstressrelaxation_time,parametersstressrelaxation_smin,parametersstressrelaxation_smax,Number1,dt):
        iloop=0
        Number0=int(parametersstressrelaxation_time / dt)+1
        # Time (h)
        t=np.linspace(0,parametersstressrelaxation_time,Number0)
        # Evolution of stress (MPa)
        S_relax_results=0.0 * np.ones((Number0,Number1))
        # Evolution of yield stress (MPa)
        YS_results=0.0 * np.ones((Number0,Number1))
        #loading stress
        for S_relax0 in np.linspace(parametersstressrelaxation_smin,parametersstressrelaxation_smax,Number1):
            
            # Constitutive equation for CAF
            S_relax,YS =self.Constitutive_equation(S_relax0,iloop,parametersstressrelaxation_time,dt)
            S_relax_results[:,iloop] = S_relax
            YS_results[:,iloop]=YS
            iloop=iloop+1
        return t, S_relax_results,YS_results

    
# print("--- %s seconds ---" % (time.time() - start_time))
# Results_AA6082=Stress()
# Results_AA6082.run('Al',120,225,12)
