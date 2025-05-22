import React, { useState } from 'react';
import HistoricalDataTable from '../components/HistoricalDataTable';
import { firebaseService } from '@/services/firebase';
import { Calendar, Download } from 'react-feather';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const History = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportAllData = async () => {
    try {
      setIsExporting(true);
      
      // Get all data from the last 30 days
      const data = await firebaseService.getDailySummaries(30);
      
      if (data.length === 0) {
        alert('No data available to export');
        return;
      }
      
      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'DSWD Counter Dashboard';
      workbook.created = new Date();
      
      // Create worksheet
      const worksheet = workbook.addWorksheet('Production History');
      
      // Add headers
      worksheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Total Production', key: 'totalProduction', width: 18 },
        { header: 'Daily Target', key: 'totalTarget', width: 15 },
        { header: 'Efficiency (%)', key: 'overallEfficiency', width: 15 },
        { header: 'Top Line', key: 'topPerformingLineId', width: 15 },
        { header: 'Needs Attention', key: 'lowestPerformingLineId', width: 15 },
      ];
      
      // Style the header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2563EB' } // Blue color
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      
      // Add data rows
      data.forEach(item => {
        worksheet.addRow({
          date: new Date(item.date).toLocaleDateString(),
          totalProduction: item.totalProduction || 0,
          totalTarget: item.totalTarget || 0,
          overallEfficiency: item.overallEfficiency || 0,
          topPerformingLineId: item.topPerformingLineId ? `Line ${item.topPerformingLineId}` : 'N/A',
          lowestPerformingLineId: item.lowestPerformingLineId ? `Line ${item.lowestPerformingLineId}` : 'N/A',
        });
      });
      
      // Style efficiency column
      for (let i = 2; i <= data.length + 1; i++) {
        const cell = worksheet.getCell(`D${i}`);
        const value = Number(cell.value);
        
        if (value >= 90) {
          cell.font = { color: { argb: '16A34A' } }; // Green
        } else if (value >= 70) {
          cell.font = { color: { argb: 'EAB308' } }; // Yellow
        } else {
          cell.font = { color: { argb: 'DC2626' } }; // Red
        }
      }
      
      // Save file
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `DSWD_Production_History_${new Date().toISOString().split('T')[0]}.xlsx`);
      
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-800 mb-4 md:mb-0 flex items-center">
          <Calendar size={24} className="mr-2" />
          Production History
        </h1>
        
        <button
          onClick={handleExportAllData}
          disabled={isExporting}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center transition-colors text-sm disabled:opacity-50"
        >
          <Download size={16} className="mr-2" />
          {isExporting ? 'Exporting...' : 'Export All History'}
        </button>
      </div>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          View and analyze historical production data from your DSWD Relief Counter operations.
          Historical data is automatically saved when you use the "Add to Cloud" button on the dashboard.
        </p>
      </div>
      
      <HistoricalDataTable />
    </div>
  );
};

export default History; 