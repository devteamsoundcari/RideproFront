import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart = ({ data }: any) => {
  const options = {
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Doughnut Chart',
        color: 'blue',
        font: {
          size: 34
        },
        padding: {
          top: 30,
          bottom: 30
        },
        responsive: true,
        animation: {
          animateScale: true
        }
      }
    }
  };
  return <Doughnut data={data} options={options} />;
};
