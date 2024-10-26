'use client'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";


import React from "react";
import { useRouter } from 'next/navigation';

export default function Videos() {
  const router = useRouter();
  const handleOnClick=()=>{
      router.replace('/en/detail');

     
  }

 
 
  const renderItemExample = () => {
    const result = [];
    for (let i = 0; i < 30; i++) {
      result.push(
        <Card key={i} sx={{ maxWidth: 345,my:1 }}>
          <CardMedia
            sx={{ height: 140 }}
            image="http://localhost:2070/avatar/1729867775058-mongmee.webp"
            title="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Lizard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
           

          <CardActions>
            <Button sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }}
          color="inherit"
          variant="contained" size="small">Share</Button>
            <Button  sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }}
          color="inherit"
          variant="contained" size="small" onClick={() => handleOnClick()}>Learn More</Button>
            
            
            
          </CardActions>
        </Card>
      );
    }
    return result;
  };
  return <React.Fragment>
    {renderItemExample()}
  </React.Fragment>;
}
