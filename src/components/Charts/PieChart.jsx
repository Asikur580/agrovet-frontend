import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./Chart.css";

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ chartData, chartOptions }) => {
  return (
    <div className="pieChartWrapper">
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

export default PieChart;
