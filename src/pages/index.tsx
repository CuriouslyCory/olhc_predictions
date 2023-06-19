import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Chart from "~/components/features/chart";
import { ChartComponent } from "~/components/features/tv-chart-container";
import { historicalDataToCandle, predictionsToChartData } from "~/components/features/tv-chart-container/utils";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("ethusd");
  const [selectedInterval, setSelectedInterval] = useState<string>("1d");
  const symbols = [
    "ATOMUSD",
    "AVAXUSD",
    "BNBUSD",
    "BTCUSD",
    "DOGEUSD",
    "DOTUSD",
    "ETCUSD",
    "ETHBTC",
    "ETHUSD",
    "FTMUSD",
    "ICPUSD",
    "LINKUSD",
    "LTCUSD",
    "MANAUSD",
    "MATICUSD",
    "SHIBUSD",
    "SOLUSD",
    "TRXUSD",
    "UNIUSD",
    "XLMUSD",
    "XTZUSD",
  ];

  const intervals = [
    "1d",
    "3d",
    "1w",
  ]
  const predictions = api.predictions.getAll.useQuery({ skip: 0, take: 100, symbol: selectedSymbol.toLowerCase(), interval: selectedInterval });
  const historicalData = api.historicalData.getRecent.useQuery({ skip: 0, take: 200, symbol: selectedSymbol.toUpperCase(), interval: selectedInterval });

  useEffect(() => {
    console.log(predictions.data?.map((prediction) => prediction.openTimestamp));
  }, [predictions.data])

  return (
    <>
      <Head>
        <title>Crypto Predictions</title>
        <meta name="description" content="AI Market Predictions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <p>No information on this website constitutes financial advice.</p>
        <div className="tw-flex">
          <div className="tw-flex tw-col gap-y-2">
            <label>Symbol</label>
            <select className="p-2" value={selectedSymbol} onChange={(e) => setSelectedSymbol(e.target.value)}>
              {
                symbols.map((symbol) => (
                  <option key={symbol} value={symbol}>{symbol}</option>
                ))
              }
            </select>
          </div>
          <div className="tw-flex tw-col gap-y-2">
            <label>Interval</label>
            <select className="p-2" value={selectedInterval} onChange={(e) => setSelectedInterval(e.target.value)}>
              {
                intervals.map((interval) => (
                  <option key={interval} value={interval}>{interval}</option>
                ))
              }
            </select>
          </div>
        </div>
        <section>
          <ChartComponent data={historicalDataToCandle(historicalData.data)} predictions={predictionsToChartData(predictions.data)} />
        </section>
        <section>
          <ul>
            {predictions.data?.map((prediction) => (
              <li key={prediction.id}>
                <h3>{prediction.symbol}</h3>
                <p>{prediction.interval}</p>
                <p>{prediction.prediction}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
};

export default Home;
