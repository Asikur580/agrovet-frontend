import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

const barColors = [
  "rgba(34, 197, 94, 0.6)",   // green - Product Sales
  "rgba(239, 68, 68, 0.6)",   // red - Product Buy Price
  "rgba(59, 130, 246, 0.6)",  // blue - Salary Cost
  "rgba(249, 115, 22, 0.6)",  // orange - Employee Add Cost
  "rgba(168, 85, 247, 0.6)",  // purple - Office Cost
  "rgba(20, 184, 166, 0.6)",  // teal - Net Profit / Loss
];

export default function BarChart(props) {
  const { data, identifier } = props;

  //===> Chart Configuration (Memoized)
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: { position: "top" },
        title: { display: false, text: identifier.toUpperCase() },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const value = Number(context.raw).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              return ` ${context.label}: ${value} /-`;
            },
          },
        },
        datalabels: {
          anchor: "end",
          align: "top",
          formatter: (value) => {
            return Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          },
          font: {
            weight: "bold",
            size: 11,
          },
          color: "#333",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
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
          backgroundColor: barColors.slice(0, dataValues.length),
        },
      ],
    };
  }, [data]);

  return <Bar options={chartOptions} data={chartData} />;
}
