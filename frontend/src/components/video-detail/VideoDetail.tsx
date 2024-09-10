import React from 'react';
import { Box, Grid, Typography, Avatar, Button, IconButton } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styles from './VideoDetail.module.css';

const VideoDetail = () => {
  return (
    <Box className={styles.container}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <div className={styles.videoWrapper}>
            <iframe
              className={styles.videoIframe}
              title="Material UI Tutorial #1 - Intro &amp; Setup"
              src="https://www.youtube.com/embed/0KEpWHtG10M?list=PL4cUxeGkcC9gjxLvV4VEkZ6H6H4yWuS58"
              allowFullScreen
            ></iframe>
          </div>
          <h1 className={styles.videoTitle}>Material UI Tutorial #1 - Intro & Setup</h1>
          <Box className={styles.channelInfo}>
            <Avatar src= '/public/image/logo.png' alt = 'akelo'/>
            <Box className={styles.channelText}>
              <Typography variant="subtitle1">Haven Deep</Typography>
              <Typography variant="body2" color="textSecondary">3,89 N người đăng ký</Typography>
            </Box>
            <Button variant="contained" color="primary" className={styles.subscribeButton}>
              Đăng ký
            </Button>
          </Box>
          <Box className={styles.videoButton}>
            <Button startIcon={<ThumbUpOutlinedIcon />}>3,9 N</Button>
            <Button startIcon={<ThumbDownOutlinedIcon />}></Button>
            <Button startIcon={<ShareOutlinedIcon />}>Chia sẻ</Button>
            <Button startIcon={<DownloadIcon />}>Tải xuống</Button>
            <IconButton><MoreHorizIcon /></IconButton>
          </Box>
        </Grid>
        <Grid item xs={12} md={4} className={styles.test}>
          <Typography variant="subtitle1" className={styles.relatedVideosTitle}>
            Tất cả
          </Typography>
          {/* Add related videos list here */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoDetail;