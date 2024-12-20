"use client";
import React, { memo, useEffect, useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const VerticalBarChart = memo(function VerticalBarChart({
  gridData,
  buckets,
  colName,
  fixN,
  titlex,
}) {
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  const customTooltip = {
    enabled: true,
    mode: "nearest",
    intersect: false,
    callbacks: {
      label: (context) => {
        return `${context.parsed.y}% مدیران`;
      },
      title: (context) => {
        const title = `  بین بازه ی ${context[0].label}`;
        return title;
      },
    },

    bodyFont: {
      family: "__iransans_7c92e5",
      size: 14,
    },
    titleFont: {
      family: "__iransans_7c92e5",
      size: 14,
    },

    backgroundColor: "rgba(0, 0, 0, 0.7)",
    bodyFontColor: "#fff",
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        barPercentage: 1.6,
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: titlex,
          padding: 10,
          font: {
            size: 12,
            family: "__iransans_7c92e5",
            style: "normal",
            weight: "bold",
          },
        },
        ticks: {
          beginAtZero: false,
          padding: 5,
          backdropPadding: 5,
        },
      },
      y: {
        title: {
          display: false,
          text: "درصد مدیران",
          font: {
            size: 12,
            family: "__iransans_7c92e5",
            style: "normal",
            weight: "bold",
          },
        },
        ticks: {
          beginAtZero: true,
          padding: 10,
          backdropPadding: 10,
          callback: (value) => {
            return `${value}%`;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "__iransans_7c92e5",
            style: "normal",
            weight: "bold",
          },
        },
      },
      title: {
        display: false,
        text: "",
      },
      datalabels: {
        display: (context) => context.dataset.data.length <= 10,
        color: "#000",
        font: {
          weight: "bold",
          family: "__iransans_7c92e5",
        },
        align: "right",
        
        formatter: (value) => {
          return `${Number(value).toFixed(0)}%`;
        },
      },
      tooltip: customTooltip,
      interaction: {
        mode: "index",
        intersect: false,
      },
    },
  };

  useEffect(() => {
    const dataArray = [];
    gridData.forEach((row) => {
      let rowItem = row[colName];
      if (rowItem > 0) {
        if (colName=="appCounts") {
          rowItem = rowItem/30;
        }
        dataArray.push(rowItem);
      }
    });

    let maxValue = Number.MIN_SAFE_INTEGER;
    let minValue = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
      }
      if (dataArray[i] < minValue) {
        minValue = dataArray[i];
      }
    }
    maxValue = Math.ceil(maxValue / fixN) * fixN;
    minValue = Math.floor(minValue / fixN) * fixN;

    const span = Math.ceil((maxValue - minValue) / buckets);

    const labelDic = {};
    let labelName = "";
    dataArray.forEach((item) => {
      for (let i = 0; i <= buckets - 1; i++) {
        const lowerBound = minValue + i * span;
        const upperBound =
          i === buckets - 1 ? maxValue : minValue + (i + 1) * span;

        if (item >= lowerBound && item < upperBound) {
          labelName = `${lowerBound}-${upperBound}`;
          break;
        }
      }

      if (labelDic[labelName]) {
        labelDic[labelName]++;
      } else {
        labelDic[labelName] = 1;
      }
    });

    const totalCount = Object.values(labelDic).reduce(
      (sum, count) => sum + count,
      0
    );

    Object.keys(labelDic).forEach((itemKey) => {
      const itemValue = labelDic[itemKey];
      const percentage = (itemValue / totalCount) * 100;
      labelDic[itemKey] = percentage;
    });

    const dataArrayx = Object.keys(labelDic).map((e) => {
      return {
        index: e.split("-")[0],
        label: e,
        value: labelDic[e].toFixed(2),
      };
    });

    const sortedDataArrayx = dataArrayx.sort((a, b) => a.index - b.index);
    const labelArray = sortedDataArrayx.map((item) => item.label);
    const valueArray = sortedDataArrayx.map((item) => item.value);

    setLabels(labelArray);
    setValues(valueArray);
  }, [gridData, buckets, colName]);

  const backgroundColorx = [
    "#8a2be2",
    "#00ced1",
    "#ffa500",
    "#ff69b4",
    "#4169e1",
    "#ff1493",
    "#00ffff",
    "#ff00ff",
    "#ff6384",
    "#d16cf8",
    "#11bcff",
    "#07F889",
    "#FFBB00",
    "#f747f8",
    "#09fcf8",
    "#fba71b",
    "#57b757",
    "#9a42c8",
    "#ff0066",
  ];
  const randomNumber = Math.floor(Math.random() * 18);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColorx[randomNumber],
      },
    ],
  };
  return <Bar options={options} data={data} />;
});

export default VerticalBarChart;
