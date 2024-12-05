import React from "react";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector để lấy thông tin từ Redux
import Grid from "@mui/material/Grid";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { _ENV } from "@/contstants";
import { useLocale, useTranslations } from "next-intl";
import { changeTheme } from "@/stores/features/masterSlice";
import { useRouter } from "next/navigation";

const ProposeVideo = ({ proposeVideoData, videoData, categoryId }: { proposeVideoData: any[]; videoData: any, categoryId: any }) => {
  const locale = useLocale();
  const t = useTranslations("HomePage");
  const router = useRouter();

  // Sử dụng useSelector để lấy thông tin về theme từ Redux store
  const theme = useSelector((state: any) => state.master.theme); // Tham chiếu đến theme trong masterSlice

  // Thêm một handler để thay đổi theme (nếu bạn muốn cung cấp chức năng chuyển đổi theme)
  const dispatch = useDispatch();

  const handleChangeTheme = () => {
    dispatch(changeTheme()); // Gọi action thay đổi theme
  };


  const handleOnClick = (videoId: string) => {
  
    router.push(`/${locale}/detail/${videoId}?categoryId=${categoryId}`);
  };


  return (
    <Grid
      item
      xs={5}
      sx={{
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
        paddingRight: 2,
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ccc",
          borderRadius: "4px",
        },
        backgroundColor: theme === "light" ? "#fff" : "#121212", // Thay đổi màu nền dựa trên theme
        color: theme === "light" ? "#000" : "#fff", // Thay đổi màu chữ
      }}
    >
      {proposeVideoData.map((video: any) =>
        video.video.url !== videoData.url ? (
          video.video.status !== 'confirming' &&(
            <Box
            key={video.video.id}
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: 2,
              padding: 1,
              backgroundColor: theme === "light" ? "#f9f9f9" : "#333", // Điều chỉnh màu nền của video item
              borderRadius: "8px",
              boxShadow: theme === "light" ? "0 2px 4px rgba(0,0,0,0.1)" : "0 2px 4px rgba(0,0,0,0.3)", // Thêm hiệu ứng shadow tùy theo theme
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
                  color: theme === "light" ? "#333" : "#fff", // Thay đổi màu chữ theo theme
                  lineHeight: 1.4,
                }}
              >
               {video.video.name.length > 50 ? (
                    <Tooltip title={video.video.name}>
                      <span onClick={() => handleOnClick(video.video.id)} className="cursor-pointer hover:text-blue-600">{`${video.video.name.substring(0, 50)}...`}</span>
                    </Tooltip>
                  ) :
                    <span onClick={() => handleOnClick(video.video.id)} className="cursor-pointer hover:text-blue-600">{video.video.name}</span>
                  }
              </Typography>
              {/* <Button
                // href={`${_ENV.NEXT_URL_PROD}/${locale}/detail/${video.video.id}?categoryId=${categoryId}`}
                href="#"
                onClick={()=>handleOnClick(video.video.id)}
                target="_blank"
                sx={{
                  fontSize: "12px",
                  textTransform: "none",
                  padding: 0,
                  marginTop: 1,
                  color: theme === "light" ? "#007bff" : "#1e90ff", // Thay đổi màu nút
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Xem chi tiết
              </Button> */}
            </Box>
          </Box>
          )
        ) : null
      )}
    </Grid>
  );
};

export default ProposeVideo;