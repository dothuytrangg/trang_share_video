import Category from "@/components/HomePages/category";
import Videos from "@/components/HomePages/videos";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";





export default function HomePage() {
  return (
    <div className="grid">
      <Category></Category>
      <div className="grid grid-cols-5 gap-3 mt-4"> 
          <Videos></Videos>
      </div>
   
    </div>
  );
}