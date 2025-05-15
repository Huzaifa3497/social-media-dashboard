import { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  Skeleton,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { FaTwitter, FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { posts } from '../mockData';

function PostDetails({ platform, selectedTweet, setSelectedTweet }) {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const data = posts.filter(
        (post) => !platform || post.platform === platform || platform === 'All'
      );
      setFilteredPosts(data);
      setLoading(false);
    }, 1000);
  }, [platform]);

  const platformIcons = {
    Twitter: <FaTwitter color="#1DA1F2" />,
    Facebook: <FaFacebook color="#3b5998" />,
    Instagram: <FaInstagram color="#C13584" />,
    TikTok: <FaTiktok color="#000000" />,
    YouTube: <FaYoutube color="#FF0000" />,
  };

  const post = filteredPosts.find((p) => p.id === selectedTweet);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Post Details
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Select Post</InputLabel>
          <Select
            value={selectedTweet || ''}
            onChange={(e) => setSelectedTweet(e.target.value)}
            sx={{ bgcolor: '#fff', borderRadius: 2 }}
          >
            {filteredPosts.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                <Box display="flex" alignItems="center" gap={1}>
                  {platformIcons[p.platform]}
                  {p.text.substring(0, 30)}...
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Paper elevation={3} sx={{ mt: 3, p: 2, borderRadius: 3 }}>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2 }} />
          ) : post ? (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Platform</strong></TableCell>
                  <TableCell><strong>User</strong></TableCell>
                  <TableCell><strong>Text</strong></TableCell>
                  <TableCell><strong>Likes</strong></TableCell>
                  <TableCell><strong>Shares/Comments</strong></TableCell>
                  <TableCell><strong>Views</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {platformIcons[post.platform]}
                      {post.platform}
                    </Box>
                  </TableCell>
                  <TableCell>{post.screen_name}</TableCell>
                  <TableCell>{post.text}</TableCell>
                  <TableCell>{post.favorite_count || post.likes || 0}</TableCell>
                  <TableCell>{post.retweet_count || post.shares || post.comments || 0}</TableCell>
                  <TableCell>{post.views || 0}</TableCell>
                  <TableCell>{post.created_at}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <Typography color="text.secondary" p={2}>
              Select a post to view details.
            </Typography>
          )}
        </Paper>
      </Box>
    </motion.div>
  );
}

export default PostDetails;
