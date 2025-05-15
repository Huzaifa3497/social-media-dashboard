import { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Divider,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import PostVolumeChart from './components/TweetVolumeChart';
import TopUsers from './components/TopUsers';
import HashtagWordCloud from './components/HashtagWordCloud';
import KeyMetrics from './components/KeyMetrics';
import PostManager from './components/TweetManager';
import PostDetails from './components/TweetDetails';
import './App.css';

function App() {
  const [selectedTweet, setSelectedTweet] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const platforms = [
    { name: 'All', icon: <FaBars /> },
    { name: 'Twitter', icon: <FaTwitter style={{ color: '#1DA1F2' }} /> },
    { name: 'Facebook', icon: <FaFacebook style={{ color: '#3b5998' }} /> },
    { name: 'Instagram', icon: <FaInstagram style={{ color: '#C13584' }} /> },
    { name: 'TikTok', icon: <FaTiktok style={{ color: '#000' }} /> },
    { name: 'YouTube', icon: <FaYoutube style={{ color: '#FF0000' }} /> },
  ];

  return (
    <div className="dashboard-root">
      <motion.div
        className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}
        initial={{ width: 250 }}
        animate={{ width: isSidebarCollapsed ? 80 : 250 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          {!isSidebarCollapsed && <Typography variant="h6">Social Dashboard</Typography>}
          <IconButton onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
            {isSidebarCollapsed ? <FaBars /> : <FaTimes />}
          </IconButton>
        </Box>
        <Divider />
        {platforms.map((platform) => (
          <Tooltip title={isSidebarCollapsed ? platform.name : ''} placement="right" key={platform.name}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                backgroundColor:
                  selectedPlatform === platform.name ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.25)' },
              }}
              onClick={() => setSelectedPlatform(platform.name)}
            >
              <span className="platform-icon" style={{ fontSize: 20, marginRight: isSidebarCollapsed ? 0 : 10 }}>
                {platform.icon}
              </span>
              {!isSidebarCollapsed && <Typography variant="body2">{platform.name}</Typography>}
            </Box>
          </Tooltip>
        ))}
      </motion.div>

      <motion.div
        className={`main-content ${isSidebarCollapsed ? 'collapsed' : ''}`}
        initial={{ marginLeft: 250 }}
        animate={{ marginLeft: isSidebarCollapsed ? 80 : 250 }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Social Media Dashboard
            </Typography>

            <FormControl sx={{ mb: 3, width: 300 }}>
              <InputLabel>Filter by Platform</InputLabel>
              <Select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                label="Filter by Platform"
              >
                {platforms.map((platform) => (
                  <MenuItem key={platform.name} value={platform.name}>
                    <span className="platform-icon" style={{ marginRight: 10 }}>{platform.icon}</span>
                    {platform.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                  <PostVolumeChart platform={selectedPlatform} />
                </Paper>
                <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                  <TopUsers platform={selectedPlatform} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                  <HashtagWordCloud platform={selectedPlatform} />
                </Paper>
                <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                  <KeyMetrics platform={selectedPlatform} />
                </Paper>
                <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                  <PostManager platform={selectedPlatform} />
                </Paper>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                  <PostDetails
                    platform={selectedPlatform}
                    selectedTweet={selectedTweet}
                    setSelectedTweet={setSelectedTweet}
                  />
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </motion.div>
    </div>
  );
}

export default App;