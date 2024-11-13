

'use client'
import Category from "@/components/HomePages/category";
import VideoDetail from "@/components/video-detail/VideoDetail";
import Videos from "@/components/HomePages/videos";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/stores/hookStore";
import { initialBootState } from "@/stores/features/masterSlice";
import { useDispatch } from "react-redux";
import { cookies } from "next/headers";
export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <div className="grid">
      {/* <h1>fdfdfd</h1> */}
      <Category></Category> 
       <div className="grid grid-cols-4 gap-3 mt-4"> 
          <Videos></Videos>
      </div>

      {/* <VideoDetail></VideoDetail> */}
   
    </div>
  );
}