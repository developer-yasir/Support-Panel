import { useState, useEffect } from 'react';
import { supportQuotes } from '../utils/supportQuotes';

// Custom hook to get a random support quote
export const useRandomSupportQuote = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (supportQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * supportQuotes.length);
      setQuote(supportQuotes[randomIndex]);
    }
  }, []);

  const getRandomQuote = () => {
    if (supportQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * supportQuotes.length);
      return supportQuotes[randomIndex];
    }
    return '';
  };

  return { quote, getRandomQuote };
};