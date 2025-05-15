import { useState } from 'react';
import {
  TextField, Button, Card, CardContent, Typography,
  Grid, Chip, Box, Snackbar, Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaPaperPlane } from 'react-icons/fa';

function PostManager({ platform }) {
  const [postText, setPostText] = useState('');
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSchedulePost = () => {
    if (postText && postText.length <= 280) {
      const newPost = {
        text: postText,
        platform: platform || 'All',
        scheduledTime: new Date().toISOString(),
        status: 'Scheduled'
      };
      setScheduledPosts([newPost, ...scheduledPosts]);
      setPostText('');
      setSnackbarOpen(true);
    } else {
      alert('Post must be between 1–280 characters.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="MuiCard-root"
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          {platform ? `Schedule a Post for ${platform}` : 'Select a Platform to Schedule'}
        </Typography>

        <TextField
          label="Write your post..."
          placeholder="What's on your mind?"
          multiline
          rows={4}
          fullWidth
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          disabled={!platform}
          sx={{
            backgroundColor: '#F8FAFC',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSchedulePost}
          disabled={!platform}
          startIcon={<FaPaperPlane />}
          sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
        >
          Schedule Post
        </Button>

        {scheduledPosts.length > 0 && (
          <Box mt={4}>
            <Typography variant="subtitle1" gutterBottom>
              Scheduled Posts
            </Typography>

            <Grid container spacing={2}>
              {scheduledPosts
                .filter(p => !platform || p.platform === platform || p.platform === 'All')
                .map((post, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card sx={{ borderLeft: '5px solid #3f51b5', boxShadow: 2 }}>
                      <CardContent>
                        <Typography variant="body1" gutterBottom>
                          {post.text}
                        </Typography>
                        <Chip label={post.platform} size="small" sx={{ mb: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="textSecondary">
                            <FaCalendarAlt style={{ marginRight: 4 }} />
                            {new Date(post.scheduledTime).toLocaleString()}
                          </Typography>
                          <Chip label={post.status} size="small" color="success" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            Post scheduled successfully!
          </Alert>
        </Snackbar>
      </Box>
    </motion.div>
  );
}

export default PostManager;
