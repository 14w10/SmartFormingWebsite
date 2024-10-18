import linecache
from pathlib import Path

import numpy as np
import plotly.graph_objects as go


class Matcardhr():

    def run(self, blank_material_name, blank_material_thickness, blank_material_supplier, temperature_min,
            temperature_max, heating_rate, create_file=True, target_directory=None, **kwargs):
        print("Running material mate")

        print(f'blank_material_name: {blank_material_name}')
        print(f'blank_material_thickness: {blank_material_thickness}')
        print(f'blank_material_supplier: {blank_material_supplier}')
        print(f'temperature_min: {temperature_min}')
        print(f'temperature_max: {temperature_max}')
        print(f'hr: {heating_rate}')  # heating rate input in Cs^-1

        blank_material_thickness = 2
        blank_material_name = 'AA6111'
        blank_material_supplier = 'Novelis'
        strain_rate_min = 0.1
        strain_rate_max = 100
        
        
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
            if (
                    blank_material_name == 'AA2024' or blank_material_name == 'AA2060' or blank_material_name == 'AA5754' or blank_material_name == 'AA6082' or blank_material_name == 'AA6111' or blank_material_name == 'AA7075'):
                evalflag1 = True
            else:
                raise Exception('Error Unidentified material. Please input another material.')

        evalflag2 = False
        while evalflag2 == False:
            if (
                    blank_material_name == 'AA2024' and blank_material_thickness == 1 or blank_material_name == 'AA2060' and blank_material_thickness == 2 or blank_material_name == 'AA5754' and blank_material_thickness == 1.2 or blank_material_name == 'AA5754' and blank_material_thickness == 2 or blank_material_name == 'AA6082' and blank_material_thickness == 1 or blank_material_name == 'AA6082' and blank_material_thickness == 1.5 or blank_material_name == 'AA6082' and blank_material_thickness == 2 or blank_material_name == 'AA6082' and blank_material_thickness == 2.5 or blank_material_name == 'AA6082' and blank_material_thickness == 3 or blank_material_name == 'AA6082' and blank_material_thickness == 5 or blank_material_name == 'AA6111' and blank_material_thickness == 2 or blank_material_name == 'AA7075' and blank_material_thickness == 1.6 or blank_material_name == 'AA7075' and blank_material_thickness == 2):
                evalflag2 = True
            else:
                raise Exception('Error: Data unavailble for selected thickness. Please input another thickness.')

        evalflag0 = False
        while evalflag0 == False:
            if (
                    blank_material_name == 'AA2024' and blank_material_thickness == 1 and blank_material_supplier == 'Bombardier' or blank_material_name == 'AA2060' and blank_material_thickness == 2 and blank_material_supplier == 'NA' or blank_material_name == 'AA5754' and blank_material_thickness == 1.2 and blank_material_supplier == 'Novelis' or blank_material_name == '5754' and blank_material_thickness == 2 and blank_material_supplier == 'Novelis' or blank_material_name == 'AA6082' and blank_material_thickness == 1 and blank_material_supplier == 'AMAG' or blank_material_name == 'AA6082' and blank_material_thickness == 1.5 and blank_material_supplier == 'AMAG' or blank_material_name == 'AA6082' and blank_material_thickness == 2 and blank_material_supplier == 'Novelis' or blank_material_name == 'AA6082' and blank_material_thickness == 2.5 and blank_material_supplier == 'AMAG' or blank_material_name == 'AA6082' and blank_material_thickness == 3 and blank_material_supplier == 'Alcoa' or blank_material_name == 'AA6082' and blank_material_thickness == 3 and blank_material_supplier == 'NELA' or blank_material_name == 'AA6082' and blank_material_thickness == 5 and blank_material_supplier == 'AMAG' or blank_material_name == 'AA6111' and blank_material_thickness == 2 and blank_material_supplier == 'Novelis' or blank_material_name == 'AA7075' and blank_material_thickness == 1.6 and blank_material_supplier == 'AMAG' or blank_material_name == 'AA7075' and blank_material_thickness == 2 and blank_material_supplier == 'Schuler' or blank_material_name == 'AA7075' and blank_material_thickness == 2 and blank_material_supplier == 'Kaiser'):
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

        #  'What is the minimum temperature? (deg C) - from 200 deg C '
        temperature_min = float(temperature_min)

        #  'What is the maximum temperature? (deg C) - upto 500 deg C '
        temperature_max = float(temperature_max)

        if (temperature_max - temperature_min) >= 50:
            temperature = np.linspace(temperature_min, temperature_max, num=7, dtype=int)
        else:
            temperature = np.linspace(temperature_min, temperature_max, num=2)

        #user input heating rate
        hr=heating_rate #input heating rate
        
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
        Aa = np.zeros(shape=(len(temperature), 1))
        Bb = np.zeros(shape=(len(temperature), 1))
        Cc = np.zeros(shape=(len(temperature), 1))
        hr_coeff = np.zeros(shape=(len(temperature), 1))
        
        output_stress = []
        strain_ref = np.array([0, 0.02, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1])
        pamstamp_strain = []
        u = 0

        fig = go.Figure()

        # SR and time increment
        etotalrate = SR_range * 10 ** 3
        deltat = 0.00002
        threshold = 350  # last temperature on low temp

        for i in range(0, len(temperature)):
            R = 8.314
            if temperature[i] <= threshold:
                Capital_K0 = 31.46
                QCapital_K = 5393
                k0 = 0.19130
                Qk = 12809
                B0 = 0.535
                QB = 21869
                Cp0 = 15
                QCp = -22000
                E0 = 10000
                QE = 8500
                A0 = 36
                QA = -7422
                n0 = 4.98
                Qn = 4550
                n2 = 3.5
                Aa0 = -38.84134918
                QAa = 0.051721351
                Bb0 = 0.350345404
                QBb = -0.000461887
                Cc0 = 132.5239731
                QCc = -0.177001475
            else:
                Capital_K0 = 0.232
                QCapital_K = 31033
                k0 = 0.5
                Qk = 10
                B0 = 0.00322
                QB = 47668
                Cp0 = 0.1
                QCp = 10
                E0 = 10000
                QE = 8500
                A0 = 0.000427
                QA = 60074
                n0 = 1.34
                Qn = 8828
                n2 = 3.5
                Aa0 = -38.84134918
                QAa = 0.051721351
                Bb0 = 0.350345404
                QBb = -0.000461887
                Cc0 = 132.5239731
                QCc = -0.177001475

            K[i] = Capital_K0 * np.exp(QCapital_K / R / (temperature[i] + 273))
            k[i] = k0 * np.exp(Qk / R / (temperature[i] + 273))
            B[i] = B0 * np.exp(QB / R / (temperature[i] + 273))
            A[i] = A0 * np.exp(QA / R / (temperature[i] + 273))
            Cp[i] = Cp0 * np.exp(QCp / R / (temperature[i] + 273))
            E[i] = E0 * np.exp(QE / R / (temperature[i] + 273))
            
            n1[i] = n0 * np.exp(Qn / R / (temperature[i] + 273))
            Aa[i] = QAa*(temperature[i]+273)+Aa0
            Bb[i] = QBb*(temperature[i]+273)+Bb0
            Cc[i] = QCc*(temperature[i]+273)+Cc0
            hr_coeff[i] = Aa[i] * np.log(hr) + Bb[i]*hr + Cc[i]
            for j in range(0, len(etotalrate)):
                rho = 0.000001
                strain_p = 0
                stress = E[i] * deltat
                stress_list = np.linspace(0, 1, num=int(1 / deltat))
                strain_list = np.linspace(0, 1, num=int(1 / deltat))
                pamstamp_strain.append(strain_list)

                for m, strain in enumerate(strain_list):
                    R_1 = B[i] * np.sqrt(rho)
                    d_strain_p = ((stress - R_1 - k[i] - hr_coeff[i]) / K[i]) ** n1[i]
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

        return {'files': [{'filename': f'autoform_material_card.mat', 'data': autoform_contents}],
            'figures': [{'figurename': 'material_card_figure', 'figure': fig_asdict}]}


