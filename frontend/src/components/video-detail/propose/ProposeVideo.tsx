import React from "react";
import Grid from "@mui/material/Grid";
import styles from "./YourStyles.module.css"; // Đảm bảo bạn có tệp CSS hoặc module styles.
import { _ENV } from "@/contstants";
import { Box, Button, Typography } from "@mui/material";

const ProposeVideo = ({ proposeVideoData, videoData,categoryId }: { proposeVideoData: any[]; videoData: any,categoryId:any }) => {
  return (
 (
    <Grid
      item
      xs={5}
      sx={{
        maxHeight: "calc(100vh - 120px)", // Giới hạn chiều cao
        overflowY: "auto", // Cuộn dọc nếu nội dung quá dài
        paddingRight: 2,
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ccc",
          borderRadius: "4px",
        },
      }}
    >
      {proposeVideoData.map((video: any) =>
        video.video.url !== videoData.url ? (
          <Box
            key={video.video.id}
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: 2,
              padding: 1,
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {/* Thumbnail */}
            <Box
              component="img"
              src={`${_ENV.NEXT_URL_RESOURCE}/videos/${video.video.thumbnail}`}
              alt={video.video.name}
              sx={{
                width: 120,
                height: 80,
                objectFit: "cover",
                borderRadius: "8px",
                marginRight: 2,
              }}
            />

            {/* Tên video */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#333",
                  lineHeight: 1.4,
                }}
              >
                {video.video.name}
              </Typography>
              <Button
                href={`${_ENV.NEXT_URL_PRODUCTION}/en/detail/${video.video.id}?categoryId=${categoryId}`}
                target="_blank"
                sx={{
                  fontSize: "12px",
                  textTransform: "none",
                  padding: 0,
                  marginTop: 1,
                  color: "#007bff",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Xem chi tiết
              </Button>
            </Box>
          </Box>
        ) : null
      )}
    </Grid>
  // <Grid container spacing={2}>
  //     {proposeVideoData.map((video: any) =>
  //       video.video.url !== videoData.url ? (
  //         <Grid item xs={12} key={video.video.id}>
  //           <Button
  //             href={`http://localhost:2050/en/detail/${video.video.id}?categoryId=${categoryId}`}
  //             target="_blank"
  //             style={{
  //               display: "flex",
  //               alignItems: "flex-start",
  //               textAlign: "left",
  //               width: "100%",
  //               textDecoration: "none",
  //               padding: 0,
  //               background: "none",
  //               border: "none",
  //             }}
  //           >
  //             {/* Hình ảnh thumbnail */}
  //             <Box
  //               component="img"
  //               src={`${_ENV.NEXT_URL_LOCAL}/videos/${video.video.thumbnail}`}
  //               alt={video.video.name}
  //               sx={{
  //                 width: 120,
  //                 height: 80,
  //                 objectFit: "cover",
  //                 borderRadius: "8px",
  //                 boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  //                 marginRight: 2,
  //               }}
  //             />
  //             {/* Tên video */}
  //             <Typography
  //               variant="subtitle1"
  //               sx={{
  //                 fontSize: "14px",
  //                 fontWeight: "bold",
  //                 color: "#333",
  //                 lineHeight: "1.4",
  //               }}
  //             >
  //               {video.video.name}
  //             </Typography>
  //           </Button>
  //         </Grid>
  //       ) : null
  //     )}
  //   </Grid>

       
   ) );

  
};

export default ProposeVideo;
