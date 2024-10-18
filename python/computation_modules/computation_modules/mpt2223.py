import numpy as np
from scipy.integrate import solve_ivp
import plotly.io as pio
import plotly.graph_objects as go
import linecache
from pathlib import Path

from datetime import date
from .utils import print_saving_file_text
from .abstract_modules import AbstractModulePreFe

class Mpt2223(AbstractModulePreFe):

    def run(self, blank_material_name, blank_material_thickness,
        blank_material_supplier, group_selection_number, temperature_min, temperature_max, create_file=True,
        target_directory=None, **kwargs):
        print("Running material mate")

        print(f'blank_material_name: {blank_material_name}')
        print(f'blank_material_thickness: {blank_material_thickness}')
        print(f'blank_material_supplier: {blank_material_supplier}')
        print(f'temperature_min: {temperature_min}')
        print(f'temperature_max: {temperature_max}')

        blank_material_thickness = 2;
        blank_material_name = 'AA6111';
        blank_material_supplier = 'Novelis';
        strain_rate_min = 0.1;
        strain_rate_max = 100;

        output_filename = 'material_mate_result.mat'
        outF = open(output_filename, 'w')
        template_file_path = str(Path(__file__).resolve().parents[0].joinpath('AA6082_Ushape_AF_co_example.mat').absolute())

        for i in np.linspace(0,19,num=20,dtype=int):
            line = linecache.getline(template_file_path, i)
            outF.write(line)

        blank_material_thickness = float(blank_material_thickness)

        evalflag1 = False
        while evalflag1 == False:
            if (blank_material_name == 'AA2024' or
                blank_material_name == 'AA2060' or
                blank_material_name == 'AA5754' or
                blank_material_name == 'AA6082' or
                blank_material_name == 'AA6111' or
                blank_material_name == 'AA7075'):
                evalflag1 = True
            else:
                raise Exception('Error Unidentified material. Please input another material.')

        evalflag2 = False
        while evalflag2 == False:
            if (blank_material_name == 'AA2024' and blank_material_thickness == 1 or
                blank_material_name == 'AA2060' and blank_material_thickness == 2 or
                blank_material_name == 'AA5754' and blank_material_thickness == 1.2 or
                blank_material_name == 'AA5754' and blank_material_thickness == 2 or
                blank_material_name == 'AA6082' and blank_material_thickness == 1 or
                blank_material_name == 'AA6082' and blank_material_thickness == 1.5 or
                blank_material_name == 'AA6082' and blank_material_thickness == 2 or
                blank_material_name == 'AA6082' and blank_material_thickness == 2.5 or
                blank_material_name == 'AA6082' and blank_material_thickness == 3 or
                blank_material_name == 'AA6082' and blank_material_thickness == 5 or
                blank_material_name == 'AA6111' and blank_material_thickness == 2 or
                blank_material_name == 'AA7075' and blank_material_thickness == 1.6 or
                blank_material_name == 'AA7075' and blank_material_thickness == 2):
                evalflag2 = True
            else:
                raise Exception('Error: Data unavailble for selected thickness. Please input another thickness.')

        evalflag0 = False
        while evalflag0 == False:
            if (blank_material_name == 'AA2024' and blank_material_thickness == 1 and blank_material_supplier == 'Bombardier' or
                blank_material_name == 'AA2060' and blank_material_thickness == 2 and blank_material_supplier == 'NA' or
                blank_material_name == 'AA5754' and blank_material_thickness == 1.2 and blank_material_supplier == 'Novelis' or
                blank_material_name == '5754' and blank_material_thickness == 2 and blank_material_supplier == 'Novelis' or
                blank_material_name == 'AA6082' and blank_material_thickness == 1 and blank_material_supplier == 'AMAG' or
                blank_material_name == 'AA6082' and blank_material_thickness == 1.5 and blank_material_supplier == 'AMAG' or
                blank_material_name == 'AA6082' and blank_material_thickness == 2 and blank_material_supplier == 'Novelis' or
                blank_material_name == 'AA6082' and blank_material_thickness == 2.5 and blank_material_supplier == 'AMAG' or
                blank_material_name == 'AA6082' and blank_material_thickness == 3 and blank_material_supplier == 'Alcoa' or
                blank_material_name == 'AA6082' and blank_material_thickness == 3 and blank_material_supplier == 'NELA' or
                blank_material_name == 'AA6082' and blank_material_thickness == 5 and blank_material_supplier == 'AMAG' or
                blank_material_name == 'AA6111' and blank_material_thickness == 2 and blank_material_supplier == 'Novelis' or
                blank_material_name == 'AA7075' and blank_material_thickness == 1.6 and blank_material_supplier == 'AMAG' or
                blank_material_name == 'AA7075' and blank_material_thickness == 2 and blank_material_supplier == 'Schuler' or
                blank_material_name == 'AA7075' and blank_material_thickness == 2 and blank_material_supplier == 'Kaiser'):
                evalflag0 = True
            else:
                raise Exception('Error: Data unavailble for selected supplier. Please input another supplier.')

        # 'What is the minimum strain rate? (/s) - from 0.1/s '
        strain_rate_min = float(strain_rate_min) / 1000

        #  'What is the maximum strain rate? (/s) - upto 100/s '
        strain_rate_max = float(strain_rate_max) / 1000

        assert strain_rate_min < strain_rate_max

        SR_range = np.array([0.1, 1, 5])/1000
        a = "".join([format(el,'>11') for el in map(str, SR_range*1000)])

        line='    StrainRates 3'+  a
        outF.write(line)
        outF.write('\n')

        # for i in np.linspace(21,26,num=6,dtype=int):
        #     line = linecache.getline(template_file_path, i)
        #     outF.write(line)

        #  'What is the minimum temperature? (deg C) - from 300 deg C '
        temperature_min = float(temperature_min)

        #  'What is the maximum temperature? (deg C) - upto 500 deg C '
        temperature_max = float(temperature_max)

        if (temperature_max - temperature_min) >= 50:
            temperature = np.linspace( temperature_min, temperature_max, num=int(((temperature_max-temperature_min)/50)+1), dtype=int )
        else:
            temperature = np.linspace( temperature_min, temperature_max, num=2 )

        # a = " ".join(map(str, temperature))

        # line='            VALUES = '+  a
        # outF.write(line)
        # outF.write('\n')

        # for i in np.linspace(28,29,num=2,dtype=int):
        #     line = linecache.getline(template_file_path, i)
        #     outF.write(line)

        # SR and time increment
        etotalrate = SR_range*10**3;

        deltat = 0.0001;

        K = np.zeros(shape=(len(temperature),1))

        k =  np.zeros(shape=(len(temperature),1))

        B =  np.zeros(shape=(len(temperature),1))

        A = np.zeros(shape=(len(temperature),1))

        Cp = np.zeros(shape=(len(temperature),1))

        E = np.zeros(shape=(len(temperature),1))

        n1 = np.zeros(shape=(len(temperature),1))

        stress = []

        strain_ref = np.array([0,0.02,0.05,0.1,0.15,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1])

        pamstamp_strain = []

        u = 0

        fig = go.Figure()

        for i in range (0, len(temperature)):
                if temperature[i] == 300 and group_selection_number == 'Group 1':
                    Capital_K0=4.0734*10**6;QCapital_K=14181;k0=3.9255*10**6;Qk=11619;B0=3631.1330;QB=50295;Cp0=112.9223;QCp=-41145;E0=1.1426*10**8;QE=27899;n0=0.01987;Qn=31060;A0=0.0309;QA=10823;R=8.314;n2=0.8;
                elif temperature[i] != 300 and group_selection_number == 'Group 1':
                    Capital_K0=2.2369*10**5;QCapital_K=29122;k0=19.5357*10**3;Qk=40123;B0=2.3728*10**5;QB=26217;Cp0=4.5240;QCp=-2.4356*10**4;E0=7.7905*10**7;QE=3.0506*10**4;n0=0.3478;Qn=16381;A0=0.035186;QA=10229;R=8.314;n2=0.8;
                if temperature[i] == 300 and group_selection_number == 'Group 2':
                    Capital_K0=24668446;QCapital_K=7110;k0=493247607;Qk=-30414;B0=2784;QB=46957;Cp0=1.0115;QCp=-26346;E0=92943.6704;QE=62332;n0=0.0277;Qn=32685;A0=2.00E-04;QA=48217;R=8.314;n2=3.93;  
                if temperature[i] != 300 and group_selection_number == 'Group 2':
                    Capital_K0=60658;QCapital_K=38720;k0=493247607;Qk=-30414;B0=6678628;QB=5616;Cp0=1.0115;QCp=-26346;E0=92943.6704;QE=62332;n0=0.0277;Qn=32685;A0=2.00E-04;QA=48217;R=8.314;n2=3.93;  
                if temperature[i] == 300 and group_selection_number == 'Group 3':
                    Capital_K0=5271760.52;QCapital_K=12817.29;k0=3975483.40;Qk=11398.23;B0=14334.00;QB=39800.89;Cp0=0.4355;QCp=-10002.54;E0=17909544.89;QE=38982.62;n0=1.91;Qn=9627.82;A0=0.9355;QA=3850.37;R=8.314;n2=0.8;
                elif temperature[i] != 300 and group_selection_number == 'Group 3':
                    Capital_K0=482139.64;QCapital_K=25311.27;k0=1854.94;Qk=51471.37;B0=14334.00;QB=39800.89;Cp0=0.4355;QCp=-10002.54;E0=17909544.89;QE=38982.62;n0=1.91;Qn=9627.82;A0=0.9355;QA=3850.37;R=8.314;n2=0.8;
                if (temperature[i] == 300 or temperature[i] == 350 or temperature[i] == 400) and group_selection_number == 'Group 4':
                    deltat = 0.01;Capital_K0=7.890000913;QCapital_K=11377.32622;k0=8.069481864;Qk=6254.171743;B0=0.000803419;QB=52670.07792;Cp0=282.2973753;QCp=-41145.02936;E0=0.001890987;QE=83755.80554;n0=0.093815135;Qn=25993.26292;A0=0.015642374;QA=27922.45815;R=8.314;n2=1.8;
                elif (temperature[i] != 300 or temperature[i] != 350 or temperature[i] != 400) and group_selection_number == 'Group 4':
                    deltat = 0.01;Capital_K0=0.050482395;QCapital_K=40346.88351;k0=0.007106738;Qk=49733.25495;B0=0.325017634;QB=23116.88686;Cp0=4.089994793;QCp=-20415.86739;E0=271.7686536;QE=20390.90734;n0=0.439003775;Qn=13135.96611;A0=3.62092E-05;QA=69701.75496;R=8.314;n2=1.8;
                if temperature[i] == 300 and group_selection_number == 'Group 5':
                    Capital_K0=31748228.7;QCapital_K=4095.537651;k0=123911.6256;Qk=27278.64367;B0=13040274.56;QB=6857.047231;Cp0=476166404.6;QCp=-82292.86054;E0=5412241451;QE=12195.51402;n0=1.025512696;Qn=9150.654257;A0=1.89*10**-7;QA=82292;R=8.314;n2=2;
                elif temperature[i] != 300 and group_selection_number == 'Group 5':
                    Capital_K0=538606.856;QCapital_K=25608.9334;k0=268.103;Qk=58852.79;B0=4037626.003;QB=12214.41596;Cp0=434.277;QCp=-10150.08461 ;E0=28064449.86;QE=38086.81736;n0=2.867;Qn=3916.636101;A0=2.61492*10**-7;QA=81356.87222;R=8.314;n2=2;
                if temperature[i] == 300 and group_selection_number == 'Group 6':
                    Capital_K0=6286652.61;QCapital_K=12247.05892;k0=28274877.83;Qk=484.352736;B0=8.143165405;QB=73417.96595;Cp0=8519436.036;QCp=-193291.2127;E0=55617180.79;QE=35712.242;n0=8.82E-06;Qn=68957.89652;A0=11.14646773;QA=148.7894676;R=8.314;n2=3.3675;
                elif temperature[i] != 300 and group_selection_number == 'Group 6':
                    Capital_K0=269240.1006;QCapital_K=28569.80399;k0=124744.2601;Qk=28582.60594;B0=17695.29273;QB=33608.8156;Cp0=0.023270466;QCp=-91132.603;E0=670359544.2;QE=22815.39036;n0=1.527556149;Qn=6467.839287;A0=0.000187791;QA=57093.28388;R=8.314;n2=3.3675;
                if temperature[i] == 300 and group_selection_number == 'Group 7':
                    Capital_K0=19175517;QCapital_K=8004.751;k0=928205.5988;Qk=10817.12152;B0=1790.093;QB=49201.07;Cp0=5681.848;QCp=-78419.7;E0=2.88*10**8;QE=24056.21;n0=0.00578671;Qn=38797.3983;A0=3.89E-05;QA=56888.5;R=8.314;n2=3.3675;
                elif temperature[i] != 300 and group_selection_number == 'Group 7':
                    Capital_K0=283100.3607;QCapital_K=29295.94784;k0=784945.9822;Qk=11659.42311;B0=194305.8;QB=25251.37;Cp0=6940.474;QCp=-79333.9;E0=267392130.7;QE=24384.91391;n0=0.258315;Qn=18698.09;A0=0.02765;QA=23171.63;R=8.314;n2=3.3675;
                K[i]= Capital_K0*np.exp(QCapital_K/R/(temperature[i]+273));
                k[i] = k0*np.exp(Qk/R/(temperature[i]+273));
                B[i] = B0*np.exp(QB/R/(temperature[i]+273));
                A[i] = A0*np.exp(QA/R/(temperature[i]+273));
                Cp[i] = Cp0*np.exp(QCp/R/(temperature[i]+273));
                E[i] = E0*np.exp(QE/R/(temperature[i]+273));
                n1[i]= n0*np.exp(Qn/R/(temperature[i]+273));

                init = np.array([0, 0, 1*10**-30, 0]);

                for j in range (0, len(etotalrate)):

                    def RK(t,y,i,j):
                        return [abs((y[3] - y[1] - k[i][0])/K[i][0])**n1[i][0], (0.5 * (B[i][0]/(y[2]**0.5))) * (A[i][0] * (1 - y[2]) * (abs((y[3] - y[1] - k[i][0])/K[i][0])**n1[i][0])) - (Cp[i][0] * (y[2]**n2)), (A[i][0] * (1 - y[2]) * (abs((y[3] - y[1] - k[i][0])/K[i][0])**n1[i][0])) - (Cp[i][0] * (y[2]**n2)), E[i][0] * (etotalrate[j] - (abs((y[3] - y[1] - k[i][0])/K[i][0])**n1[i][0]))]

                    t = np.linspace(0, 1/etotalrate[j], num=int(1/deltat))

                    sol = solve_ivp (RK, t_span=(t[0],t[-1]), y0=init, t_eval=t, args=(i,j))

                    stress.append(sol.y[3,:])

                    x = np.linspace(0,1, num=len(sol.y[3,:]))

                    pamstamp_strain.append(x)

                    Label = f'SR = {etotalrate[j]} /s Temp = {temperature[i]} °C'

                    fig.add_trace(go.Scatter(x=x,y=stress[u], mode='lines+markers', name = Label, connectgaps=True,line=dict(width=1)))

                    u += 1

                    del sol

        fig.update_layout(title='Flow Stress Material Card',
                        xaxis=dict(title='True Strain',showgrid=False),
                        yaxis=dict(title='True Stress (MPa)', showgrid=False),
                        plot_bgcolor='white'
        )

        pamstamp_index = np.zeros(shape=(len(pamstamp_strain),len(strain_ref)))

        pamstamp_stress= np.zeros(shape=(len(pamstamp_strain),len(strain_ref)))

        for i in range (0,len(pamstamp_strain)):
            for j in range(0,len(strain_ref)):
                pamstamp_index[i][j] = np.argmin(np.abs(strain_ref[j] - pamstamp_strain[i]))
                pamstamp_stress[i][j] = stress[i][int(pamstamp_index[i][j])]
            
        autoform_stress = np.array_split(pamstamp_stress, len(temperature));

        for i in range (0, len(autoform_stress)):
            line ='    Temperature ' + str(temperature[i]);
            outF.write(line)
            outF.write('\n')
            for j in range(0, len(strain_ref)):
                if autoform_stress[i][0][j] > autoform_stress[i][1][j]:
                    autoform_stress[i][1][j] = autoform_stress[i][0][j] + 1
                if autoform_stress[i][1][j] > autoform_stress[i][2][j]:
                    autoform_stress[i][2][j] = autoform_stress[i][1][j] + 1
                if  autoform_stress[i][0][j] < autoform_stress[i][0][j-1]:
                    autoform_stress[i][0][j] = autoform_stress[i][0][j-1] + 1
                if  autoform_stress[i][1][j] < autoform_stress[i][1][j-1]:
                    autoform_stress[i][1][j] = autoform_stress[i][1][j-1] + 1
                if  autoform_stress[i][2][j] < autoform_stress[i][2][j-1]:
                    autoform_stress[i][2][j] = autoform_stress[i][2][j-1] + 1                
                for k in range (0, len(SR_range)):
                    autoform_stress[i][k][0] = autoform_stress[i][k][1]/2 
                    autoform_stress[i][k][-3:] = autoform_stress[i][k][-4]
                if i == 0:
                    line = f"{j:>6}{strain_ref[j]:>11}{np.around(autoform_stress[i][0][j]/10**6,2):>11}{np.around(autoform_stress[i][1][j]/10**6,2):>11}{np.around(autoform_stress[i][2][j]/10**6,2):>11}"
                    outF.write(line)
                    outF.write('\n')
                elif group_selection_number == 'Group 4':
                    line = f"{j:>6}{strain_ref[j]:>11}{np.around(autoform_stress[i][0][j],2):>11}{np.around(autoform_stress[i][1][j],2):>11}{np.around(autoform_stress[i][2][j],2):>11}"
                    outF.write(line)
                    outF.write('\n')            
                else:
                    line = f"{j:>6}{'':>11}{np.around(autoform_stress[i][0][j]/10**6,2):>11}{np.around(autoform_stress[i][1][j]/10**6,2):>11}{np.around(autoform_stress[i][2][j]/10**6,2):>11}"
                    outF.write(line)
                    outF.write('\n')

        for i in np.linspace(96,133,num=38,dtype=int):
            line = linecache.getline(template_file_path, i)
            outF.write(line)

        outF.flush();
        outF.close();

        with open(output_filename, 'r') as f:
            autoform_contents = f.read()

        fig_asdict = fig.to_dict()

        return {
            'files': [
                {'filename': 'autoform_material_card.mat', 'data': autoform_contents}
            ],
            'figures': [
                {'figurename': 'material_card_figure_1', 'figure': fig_asdict}
            ]
        }        
