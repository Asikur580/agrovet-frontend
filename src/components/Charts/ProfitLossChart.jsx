import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ApiConfig from "../../assets/js/ApiConfig";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart(props) {
  const { api, identifier, headers, timePeriod, reloader, setReloader } = props;
  const [apiData, setApiData] = useState([]);

  //===> Fetch API Data
  const getApiData = useCallback(async () => {
    try {
      const response = await ApiConfig.get(
        `${api}?from_date=${timePeriod.from_date}&to_date=${timePeriod.to_date}`,
        { headers }
      );
      setApiData(response.data);
      setReloader(false);
      //==> For offline use
      localStorage.setItem("ProfitLossReport", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching data:", error);
      //==> For offline use
      const cachedData = localStorage.getItem("ProfitLossReport");
      if (cachedData) {
        setApiData(JSON.parse(cachedData));
      }
    }
  }, [api, timePeriod, headers, setReloader]);

  useEffect(() => {
    getApiData();
  }, [reloader, getApiData]);

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
    const labels = Object.keys(apiData).map((item) => item.toLowerCase());
    const dataValues = Object.values(apiData);
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
  }, [apiData]);

  return <Bar options={chartOptions} data={chartData} />;
}

// import React, { useEffect, useState } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// //==> Utilities
// import ApiConfig from "../../assets/js/ApiConfig";

// export default function BarChart(props) {
//   const {
//     api,
//     identifier,
//     headers,
//     timePeriod,
//     // setLoader,
//     reloader,
//     setReloader,
//   } = props;

//   //==> Get api data
//   const [apiData, setApiData] = useState([]);
//   const getApiData = async () => {
//     try {
//       // setLoader(true);
//       await ApiConfig.get(
//         `${api}?from_date=${timePeriod.from_date}&to_date=${timePeriod.to_date}`,
//         {
//           headers,
//         }
//       ).then((response) => {
//         setTimeout(() => {
//           setApiData(response.data);
//           // setLoader(false);
//           setReloader(false);
//         }, 700);
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     getApiData();
//     // console.log(apiData);
//   }, [reloader]);

//   //==> Chart's utility
//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: false,
//         text: identifier.toUpperCase(),
//       },
//     },
//   };

//   const labels = Object.keys(apiData).map((item) => {
//     return item.toLowerCase();
//   });

//   const Y_Data = Object.values(apiData).map((item) => {
//     return item;
//   });

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Profit or loss",
//         data: Y_Data,
//         backgroundColor: "rgba(27, 2, 250, 0.3)",
//         // backgroundColor: "rgba(250, 101, 2,0.3)",
//         // backgroundColor: "rgba(250, 233, 2,0.3)",
//         // backgroundColor: "rgba(10, 250, 2,0.3)",
//         // backgroundColor: "rgba(250, 2, 196,0.3)",
//         // backgroundColor: "rgba(250, 2, 14,0.3)",
//         // backgroundColor: "rgba(13, 13, 14,0.3)",
//         // backgroundColor: "rgba(91, 91, 92,0.3)",
//       },
//     ],
//   };

//   return <Bar options={options} data={data} />;
// }
