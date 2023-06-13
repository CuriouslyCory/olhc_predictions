import { createChart, ColorType, CandlestickData } from "lightweight-charts";
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
};

export const ChartComponent = ({ data, colors }: ChartComponentProps) => {
  const chartContainerRef = useRef();
  const defaultColors = {
    backgroundColor: "white",
    lineColor: "#2962FF",
    textColor: "black",
    areaTopColor: "#2962FF",
    areaBottomColor: "rgba(41, 98, 255, 0.28)",
  };

  const chartColors = { ...defaultColors, ...colors };

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: chartColors.backgroundColor,
        },
        textColor: chartColors.textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addCandlestickSeries({
      upColor: chartColors.lineColor,
      downColor: chartColors.areaTopColor,
      wickColor: chartColors.areaBottomColor,
    });
    newSeries.setData(data);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [data, chartColors]);

  return <div ref={chartContainerRef} />;
};
