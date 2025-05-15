import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { TextField, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { getTopUsers } from '../mockData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TopUsers({ platform }) {
  const [threshold, setThreshold] = useState(0);
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const topUsers = getTopUsers(platform);
      const filteredUsers = Object.entries(topUsers)
        .filter(([_, engagement]) => engagement >= threshold)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      setData({
        labels: filteredUsers.map(([user]) => user),
        datasets: [
          {
            label: `${platform || 'All'} Engagement (Likes + Shares + Views)`,
            data: filteredUsers.map(([_, engagement]) => engagement),
            backgroundColor: 'var(--chart-color-2)',
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [platform, threshold]);

  const options = {
    plugins: {
      legend: { labels: { color: 'var(--text-primary)' } },
      title: { display: true, text: `${platform || 'All'} Top Users by Engagement`, color: 'var(--text-primary)' },
    },
    scales: {
      x: { ticks: { color: 'var(--text-secondary)' } },
      y: { ticks: { color: 'var(--text-secondary)' } },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="MuiCard-root"
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">{platform || 'All'} Top Users by Engagement</Typography>
        <TextField
          label="Min Engagement"
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          fullWidth
          margin="normal"
        />
        {loading ? (
          <Box sx={{ height: 200, width: '100%' }} className="skeleton" />
        ) : (
          <Bar data={data} options={options} />
        )}
      </Box>
    </motion.div>
  );
}

export default TopUsers;