import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart(props) {
  const { data, identifier } = props;

  //===> Chart Configuration (Memoized)
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: false, text: identifier.toUpperCase() },
      },
    }),
    [identifier]
  );

  const chartData = useMemo(() => {
    const labels = Object.keys(data).map((item) => item.toLowerCase());
    const dataValues = Object.values(data);
    return {
      labels,
      datasets: [
        {
          label: "Profit or Loss",
          data: dataValues,
          backgroundColor: "rgba(27, 2, 250, 0.3)",
        },
      ],
    };
  }, [data]);

  return <Bar options={chartOptions} data={chartData} />;
}
