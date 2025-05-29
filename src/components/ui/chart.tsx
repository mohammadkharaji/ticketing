import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const defaultOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

interface ChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
  options?: any;
  height?: number;
}

export function TicketBarChart({ data, options = {}, height }: ChartProps) {
  return (
    <Bar
      height={height}
      options={{
        ...defaultOptions,
        ...options,
      }}
      data={data}
    />
  );
}

export function TicketLineChart({ data, options = {}, height }: ChartProps) {
  return (
    <Line
      height={height}
      options={{
        ...defaultOptions,
        ...options,
      }}
      data={data}
    />
  );
}

export function TicketPieChart({ data, options = {}, height }: ChartProps) {
  return (
    <Pie
      height={height}
      options={{
        ...defaultOptions,
        ...options,
      }}
      data={data}
    />
  );
}
