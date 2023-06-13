import { type NextPage } from "next";
import Head from "next/head";
import Chart from "~/components/features/chart";
import { ChartComponent } from "~/components/features/tv-chart-container";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const predictions = api.predictions.getAll.useQuery({ skip: 0, take: 100 });
  const initialData = [
    { time: "2018-12-22", open: 32.51, high: 32.91, low: 31.77, close: 32.62 },
    { time: "2018-12-23", open: 31.11, high: 32.59, low: 30.9, close: 32.32 },
    { time: "2018-12-24", open: 27.02, high: 29.1, low: 27.02, close: 28.62 },
    { time: "2018-12-25", open: 27.32, high: 27.79, low: 26.84, close: 27.04 },
    { time: "2018-12-26", open: 25.17, high: 25.65, low: 24.43, close: 25.6 },
    { time: "2018-12-27", open: 28.89, high: 29.31, low: 28.57, close: 28.75 },
    { time: "2018-12-28", open: 25.46, high: 27.98, low: 25.1, close: 27.24 },
    { time: "2018-12-29", open: 23.92, high: 25.29, low: 23.2, close: 23.84 },
    { time: "2018-12-30", open: 22.68, high: 24.7, low: 22.5, close: 24.48 },
    { time: "2018-12-31", open: 22.67, high: 23.38, low: 22.25, close: 23.23 },
  ];
  return (
    <>
      <Head>
        <title>Crypto Predictions</title>
        <meta name="description" content="AI Market Predictions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <p>No information on this website constitutes financial advice.</p>
        <section>
          <ChartComponent data={initialData} />
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
