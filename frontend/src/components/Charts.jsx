import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { api } from '../services/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Charts = ({ startDate, endDate }) => {
  const [trendsData, setTrendsData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [resolutionData, setResolutionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch chart data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch ticket trends data
        const trendsResponse = await api.get('/tickets/trends');
        setTrendsData(trendsResponse.data);
        
        // Fetch ticket distribution data
        const distributionParams = {};
        if (startDate) distributionParams.startDate = startDate;
        if (endDate) distributionParams.endDate = endDate;
        const distributionResponse = await api.get('/tickets/distribution', { params: distributionParams });
        setDistributionData(distributionResponse.data);
        
        // Fetch resolution rates data
        const resolutionResponse = await api.get('/tickets/resolution-rates');
        setResolutionData(resolutionResponse.data);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to fetch chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  // Bar chart options for ticket trends
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ticket Trends (Last 30 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Tickets',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  // Bar chart data for ticket trends
  const barChartData = {
    labels: trendsData.map(item => item.date),
    datasets: [
      {
        label: 'Tickets Created',
        data: trendsData.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Pie chart options for ticket distribution
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ticket Distribution by Priority',
      },
    },
  };

  // Pie chart data for ticket distribution
  const pieChartData = {
    labels: distributionData.map(item => 
      item._id.charAt(0).toUpperCase() + item._id.slice(1)
    ),
    datasets: [
      {
        label: 'Tickets',
        data: distributionData.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Line chart options for resolution rates
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ticket Resolution Rates (Last 30 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Resolved Tickets',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  // Line chart data for resolution rates
  const lineChartData = {
    labels: resolutionData.map(item => item.date),
    datasets: [
      {
        label: 'Tickets Resolved',
        data: resolutionData.map(item => item.resolvedCount),
        fill: true,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return <div className="chart-container">Loading charts...</div>;
  }

  if (error) {
    return <div className="chart-container">Error: {error}</div>;
  }

  return (
    <div className="charts-container">
      <div className="chart-wrapper">
        <Bar options={barChartOptions} data={barChartData} />
      </div>
      <div className="chart-wrapper">
        <Pie options={pieChartOptions} data={pieChartData} />
      </div>
      <div className="chart-wrapper">
        <Line options={lineChartOptions} data={lineChartData} />
      </div>
    </div>
  );
};

export default Charts;