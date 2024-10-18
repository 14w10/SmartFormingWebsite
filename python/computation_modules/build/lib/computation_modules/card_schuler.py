import numpy as np
from scipy.integrate import solve_ivp
import plotly.io as pio
import plotly.graph_objects as go
import linecache
from pathlib import Path

from datetime import date
from .utils import print_saving_file_text
from .abstract_modules import AbstractModulePreFe

class CardSchuler(AbstractModulePreFe):

    def run(self, material_schuler_name, strain_rate_min, strain_rate_max,
        temperature_min, temperature_max, create_file=True,
        target_directory=None, **kwargs):
        print("Running material mate")

        # print(f'blank_material_name: {blank_material_name}')
        # print(f'blank_material_thickness: {blank_material_thickness}')
        # print(f'blank_material_supplier: {blank_material_supplier}')
        # print(f'strain_rate_min: {strain_rate_min}')
        # print(f'strain_rate_max: {strain_rate_max}')
        # print(f'temperature_min: {temperature_min}')
        # print(f'temperature_max: {temperature_max}')

        blank_material_name = 'AA6082'
        blank_material_thickness = '2'
        blank_material_supplier = 'Novelis'
        strain_rate_min = 0.1
        strain_rate_max = 10
        temperature_min = 200
        temperature_max = 550

        output_filename = 'AA6082_AF_Schuler.mat'
        outF = open(output_filename, 'w')
        template_file_path = str(Path(__file__).resolve().parents[0].joinpath('AA6082_Ushape_AF_co_example.mat').absolute())

        for i in np.linspace(0,132,num=133,dtype=int):
            line = linecache.getline(template_file_path, i)
            outF.write(line)

        blank_material_thickness = float(blank_material_thickness)

        evalflag1 = False
        while evalflag1 == False:
            if (blank_material_name == 'AA2024' or
                blank_material_name == 'AA2060' or
                blank_material_name == 'AA5754' or
                blank_material_name == 'AA6082' or
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

        SR_range = np.logspace(np.log10(strain_rate_min), np.log10(strain_rate_max), num= int(np.log10(strain_rate_max/strain_rate_min)+1))
        #a = " ".join(map(str, SR_range))

        #line='            VALUES = '+  a
        #outF.write(line)
        #outF.write('\n')

        #for i in np.linspace(21,26,num=6,dtype=int):
        #    line = linecache.getline(template_file_path, i)
        #    outF.write(line)

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

        if (blank_material_name == 'AA2024' and blank_material_thickness == 1 and blank_material_supplier == 'Bombardier'):
            # AA2024 Temperature dependent constants
            Capital_K0=3;QCapital_K=19250;k0=0.54;Qk=14000;B0=0.1;QB=31000;Cp0=120;QCp=-25000;E0=10000;QE=8500;n0=4.8;Qn=2500;A0=2;QA=12500;
            # AA2024 Temperature independent constants
            R=8.314;
            n2=2;

        elif (blank_material_name == 'AA2060' and blank_material_thickness == 2 and blank_material_supplier == 'NA'):
            # AA2060 Temperature dependent constants
            Capital_K0=0.5103;QCapital_K=2.9231e+04;k0=1.0900e-10;Qk=9.8723e+04;B0=87.6630;QB=2.8928e+03;Cp0=31.1714;QCp=-2.7400e+03;E0=9.9179e+03;QE=9.5914e+03;n0=0.7477;Qn=1.1645e+04;A0=0.0304;QA=1017.95;
            # AA2060 Temperature independent constants
            R=8.314;
            n2=3;

        elif (blank_material_name == 'AA5754' and blank_material_thickness == 1.2 and blank_material_supplier == 'Novelis'):
            # AA5754 Temperature dependent constants
            Capital_K0=23;QCapital_K=5500;k0=12.3000;Qk=4920;B0=303.5000;QB=1090;Cp0=9.0000e+09;QCp=-100000;E0=20000;QE=4300;n0=0.8300;Qn=10790;A0=0.0042;QA=18790;
            # AA5754 Temperature independent constants
            R=8.314;
            n2=1.8;

        elif (blank_material_name == 'AA5754' and blank_material_thickness == 2 and blank_material_supplier == 'Novelis'):
            # AA5754 Temperature dependent constants
            Capital_K0=23;QCapital_K=5500;k0=12.3000;Qk=4920;B0=303.5000;QB=1090;Cp0=9.0000e+09;QCp=-100000;E0=20000;QE=4300;n0=0.8300;Qn=10790;A0=0.0042;QA=18790;
            # AA5754 Temperature independent constants
            R=8.314;
            n2=1.8;

        elif (blank_material_name == 'AA6082' and blank_material_thickness == 1 and blank_material_supplier == 'AMAG'):
            # AA6082 Temperature dependent constants
            Capital_K0=2.685589;QCapital_K=16232.75;k0=0.141961413;Qk=11703.8;B0=0.0740511;QB=31048.65;Cp0=2.67E-02;QCp=-4141.205;E0=18840.278;QE=5865;n0=3.007172;Qn=5876.832;A0=14;QA=0;
            # AA6082 Temperature independent constants
            R=8.314;
            n2=5;

        elif (blank_material_name == 'AA6082' and blank_material_thickness == 1.5 and blank_material_supplier == 'AMAG'):
            # AA6082 Temperature dependent constants
            Capital_K0=2.685589;QCapital_K=16232.75;k0=0.141961413;Qk=11703.8;B0=0.0740511;QB=31048.65;Cp0=2.67E-02;QCp=-4141.205;E0=18840.278;QE=5865;n0=3.007172;Qn=5876.832;A0=14;QA=0;
            # AA6082 Temperature independent constants
            R=8.314;
            n2=5;

        elif (blank_material_name == 'AA6082' and blank_material_thickness == 2 and blank_material_supplier == 'Novelis'):
            # AA6082 Temperature dependent constants
            Capital_K0=2.685589;QCapital_K=16232.75;k0=0.141961413;Qk=11703.8;B0=0.0740511;QB=31048.65;Cp0=2.67E-02;QCp=-4141.205;E0=18840.278;QE=5865;n0=3.007172;Qn=5876.832;A0=14;QA=0;
            # AA6082 Temperature independent constants
            R=8.314;
            n2=5;

        elif (blank_material_name == 'AA6082' and blank_material_thickness == 2.5 and blank_material_supplier == 'AMAG'):
            # AA6082 Temperature dependent constants
            Capital_K0=4.0221;QCapital_K=1.5141e+04;k0=1.0976e-04;Qk=2.7035e+04;B0=0.2540;QB=2.6348e+04;Cp0=19.2825;QCp=-7.5363e+03;E0=6.1765e+03;QE=1.1061e+04;n0=3.2907;Qn=2.9531e+03;A0=0.1682;QA=14808.42
            # AA6082 Temperature independent constants
            R=8.314;
            n2=5;

        elif (blank_material_name == 'AA6082' and blank_material_thickness == 3 and blank_material_supplier == 'Alcoa'):
            # AA6082 Alcoa Temperature dependent constants
            Capital_K0=3.9302;QCapital_K=1.4728e+04;k0=9.2352e-05;Qk=2.8119e+04;B0=0.0456;QB=3.6368e+04;Cp0=872.7071;QCp=-2.6945e+04;E0=5.7336e+03;QE=1.1521e+04;n0=3.5498;Qn=2.9400e+03;A0=0.1592;QA=16468.76;
            # AA6082 Alcoa Temperature independent constants
            R=8.314;
            n2=5;

        elif (blank_material_name == 'AA6082' and blank_material_thickness == 3 and blank_material_supplier == 'NELA'):
            # AA6082 NELA Temperature dependent constants
            Capital_K0=2.16;QCapital_K=18384.21;k0=2.83E-08;Qk=62598.4;B0=19.36;QB=11683.86;Cp0=25.51;QCp=-1425.08;E0=2328.55;QE=1.1521e+04;n0=1.363;Qn=9061.22;A0=0.00225;QA=11793.55;
            # AA6082 NELA Temperature independent constants
            R=8.314;
            n2=5;

        elif (blank_material_name == 'AA6082' and blank_material_thickness == 5 and blank_material_supplier == 'AMAG'):
            # AA6082 Temperature dependent constants
            Capital_K0=3.3431;QCapital_K=1.4904e+04;k0=0.0024;Qk=2.1013e+04;B0=0.1254;QB=2.6951e+04;Cp0=84.8004;QCp=-8.6715e+03;E0=5.7664e+03;QE=1.1489e+04;n0=3.2907;Qn=2.9531e+03;A0=0.1096;QA=19847.6;
            # AA6082 Temperature independent constants
            R=8.314;
            n2=5;

        elif (blank_material_name == 'AA7075' and blank_material_thickness == 1.6 and blank_material_supplier == 'AMAG'):
            # AA7075 Temperature dependent constants
            Capital_K0=2.5;QCapital_K=20035.5;k0=0.21;Qk=14300.98;B0=0.1;QB=31500;Cp0=200;QCp=-30000;E0=15000;QE=9876.6;n0=3;Qn=3100;A0=2;QA=11000;
            # AA7075 Temperature independent constants
            R=8.314;
            n2=2;

        elif (blank_material_name == 'AA7075' and blank_material_thickness == 2 and blank_material_supplier == 'Schuler'):
            # AA7075 Kaiser Temperature dependent constants
            Capital_K0=0.0563;QCapital_K=38268.4;k0=0.71577;Qk=1091.435;B0=6.91712;QB=10287.8;Cp0=64.7802;QCp=-16875.948;E0=29584.3;QE=2402.25;n0=3.40757;Qn=2.3821e+03;A0=460.54;QA=-8645.72;
            # AA7075 Kaiser Temperature independent constants
            R=8.314;
            n2=5;


        elif (blank_material_name == 'AA7075' and blank_material_thickness == 2 and blank_material_supplier == 'Kaiser'):
            # AA7075 Kaiser Temperature dependent constants
            Capital_K0=2.8434;QCapital_K=19531;k0=0.8248;Qk=414.5194;B0=4.2321;QB=1.2682e+04;Cp0=78.4452;QCp=-1.5564e+04;E0=1.3202e+04;QE=7.5961e+03;n0=3.4076;Qn=2382.0615;A0=125.08;QA=-2501.97;
            # AA7075 Kaiser Temperature independent constants
            R=8.314;
            n2=5;

        # SR and time increment
        etotalrate = SR_range*10**3;

        deltat = 0.001;

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

# for i in range (0,len(pamstamp_strain)):
#     for j in range(0,len(strain_ref)):
#         pamstamp_index[i][j] = np.argmin(np.abs(strain_ref[j] - pamstamp_strain[i]))
#         pamstamp_stress[i][j] = stress[i][int(pamstamp_index[i][j])]
#     a = " ".join(map(str, pamstamp_stress[i]))
#     line='            VALUES = '+  a
    # outF.write(line)
    # outF.write('\n')

# for i in np.linspace(50,51,num=2,dtype=int):
#     line = linecache.getline(template_file_path, i)
    # outF.write(line)

# a = "_".join([blank_material_name,str(blank_material_thickness),blank_material_supplier,'HOT'])
# line='    REFERENCE = '+  '\'' + a + '\''
# outF.write(line)
# outF.write('\n')

# for i in np.linspace(53,53,num=1,dtype=int):
#     line = linecache.getline(template_file_path, i)
#     outF.write(line)

# a = date.today().strftime("%A %B %d %Y")
# line='    CREATION_DATE = '+  '\'' + a + '\''
# outF.write(line)
# outF.write('\n')

# for i in np.linspace(55,57,num=3,dtype=int):
#     line = linecache.getline(template_file_path, i)
#     outF.write(line)

# a = "_".join([blank_material_name,str(blank_material_thickness),blank_material_supplier,'HOT'])
# line='    NAME = '+  '\'' + a + '\''
# outF.write(line)
# outF.write('\n')

# for i in np.linspace(59,61,num=3,dtype=int):
#     line = linecache.getline(template_file_path, i)
#     outF.write(line)

# if (blank_material_name == 'AA2024' or blank_material_name == 'AA6082' and blank_material_thickness == 3 and blank_material_supplier == 'NELA' or blank_material_name == 'AA7075'):
#     line ='    ANISOTROPIC_TYPE = ISOTROPIC'
#     outF.write(line)
#     outF.write('\n')
# else:
#     line='    ANISOTROPIC_TYPE = ORTHOTROPIC'
#     outF.write(line)
#     outF.write('\n')

# if (blank_material_name == 'AA2024' or blank_material_name == 'AA6082' and blank_material_thickness == 3 and blank_material_supplier == 'NELA' or blank_material_name == 'AA7075'):
#     for i in np.linspace(63,65,num=3,dtype=int):
#         line = linecache.getline(template_file_path, i)
#         outF.write(line)
#     for i in np.linspace(69,107,num=39,dtype=int):
#         line = linecache.getline(template_file_path, i)
#         outF.write(line)

# else:
#     for i in np.linspace(63,107,num=45,dtype=int):
#         line = linecache.getline(template_file_path, i)
#         outF.write(line)

        outF.flush()
        outF.close()

        with open(output_filename, 'r') as f:
            psm_contents = f.read()

        fig_asdict = fig.to_dict()

        return {
            'files': [
                {'filename': 'AA6082_AF_Schuler.mat', 'data': psm_contents}
            ],
            'figures': [
                {'figurename': 'material_card_figure_1', 'figure': fig_asdict}
            ]
        }
