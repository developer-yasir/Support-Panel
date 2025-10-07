import { createContext, useContext, useState, useEffect } from 'react';

const DashboardSettingsContext = createContext();

export const useDashboardSettings = () => {
  return useContext(DashboardSettingsContext);
};

export const DashboardSettingsProvider = ({ children }) => {
  const [dashboardSettings, setDashboardSettings] = useState({
    showCompanyTickets: true
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        // Filter out deprecated settings and only keep valid ones
        const validSettings = {
          showCompanyTickets: parsedSettings.showCompanyTickets ?? true
        };
        setDashboardSettings(validSettings);
      } catch (error) {
        console.error('Error loading dashboard settings:', error);
        // Set default settings if parsing fails
        setDashboardSettings({ showCompanyTickets: true });
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