import { createContext, useContext, useState, useEffect } from 'react';

const DashboardSettingsContext = createContext();

export const useDashboardSettings = () => {
  return useContext(DashboardSettingsContext);
};

export const DashboardSettingsProvider = ({ children }) => {
  const [dashboardSettings, setDashboardSettings] = useState({
    showRecentActivity: true,
    showTicketCategories: true,
    showAgentPerformance: true,
    showCustomerSatisfaction: true,
    showTicketAgeAnalysis: true,
    showResponseTimeMetrics: true,
    showQuickActions: true,
    showUpcomingBreaches: true,
    showDepartmentView: true
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      try {
        setDashboardSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading dashboard settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dashboardSettings', JSON.stringify(dashboardSettings));
  }, [dashboardSettings]);

  const updateSetting = (settingName, value) => {
    setDashboardSettings(prev => ({
      ...prev,
      [settingName]: value
    }));
  };

  const value = {
    dashboardSettings,
    updateSetting
  };

  return (
    <DashboardSettingsContext.Provider value={value}>
      {children}
    </DashboardSettingsContext.Provider>
  );
};