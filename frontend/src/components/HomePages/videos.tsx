'use client'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";


import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import requestApi from "../../../helpers/api";
import { useAppDispatch, useAppSelector } from "@/stores/hookStore";
import { useLocale, useTranslations } from "next-intl";
import { _ENV, _GLOBAL } from "@/contstants";

export default function Videos() {
  var ranonce = false;
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const masterStore = useAppSelector((state) => state.master);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("HomePage");
  const dispatch = useAppDispatch();
  const handleOnClick=()=>{
      router.replace('/en/detail');

     
  }

  useEffect(() => {
    if (!ranonce) {
   
        setLoading(false);
        // router.push(`/${locale}/${_GLOBAL.ROUTE_ADMIN}/${_GLOBAL.ROUTE_ADMIN_VIDEO}`);
        loadVideos(page);
        ranonce = true;
    }
  }, []);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const loadVideos = async (pageSelected: number) => {
    await requestApi(`videos?page=${pageSelected}&items_per_page=12&search`, "GET").then((res: any) => {
      console.log('res videos', res);
      if (res.success) {
        setVideos(res.data);
        setLastPage(res.lastPage);
      }

    }).catch((err: any) => {
      console.error(err);
    })
    // console.log(check)
    // setCategories(check.data);
    // console.log('category hhh',categories);
  };
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    loadVideos(value);
  };

 
 
  // const renderItemExample = () => {
  //   const result = [];
  //   for (let i = 0; i < 30; i++) {
  //     result.push(
  //       <Card key={i} sx={{ maxWidth: 345,my:1 }}>
  //         <CardMedia
  //           sx={{ height: 140 }}
  //           image="http://localhost:2070/avatar/1729939926278-mongmee.webp"
  //           title="green iguana"
  //         />
  //         <CardContent>
  //           <Typography gutterBottom variant="h5" component="div">
  //             Lizard
  //           </Typography>
  //           <Typography variant="body2" color="text.secondary">
  //             Lizards are a widespread group of squamate reptiles, with over
  //             6,000 species, ranging across all continents except Antarctica
  //           </Typography>
  //         </CardContent>
           

  //         <CardActions>
  //           <Button sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }}
  //         color="inherit"
  //         variant="contained" size="small">Share</Button>
  //           <Button  sx={{ ml: 1, pr: 1, textTransform: "none", mt: 2 }}
  //         color="inherit"
  //         variant="contained" size="small" onClick={() => handleOnClick()}>Learn More</Button>
            
            
            
  //         </CardActions>
  //       </Card>
  //     );
  //   }
  //   return result;
  // };
  return <React.Fragment>
    {/* <h1>list video</h1> */}
     {
      videos.map((video:any)=>(
        <Card key={video.id} sx={{ maxWidth: 345,my:1 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={`${_ENV.NEXT_URL_RESOURCE}/avatars/${video.thumbnail}`} 
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
           {video.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          {video.description}
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
      
      ))
       
     }
      <Stack spacing={2}>
          <Pagination style={{ margin: 10 }} count={lastPage} page={page} onChange={handleChange} variant="outlined" color="primary" />

      </Stack>
    {/* {renderItemExample()} */}
  </React.Fragment>;
}
