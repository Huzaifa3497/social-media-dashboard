export const posts = [
  {
    id: "1",
    platform: "Twitter",
    screen_name: "user1",
    created_at: "2025-05-10",
    text: "Loving #rstats for data analysis!",
    favorite_count: 50,
    retweet_count: 20,
    hashtags: ["rstats", "data"],
  },
  {
    id: "2",
    platform: "Twitter",
    screen_name: "user2",
    created_at: "2025-05-11",
    text: "Check out my #rstats project!",
    favorite_count: 30,
    retweet_count: 10,
    hashtags: ["rstats", "coding"],
  },
  {
    id: "3",
    platform: "Facebook",
    screen_name: "user3",
    created_at: "2025-05-10",
    text: "Excited about our new #product launch!",
    likes: 100,
    shares: 25,
    hashtags: ["product", "launch"],
  },
  {
    id: "4",
    platform: "Instagram",
    screen_name: "user4",
    created_at: "2025-05-11",
    text: "Chasing sunsets #instagood",
    likes: 200,
    comments: 15,
    hashtags: ["instagood", "sunset"],
  },
  {
    id: "5",
    platform: "TikTok",
    screen_name: "user5",
    created_at: "2025-05-12",
    text: "Dance challenge! #tiktokdance",
    views: 1000,
    likes: 300,
    hashtags: ["tiktokdance", "challenge"],
  },
  {
    id: "6",
    platform: "YouTube",
    screen_name: "user6",
    created_at: "2025-05-12",
    text: "New tutorial on #coding",
    views: 500,
    likes: 50,
    hashtags: ["coding", "tutorial"],
  },
];

export const getPostVolume = (platform = null) => {
  return posts
    .filter((post) => !platform || post.platform === platform)
    .reduce((acc, post) => {
      const date = post.created_at;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
};

export const getTopUsers = (platform = null) => {
  return posts
    .filter((post) => !platform || post.platform === platform)
    .reduce((acc, post) => {
      const { screen_name, favorite_count = 0, retweet_count = 0, likes = 0, shares = 0, comments = 0, views = 0 } = post;
      const engagement = favorite_count + retweet_count + likes + shares + comments + views;
      acc[screen_name] = (acc[screen_name] || 0) + engagement;
      return acc;
    }, {});
};

export const getHashtags = (platform = null) => {
  const hashtags = posts
    .filter((post) => !platform || post.platform === platform)
    .flatMap((post) => post.hashtags);
  const freq = hashtags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(freq).map(([word, value]) => ({ text: word, value }));
};

export const getMetrics = (platform = null) => {
  const filteredPosts = platform ? posts.filter((post) => post.platform === platform) : posts;
  return {
    totalPosts: filteredPosts.length,
    totalLikes: filteredPosts.reduce((sum, p) => sum + (p.favorite_count || p.likes || 0), 0),
    totalShares: filteredPosts.reduce((sum, p) => sum + (p.retweet_count || p.shares || p.comments || 0), 0),
    totalViews: filteredPosts.reduce((sum, p) => sum + (p.views || 0), 0),
  };
};