import React from 'react';
import { startOfYear, endOfYear, addMonths, format } from 'date-fns';

const YearView = ({ date }) => {
  const start = startOfYear(date);
  const end = endOfYear(date);
  const months = [];

  for (let month = start; month <= end; month = addMonths(month, 1)) {
    months.push(
      <div key={month} className="month">
        <h3>{format(month, 'MMMM yyyy')}</h3>
        {/* Aquí puedes agregar más detalles del mes */}
      </div>
    );
  }

  return <div className="year-view">{months}</div>;
};

YearView.title = (date, { localizer }) => {
  return localizer.format(date, 'yyyy');
};

YearView.navigate = (date, action) => {
  switch (action) {
    case 'PREV':
      return new Date(date.getFullYear() - 1, 0, 1);
    case 'NEXT':
      return new Date(date.getFullYear() + 1, 0, 1);
    default:
      return date;
  }
};

YearView.range = (date) => {
  return [startOfYear(date), endOfYear(date)];
};

export default YearView;