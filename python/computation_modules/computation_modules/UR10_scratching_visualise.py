import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from scipy.interpolate import make_interp_spline
import os

def preprocess_data(file_path):
    # Load the CSV file
    cycle_data = pd.read_csv(file_path).iloc[20:]
    head, tail = os.path.split(file_path)
    # Process the data

    cycle_data['timestamp_0'] = cycle_data['timestamp'] - cycle_data['timestamp'].iloc[0]

    cycle_data['timestep'] = cycle_data['timestamp'].diff().fillna(0)

    cycle_data['velocity_x'] = cycle_data['position_x'].diff() * -1000 * 125

    cycle_data['cof'] = abs(cycle_data['force_y'] / cycle_data['force_z'])

    cycle_data['sliding_distance'] = (cycle_data['position_x'] - cycle_data['position_x'].iloc[0]) * -1000

    cycle_data.to_csv(os.path.join(head, f'{tail[:15]}_processed.csv'), index=False)

    print(f"Processed data saved to {os.path.join(head, f'{tail[:15]}_processed.csv')}")

    return cycle_data


def plot_cof(file_path):
    """
    Plots the friction coefficients against sliding distance for single cycle.
    """
    # Plot using seaborn
    cycle_data = preprocess_data(file_path)
    head, tail = os.path.split(file_path)
    plt.figure(figsize=(12, 8))
    plt.title('Coefficient of Friction vs Sliding Distance', fontsize=16)
    plt.xlabel('Sliding Distance (mm)', fontsize=14)
    plt.ylabel('Coefficient of Friction', fontsize=14)
    plt.plot(cycle_data['sliding_distance'], cycle_data['cof'])
    plt.xticks(fontsize=11)
    plt.yticks(fontsize=11)
    plt.ylim([0, None])
    plt.grid(True, linestyle='--')
    plt.savefig(os.path.join(head, f'{tail[:15]}_cof.png'), dpi=200)
    # plt.savefig(os.path.join(head, 'figures', f'{tail[:13]}_cof.svg'), transparent=True)
    # plt.savefig(os.path.join(head, 'figures', f'{tail[:13]}_cof.pdf'))
    # plt.show()
    print(f"Figure saved to {os.path.join(head, f'{tail[:15]}_cof.png')}")
    plt.close()


def get_all_data(folder_path):
    all_files = os.listdir(folder_path)
    processed_files = sorted([f for f in all_files if f.endswith('_processed.csv')])
    processed_file_paths = [os.path.join(folder_path, f) for f in processed_files]

    all_data = pd.DataFrame()

    for i, file_path in enumerate(processed_file_paths):
        cycle_data = pd.read_csv(file_path)
        cycle_data['cycle'] = i + 1
        all_data = pd.concat([all_data, cycle_data])
        
    return all_data


def plot_cofs(folder_path, num_cycles):
    # Get data for all cycles
    all_data = get_all_data(folder_path)
    # Plot using seaborn
    plt.figure(figsize=(12, 8))
    plt.title('Friction Coefficient vs Sliding Distance for Multiple Cycles', fontsize=16)
    plt.xlabel('Sliding Distance (mm)', fontsize=14)
    plt.ylabel('Friction Coefficient', fontsize=14)
    ax = sns.lineplot(x='sliding_distance', y='cof', hue='cycle', data=all_data, palette='viridis')
    norm = plt.Normalize(1, num_cycles)
    sm = plt.cm.ScalarMappable(cmap='viridis', norm=norm)
    plt.colorbar(sm, ax=ax, label="Cycle", ticks=np.arange(1, num_cycles, 2))
    ax.legend_.remove()
    plt.xticks(fontsize=11)
    plt.yticks(fontsize=11)
    plt.ylim([0, None])
    plt.grid(True, linestyle='--')
    plt.savefig(os.path.join(folder_path, 'multi_cycle', 'multicycle_cof.pdf'))
    plt.savefig(os.path.join(folder_path, 'multi_cycle', 'multicycle_cof.png'), dpi=200)
    # plt.show()


def plot_average_cofs(folder_path, num_cycles, std_interpolation=True):
    # Get data for all cycles
    all_data = get_all_data(folder_path)

    # Initialize lists to store averages and standard deviations
    averages = []
    std_devs = []
    cycles = range(1, num_cycles + 1)

    # Calculate averages and standard deviations for each cycle
    for cycle in cycles:
        cycle_data = all_data[all_data['cycle'] == cycle]
        averages.append(cycle_data['cof'].mean())
        std_devs.append(cycle_data['cof'].std())

    # Convert to arrays for vectorised operations
    averages = np.array(averages)
    std_devs = np.array(std_devs)
    np.savetxt(os.path.join(folder_path, 'multi_cycle', 'mean.txt'), averages)
    np.savetxt(os.path.join(folder_path, 'multi_cycle', 'std.txt'), std_devs)

    # Spline interpolation for smoothing
    cycles_smooth = np.linspace(min(cycles), max(cycles), 300)  # Increase for smoother curves
    spline_avg = make_interp_spline(cycles, averages)(cycles_smooth)
    spline_upper = make_interp_spline(cycles, averages + std_devs)(cycles_smooth)
    spline_lower = make_interp_spline(cycles, averages - std_devs)(cycles_smooth)

    # Plotting
    plt.figure(figsize=(12, 8))
    if std_interpolation:
        plt.plot(cycles_smooth, spline_avg, label='Average Friction Coefficient', color='blue')
        plt.fill_between(cycles_smooth, spline_lower, spline_upper, color='blue', alpha=0.2)
    else:
        plt.plot(cycles, averages, label='Average Friction Coefficient', color='blue')
        plt.fill_between(cycles, averages - std_devs, averages + std_devs, color='blue', alpha=0.2)

    # Set plot titles and labels
    plt.title('Average Friction Coefficient per Cycle with Standard Deviation', fontsize=16)
    plt.xlabel('Cycle', fontsize=14)
    plt.ylabel('Average Friction Coefficient', fontsize=14)
    plt.xticks(cycles, fontsize=11)  # Ensure all cycle numbers are shown
    plt.yticks(fontsize=11)
    plt.ylim([0, None])
    plt.grid(True, linestyle='--')
    plt.legend(fontsize=11)
    plt.savefig(os.path.join(folder_path, 'multi_cycle', 'average_cof.pdf'))
    plt.savefig(os.path.join(folder_path, 'multi_cycle', 'average_cof.png'), dpi=200)
    # plt.show()

if __name__ == '__main__':
    test_num = 10
    for test_num in range(12, 14):
        folder_path = os.path.join('Data', '2024', '0725', f'Test{test_num}')
        if not os.path.exists(os.path.join(folder_path, 'multi_cycle')):
            os.makedirs(os.path.join(folder_path, 'multi_cycle'))

        plot_cofs(folder_path, 20)
        plot_average_cofs(folder_path, 20)