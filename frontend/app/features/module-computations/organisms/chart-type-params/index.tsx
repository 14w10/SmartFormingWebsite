import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ColorResult } from 'react-color';
import { PlotParams } from 'react-plotly.js';

import { Button, Icon, Select } from '@smar/ui';

import { ChartColorPicker } from '../../molecules/chart-color-picker';
import { ChartTypePicker } from '../../molecules/chart-type-picker';

type PlotType = PlotParams['data'][0]['type'];

type OptionType = {
  label: string;
  value: PlotType;
};

type AxisProp = {
  label: keyof ComputationGraphicOptions['data'];
  value: keyof ComputationGraphicOptions['data'];
};

const chartTypes = [
  {
    label: 'Basic',
    items: [
      {
        label: 'scatter',
        value: 'scatter',
      },
      {
        label: 'lines',
        value: 'lines',
      },
      {
        label: 'bar',
        value: 'bar',
      },
    ] as OptionType[],
  },
  {
    label: '3D Charts',
    items: [
      {
        label: 'Scatter 3D',
        value: 'scatter3d',
      },
      {
        label: 'Surface',
        value: 'surface',
      },
      {
        label: 'Lines 3D',
        value: '3dlines',
      },
      {
        label: 'Hardness (HV)',
        value: 'mesh3d',
      },
    ] as OptionType[],
  },
];

type ChartState = {
  x?: AxisProp['value'];
  y?: AxisProp['value'];
  z?: AxisProp['value'];
  type: PlotType;
  color: ColorResult;
};

export const ChartTypeParams = ({
  index,
  chart,
  chartsSet,
  axisOptions,
  link,
}: {
  link: string;
  index: number;
  chart: ChartState;
  chartsSet: React.Dispatch<React.SetStateAction<ChartState[]>>;
  axisOptions?: { label: string; value: string }[];
}) => {
  const handleType = useCallback(
    (type: PlotType) => {
      chartsSet(prevState => prevState.map((item, i) => (i === index ? { ...item, type } : item)));
    },
    [chartsSet, index],
  );
  const handleColor = useCallback(
    (color: ColorResult) => {
      chartsSet(prevState => prevState.map((item, i) => (i === index ? { ...item, color } : item)));
    },
    [chartsSet, index],
  );
  const handleX = useCallback(
    (x: AxisProp['value']) => {
      chartsSet(prevState => prevState.map((item, i) => (i === index ? { ...item, x } : item)));
    },
    [chartsSet, index],
  );
  const handleY = useCallback(
    (y: AxisProp['value']) => {
      chartsSet(prevState => prevState.map((item, i) => (i === index ? { ...item, y } : item)));
    },
    [chartsSet, index],
  );
  const handleZ = useCallback(
    (z: AxisProp['value']) => {
      chartsSet(prevState => prevState.map((item, i) => (i === index ? { ...item, z } : item)));
    },
    [chartsSet, index],
  );
  const is3d = useMemo(() => chartTypes[1].items.some(item => item.value === chart.type), [
    chart?.type,
  ]);
  return (
    <div className="flex justify-between">
      <div className="py-4px border-secondaryDarkBlue930 inline-flex px-2 h-7 border rounded-full">
        <div className="flex items-center mr-3">
          <p className="v-text110 text-secondaryDarkBlue900 mr-2">CHART TYPE</p>
          <ChartTypePicker
            chartTypeSet={handleType}
            chartType={chart.type}
            chartTypes={chartTypes}
          />
        </div>

        <div className="flex items-center mr-3">
          <p className="v-text110 text-secondaryDarkBlue900 mr-2">Color</p>
          <ChartColorPicker color={chart.color} setColor={handleColor} />
        </div>
        <div className="flex items-center mr-3">
          <p className="v-text110 text-secondaryDarkBlue900 mr-2">x-axis</p>
          {axisOptions && (
            <Select
              variant="noBorderLight"
              items={axisOptions}
              className="w-19"
              onChange={handleX as any}
              defaultSelectedItem={{ value: chart.x as string, label: chart.x as string }}
            />
          )}
        </div>
        <div className="flex items-center">
          <p className="v-text110 text-secondaryDarkBlue900 mr-2">y-axis</p>
          {axisOptions && (
            <Select
              variant="noBorderLight"
              items={axisOptions}
              className="w-19"
              onChange={handleY as any}
              defaultSelectedItem={{ value: chart.y as string, label: chart.y as string }}
            />
          )}
        </div>
        {is3d && (
          <div className="flex items-center ml-3">
            <p className="v-text110 text-secondaryDarkBlue900 mr-2">z-axis</p>
            {axisOptions && (
              <Select
                variant="noBorderLight"
                items={axisOptions}
                className="w-19"
                defaultSelectedItem={{ value: chart.z as string, label: chart.z as string }}
                onChange={handleZ as any}
              />
            )}
          </div>
        )}
      </div>
      {/* {chart?.type === 'mesh3d' && ( */}
      <Button as="a" variant="outlined" href={link} target="_blank" rel="noreferrer">
        <Icon name="download" mr={1} size={16} /> detailed version of the chart
      </Button>
      {/* )} */}
    </div>
  );
};
