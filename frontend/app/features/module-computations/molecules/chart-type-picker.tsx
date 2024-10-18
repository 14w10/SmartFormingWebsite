import { useMemo } from 'react';
import { PlotParams } from 'react-plotly.js';
import { useSelect } from 'downshift';

import { Icon } from '@smar/ui';

type PlotType = PlotParams['data'][0]['type'];

type OptionType = {
  label: string;
  value: PlotType;
};

export const ChartTypePicker = ({
  chartTypeSet,
  chartType,
  chartTypes,
}: {
  chartTypeSet: (state: PlotType) => void;
  chartType: PlotType;
  chartTypes: { label: string; items: OptionType[] }[];
}) => {
  const formattedOptions = useMemo(
    () => chartTypes.reduce((acc: OptionType[], item) => [...acc, ...item.items], []),
    [chartTypes],
  );
  const { isOpen, selectedItem, getToggleButtonProps, getMenuProps, getItemProps } = useSelect({
    items: formattedOptions as OptionType[],
    onSelectedItemChange: ({ selectedItem }) => {
      chartTypeSet(selectedItem?.value);
    },
    defaultSelectedItem: { label: chartType as string, value: chartType },
  });
  const label =
    selectedItem?.label && selectedItem?.label === 'mesh3d' ? 'Custom' : selectedItem?.label;

  return (
    <div className="select-none">
      <div className="relative flex flex-col">
        <button
          className="py-4px pr-12px flex items-center justify-between pl-1 focus:outline-none"
          {...getToggleButtonProps()}
        >
          <div
            className={`v-text110 ${
              isOpen ? 'text-secondaryDarkBlue910' : 'text-secondaryDarkBlue920'
            }`}
          >
            {label || 'Select'}
          </div>
          <Icon
            name={isOpen ? 'arrow-drop-up' : 'arrow-drop-down'}
            size={24}
            iconFill={!isOpen ? 'secondaryDarkBlue920' : 'secondaryDarkBlue910'}
          />
        </button>
        {isOpen && (
          <div
            className="mt-4px shadow-shadow4 rounded-large absolute z-20 flex px-3 py-2 w-max bg-white"
            style={{ top: '100%' }}
            {...getMenuProps()}
          >
            {chartTypes.map((item, i) => {
              const currentIndex = new Array(i).fill(null).reduce((acc, _, indexItem) => {
                return (chartTypes[indexItem]?.items.length || 0) + acc;
              }, 0);
              return (
                <div key={item.label} className={`${i !== 0 ? 'ml-6' : ''}`}>
                  <p className="text-secondaryDarkBlue900 v-text110">{item.label}</p>
                  <ul>
                    {item.items.map((type, typeIndex) => {
                      return (
                        <li
                          key={type.value}
                          className="v-p130 hover:text-primaryBlue900 mt-2 cursor-pointer capitalize"
                          {...getItemProps({
                            item: type,
                            index: i > 0 ? currentIndex + typeIndex : typeIndex,
                          })}
                        >
                          {type.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
