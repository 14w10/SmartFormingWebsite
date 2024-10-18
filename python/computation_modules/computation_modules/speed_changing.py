import numpy as np
import plotly.io as pio
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
from .abstract_modules import AbstractModulePreFe


pio.renderers.default='browser'


class SpeedChanging(AbstractModulePreFe):

    def run(self, material_workpiece_supplier, material_workpiece_name, material_tool_supplier, material_tool_name, lubricants_lubricant_supplier,
        lubricants_lubricant_name, speedconditions_smin, speedconditions_smax, speedconditions_type, speedconditions_rate, otherspeedconditions_t,
        otherspeedconditions_p, create_file=True, target_directory=None, **kwargs):

# if __name__ == "__main__":

        # model parameters
        x=[2, 1.1, 1.2, 2.05, 2.98, 5.3, 0.12, 1.435];
        
        fig = make_subplots(specs=[[{"secondary_y": True}]])        
        
        lambda1=x[0]*10;
        lambda2=x[1];
        c=x[2]/100;
        k1=x[3];
        k2=x[4];
        k3=x[5];
        ita0=x[6];
        A=x[7]*1000;
        
        # contact conditions: user input
        # Tmin= contactconditions_tmin + 273; # Kelvin
        # Pmin= contactconditions_pmin/1000; # GPa
        # vmin = contactconditions_smin; # mm/s
       
        # Tmax= contactconditions_tmax + 273; # Kelvin
        # Pmax= contactconditions_pmax/1000; # GPa
        # vmax = contactconditions_smax; # mm/s
        
        #User input
        Vmin = speedconditions_smin #mm/s
        Vmax = speedconditions_smax
        
        ## For multi curve: Temperature, Pressure and Sliding velocity
        #Pmin=0.2;
        #Pmax=0.4;
        #vmin=30;
        #vmax=100;
        
        ## For multi curve: Temperature, Pressure and Sliding velocity
        #T_array = np.array([Tmin,(Tmin+Tmax)/2, Tmax])
        #P_array = np.array([Pmin,(Pmin+Pmax)/2, Pmax])
        #v_array = np.array([vmin,(vmin+vmax)/2, vmax])
    
        ## I.f. for interactive figure calculation
        
        numbcurves = 76 # Can be calculated by Max-min/changing rate + 1    
        # P_array = np.linspace(Pmin, Pmax, numbcurves)
        
        # User input
        #T_changing_rate = 1.3 #C/mm
        v_jump_point_array = np.linspace(0,75,numbcurves)
        changing_type = speedconditions_type
        
        if changing_type == "speed increase":
            v1 = Vmin
            v2 = Vmax
        else:
            v1 = Vmax
            v2 = Vmin
         
        # Other constant contact conditions
        T = otherspeedconditions_t # C
        T = T + 273.1
        P = otherspeedconditions_p/1000 #GPa
                
        cof_store = []   
        slidingdistance_store = []
        #labels = []
        
        ## For multi curve: Temperature, Pressure and Sliding velocity
        
        # for i in range (9):
            
        #     if i==0:
        #         T=T_array[0] # Kelvin
        #         P=P_array[1] # GPa
        #         v=v_array[1] # mm/s
        #     elif i==1:
        #         T=T_array[1]; # Kelvin
        #         P=P_array[1]; # GPa
        #         v=v_array[1]; # mm/s
        #     elif i==2:
        #         T=T_array[2]; # Kelvin
        #         P=P_array[1]; # GPa
        #         v=v_array[1]; # mm/s
        #     elif i==3:
        #         T=T_array[1]; # Kelvin
        #         P=P_array[0]; # GPa
        #         v=v_array[1]; # mm/s
        #     elif i==4:
        #         T=T_array[1]; # Kelvin
        #         P=P_array[1]; # GPa
        #         v=v_array[1]; # mm/s
        #     elif i==5:
        #         T=T_array[1]; # Kelvin
        #         P=P_array[2]; # GPa
        #         v=v_array[1]; # mm/s
        #     elif i==6:
        #         T=T_array[1]; # Kelvin
        #         P=P_array[1]; # GPa
        #         v=v_array[0]; # mm/s
        #     elif i==7:
        #         T=T_array[1]; # Kelvin
        #         P=P_array[1]; # GPa
        #         v=v_array[1]; # mm/s
        #     elif i==8:
        #         T=T_array[1]; # Kelvin
        #         P=P_array[1]; # GPa
        #         v=v_array[2]; # mm/s


## For multi curve: Temperature, Pressure and Sliding velocity or for I.f interactive figure calculation
        for i in range(numbcurves):
        #     T=T_array[1]; # Kelvin
        #     v=v_array[1]; # mm/s
        #     P=P_array[i]
        
            t_step = 0.0005;
        
        ## For multi curve: Temperature, Pressure and Sliding velocit
            max_sliding_distance = 75 #mm
            
            v_jump_step = round(v_jump_point_array[i]/(v1*t_step))

            timesteps = round(max_sliding_distance/Vmin/t_step) #changed from SD to max SD (constant)
            
            V = np.zeros(timesteps)
            if changing_type == "speed increase":
                V[:v_jump_step] = Vmin
                V[v_jump_step:] = Vmax
                V[0] = Vmin
                V[-1] = Vmax
            else:
                V[:v_jump_step] = Vmax
                V[v_jump_step:] = Vmin
                V[0] = Vmax
                V[-1] = Vmin

            ita=ita0*np.exp(A/T)
            ul=1.592*np.exp(-1056.2/T)
            ud=9.656*np.exp(-1054.3/T)
        
            t = np.zeros(timesteps)
            
        ## For multi curve: Temperature, Pressure and Sliding Velocity
        #slidingdistance = np.linspace(0,90,timesteps)
            slidingdistance = np.zeros(timesteps+1)
            ht_dot = np.zeros(timesteps+1)
            ht = np.zeros(timesteps+1)
            beta = np.zeros(timesteps)
            u = np.zeros(timesteps+1)

            #For constant curve Vmin = 50
            ita_min=ita0*np.exp(A/(T))
            ul_min=1.592*np.exp(-1056.2/(T))
            ud_min=9.656*np.exp(-1054.3/(T))
            
            ht_dot_min = np.zeros(timesteps+1)
            ht_min = np.zeros(timesteps+1)
            beta_min = np.zeros(timesteps)
            u_min = np.zeros(timesteps+1)
            
            #For constant curve Vmax = 80
            ita_max=ita0*np.exp(A/(T))
            ul_max=1.592*np.exp(-1056.2/(T))
            ud_max=9.656*np.exp(-1054.3/(T))
            
            ht_dot_max = np.zeros(timesteps+1)
            ht_max = np.zeros(timesteps+1)
            beta_max = np.zeros(timesteps)
            u_max = np.zeros(timesteps+1)
            
        
        # initial lubricant thickness: um
            ht[0] = 25
            ht_min[0] = 25
            ht_max[0] = 25
        
            for j in range(v_jump_step):
                t[j]=(j-1)*t_step
                
                sldingdistance_step = t_step * v1 
        
                slidingdistance[j+1] = slidingdistance[j] + sldingdistance_step
        
                
                ht_dot[j]=-ht[j]*(c*(P**k1)*(v1**k2)/(ita**k3))
                ht[j+1]=ht[j]+ht_dot[j]*t_step
                beta[j]=np.exp(-(lambda1*ht[j])**lambda2)
                u[j]=(1-beta[j])*ul+beta[j]*ud
                
            for j in range(v_jump_step, timesteps):
                t[j]=(j-1)*t_step
                
                sldingdistance_step = t_step * v2 

                slidingdistance[j+1] = slidingdistance[j] + sldingdistance_step
                ht_dot[j]=-ht[j]*(c*(P**k1)*(v2**k2)/(ita**k3))
                ht[j+1]=ht[j]+ht_dot[j]*t_step
                beta[j]=np.exp(-(lambda1*ht[j])**lambda2)
                u[j]=(1-beta[j])*ul+beta[j]*ud

            for j in range(timesteps):
                ht_dot_min[j]=-ht_min[j]*(c*(P**k1)*(Vmin**k2)/(ita_min**k3))
                ht_min[j+1]=ht_min[j]+ht_dot_min[j]*t_step
                beta_min[j]=np.exp(-(lambda1*ht_min[j])**lambda2)
                u_min[j]=(1-beta_min[j])*ul_min+beta_min[j]*ud_min
                
                ht_dot_max[j]=-ht_max[j]*(c*(P**k1)*(Vmax**k2)/(ita_max**k3))
                ht_max[j+1]=ht_max[j]+ht_dot_max[j]*t_step
                beta_max[j]=np.exp(-(lambda1*ht_max[j])**lambda2)
                u_max[j]=(1-beta_max[j])*ul_max+beta_max[j]*ud_max
        
        # if i == 3 or i == 4 or i == 5 :
            
    #         #Label = f'Temp = {T} °C  P = {P*1000} MPa  Vel = {v} mm/s'    
            if changing_type == "speed increase":         
                fig.add_trace(go.Scatter(visible = False, x=slidingdistance[0:-1], y=u[0:-1],mode='lines', line=dict(width=2),name='COF (Velocity Increase)',yaxis = 'y1')) #legendgroup='group1', name = f'Effect of Temperature = {T - 273:,.2f} C' , mode='lines', line=dict(width=2)))
            else:
                fig.add_trace(go.Scatter(visible = False, x=slidingdistance[0:-1], y=u[0:-1],mode='lines', line=dict(width=2),name='COF (Velocity Decrease)',yaxis = 'y1')) #legendgroup='group1', name = f'Effect of Temperature = {T - 273:,.2f} C' , mode='lines', line=dict(width=2)))
            if changing_type == "speed increase":
                fig.add_trace(go.Scatter(visible=False, x=slidingdistance[0:-1], y=V, mode='lines', line=dict(width=2, dash='dashdot'),name='Velocity increase', ), secondary_y=True)
            else:
                fig.add_trace(go.Scatter(visible=False, x=slidingdistance[0:-1], y=V, mode='lines', line=dict(width=2, dash='dashdot'),name='Velocity decrease', ), secondary_y=True)

            fig.add_trace(go.Scatter(visible = False, x=np.linspace(0,t_step*Vmin*timesteps,u_min.size), y=u_min[0:-1],mode='lines', line=dict(width=2, dash='dash'),name=f'COF Vmin={Vmin} mm/s',yaxis = 'y1'))

            fig.add_trace(go.Scatter(visible = False, x=np.linspace(0,t_step*Vmax*timesteps,u_min.size), y=u_max[0:-1],mode='lines', line=dict(width=2, dash='dot'),name=f'COF Vmax={Vmax} mm/s',yaxis = 'y1'))

        ##for I.f interactive figure calculation
        
        fig.data[0].visible = True
        fig.data[1].visible = True
        fig.data[2].visible = True
        fig.data[3].visible = True
            
        #     # Create and add slider
        steps = []
        for z in np.arange(0,len(fig.data),4):
            step = dict(
                method="update",
                args=[{"visible": [False] * len(fig.data)},{"showlegend":True}],
                label = str(round(v_jump_point_array[int(z/4)],1)) # layout attribute
            )
            step["args"][0]["visible"][z] = True  # Toggle z'th trace to "visible"
            step["args"][0]["visible"][z+3] = True
            step["args"][0]["visible"][z+1] = True
            step["args"][0]["visible"][z+2] = True
            steps.append(step)
        
        sliders = [dict(
            active=0,
            currentvalue={"prefix": 'Velocity jump point:'},
            pad={"t": 55},
            steps=steps
        )]
        
        fig.update_layout(title='Dynamic coefficient of friction', title_x = 0.5,
                                xaxis=dict(title='Sliding Distance (mm)',showgrid=True),
                                yaxis=dict(title='Coefficient of Friction', showgrid=True), 
                                xaxis_range=[0,75],yaxis_range=[0,1],
                                plot_bgcolor='white',
                                sliders=sliders
        )
            
        #     if i== 3 or i == 4 or i == 5:
                
        #         #Label = f'Temp = {T} °C  P = {P*1000} MPa  Vel = {v} mm/s'    
                
        #         fig.add_trace(go.Scatter(x=slidingdistance, y=u, legendgroup='group2', name = f'Effect of Pressure = {P*1000:,.2f} MPa' , mode='lines', line=dict(width=2)))
             
        #     if i== 6 or i == 7 or i == 8:
                
        #         #Label = f'Temp = {T} °C  P = {P*1000} MPa  Vel = {v} mm/s'    
                
        #         fig.add_trace(go.Scatter(x=slidingdistance, y=u, legendgroup='group3', name = f'Effect of Velocity = {v:,.2f} mm/s' , mode='lines', line=dict(width=2)))
            
        #     cof_store.append(u)
        #     slidingdistance_store.append(slidingdistance)
        #     labels.append(['Sliding distance (mm)', f'Cof T = {T - 273:,.2f}C P = {P*1000:,.2f}MPa V = {v:,.2f}mm/s'])
            
        # Avg_COF = [slidingdistance_store[0],cof_store[0],slidingdistance_store[1],cof_store[1],slidingdistance_store[2],cof_store[2],slidingdistance_store[3],cof_store[3],slidingdistance_store[4],cof_store[4],slidingdistance_store[5],cof_store[5],slidingdistance_store[6],cof_store[6],slidingdistance_store[7],cof_store[7],slidingdistance_store[8],cof_store[8]]
        
        # max_len = max([len(arr) for arr in Avg_COF])
        # padded = np.array([np.lib.pad(arr, (0, max_len - len(arr)), 'constant', constant_values=np.nan) for arr in Avg_COF])
        # padded = padded.T
        # #padded = pd.DataFrame(padded)
        # #padded.fillna('', inplace=True)
        
        # finallabels = labels[0]+labels[1]+labels[2]+labels[3]+labels[4]+labels[5]+labels[6]+labels[7]+labels[8]
        
        # Avg_COF_formatted = padded.tolist()
            
        # Avg_COF_formatted.insert(0, finallabels)
            
        # fig.update_layout(title='Dynamic coefficient of friction', title_x = 0.5,
        #                         xaxis=dict(title='Sliding Distance (mm)',showgrid=True),
        #                         yaxis=dict(title='Coefficient of Friction', showgrid=True), 
        #                         yaxis_range=[0,1],
        #                         plot_bgcolor='white'
        #                         )
        
        # fig.update_yaxes(title_text="Temperature (C)", secondary_y=True)
        
        fig.update_yaxes(title_text="Velocity (mm/s)", secondary_y=True)
        # fig.show()

        fig_asdict = fig.to_dict()
        
        Avg_COF = np.concatenate((slidingdistance.reshape(-1,1), u.reshape(-1,1)), axis=1)
        
        Avg_COF_formatted = Avg_COF.tolist()
        
        Avg_COF_formatted.insert(0, ['Sliding distance (mm)', 'Coefficient of friction'])
        
        return {
                'files': [
                    {'filename': 'AverageCOF2.csv', 'data': Avg_COF_formatted}
                ],
                'figures': [
                    {'figurename': 'sliding_speed_figure', 'figure': fig_asdict}
                ]
            }
