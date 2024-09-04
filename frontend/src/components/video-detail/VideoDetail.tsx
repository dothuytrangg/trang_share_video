'use client'
import { Padding } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Paper, styled, Typography } from "@mui/material";

const VideoDetail = ()=>{
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

    return(
      <Box sx={{ flexGrow: 1 }} margin={10}>
      <Grid container spacing={2} columns={16}>
        <Grid item xs={9}>
          <Item style={{width:'720px',height:600}} >
          <iframe width="670" height="377" src="https://www.youtube.com/embed/0KEpWHtG10M?list=PL4cUxeGkcC9gjxLvV4VEkZ6H6H4yWuS58" title="Material UI Tutorial #1 - Intro &amp; Setup" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
           <h1>Material UI Tutorial #1 - Intro & Setup</h1>
          </Item>
        </Grid>
        <Grid item xs={7}>
         
          <Item style={{height:600}}>
            <h1>Material UI Tutorial</h1>
          </Item>
        </Grid>
      </Grid>
    </Box>
      
        
    )
}
export default VideoDetail