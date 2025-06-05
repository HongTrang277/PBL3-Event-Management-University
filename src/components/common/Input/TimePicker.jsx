import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import styled from 'styled-components';

const TimePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border-radius: 8px;
  background-color: #1e1e1e;
  color: #ffffff;
  width: 100%;
  max-width: 400px;
`;

const TimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RadioButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RadioInput = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #6c6c6c;
  border-radius: 50%;
  margin: 0;
  cursor: pointer;
  position: relative;

  &:checked {
    border-color: #ffffff;
    
    &::after {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      background-color: #ffffff;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

const RadioLabel = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
`;

const TimeDisplay = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 8px;
  margin-left: 26px;
`;

const DatePill = styled.div`
  background-color: #333333;
  padding: 8px 12px;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  color: #ffffff;
`;

const TimePill = styled.div`
  background-color: #333333;
  padding: 8px 12px;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  color: #ffffff;
`;

const TimeZoneInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 14px;
  color: #a0a0a0;
`;

const TimePicker = ({ 
  startDate = new Date(), 
  endDate = new Date(new Date().getTime() + 60 * 60 * 1000),
  onStartDateChange,
  onEndDateChange,
  timeZone = 'GMT+07:00',
  location = 'Saigon',
  activeField: initialActiveField = 'start'
}) => {
  // Convert strings to Date objects if necessary
  const initialStartDate = startDate instanceof Date ? startDate : new Date(startDate);
  const initialEndDate = endDate instanceof Date ? endDate : new Date(endDate);
  
  const [start, setStart] = useState(initialStartDate);
  const [end, setEnd] = useState(initialEndDate);
  const [activeField, setActiveField] = useState(initialActiveField);
  
  // Sync with parent component when props change
  useEffect(() => {
    if (startDate) {
      const newStartDate = startDate instanceof Date ? startDate : new Date(startDate);
      if (!isNaN(newStartDate.getTime())) {
        setStart(newStartDate);
      }
    }
  }, [startDate]);
  
  useEffect(() => {
    if (endDate) {
      const newEndDate = endDate instanceof Date ? endDate : new Date(endDate);
      if (!isNaN(newEndDate.getTime())) {
        setEnd(newEndDate);
      }
    }
  }, [endDate]);

  const handleStartDateChange = (newDate) => {
    setStart(newDate);
    if (onStartDateChange) {
      onStartDateChange(newDate);
    }
    
    // If end date is before new start date, update end date
    if (end < newDate) {
      const newEndDate = new Date(newDate.getTime() + 60 * 60 * 1000); // 1 hour later
      setEnd(newEndDate);
      if (onEndDateChange) {
        onEndDateChange(newEndDate);
      }
    }
  };

  const handleEndDateChange = (newDate) => {
    setEnd(newDate);
    if (onEndDateChange) {
      onEndDateChange(newDate);
    }
  };

  // Add date/time picker functionality here
  // For example, handleDateClick, handleTimeClick methods
  // You'll need to render date pickers and time pickers when a field is active

  return (
    <TimePickerContainer>
      <TimeRow>
        <RadioButton>
          <RadioInput 
            type="radio" 
            name="timeField" 
            id="startTime" 
            checked={activeField === 'start'} 
            onChange={() => setActiveField('start')} 
          />
          <RadioLabel>Start</RadioLabel>
        </RadioButton>
        
        <TimeDisplay>
          <DatePill onClick={() => setActiveField('start')}>{format(start, 'EEE, MMM d')}</DatePill>
          <TimePill onClick={() => setActiveField('start')}>{format(start, 'hh:mm a')}</TimePill>
          {activeField === 'start' && (
            <TimeZoneInfo>
              <div>{timeZone}</div>
              <div>{location}</div>
            </TimeZoneInfo>
          )}
        </TimeDisplay>
      </TimeRow>

      <TimeRow>
        <RadioButton>
          <RadioInput 
            type="radio" 
            name="timeField" 
            id="endTime" 
            checked={activeField === 'end'} 
            onChange={() => setActiveField('end')} 
          />
          <RadioLabel>End</RadioLabel>
        </RadioButton>

        <TimeDisplay>
          <DatePill onClick={() => setActiveField('end')}>{format(end, 'EEE, MMM d')}</DatePill>
          <TimePill onClick={() => setActiveField('end')}>{format(end, 'hh:mm a')}</TimePill>
          {activeField === 'end' && (
            <TimeZoneInfo>
              <div>{timeZone}</div>
              <div>{location}</div>
            </TimeZoneInfo>
          )}
        </TimeDisplay>
      </TimeRow>
      
      {/* Add date/time selection components here */}
      {activeField && (
        <div>
          {/* Calendar component would go here */}
          {/* Time selection component would go here */}
        </div>
      )}
    </TimePickerContainer>
  );
};

export default TimePicker;