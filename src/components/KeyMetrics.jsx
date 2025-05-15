import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { FaComment, FaEye, FaHeart, FaShare } from 'react-icons/fa';
import { getMetrics } from '../mockData';

function KeyMetrics({ platform }) {
  const [metrics, setMetrics] = useState({ totalPosts: 0, totalLikes: 0, totalShares: 0, totalViews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const data = getMetrics(platform);
      setMetrics(data);
      setLoading(false);
    }, 1000);
  }, [platform]);

  const metricCards = [
    { title: 'Total Posts', value: metrics.totalPosts, icon: <FaComment />, color: '#4dabf7' },
    { title: 'Total Likes', value: metrics.totalLikes, icon: <FaHeart />, color: '#e64980' },
    { title: 'Total Shares', value: metrics.totalShares, icon: <FaShare />, color: '#845ef7' },
    { title: 'Total Views', value: metrics.totalViews, icon: <FaEye />, color: '#82c91e' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          {platform || 'All'} Key Metrics
        </Typography>
        <Grid container spacing={3}>
          {metricCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${card.color}, ${card.color}99)`,
                    color: '#fff',
                    borderRadius: 3,
                    boxShadow: 4,
                    transition: 'transform 0.3s',
                    minHeight: 140,
                  }}
                >
                  <CardContent>
                    {loading ? (
                      <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: 2, bgcolor: 'grey.700' }} />
                    ) : (
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor: '#ffffff33',
                              borderRadius: '50%',
                              padding: 1.5,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Box sx={{ fontSize: 24 }}>{card.icon}</Box>
                          </Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
                          {card.title}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {card.value}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </motion.div>
  );
}

export default KeyMetrics;
