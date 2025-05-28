import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'react-feather';

interface DateRangePickerProps {
  onDateChange: (startDate: Date | null, endDate: Date | null, isUserSelection?: boolean) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  // Load saved date range from localStorage on component mount
  useEffect(() => {
    const savedStartDate = localStorage.getItem('dashboardStartDate');
    const savedEndDate = localStorage.getItem('dashboardEndDate');
    
    if (savedStartDate && savedEndDate) {
      const parsedStartDate = new Date(savedStartDate);
      const parsedEndDate = new Date(savedEndDate);
      
      if (!isNaN(parsedStartDate.getTime()) && !isNaN(parsedEndDate.getTime())) {
        setDateRange([parsedStartDate, parsedEndDate]);
        onDateChange(parsedStartDate, parsedEndDate, false); // false indicates not a user selection
      }
    }
  }, []); // Remove onDateChange from dependencies

  // Update localStorage when date range changes
  useEffect(() => {
    if (startDate) {
      localStorage.setItem('dashboardStartDate', startDate.toISOString());
    }
    if (endDate) {
      localStorage.setItem('dashboardEndDate', endDate.toISOString());
    }
  }, [startDate, endDate]);

  return (
    <div className="relative flex items-center">
      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
          onDateChange(update[0], update[1], true); // true indicates user selection
        }}
        isClearable
        placeholderText="Select date range"
        className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-blue-500"
      />
      <Calendar size={18} className="absolute left-2 text-gray-400" />
    </div>
  );
};

export default DateRangePicker; 