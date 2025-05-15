import { useState, useEffect } from 'react';
import { Wordcloud } from '@visx/wordcloud';
import { scaleLog } from '@visx/scale';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { getHashtags } from '../mockData';

function HashtagWordCloud({ platform }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const hashtags = getHashtags(platform);
      setWords(hashtags);
      setLoading(false);
    }, 1000);
  }, [platform]);

  const fontScale = scaleLog({
    domain: [Math.min(...words.map((w) => w.value)) || 1, Math.max(...words.map((w) => w.value)) || 10],
    range: [10, 50],
  });

  const platformColors = {
    Twitter: 'var(--twitter-color)',
    Facebook: 'var(--facebook-color)',
    Instagram: 'var(--instagram-color)',
    TikTok: 'var(--tiktok-color)',
    YouTube: 'var(--youtube-color)',
    All: 'var(--chart-color-3)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="MuiCard-root"
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">{platform || 'All'} Hashtag Word Cloud</Typography>
        {loading ? (
          <Box sx={{ height: 200, width: '100%' }} className="skeleton" />
        ) : (
          <svg width="100%" height={200}>
            <Wordcloud
              words={words}
              width={300}
              height={200}
              font="Poppins"
              fontSize={(word) => fontScale(word.value)}
              padding={2}
              rotate={0}
              random={() => 0.5}
            >
              {(cloudWords) =>
                cloudWords.map((w, i) => (
                  <text
                    key={w.text}
                    style={{ fontSize: w.size, fontFamily: w.font, fill: platformColors[platform || 'All'] }}
                    textAnchor="middle"
                    transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                  >
                    {w.text}
                  </text>
                ))
              }
            </Wordcloud>
          </svg>
        )}
      </Box>
    </motion.div>
  );
}

export default HashtagWordCloud;