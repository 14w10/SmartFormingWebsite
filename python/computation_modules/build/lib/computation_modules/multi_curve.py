import numpy as np
import plotly.io as pio
import plotly.graph_objects as go
import pandas as pd
from .abstract_modules import AbstractModulePreFe


#pio.renderers.default='browser'


class MultiCurve(AbstractModulePreFe):

    def run(self, material_workpiece_supplier, material_workpiece_name, material_tool_supplier, material_tool_name, lubricants_lubricant_supplier,
        lubricants_lubricant_name, multiconditions_tmin, multiconditions_tmax, multiconditions_pmin, multiconditions_pmax, multiconditions_smin,
        multiconditions_smax, create_file=True, target_directory=None, **kwargs):
   

#if __name__ == "__main__":

        # model parameters
        x=[2, 1.1, 1.2, 2.05, 2.98, 5.3, 0.12, 1.435];
        
        fig = go.Figure() 
        
        lambda1=x[0]*10;
        lambda2=x[1];
        c=x[2]/100;
        k1=x[3];
        k2=x[4];
        k3=x[5];
        ita0=x[6];
        A=x[7]*1000;
        
        # contact conditions: user input
        Tmin= multiconditions_tmin + 273; # Kelvin
        Pmin= multiconditions_pmin/1000; # GPa
        vmin = multiconditions_smin; # mm/s
       
        Tmax= multiconditions_tmax + 273; # Kelvin
        Pmax= multiconditions_pmax/1000; # GPa
        vmax = multiconditions_smax; # mm/s
        
        # Tmin=473.1;
        # Tmax=623.1;
        # Pmin=0.2;
        # Pmax=0.4;
        # vmin=30;
        # vmax=100;
        
        T_array = np.array([Tmin,(Tmin+Tmax)/2, Tmax])
        P_array = np.array([Pmin,(Pmin+Pmax)/2, Pmax])
        v_array = np.array([vmin,(vmin+vmax)/2, vmax])
    
        cof_store = []   
        slidingdistance_store = []
        labels = []
        
        for i in range (9):
            
            if i==0:
                T=T_array[0] # Kelvin
                P=P_array[1] # GPa
                v=v_array[1] # mm/s
            elif i==1:
                T=T_array[1]; # Kelvin
                P=P_array[1]; # GPa
                v=v_array[1]; # mm/s
            elif i==2:
                T=T_array[2]; # Kelvin
                P=P_array[1]; # GPa
                v=v_array[1]; # mm/s
            elif i==3:
                T=T_array[1]; # Kelvin
                P=P_array[0]; # GPa
                v=v_array[1]; # mm/s
            elif i==4:
                T=T_array[1]; # Kelvin
                P=P_array[1]; # GPa
                v=v_array[1]; # mm/s
            elif i==5:
                T=T_array[1]; # Kelvin
                P=P_array[2]; # GPa
                v=v_array[1]; # mm/s
            elif i==6:
                T=T_array[1]; # Kelvin
                P=P_array[1]; # GPa
                v=v_array[0]; # mm/s
            elif i==7:
                T=T_array[1]; # Kelvin
                P=P_array[1]; # GPa
                v=v_array[1]; # mm/s
            elif i==8:
                T=T_array[1]; # Kelvin
                P=P_array[1]; # GPa
                v=v_array[2]; # mm/s
                
            ita=ita0*np.exp(A/T);
            ul=1.592*np.exp(-1056.2/T);
            ud=9.656*np.exp(-1054.3/T);
            
            t_step=0.0005;
            max_sliding_distance = 90 #mm
            timesteps = int(max_sliding_distance/v/t_step)
            t=np.zeros(timesteps);
            slidingdistance=np.linspace(0,90,timesteps)
            ht_dot=np.zeros(timesteps);
            ht=np.zeros(timesteps+1);
            beta=np.zeros(timesteps);
            u=np.zeros(timesteps);
            
            # initial lubricant thickness: um
            ht[0]=25;
            
            for j in range(timesteps):
                t[j]=(j-1)*t_step;
                ht_dot[j]=-ht[j]*(c*(P**k1)*(v**k2)/(ita**k3));
                ht[j+1]=ht[j]+ht_dot[j]*t_step;
                beta[j]=np.exp(-(lambda1*ht[j])**lambda2);
                u[j]=(1-beta[j])*ul+beta[j]*ud;
            
            if i== 0 or i == 1 or i == 2:
                
                #Label = f'Temp = {T} °C  P = {P*1000} MPa  Vel = {v} mm/s'    
                
                fig.add_trace(go.Scatter(x=slidingdistance, y=u, legendgroup='group1', 
                name = f'Effect of Temperature = {T - 273:,.2f} C' , mode='lines', line=dict(width=2)))
            
            if i== 3 or i == 4 or i == 5:
                
                #Label = f'Temp = {T} °C  P = {P*1000} MPa  Vel = {v} mm/s'    
                
                fig.add_trace(go.Scatter(x=slidingdistance, y=u, legendgroup='group2', 
                name = f'Effect of Pressure = {P*1000:,.2f} MPa' , mode='lines', line=dict(width=2)))
             
            if i== 6 or i == 7 or i == 8:
                
                #Label = f'Temp = {T} °C  P = {P*1000} MPa  Vel = {v} mm/s'    
                
                fig.add_trace(go.Scatter(x=slidingdistance, y=u, legendgroup='group3', 
                name = f'Effect of Velocity = {v:,.2f} mm/s' , mode='lines', line=dict(width=2)))
            
            cof_store.append(u)
            slidingdistance_store.append(slidingdistance)
            labels.append(['Sliding distance (mm)', f'Cof T={T - 273:,.2f}C P={P*1000:,.2f}MPa V={v:,.2f}mm/s'])
            
        Avg_COF = [slidingdistance_store[0],cof_store[0],slidingdistance_store[1],cof_store[1],
        slidingdistance_store[2],cof_store[2],slidingdistance_store[3],cof_store[3],slidingdistance_store[4],
        cof_store[4],slidingdistance_store[5],cof_store[5],slidingdistance_store[6],cof_store[6],
        slidingdistance_store[7],cof_store[7],slidingdistance_store[8],cof_store[8]]
        
        max_len = max([len(arr) for arr in Avg_COF])
        padded = np.array([np.lib.pad(arr, (0, max_len - len(arr)), 'constant', constant_values=0) 
        for arr in Avg_COF])
        
        padded = padded.T
        padded = pd.DataFrame(padded)
        padded.fillna('', inplace=True)
        
        finallabels = labels[0]+labels[1]+labels[2]+labels[3]+labels[4]+labels[5]+labels[6]+labels[7]+labels[8]
        
        Avg_COF_formatted = padded.values.tolist()
            
        Avg_COF_formatted.insert(0, finallabels)
            
        fig.update_layout(title='Dynamic coefficient of friction', title_x = 0.5,
                               xaxis=dict(title='Sliding Distance (mm)',showgrid=True),
                               yaxis=dict(title='Coefficient of Friction', showgrid=True), 
                               yaxis_range=[0,1],
                               plot_bgcolor='white'
                               )
            
        # fig.show()

        fig_asdict = fig.to_dict()
        
        Avg_COF = np.concatenate((slidingdistance.reshape(-1,1), u.reshape(-1,1)), axis=1)
        
        Avg_COF_formatted = Avg_COF.tolist()
        
        Avg_COF_formatted.insert(0, ['Sliding distance (mm)', 'Coefficient of friction'])
        
        return {
                'files': [
                    {'filename': 'AverageCOF3.csv', 'data': Avg_COF_formatted}
                ],
                'figures': [
                    {'figurename': 'multi_mate_figure', 'figure': fig_asdict}
                ]
            }
