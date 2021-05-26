import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js";
import numeral from "numeral";
import "./linegraph.css";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          displayFormats: {
            week: true,
          },
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function(value,index,values) {
            return numeral(value).format("0,0");
          }
        },
      },
    ],
  },
};

const buildChartData = (data, caseType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[caseType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[caseType][date];
  }
  return chartData;
};

function LineGraph({ caseType = "cases" }) {
  const [data, setData] = useState({});
  const [chartOptions, setOptions] = useState(options);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://disease.sh/v3/covid-19/historical/all?lastdays=120"
      );
      const chartSet = await response.json();
      let chartData = buildChartData(chartSet, caseType);
      setData(chartData);
    };

    fetchData();
  }, [caseType]);

  return (
    <div className="chart">
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "#4287f5",
                borderColor: "#4287f5",
                data: data,
                fill: false,
              },
            ],
          }}
          options={chartOptions}
        />
      )}
    </div>
  );
}

export default LineGraph;
