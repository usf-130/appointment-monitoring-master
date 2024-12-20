"use client";
import React, { memo, useEffect, useState } from "react";
import { Bar ,} from "react-chartjs-2";
import Chart from 'chart.js/auto';

const ColumnChartJs = memo(function ColumnChartJs({
  gridData,
  xKey,
  yKey,
}) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const itemxDic = {};
    gridData.forEach((row) => {
      const itemx = row[xKey]?.trim();
      if (itemx) {
        if (itemxDic[itemx]) {
          itemxDic[itemx]++;
        } else {
          itemxDic[itemx] = 1;
        }
      }
    });

    let totalCount = Object.values(itemxDic).reduce(
      (sum, count) => sum + count,
      0
    );

    const itemArray = Object.keys(itemxDic).map((itemName) => {
      const count = itemxDic[itemName];

      const percentage = (count / totalCount) * 100;

      return {
        [xKey]: itemName,
        count: count,
        [yKey]: percentage,
      };
    });

    const sortedData = itemArray.sort(compare);

    const labels = sortedData.map((item) => item[xKey]);
    const values = sortedData.map((item) => item[yKey]);

    const backgroundColorx = [
      "#44c2fd",
      "#1ac0c6",
      "#ffa500",
      "#ff69b4",
      "#4FFBDF",
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
      "#67f2d1",
      "#FF6F91",
      "#00C2A8",
    ];

    const randomNumber = Math.floor(Math.random() * 18);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: yKey,
          data: values,
          backgroundColor: backgroundColorx[randomNumber],
        },
      ],
    };

    setChartData(chartData);
  }, [gridData, xKey, yKey]);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        beginAtZero: false,
        title: {
          display: false,
          text: xKey,
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
          font: {
            family: "__iransans_7c92e5", 
            size: 12,
          },
        },
      },
      y: {
        type: 'logarithmic',
        title: {
          display: false,
          text: yKey,
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
          font: {
            family: "__iransans_7c92e5",
          },
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
      tooltip: {
        enabled: true,
        mode: "nearest",
        intersect: false,
        callbacks: {
          label: (context) => {
            return `${context.parsed.y.toFixed(2)}% مدیران`;
          },
          title: (context) => {
            return `${context[0].label}`;
          },
        },
        bodyFont: {
          family: "__iransans_7c92e5",
          size: 12,
        },
        titleFont: {
          family: "__iransans_7c92e5",
          size: 14,
        },
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        bodyFontColor: "#0000",
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
});

export default ColumnChartJs;

function compare(b, a) {
  if (a.percentage < b.percentage) {
    return -1;
  }
  if (a.percentage > b.percentage) {
    return 1;
  }
  return 0;
}
