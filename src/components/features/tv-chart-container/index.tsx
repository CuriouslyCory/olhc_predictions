import {
  createChart,
  ColorType,
  type CandlestickData,
  type LineData,
} from "lightweight-charts";
import React, { useEffect, useRef } from "react";

type ChartComponentProps = {
  data: CandlestickData[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
  predictions?: LineData[];
};

export const ChartComponent = ({ data, colors, predictions }: ChartComponentProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const defaultColors = {
    backgroundColor: "white",
    lineColor: "#2962FF",
    textColor: "black",
    redStickColor: "#FF1744",
    greenStickColor: "#00E676",
  };

  const chartColors = { ...defaultColors, ...colors };

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef?.current?.clientWidth as number,
      });
    };

    const chart = createChart(chartContainerRef?.current ?? "", {
      layout: {
        background: {
          type: ColorType.Solid,
          color: chartColors.backgroundColor,
        },
        textColor: chartColors.textColor,
      },
      width: chartContainerRef?.current?.clientWidth,
      height: 300,
    });
    chart.timeScale().fitContent();

    const newCandles = chart.addCandlestickSeries({
      upColor: chartColors.greenStickColor,
      downColor: chartColors.redStickColor,
      wickColor: chartColors.areaBottomColor,
    });
    newCandles.setData(data);

    const newSeries = chart.addLineSeries({
      color: chartColors.lineColor,
    });
    newSeries.setData(predictions ?? []);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [data, chartColors]);

  return <div ref={chartContainerRef} />;
};
