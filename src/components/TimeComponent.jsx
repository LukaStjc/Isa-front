import React from 'react';

function TimeComponent({ date }) {
  const formattedDate = new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });

  return <p>Date and Time: {formattedDate}</p>;
}

export default TimeComponent;
