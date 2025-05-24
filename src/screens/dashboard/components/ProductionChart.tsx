import React from 'react';
import { DashboardData } from '../../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface ProductionChartProps {
  data: DashboardData | null;
}

const ProductionChart: React.FC<ProductionChartProps> = ({ data }) => {
  if (!data) return null;

  // Transform data for the chart
  const chartData = data.lines.map(line => ({
    name: `Line ${line.id}`,
    actual: line.actualProduction,
    target: line.dailyTarget,
    efficiency: Math.round((line.actualProduction / line.dailyTarget) * 100)
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-200">
      <h2 className="text-lg font-medium text-blue-800 mb-4">Production vs Target</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="actual" name="Actual Production" fill="#3B82F6" />
            <Bar dataKey="target" name="Daily Target" fill="#FCD34D" />
            <ReferenceLine y={0} stroke="#000" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductionChart;