import React from "react";
import { CChartLine } from "@coreui/react-chartjs";
import { getStyle, hexToRgba } from "@coreui/utils";
import { formatRupiah } from "src/shared/utils";
const brandInfo = getStyle("info") || "#20a8d8";

const ChartIncomes = ({ data, data_description }) => {
  const maxIncome = data.length > 0 ? Math.max(...data) : 10;

  const defaultOptions = (() => {
    return {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              drawOnChartArea: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5,
              stepSize: Math.ceil(maxIncome / 4),
              max: (maxIncome || 1) * 1.5,
              callback: (value) => formatRupiah(value),
            },
            gridLines: {
              display: true,
            },
          },
        ],
      },
    };
  })();

  return (
    <CChartLine
      style={{ height: "25rem", marginTop: "40x" }}
      datasets={[
        {
          label: "Total",
          backgroundColor: hexToRgba(brandInfo, 10),
          borderColor: brandInfo,
          pointHoverBackgroundColor: brandInfo,
          borderWidth: 2,
          data,
        },
      ]}
      options={defaultOptions}
      labels={data_description}
    />
  );
};

export default ChartIncomes;
