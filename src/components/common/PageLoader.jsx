import React from 'react';
import styled from 'styled-components';

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
`;

const LoaderSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f4f6;
  border-top: 5px solid #3182CE;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoaderMessage = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #4a5568;
`;

const PageLoader = ({ message = "Đang tải..." }) => {
  return (
    <LoaderContainer>
      <LoaderSpinner />
      <LoaderMessage>{message}</LoaderMessage>
    </LoaderContainer>
  );
};

export default PageLoader;