import { type Predictions, type HistoricalData } from "@prisma/client";
import { type LineData, type CandlestickData, UTCTimestamp } from "lightweight-charts";

export const historicalDataToCandle = (data?: HistoricalData[]): CandlestickData[] => {
    if(!data) return [];
    const formattedData = data.map((d) => {
        return {
        time: new Date(+d.openTimestamp.toString()).toISOString()?.split('T')[0] ?? "",
        open: d.openPrice,
        high: d.highPrice,
        low: d.lowPrice,
        close: d.closePrice,
        };
    })
    .sort((a, b) => {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
    });
    return formattedData;
}


export const predictionsToChartData = (data?: Predictions[]): LineData[] => {
    if(!data) return [];
    const formattedData = data.map((d) => {
        console.log(d.openTimestamp.toString())
        return {
            time: (new Date(+d.openTimestamp.toString()).getTime()) / 1000 as UTCTimestamp,
            value: d.prediction,
        };
    })
    .sort((a, b) => {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
    });
    return formattedData;
}

export const intervalToSeconds = (interval: string): number => {
    switch(interval) {
        case "1m":
            return 60;
        case "5m":
            return 300;
        case "15m":
            return 900;
        case "30m":
            return 1800;
        case "1h":
            return 3600;
        case "4h":
            return 14400;
        case "1d":
            return 86400;
        case "1w":
            return 604800;
        case "1M":
            return 2592000;
        default:
            return 0;
    }
}