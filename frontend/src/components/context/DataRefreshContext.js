// src/components/context/DataRefreshContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';

const DataRefreshContext = createContext();

export const DataRefreshProvider = ({ children }) => {
  const [refreshTriggers, setRefreshTriggers] = useState({
    records: 0,
    requests: 0,
    uploads: 0
  });

  const triggerRefresh = useCallback((type) => {
    setRefreshTriggers(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  }, []);

  const triggerAllRefresh = useCallback(() => {
    setRefreshTriggers(prev => ({
      records: prev.records + 1,
      requests: prev.requests + 1,
      uploads: prev.uploads + 1
    }));
  }, []);

  return (
    <DataRefreshContext.Provider value={{ 
      refreshTriggers, 
      triggerRefresh, 
      triggerAllRefresh 
    }}>
      {children}
    </DataRefreshContext.Provider>
  );
};

export const useDataRefresh = () => {
  const context = useContext(DataRefreshContext);
  if (!context) {
    throw new Error('useDataRefresh must be used within a DataRefreshProvider');
  }
  return context;
};