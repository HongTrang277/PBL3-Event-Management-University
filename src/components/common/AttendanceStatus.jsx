import React from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const AttendanceStatus = ({ message }) => {
  if (!message) return null;

  const isSuccess = message.toLowerCase().includes('successful');

  return (
    <div className={`mt-4 p-4 rounded-lg ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
      <div className="flex items-center">
        {isSuccess ? (
          <FaCheckCircle className="text-green-500 mr-2 text-xl" />
        ) : (
          <FaExclamationTriangle className="text-red-500 mr-2 text-xl" />
        )}
        <p className={`${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default AttendanceStatus;