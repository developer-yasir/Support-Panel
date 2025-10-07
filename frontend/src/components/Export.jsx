import { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './Export.css';

const Export = ({ stats, startDate, endDate }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    frequency: 'daily',
    email: '',
    format: 'pdf'
  });
  const [shareData, setShareData] = useState({
    emails: '',
    message: ''
  });

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Support Panel Dashboard Report', 14, 22);
    
    // Add date range if available
    if (startDate || endDate) {
      doc.setFontSize(12);
      const dateRange = `Date Range: ${startDate || 'Beginning'} to ${endDate || 'Today'}`;
      doc.text(dateRange, 14, 32);
    }
    
    // Add stats table
    doc.autoTable({
      startY: 40,
      head: [['Metric', 'Value']],
      body: [
        ['Total Tickets', stats.totalTickets.toString()],
        ['Open Tickets', stats.openTickets.toString()],
        ['In Progress Tickets', stats.inProgressTickets.toString()],
        ['High Priority Tickets', stats.highPriorityTickets.toString()]
      ],
      theme: 'grid'
    });
    
    // Save the PDF
    doc.save(`dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`);
    setIsDropdownOpen(false);
  };

  // Export to Excel
  const exportToExcel = () => {
    // Create worksheet data
    const data = [
      ['Metric', 'Value'],
      ['Total Tickets', stats.totalTickets],
      ['Open Tickets', stats.openTickets],
      ['In Progress Tickets', stats.inProgressTickets],
      ['High Priority Tickets', stats.highPriorityTickets]
    ];
    
    // Add date range if available
    if (startDate || endDate) {
      data.unshift(['', '']);
      data.unshift(['Date Range', `${startDate || 'Beginning'} to ${endDate || 'Today'}`]);
      data.unshift(['Report Generated', new Date().toISOString().split('T')[0]]);
    }
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Dashboard Report');
    
    // Save the Excel file
    XLSX.writeFile(wb, `dashboard-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    setIsDropdownOpen(false);
  };

  // Handle schedule form changes
  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle share form changes
  const handleShareChange = (e) => {
    const { name, value } = e.target;
    setShareData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle schedule submit (mock)
  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to schedule reports
    alert(`Report scheduled successfully!
Frequency: ${scheduleData.frequency}
Format: ${scheduleData.format}
Email: ${scheduleData.email}`);
    setIsScheduleModalOpen(false);
    setScheduleData({
      frequency: 'daily',
      email: '',
      format: 'pdf'
    });
  };

  // Handle share submit (mock)
  const handleShareSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to share the dashboard
    alert(`Dashboard shared successfully!
Recipients: ${shareData.emails}
Message: ${shareData.message}`);
    setIsShareModalOpen(false);
    setShareData({
      emails: '',
      message: ''
    });
  };

  return (
    <div className="export-component">
      <div className="dropdown">
        <button 
          className="btn btn--outline export-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="icon export-button__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
        
        {isDropdownOpen && (
          <div className="dropdown__menu export-dropdown">
            <button 
              className="dropdown__item export-dropdown__item"
              onClick={exportToPDF}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon export-dropdown__item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export as PDF
            </button>
            <button 
              className="dropdown__item export-dropdown__item"
              onClick={exportToExcel}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon export-dropdown__item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export as Excel
            </button>
            <button 
              className="dropdown__item export-dropdown__item"
              onClick={() => setIsScheduleModalOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon export-dropdown__item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Schedule Reports
            </button>
            <button 
              className="dropdown__item export-dropdown__item"
              onClick={() => setIsShareModalOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon export-dropdown__item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="modal">
          <div className="modal__overlay" onClick={() => setIsScheduleModalOpen(false)}></div>
          <div className="modal__content schedule-modal">
            <div className="modal__header">
              <h3 className="modal__title">Schedule Automated Reports</h3>
              <button 
                className="modal__close"
                onClick={() => setIsScheduleModalOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="icon modal__close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal__body">
              <form onSubmit={handleScheduleSubmit}>
                <div className="form-group">
                  <label htmlFor="frequency" className="form-label">Frequency</label>
                  <select
                    id="frequency"
                    name="frequency"
                    className="form-control"
                    value={scheduleData.frequency}
                    onChange={handleScheduleChange}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="format" className="form-label">Format</label>
                  <select
                    id="format"
                    name="format"
                    className="form-control"
                    value={scheduleData.format}
                    onChange={handleScheduleChange}
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="recipient@example.com"
                    value={scheduleData.email}
                    onChange={handleScheduleChange}
                    required
                  />
                </div>
                
                <div className="modal__footer">
                  <button 
                    type="button" 
                    className="btn btn--secondary"
                    onClick={() => setIsScheduleModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn--primary"
                  >
                    Schedule Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="modal">
          <div className="modal__overlay" onClick={() => setIsShareModalOpen(false)}></div>
          <div className="modal__content share-modal">
            <div className="modal__header">
              <h3 className="modal__title">Share Dashboard</h3>
              <button 
                className="modal__close"
                onClick={() => setIsShareModalOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="icon modal__close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal__body">
              <form onSubmit={handleShareSubmit}>
                <div className="form-group">
                  <label htmlFor="emails" className="form-label">Email Addresses</label>
                  <input
                    type="text"
                    id="emails"
                    name="emails"
                    className="form-control"
                    placeholder="user1@example.com, user2@example.com"
                    value={shareData.emails}
                    onChange={handleShareChange}
                    required
                  />
                  <small className="form-text">Separate multiple emails with commas</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-control"
                    rows="4"
                    placeholder="Add a message to include with the dashboard link..."
                    value={shareData.message}
                    onChange={handleShareChange}
                  ></textarea>
                </div>
                
                <div className="modal__footer">
                  <button 
                    type="button" 
                    className="btn btn--secondary"
                    onClick={() => setIsShareModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn--primary"
                  >
                    Share Dashboard
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Export;