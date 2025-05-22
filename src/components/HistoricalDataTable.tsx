import React, { useEffect, useState } from 'react';
import { firebaseService } from '@/services/firebase';
import { BarChart2, Calendar, TrendingUp } from 'react-feather';

// Interface for daily summary data
interface DailySummary {
  date: string;
  totalProduction?: number;
  totalTarget?: number;
  overallEfficiency?: number;
  topPerformingLineId?: number;
  lowestPerformingLineId?: number;
}

const HistoricalDataTable: React.FC = () => {
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7); // Default to 7 days

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await firebaseService.getDailySummaries(days);
        setSummaries(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch historical data:', err);
        setError('Could not load historical data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [days]);

  const handleDaysChange = (newDays: number) => {
    setDays(newDays);
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-xl p-6 mb-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-lg shadow-xl p-6 mb-6">
        <div className="text-red-500 text-center py-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden mb-6 border border-blue-200">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-50">
        <h2 className="text-lg font-medium text-blue-800 flex items-center">
          <Calendar size={18} className="mr-2" />
          Historical Production Data
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={() => handleDaysChange(7)}
            className={`px-3 py-1 rounded-md text-sm ${
              days === 7
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => handleDaysChange(14)}
            className={`px-3 py-1 rounded-md text-sm ${
              days === 14
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            14 Days
          </button>
          <button
            onClick={() => handleDaysChange(30)}
            className={`px-3 py-1 rounded-md text-sm ${
              days === 30
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {summaries.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No historical data available. Save some production data first.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-center">Total Production</th>
                <th className="py-3 px-4 text-center">Daily Target</th>
                <th className="py-3 px-4 text-center">Efficiency</th>
                <th className="py-3 px-4 text-center">Top Line</th>
                <th className="py-3 px-4 text-center">Needs Attention</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((summary, index) => (
                <tr
                  key={summary.date}
                  className={`border-b border-blue-100 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                  } hover:bg-yellow-50 transition-colors`}
                >
                  <td className="py-3 px-4 font-medium">
                    {new Date(summary.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {summary.totalProduction?.toLocaleString() || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {summary.totalTarget?.toLocaleString() || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        (summary.overallEfficiency || 0) >= 90
                          ? 'bg-green-500'
                          : (summary.overallEfficiency || 0) >= 70
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {summary.overallEfficiency}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    Line {summary.topPerformingLineId || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    Line {summary.lowestPerformingLineId || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoricalDataTable; 