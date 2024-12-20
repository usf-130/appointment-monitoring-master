"use client";
import React, { memo, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";

Chart.register(ArcElement);

const PieChartJs = memo(function PieChartJs({
  gridData,
  labelKey,
  valueKey,
  legPosition,
  rerender,
}) {
  const getRandomColors = () => {
    const colors = [
      '#8a2be2', 
      '#00ced1',
      '#ffa500',
      '#ff69b4',
      '#4169e1',
      '#ff1493',
      '#00ffff',
      '#ff00ff',
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

    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    return colors;
  };

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: getRandomColors(),
      },
    ],
  });

  useEffect(() => {
    const itemxDic = {};
    gridData.forEach((row) => {
      const itemx = row[labelKey]?.trim();
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
        [labelKey]: `${percentage.toFixed(0)}% ${itemName}`,
        count: count,
        [valueKey]: percentage,
      };
    });

    const labels = itemArray.map((item) => item[labelKey]);
    const values = itemArray.map((item) => item[valueKey]);

    const backgroundColors = getRandomColors();

    setChartData({
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: backgroundColors,
        },
      ],
    });
  }, [gridData, labelKey, valueKey, rerender]);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: legPosition,
        labels: {
          font: {
            size: 12,
            family: "__iransans_7c92e5",
            style: "normal",
          },
        },
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
      title: {
        display: false,
        text: "",
      },
      tooltip: {
        enabled: true,
        position: "nearest",
        callbacks: {
          label: (context) => {
            const percentage = context.parsed.toFixed(2);
            return `${percentage}% `;
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
      },
    },
  };

  return <Pie data={chartData} options={options} />;
});

export default PieChartJs;
