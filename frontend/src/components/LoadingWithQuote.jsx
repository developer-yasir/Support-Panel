import React from 'react';
import { useRandomSupportQuote } from '../hooks/useRandomSupportQuote';

const LoadingWithQuote = ({ message = "Loading...", className = "" }) => {
  const { quote } = useRandomSupportQuote();

  return (
    <div className={`loading-with-quote ${className}`}>
      <div className="loading-content">
        <div className="spinner spinner--primary"></div>
        <p className="loading-message">{message}</p>
        {quote && (
          <div className="quote-container">
            <p className="support-quote">"{quote}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingWithQuote;