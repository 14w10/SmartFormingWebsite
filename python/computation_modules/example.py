import plotly.graph_objects as go
import numpy as np

def main():
    different_temperatures = {'400': [[1, 2, 3, 4, 5], [10, 20, 30, 30, 60]],
                              '500': [[1.5, 2.5, 3.5], [20, 50, 70]]}
    different_strain_rates = {'0.3': [[3, 5, 7], [4, 8, 12]]}

    x = np.array([[1,2,3], [4,5,6,7,8]])

    # Create traces
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=different_temperatures['400'][0], y=different_temperatures['400'][1],
                        mode='lines',
                        name='lines'))
    fig.add_trace(go.Scatter(x=different_temperatures['500'][0], y=different_temperatures['500'][1],
                        mode='lines+markers',
                        name='lines+markers'))
    fig.show()

def plotting_test():

    arr = np.array([[7.539223834326107,  10.007908526667622],
                    [7.058585214543763,  10.003280154665209],
                    [8.486681490968568,  10.003226516254873],
                    [10.008947267257755, 7.609329200969625],
                    [3.1415926542,       8.34435352]])
    
    arr = np.amax(arr, axis=1)
    arr[arr > 10] = 10

    print(arr)

if __name__ == "__main__":
    # main()
    # plotting_test()
    from pathlib import Path
    template_file_path = Path(__file__).resolve().parents[0].joinpath('template_output_file.psm').absolute()
    print(type(str(template_file_path)))