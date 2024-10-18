import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ColorResult } from 'react-color';
import Plot, { PlotParams } from 'react-plotly.js';
import { useMutation } from 'react-query';
import styled from 'astroturf/react';

import { Button, Card, Icon } from '@smar/ui';

import { useCurrentUser } from 'features/user';

import { getComputationGraphicDataKey, saveChartParamsReq } from '../../api';
import { ChartTypeParams } from '../chart-type-params';
import json from './json_3d_plot.json';

type PlotType = PlotParams['data'][0]['type'];

const PlotWrapper = styled.div`
  :global {
    :not(svg) {
      transform-origin: 0px 0px;
    }
    .modebar {
      display: flex !important;
    }
    .modebar-group {
      display: flex !important;
      float: none !important;
    }
    .plot-container {
      width: 100% !important;
      min-height: 700px;
    }
  }
`;

type AxisProp = {
  label: keyof ComputationGraphicOptions['data'];
  value: keyof ComputationGraphicOptions['data'];
};

type ChartState = {
  x?: AxisProp['value'];
  y?: AxisProp['value'];
  z?: AxisProp['value'];
  type: PlotType;
  color: ColorResult;
};

export const ComputationsChart = ({
  isLoading,
  refetchGraphicData,
  resultsData,
  isFetching,
}: {
  refetchGraphicData: any;
  isFetching: boolean;
  isLoading: boolean;
  resultsData: ComputationGraphicOptions;
}) => {
  // const [charts, chartsSet] = useState<ChartState[]>(resultsData?.parameters);

  // const { currentUser } = useCurrentUser();
  // const isAdmin = currentUser?.role === 'admin';
  // const isUser = currentUser?.role === 'user';

  // const { mutate: saveChartParams } = useMutation(saveChartParamsReq);

  // const addChart = useCallback(() => {
  //   chartsSet(prevState => [
  //     ...prevState,
  //     {
  //       color: { hex: '#D0021B' } as any,
  //       type: 'scatter',
  //     },
  //   ]);
  // }, []);

  // const removeChart = useCallback((index: number) => {
  //   chartsSet(prevState => prevState.filter((_, i) => i !== index));
  // }, []);

  const handleSaveChart = useCallback(() => {
    // saveChartParams(
    //   { computationResultId: resultsData.id, parameters: charts },
    //   {
    //     onSuccess: () => {
    //       refetchGraphicData();
    //     },
    //   },
    // );
  }, []);

  // useEffect(() => {
  //   if (isAdmin) {
  //     handleSaveChart();
  //   }
  // }, [handleSaveChart, isAdmin, charts, isUser]);

  // const axisOptions = useMemo(
  //   () =>
  //     resultsData &&
  //     Object.keys(resultsData?.data)
  //       .map(item => ({ label: item, value: item }))
  //       .filter(item => item.value !== 'info'),
  //   [resultsData],
  // );
  // const plotlyData = useMemo(() => {
  //   return charts.map(({ type, ...item }, i) => ({
  //     x: item.x ? resultsData?.data[item.x] : [],
  //     y: item.y ? resultsData?.data[item.y] : [],
  //     z: item.z ? resultsData?.data[item.z] : [],
  //     type:
  //       type === ('3dlines' as any) ? 'scatter3d' : type === ('lines' as any) ? 'scatter' : type,
  //     name: `Chart ${i + 1}`,
  //     mode: type === ('3dlines' as any) || type === ('lines' as any) ? 'lines' : 'lines+markers',
  //     marker: { color: item.color.hex, opacity: 0.8 },
  //     line: { width: 1 },
  //     intensity: item.z ? resultsData?.data[item.z] : [],
  //     colorscale: 'Jet',
  //   })) as Plotly.Data[];
  // }, [charts, resultsData?.data]);

  // if (isUser && resultsData.parameters.length === 0) return null;
  return (
    <div>
      <h2 className="v-text110 text-secondaryDarkBlue900 mb-1">Chart</h2>
      <Card variant="sm">
        {/* <div className="flex justify-between">
          <Button variant="outlined" onClick={addChart}>
            <Icon name="add" size={20} mr={1} /> Add new chart
          </Button>
        </div>
        {charts?.length > 0 && (
          <div className="bg-secondaryDarkBlue930 my-2 w-full" style={{ height: 1 }} />
        )} */}
        {resultsData?.link && (
          <div className="flex justify-end">
            <Button
              as="a"
              variant="outlined"
              href={resultsData.link}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="download" mr={1} size={16} /> detailed version of the chart
            </Button>
          </div>
        )}

        <PlotWrapper>
          {!isLoading ? (
            <>
              {/* {plotlyData?.length > 0 && ( */}
              <Plot
                {...(resultsData as any)?.data}
                config={{
                  showTips: true,
                  displayModeBar: true,
                  responsive: true,
                  toImageButtonOptions: { width: 1600, height: 700, format: 'svg' },
                }}
                className="flex max-w-full"
                useResizeHandler={true}
                // data={plotlyData}
                layout={{
                  ...(resultsData as any)?.data?.layout,
                  height: undefined,
                  width: undefined,
                }}
                // layout={{
                //   images: [
                //     {
                //       x: 0,
                //       y: 1.07,
                //       sizex: 0.2,
                //       sizey: 0.2,
                //       source: '/logo.png',
                //       xanchor: 'left',
                //       xref: 'paper',
                //       yanchor: 'bottom',
                //       yref: 'paper',
                //     },
                //   ],
                //   font: { size: 9, family: 'Helvetica' },
                // }}
              />
              {/* )} */}
            </>
          ) : (
            'Loading...'
          )}
        </PlotWrapper>
      </Card>
    </div>
  );
};
