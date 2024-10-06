
'use client'
import React from 'react';
import { Box, Grid, Typography, Avatar, Button, IconButton, TextField } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import styles from './VideoDetail.module.css';
import SortIcon from '@mui/icons-material/Sort';
import ListItem from '@mui/material/ListItem';
const VideoDetail = () => {
  return (
    <Box className={styles.container}>
      <Grid container spacing={3}>
        <Grid item xs={7}>
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
            <IconButton><MoreHorizIcon /></IconButton>
          </Box>
          <Box className={styles.videoInfo}>
            <Typography variant="body2">63,897,730 views • 3 weeks ago • #16 on Trending for music</Typography>
            <Typography variant="body2">
              Listen to "Die With A Smile", song and video out now: <a href="http://GagaMars.lnk.to/DieWithASmile">http://GagaMars.lnk.to/DieWithASmile</a>
            </Typography>
            <Typography variant="body2">Directed by Daniel Ramos & Bruno Mar...</Typography>
          </Box>

          <Box className={styles.commentsSection}>
            <Typography variant="h6">74,731 Comments</Typography>
            <Button startIcon={<SortIcon />}>Sort by</Button>

            <Box className={styles.addComment}>
              <Avatar>U</Avatar>
              <TextField fullWidth placeholder="Add a comment..." variant="standard" />
              <Button variant="text">Cancel</Button>
              <Button variant="text" disabled>Comment</Button>
            </Box>
          </Box> 

        </Grid>

        <Grid item xs={5}>
          
          {[...Array(10)].map((_, index) => (
            <Grid rowSpacing={1} columnSpacing={2}>
              <Grid item xs={4} className={styles.test}>
                <iframe
                  title="Material UI Tutorial #1 - Intro &amp; Setup"
                  src="https://www.youtube.com/embed/0KEpWHtG10M?list=PL4cUxeGkcC9gjxLvV4VEkZ6H6H4yWuS58"
                  allowFullScreen
                ></iframe>
              </Grid>
              <Grid item xs={4}>
                  <h1 >Material UI Tutorial #{index + 1} - Intro & Setup</h1>
                  </Grid>
            </Grid>
             
          ))}
        </Grid>
      </Grid>
      
    </Box>
  );
};

export default VideoDetail;