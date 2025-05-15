import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { getPostVolume } from '../mockData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function PostVolumeChart({ platform }) {
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const postVolume = getPostVolume(platform);
      setData({
        labels: Object.keys(postVolume),
        datasets: [
          {
            label: `${platform || 'All'} Post Volume`,
            data: Object.values(postVolume),
            borderColor: 'var(--chart-color-1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            pointBackgroundColor: 'var(--chart-color-1)',
            fill: true,
          },
        ],
      });
      setLoading(false);
    }, 1000); // Simulate async load
  }, [platform]);

  const options = {
    plugins: {
      legend: { labels: { color: 'var(--text-primary)' } },
      title: { display: true, text: `${platform || 'All'} Post Volume Over Time`, color: 'var(--text-primary)' },
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
        <Typography variant="h6">{platform || 'All'} Post Volume Over Time</Typography>
        {loading ? (
          <Box sx={{ height: 200, width: '100%' }} className="skeleton" />
        ) : (
          <Line data={data} options={options} />
        )}
      </Box>
    </motion.div>
  );
}

export default PostVolumeChart;