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
  "#3b5898", // 30% Brand Navy - Product Sales
  "#64748b", // Slate 500 - Product Buy Price
  "#94a3b8", // Slate 400 - Salary Cost
  "#cbd5e1", // Slate 300 - Employee Add Cost
  "#475569", // Slate 600 - Office Cost
  "#f48726", // 10% Accent - Net Profit / Loss
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
