// import { useTranslations } from 'next-intl';

// export default function Home() {
//   const t = useTranslations('IndexPage');

//   return (
//     <div>
//       <h1 className='text-4xl mb-4 font-semibold'>{t('title')}</h1>
//       <p>{t('description')}</p>
//     </div>
//   );
// }
import Category from "@/components/HomePages/category";
import VideoDetail from "@/components/video-detail/VideoDetail";
import Videos from "@/components/HomePages/videos";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { useTranslations } from 'next-intl';
export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <div className="grid">
    
      <Category></Category> 
       <div className="grid grid-cols-4 gap-3 mt-4"> 
          <Videos></Videos>
      </div>

      {/* <VideoDetail></VideoDetail> */}
   
    </div>
  );
}