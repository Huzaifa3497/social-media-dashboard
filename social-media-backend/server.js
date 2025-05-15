require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');
const FB = require('fb');
// const TikTokAPI = require('tiktok-api').default;
const { google } = require('googleapis');

const app = express();
const port = 3001;

app.use(express.json());

// Twitter Client
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_TOKEN_SECRET,
});

// Facebook Client
FB.setAccessToken(process.env.FACEBOOK_APP_ID + '|' + process.env.FACEBOOK_APP_SECRET);

// TikTok Client
// const tiktokApi = new TikTokAPI({
//   clientKey: process.env.TIKTOK_CLIENT_KEY,
//   clientSecret: process.env.TIKTOK_CLIENT_SECRET,
// });

// YouTube Client
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5174');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

// Fetch Twitter Posts
app.get('/api/posts/twitter', async (req, res) => {
  try {
    const tweets = await twitterClient.v2.userTimeline('user_id'); // Replace with your Twitter user ID
    const posts = [];
    for await (const tweet of tweets) {
      posts.push({
        id: tweet.id,
        platform: 'Twitter',
        screen_name: tweet.author_id,
        created_at: tweet.created_at,
        text: tweet.text,
        favorite_count: tweet.public_metrics.like_count,
        retweet_count: tweet.public_metrics.retweet_count,
        hashtags: tweet.entities?.hashtags?.map(h => h.tag) || [],
      });
    }
    res.json(posts);
  } catch (error) {
    console.error('Twitter Error:', error);
    res.status(500).json({ error: 'Failed to fetch Twitter posts' });
  }
});

// Fetch Facebook Posts
app.get('/api/posts/facebook', async (req, res) => {
  try {
    const response = await FB.api('me/feed', { fields: 'id,from,message,created_time,likes.summary(true),shares' });
    const posts = response.data.map(post => ({
      id: post.id,
      platform: 'Facebook',
      screen_name: post.from.name,
      created_at: post.created_time,
      text: post.message || '',
      likes: post.likes?.summary.total_count || 0,
      shares: post.shares?.count || 0,
      hashtags: post.message?.match(/#[^\s#]+/g) || [],
    }));
    res.json(posts);
  } catch (error) {
    console.error('Facebook Error:', error);
    res.status(500).json({ error: 'Failed to fetch Facebook posts' });
  }
});

// Fetch Instagram Posts
app.get('/api/posts/instagram', async (req, res) => {
  try {
    const response = await FB.api('me/media', { fields: 'id,username,caption,timestamp,like_count,comments_count' });
    const posts = response.data.map(post => ({
      id: post.id,
      platform: 'Instagram',
      screen_name: post.username,
      created_at: post.timestamp,
      text: post.caption || '',
      likes: post.like_count || 0,
      comments: post.comments_count || 0,
      hashtags: post.caption?.match(/#[^\s#]+/g) || [],
    }));
    res.json(posts);
  } catch (error) {
    console.error('Instagram Error:', error);
    res.status(500).json({ error: 'Failed to fetch Instagram posts' });
  }
});

// Fetch TikTok Posts
// app.get('/api/posts/tiktok', async (req, res) => {
//   try {
//     const response = await tiktokApi.getUserVideos('user_id'); // Replace with your TikTok user ID
//     const posts = response.videos.map(video => ({
//       id: video.id,
//       platform: 'TikTok',
//       screen_name: video.author.uniqueId,
//       created_at: new Date(video.createTime * 1000).toISOString(),
//       text: video.desc,
//       views: video.playCount,
//       likes: video.diggCount,
//       hashtags: video.textExtra.filter(t => t.hashtagName).map(t => t.hashtagName),
//     }));
//     res.json(posts);
//   } catch (error) {
//     console.error('TikTok Error:', error);
//     res.status(500).json({ error: 'Failed to fetch TikTok posts' });
//   }
// });

// Fetch YouTube Videos
app.get('/api/posts/youtube', async (req, res) => {
  try {
    const response = await youtube.search.list({
      part: 'snippet',
      forMine: true,
      type: 'video',
    });
    const posts = response.data.items.map(video => ({
      id: video.id.videoId,
      platform: 'YouTube',
      screen_name: video.snippet.channelTitle,
      created_at: video.snippet.publishedAt,
      text: video.snippet.title,
      views: 0, // Requires additional API call to statistics
      likes: 0, // Requires additional API call to statistics
      hashtags: video.snippet.tags || [],
    }));
    res.json(posts);
  } catch (error) {
    console.error('YouTube Error:', error);
    res.status(500).json({ error: 'Failed to fetch YouTube videos' });
  }
});

// Schedule Post
app.post('/api/post', async (req, res) => {
  const { platform, text } = req.body;
  try {
    switch (platform.toLowerCase()) {
      case 'twitter':
        await twitterClient.v2.tweet(text);
        break;
      case 'facebook':
        await FB.api('me/feed', 'post', { message: text });
        break;
      case 'instagram':
        // Instagram requires media upload, not supported in this basic example
        throw new Error('Instagram posting not implemented');
      case 'tiktok':
        // TikTok posting requires video upload, not supported in this basic example
        throw new Error('TikTok posting not implemented');
      case 'youtube':
        // YouTube requires video upload, not supported in this basic example
        throw new Error('YouTube posting not implemented');
      default:
        throw new Error('Invalid platform');
    }
    res.json({ message: 'Post scheduled successfully' });
  } catch (error) {
    console.error(`${platform} Posting Error:`, error);
    res.status(500).json({ error: `Failed to schedule post on ${platform}` });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});