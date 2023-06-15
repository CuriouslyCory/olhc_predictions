import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Chart from "~/components/features/chart";
import { ChartComponent } from "~/components/features/tv-chart-container";
import { historicalDataToCandle, predictionsToChartData } from "~/components/features/tv-chart-container/utils";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("ethusd");
  const symbols = [
    "ethusd",
    "atomusd",
    "maticusd",
    "manausd",
    "linkusd",
    "avaxusd",
    "ftmusd",
    "xlmusd",
    "uniusd",
    "dogeusd",
    "trxusd",
    "ethbtc",
    "bnbusd",
    "btcusd"
  ];
  const predictions = api.predictions.getAll.useQuery({ skip: 0, take: 100, symbol: selectedSymbol, interval: "1d" });
  const historicalData = api.historicalData.getRecent.useQuery({ skip: 0, take: 200, symbol: selectedSymbol.toUpperCase(), interval: "1d" });


  return (
    <>
      <Head>
        <title>Crypto Predictions</title>
        <meta name="description" content="AI Market Predictions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <p>No information on this website constitutes financial advice.</p>
        <div>
          <label>Symbol</label>
          <select className="p-2" value={selectedSymbol} onChange={(e) => setSelectedSymbol(e.target.value)}>
            {
              symbols.map((symbol) => (
                <option key={symbol} value={symbol}>{symbol}</option>
              ))
            }
          </select>
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
