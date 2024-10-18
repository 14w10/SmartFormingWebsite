import numpy as np
from scipy.integrate import solve_ivp
import plotly.io as pio
import plotly.graph_objects as go
import linecache
from pathlib import Path

from datetime import date
from .utils import print_saving_file_text
from .abstract_modules import AbstractModulePreFe


class Mpt2324(AbstractModulePreFe):

    def run(self, blank_material_name, blank_material_thickness,
            blank_material_supplier, group_selection_number, temperature_min, temperature_max,
            create_file=True, target_directory=None, **kwargs):
        print("Running material mate")

        print(f'blank_material_name: {blank_material_name}')
        print(f'blank_material_thickness: {blank_material_thickness}')
        print(f'blank_material_supplier: {blank_material_supplier}')
        print(f'temperature_min: {temperature_min}')
        print(f'temperature_max: {temperature_max}')

        blank_material_thickness = 2;
        blank_material_name = 'AA6111';
        blank_material_supplier = 'Novelis';
        group_num = group_selection_number.split(' ')[-1]
        strain_rate_min = 0.1;
        strain_rate_max = 100;

        output_filename = 'material_mate_result.mat'
        outF = open(output_filename, 'w')
        template_file_path = str(
            Path(__file__).resolve().parents[0].joinpath('AA6082_Ushape_AF_co_example.mat').absolute())

        for i in np.linspace(0, 19, num=20, dtype=int):
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
            if (
                    blank_material_name == 'AA2024' and blank_material_thickness == 1 and blank_material_supplier == 'Bombardier' or
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

        SR_range = np.array([0.1, 1, 5]) / 1000
        a = "".join([format(el, '>11') for el in map(str, SR_range * 1000)])

        line = '    StrainRates 3' + a
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
            temperature = np.linspace(temperature_min, temperature_max,
                                      num=6, dtype=int)
        else:
            temperature = np.linspace(temperature_min, temperature_max, num=2)

        # a = " ".join(map(str, temperature))

        # line='            VALUES = '+  a
        # outF.write(line)
        # outF.write('\n')

        # for i in np.linspace(28,29,num=2,dtype=int):
        #     line = linecache.getline(template_file_path, i)
        #     outF.write(line)

        K = np.zeros(shape=(len(temperature), 1))
        k = np.zeros(shape=(len(temperature), 1))
        B = np.zeros(shape=(len(temperature), 1))
        A = np.zeros(shape=(len(temperature), 1))
        Cp = np.zeros(shape=(len(temperature), 1))
        E = np.zeros(shape=(len(temperature), 1))
        n1 = np.zeros(shape=(len(temperature), 1))

        output_stress = []
        strain_ref = np.array([0, 0.02, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1])
        pamstamp_strain = []
        u = 0

        fig = go.Figure()

        # SR and time increment
        etotalrate = SR_range * 10 ** 3
        deltat = 0.00002

        for i in range(0, len(temperature)):
            if temperature[i] <= 325 and group_selection_number == 'Group 1':
                Capital_K0 = 40.97;
                QCapital_K = 4319.7;
                k0 = 1.71E-09;
                Qk = 86457;
                B0 = 24.28;
                QB = 15763;
                Cp0 = 233982;
                QCp = -17645;
                E0 = 3613;
                QE = 13045;
                n0 = 3.19;
                Qn = 5807.4;
                A0 = 4.37E-06;
                QA = 40031;
                R = 8.314;
                n2 = 2.2;
            elif temperature[i] > 325 and group_selection_number == 'Group 1':
                Capital_K0 = 0.047;
                QCapital_K = 40854;
                k0 = 1.71E-09;
                Qk = 86457;
                B0 = 24.28;
                QB = 15763;
                Cp0 = 233982;
                QCp = -17645;
                E0 = 3613;
                QE = 13045;
                n0 = 3.19;
                Qn = 5807.4;
                A0 = 4.37E-06;
                QA = 40031;
                R = 8.314;
                n2 = 2.2;
            if temperature[i] <= 375 and group_selection_number == 'Group 2':
                Capital_K0 = 23.29376643;
                QCapital_K = 6535.247985;
                k0 = 1.734924694;
                Qk = 6545.756471;
                B0 = 0.927794223;
                QB = 20536.25077;
                Cp0 = 43.95593917;
                QCp = -2619.047767;
                E0 = 27406.29476;
                QE = 3680.507509;
                n0 = 0.368717179;
                Qn = 11126.87356;
                A0 = 2.573065606;
                QA = 2634.068454;
                R = 8.314;
                n2 = 3;
            elif temperature[i] > 375 and group_selection_number == 'Group 2':
                Capital_K0 = 0.133794638;
                QCapital_K = 34329.4168;
                k0 = 0.028574484;
                Qk = 29250.30524;
                B0 = 0.103089802;
                QB = 27834.26986;
                Cp0 = 31.56571235;
                QCp = -939.2595841;
                E0 = 8491.690395;
                QE = 10491.43163;
                n0 = 0.000930631;
                Qn = 43585.19332;
                A0 = 0.135550974;
                QA = 15195.70083;
                R = 8.314;
                n2 = 3;
            if temperature[i] <= 350 and group_selection_number == 'Group 3':
                Capital_K0 = 5.747;
                QCapital_K = 6676.427554;
                k0 = 21.40058;
                Qk = 5958.2886;
                B0 = 7.77775;
                QB = 10927.3997;
                Cp0 = 541.50031;
                QCp = -18875.3018;
                E0 = 25516.71008;
                QE = 3052.0759;
                n0 = 2.34936;
                Qn = 6260.2368;
                A0 = 1.29138;
                QA = 7321.886;
                R = 8.314;
                n2 = 3;
            elif temperature[i] > 350 and group_selection_number == 'Group 3':
                Capital_K0 = 0.1665;
                QCapital_K = 24797.9795;
                k0 = 0.3962;
                Qk = 24832.8681;
                B0 = 0.1702;
                QB = 28996.1928;
                Cp0 = 687.9722;
                QCp = -27066.5049;
                E0 = 36938.1450;
                QE = 3129.9686;
                n0 = 8.2430;
                Qn = 6482.5333;
                A0 = 12.9268;
                QA = 627.4651;
                R = 8.314;
                n2 = 3;
            if temperature[i] <= 375 and group_selection_number == 'Group 4':
                Capital_K0 = 1.464e+01;
                QCapital_K = 8.504e+03;
                k0 = 4.5e-07;
                Qk = 1.2e+04;
                B0 = 8.0654e+01;
                QB = 1.0245e+04;
                Cp0 = 2.7e+05;
                QCp = 1.1e+03;
                E0 = 9.11e+03;
                QE = 8.5781e+03;
                n0 = 1.2;
                Qn = 1.005e+04;
                A0 = 8e-02;
                QA = 1e+03;
                R = 8.314;
                n2 = 3;
            elif temperature[i] > 375 and group_selection_number == 'Group 4':
                Capital_K0 = 0.0866307886034174;
                QCapital_K = 37311.9;
                k0 = 1.48007927563291E-07;
                Qk = 58360.299;
                B0 = 34.3155978973948;
                QB = 7030.0107;
                Cp0 = 770658.019753258;
                QCp = -1351.0398;
                E0 = 8292.44385315521;
                QE = 2843.9313;
                n0 = 0.799235206852371;
                Qn = 11256.726;
                A0 = 0.0255939316632598;
                QA = 482.22099;
                R = 8.314;
                n2 = 3;
            if temperature[i] <= 300 and group_selection_number == 'Group 5':
                Capital_K0 = 17.8239;
                QCapital_K = 4873.92;
                k0 = 14.3368;
                Qk = 5569.41;
                B0 = 4.70458;
                QB = 12758.9;
                Cp0 = 28.7896;
                QCp = -24874.2;
                E0 = 23315.29;
                QE = 5323.417;
                n0 = 2.21073;
                Qn = 5041.91;
                A0 = 8.8586;
                QA = 1175.95;
                R = 8.314;
                n2 = 2;
            elif temperature[i] > 300 and group_selection_number == 'Group 5':
                Capital_K0 = 0.25068;
                QCapital_K = 25450.9;
                k0 = 0.24337;
                Qk = 25825.67;
                B0 = 0.11758;
                QB = 30099.34;
                Cp0 = 857.46842;
                QCp = -28285.93;
                E0 = 36007.8;
                QE = 3270.69;
                n0 = 1.55832;
                Qn = 6770.07;
                A0 = 9.9190;
                QA = 670.234;
                R = 8.314;
                n2 = 2;
            if temperature[i] <= 325 and group_selection_number == 'Group 6':
                Capital_K0 = 38.24450921;
                QCapital_K = 2374.5825;
                k0 = 2.554611;
                Qk = 11991.3;
                B0 = 49.93889;
                QB = 9185.87;
                Cp0 = 77.5637361;
                QCp = -1729.1448;
                E0 = 28452.7;
                QE = 4955.25;
                n0 = 3.47818e-6;
                Qn = 52072.953;
                A0 = 0.16868875;
                QA = 4591.0257;
                R = 8.314;
                n2 = 1.5;
            elif temperature[i] > 325 and group_selection_number == 'Group 6':
                Capital_K0 = 1.048331654;
                QCapital_K = 17593.932;
                k0 = 0.0030503;
                Qk = 52906.446;
                B0 = 0.2676166;
                QB = 29169.762;
                Cp0 = 47667.25676;
                QCp = -34803.942;
                E0 = 6904.302;
                QE = 13288.521;
                n0 = 0.000729246;
                Qn = 26758.2;
                A0 = 2.09527e-8;
                QA = 87562.47;
                R = 8.314;
                n2 = 1.5;
            if temperature[i] <= 350 and group_selection_number == 'Group 7':
                Capital_K0 = 66.70634;
                QCapital_K = 2868.496;
                k0 = 0.031556;
                Qk = -20633.7;
                B0 = 56.55423;
                QB = 8679.816;
                Cp0 = 25.02061;
                QCp = 594.8168;
                E0 = 55105.24;
                QE = -7.39697;
                n0 = 1.950918;
                Qn = 6988.333;
                A0 = 7.73E-05;
                QA = 32199.29;
                R = 8.314;
                n2 = 5;
            elif temperature[i] > 350 and group_selection_number == 'Group 7':
                Capital_K0 = 0.235416;
                QCapital_K = 31423.59;
                k0 = 2.54E-05;
                Qk = 17604.06;
                B0 = 2.433912;
                QB = 20649.48;
                Cp0 = 151.4416;
                QCp = -8720.55;
                E0 = 54775.59;
                QE = 27.18844;
                n0 = 10.51182;
                Qn = -2878.31;
                A0 = 8.84E-05;
                QA = 32974.99;
                R = 8.314;
                n2 = 5;
            if temperature[i] <= 325 and group_selection_number == 'Group 8':
                Capital_K0 = 49.1104701;
                QCapital_K = 4364.60413;
                k0 = 0.000424;
                Qk = 15706.41;
                B0 = 9.173691;
                QB = 17385.36;
                Cp0 = 24.0167106;
                QCp = -839.502202;
                E0 = 2887.72629;
                QE = 9878.0084;
                n0 = 27.04738;
                Qn = 1913.563;
                A0 = 0.00579;
                QA = 10837.32;
                R = 8.314;
                n2 = 3;
            elif temperature[i] > 325 and group_selection_number == 'Group 8':
                Capital_K0 = 0.25553395;
                QCapital_K = 31158.3778;
                k0 = 0.00011975;
                Qk = 21512.475;
                B0 = 0.4725555;
                QB = 30266.286;
                Cp0 = 23.6059784;
                QCp = -711.35415;
                E0 = 2207.9064;
                QE = 11466.669;
                n0 = 0.210357;
                Qn = 22754.01;
                A0 = 0.000276;
                QA = 25147.36;
                R = 8.314;
                n2 = 3;
            if temperature[i] <= 325 and group_selection_number == 'Group 9':
                Capital_K0 = 26.8402;
                QCapital_K = 4602.797;
                k0 = 22.1602;
                Qk = 1449.13;
                B0 = 8.3964;
                QB = 14946.08;
                Cp0 = 2699.711;
                QCp = -15656.09;
                E0 = 4461.77;
                QE = 13843.6;
                n0 = 3.6357;
                Qn = 1965.845;
                A0 = 4.4039;
                QA = 6518.843;
                R = 8.314;
                n2 = 2;
            elif temperature[i] > 325 and group_selection_number == 'Group 9':
                Capital_K0 = 0.0215;
                QCapital_K = 40869.129;
                k0 = 0.1259;
                Qk = 30508.223;
                B0 = 53.5;
                QB = 4150.6814;
                Cp0 = 531.6046;
                QCp = -11333.6448;
                E0 = 3.0688;
                QE = 53896.3;
                n0 = 0.6836;
                Qn = 9169.5106;
                A0 = 0.00019;
                QA = 30206.4248;
                R = 8.314;
                n2 = 2;

            K[i] = Capital_K0 * np.exp(QCapital_K / R / (temperature[i] + 273));
            k[i] = k0 * np.exp(Qk / R / (temperature[i] + 273));
            B[i] = B0 * np.exp(QB / R / (temperature[i] + 273));
            A[i] = A0 * np.exp(QA / R / (temperature[i] + 273));
            Cp[i] = Cp0 * np.exp(QCp / R / (temperature[i] + 273));
            E[i] = E0 * np.exp(QE / R / (temperature[i] + 273));
            n1[i] = n0 * np.exp(Qn / R / (temperature[i] + 273));

            for j in range(0, len(etotalrate)):
                rho = 0.000001
                strain_p = 0
                stress = E[i] * deltat
                stress_list = np.linspace(0, 1, num=int(1 / deltat))
                strain_list = np.linspace(0, 1, num=int(1 / deltat))
                pamstamp_strain.append(strain_list)

                for m, strain in enumerate(strain_list):
                    R_1 = B[i] * np.sqrt(rho)
                    d_strain_p = ((stress - R_1 - k[i]) / K[i]) ** n1[i]
                    if not d_strain_p > 0:
                        d_strain_p = 0
                    strain_p = strain_p + d_strain_p * deltat / etotalrate[j]
                    d_rho = A[i] * (1 - rho) * d_strain_p - Cp[i] * rho ** n2
                    rho = rho + d_rho * deltat / etotalrate[j]
                    stress = E[i] * (strain - strain_p)
                    stress_list[m] = stress

                output_stress.append(stress_list)

                Label = f'SR = {etotalrate[j]} /s Temp = {temperature[i]} °C'
                fig.add_trace(go.Scatter(x=strain_list[::5], y=output_stress[u][::5], mode='lines+markers', name=Label,
                                         connectgaps=True, line=dict(width=1)))
                u += 1

        fig.update_layout(title='Flow Stress Material Card', xaxis=dict(title='True Strain', showgrid=False),
                          yaxis=dict(title='True Stress (MPa)', showgrid=False), plot_bgcolor='white')

        pamstamp_index = np.zeros(shape=(len(pamstamp_strain), len(strain_ref)))

        pamstamp_stress = np.zeros(shape=(len(pamstamp_strain), len(strain_ref)))

        for i in range(0, len(pamstamp_strain)):
            for j in range(0, len(strain_ref)):
                pamstamp_index[i][j] = np.argmin(np.abs(strain_ref[j] - pamstamp_strain[i]))
                pamstamp_stress[i][j] = output_stress[i][int(pamstamp_index[i][j])]

        autoform_stress = np.array_split(pamstamp_stress, len(temperature))

        for i in range(0, len(autoform_stress)):
            line = '    Temperature ' + str(temperature[i])
            outF.write(line)
            outF.write('\n')
            for j in range(0, len(strain_ref)):
                if autoform_stress[i][0][j] > autoform_stress[i][1][j]:
                    autoform_stress[i][1][j] = autoform_stress[i][0][j] + 1
                if autoform_stress[i][1][j] > autoform_stress[i][2][j]:
                    autoform_stress[i][2][j] = autoform_stress[i][1][j] + 1
                if autoform_stress[i][0][j] < autoform_stress[i][0][j - 1]:
                    autoform_stress[i][0][j] = autoform_stress[i][0][j - 1] + 1
                if autoform_stress[i][1][j] < autoform_stress[i][1][j - 1]:
                    autoform_stress[i][1][j] = autoform_stress[i][1][j - 1] + 1
                if autoform_stress[i][2][j] < autoform_stress[i][2][j - 1]:
                    autoform_stress[i][2][j] = autoform_stress[i][2][j - 1] + 1
                for k in range(0, len(SR_range)):
                    autoform_stress[i][k][0] = autoform_stress[i][k][1] / 2
                    autoform_stress[i][k][-3:] = autoform_stress[i][k][-4]
                if i == 0:
                    line = f"{j:>6}{strain_ref[j]:>11}{np.around(autoform_stress[i][0][j], 2):>11}{np.around(autoform_stress[i][1][j], 2):>11}{np.around(autoform_stress[i][2][j], 2):>11}"
                    outF.write(line)
                    outF.write('\n')
                else:
                    line = f"{j:>6}{'':>11}{np.around(autoform_stress[i][0][j], 2):>11}{np.around(autoform_stress[i][1][j], 2):>11}{np.around(autoform_stress[i][2][j], 2):>11}"
                    outF.write(line)
                    outF.write('\n')

        for i in np.linspace(96, 133, num=38, dtype=int):
            line = linecache.getline(template_file_path, i)
            outF.write(line)

        outF.flush()
        outF.close()

        with open(output_filename, 'r') as f:
            autoform_contents = f.read()

        fig_asdict = fig.to_dict()

        return {
            'files': [
                {'filename': f'group{group_num}_autoform_material_card.mat', 'data': autoform_contents}
            ],
            'figures': [
                {'figurename': 'group{group_num}_material_card_figure', 'figure': fig_asdict}
            ]
        }


