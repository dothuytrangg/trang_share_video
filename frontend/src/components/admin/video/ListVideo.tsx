import { _ENV, _GLOBAL } from "@/contstants";
import { useAppDispatch, useAppSelector } from "@/stores/hookStore";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import requestApi from "../../../../helpers/api";
import AddIcon from "@mui/icons-material/Add";
import { updateLocalStorage } from "@/stores/features/masterSlice";


const ListVideo = ()=>{
    var ranonce = false;
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]);
    const masterStore = useAppSelector((state) => state.master);
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations("HomePage");
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!ranonce) {
          if (masterStore.isAdmin) {
            setLoading(false);
            router.push(`/${locale}/${_GLOBAL.ROUTE_ADMIN}/${_GLOBAL.ROUTE_ADMIN_VIDEO}`);
            
    
          }
       loadVideos(page);
          ranonce = true;
        }
      }, []);
      const [page, setPage] = useState(1);
      const [lastPage, setLastPage] = useState(1);
      const loadVideos = async (pageSelected: number) => {
        await requestApi(`videos?page=${pageSelected}&items_per_page=5&search`, "GET").then((res: any) => {
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



      const [openSnackbar, setOpenSnackbar] = useState(false);
      const [snackbarMessage, setSnackbarMessage] = useState("");
      const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
      const [openAddDialog, setOpenAddDialog] = useState(false);
      const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
      const [name, setName] = useState("");
      const [description, setDescription] = useState("");
      let [errorCreate, setErrorCreate] = useState("");
      const [nameError, setNameError] = useState(false);
      const [nameErrorMessage, setNameErrorMessage] = useState("");
      const [descriptionError, setDescriptionError] = useState(false);
      const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
      const [thumbnailFile, setThumbnailFile] = useState<File | null >(null);
      const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null); 
      const [status, setStatus] = useState("confirming");

      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          setThumbnailFile(file);
          setThumbnailPreview(URL.createObjectURL(file)); // Tạo URL để hiển thị ảnh
        }
      };



  function slugify(str: string): string {

    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    str = str.replace(/^\s+|\s+$/g, '');
    str = str.toLowerCase();
    str = str.replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    return str;
  }
  const validateInputs = () => {
    const name = document.getElementById("name") as HTMLInputElement;
    const description = document.getElementById("description") as HTMLInputElement;
  
    let isValid = true;
  
  
    if (!name.value) {
      setNameError(true);
      setNameErrorMessage(t("name_required"));
      isValid = false;
    } else if (name.value.length < 3) {
      setNameError(true);
      setNameErrorMessage(t("name_least_3"));
      isValid = false;
    } else if (name.value.length > 50) {
      setNameError(true);
      setNameErrorMessage(t("name_more_50"));
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }
  

    if (!description.value) {
      setDescriptionError(true);
      setDescriptionErrorMessage(t("description_required"));
      isValid = false;
    } else if (description.value.length < 10) {
      setDescriptionError(true);
      setDescriptionErrorMessage(t("description_least_10"));
      isValid = false;
    } else if (description.value.length > 200) {
      setDescriptionError(true);
      setDescriptionErrorMessage(t("description_more_200"));
      isValid = false;
    } else {
      setDescriptionError(false);
      setDescriptionErrorMessage("");
    }
  
   
    // if (!thumbnailFile) {
    //   setSnackbarMessage(t("thumbnail_required"));
    //   setSnackbarSeverity("error");
    //   setOpenSnackbar(true);
    //   isValid = false;
    // }
  
    return isValid;
  };


  const handleCreateVideo = (): void => {
    const valid: boolean = validateInputs();

    if (valid && thumbnailFile) {
        const slug = slugify(name);
        const formData = new FormData();
        
        formData.append("thumbnail", thumbnailFile);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("slug", slug);

        requestApi("videos", "POST", formData)
            .then((res: any) => {
                if (res.success) {
                    setOpenAddDialog(false);
                    setSnackbarMessage(t("create_video_success"));
                    setSnackbarSeverity("success");
                    setOpenSnackbar(true);
                    loadVideos(page);
                } else {
                    setErrorCreate(res.message || t("create_video_failed"));
                    setSnackbarMessage(res.message || t("create_video_failed"));
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                }
            })
            .catch((err: any) => {
                console.error("Create video failed:", err);
                setSnackbarMessage(t("create_video_occurred"));
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            });
    } else {
        console.log('No file selected for thumbnail.');
    }
};

const [selectedVideo, setSelectedVideo] = useState<any>(null);
const handleOpenUpdateDialog = (video: any) => {
  console.log('video',video);
  setSelectedVideo(video);
  console.log(selectedVideo);
  setName(video.name);
  setDescription(video.description); 
  setThumbnailFile(null);
  setThumbnailPreview(`${_ENV.NEXT_URL_RESOURCE}/avatars/${video.thumbnail}`);
  // console.log('console thumbnail',selectedVideo.thumbnail);
  
  // console.log('thumbnailFile',thumbnailFile);
  setOpenUpdateDialog(true);
};

const handleCloseUpdateDialog = () => {
  setOpenUpdateDialog(false);
  setThumbnailPreview(null);
};

const handleUpdateVideo = (VideoId: string,thumbnail:File) => {
  const valid: boolean = validateInputs();

  if (valid) {
   

    const slug = slugify(name);
    const formData = new FormData();
    if (thumbnailFile) {
      console.log('thumbnail',thumbnailFile);
      
      formData.append("thumbnail", thumbnailFile); 
    } else {
        
      formData.append("thumbnail", thumbnail);
    }
    formData.append("status", status);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("slug", slug);

    requestApi(`videos/${VideoId}`, "PUT", formData)
      .then((res: any) => {
        if (res.success) {
          loadVideos(page)
          console.log('res update video', res)
          dispatch(updateLocalStorage());

          setOpenUpdateDialog(false);
          setSnackbarMessage(t("update_video_success"));
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
        } else {
          setSnackbarMessage(res.message || t("update_video_failed"));
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      })
      .catch((err: any) => {
        console.error("Update category failed:", err.response?.data || err.message);
        setSnackbarMessage(t("update_video_occerred"));
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      });
  }
};




const handleDeleteVideo = (videoId: string) => {
        requestApi(`videos/${videoId}`, "DELETE")
          .then((res: any) => {
    
            if (res.success) {
              loadVideos(page)
              console.log("Video deleted:", res);
              setSnackbarMessage(t("delete_video_success"));
              setSnackbarSeverity("success");
              setOpenSnackbar(true);
            } else {
              console.error("Delete video failed:", res.message);
              setSnackbarMessage(res.message || t("delete_video_failed"));
              setSnackbarSeverity("error");
              setOpenSnackbar(true);
            }
          })
          .catch((err: any) => {
            console.error("Delete video failed:", err.response?.data || err.message);
            setSnackbarMessage(t("delete_video_occerred"));
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
          });
      };
    const renderPage = () => {
        if (!loading) {
          return (
            <div className="grid grid-cols-1 gap-4">
              <React.StrictMode>
              <Dialog
              open={openAddDialog}
              onClose={() => setOpenAddDialog(false)}
              PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  handleCreateVideo();

                },
              }}
            >
              <DialogTitle>{t("addVideo")}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {/* {t("addText_category")} */}
                </DialogContentText>
                <TextField
                  autoFocus
                  error={nameError}
                  helperText={nameErrorMessage}
                  onChange={(val) => {
                    setName(val.target.value);
                  }}
                  margin="dense"
                  id="name"
                  name="name"
                  label={t("name_video")}
                  type="text"
                  fullWidth
                  variant="standard"
                  placeholder={t("name_video")}
                />
                <TextField
                  autoFocus
                  error={descriptionError}
                  helperText={descriptionErrorMessage}
                  onChange={(val) => setDescription(val.target.value)}
                  margin="dense"
                  id="description"
                  name="description"
                  label={t("description_text")}
                  type="text"
                  fullWidth
                  variant="standard"
                  multiline
                  rows={3} 
                  InputProps={{ style: { resize: 'vertical' } }}
                />
                    <Button variant="contained" component="label">
                      Chọn ảnh cho video
                      <input
                        type="file"
                        hidden
                        // accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>

          {/* Hiển thị ảnh thumbnail đã chọn */}
          {thumbnailPreview && (
            <img 
              src={thumbnailPreview} 
              alt="Thumbnail preview" 
              style={{ marginTop: 10, width: '100%', height: 'auto', maxHeight: '200px' }} 
            />
          )}

              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenAddDialog(false)}>{t("btnCancel")}</Button>
                <Button type="submit" >{t("add_user")}</Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={openUpdateDialog}
              onClose={() => handleCloseUpdateDialog()}
              PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  handleUpdateVideo(selectedVideo.id,selectedVideo.thumbnail);

                },
              }}
            >
              <DialogTitle>{t("update_video")}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {/* {t("update_caterogy_text")} */}
                  </DialogContentText>
                <TextField
                  autoFocus
                  error={nameError}
                  helperText={nameErrorMessage}
                  onChange={(val) => {
                    setName(val.target.value);
                  }}
                  value={name}
                  margin="dense"
                  id="name"
                  name="name"
                  label={t("name_video")}
                  type="text"
                  fullWidth
                  variant="standard"
                  placeholder={t("name_video")}
                />
                <TextField
                  autoFocus
                  error={descriptionError}
                  helperText={descriptionErrorMessage}
                  onChange={(val) => {
                    setDescription(val.target.value);
                  }}
                  value={description}
                  margin="dense"
                  id="description"
                  name="description"
                  label={t("description_text")}
                  type="text"
                  fullWidth
                  variant="standard"
                />

                <Button variant="contained" component="label">
                      Chọn ảnh cho video
                      <input
                        type="file"
                        hidden
                        // accept="image/*"
                        onChange={handleFileChange}
                      />
                </Button>
                {thumbnailPreview && (
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  style={{ marginTop: 10, width: '100%', height: 'auto', maxHeight: '200px' }} 
                />
                )}
                       <TextField
                            select
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            fullWidth
                            SelectProps={{
                                native: true,
                            }}
                            style={{marginTop:50}}
                             >
                            <option value="confirming">Confirming</option>
                            <option value="confirmed">Confirmed</option>
                      </TextField>

              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenUpdateDialog(false)}>{t("btnCancel")}</Button>
                <Button type="submit" >{t("btnUpdate")}</Button>
              </DialogActions>
            </Dialog>
                                
              <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
               >
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
                  {snackbarMessage}
                </Alert>
              </Snackbar>
              <div className="m-5 mt-20">
          
              <TableContainer className='p-5' sx={{ border: 0 }} component={Paper}>
                <Button onClick={() => setOpenAddDialog(true)} variant="outlined" startIcon={<AddIcon />}>
                  {t('addVideo')}
                </Button>

                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell >ID</TableCell>
                      <TableCell >Name</TableCell>
                      <TableCell >Thumbnail</TableCell>
                      <TableCell >url</TableCell>
                      <TableCell >userId</TableCell>
                      <TableCell >status</TableCell>
                      <TableCell >Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {
                      videos.map((video: any) => (
                        <TableRow key={video.id}>
                          <TableCell>{video.id}</TableCell>
                          <TableCell>{video.name}</TableCell>
                          <TableCell>
                                <img 
                                src={`${_ENV.NEXT_URL_RESOURCE}/avatars/${video.thumbnail}`} 
                                alt={video.name} 
                                style={{ width: '100px', height: 'auto' }} // Adjust width and height as needed
                                />
                         </TableCell>
                          <TableCell >{video.url}</TableCell>
                          <TableCell >{video.user.id}</TableCell>
                          <TableCell >
                            {video.status}
                          </TableCell>

                          <TableCell  >
                            <Button variant="outlined" color="primary" onClick={()=>handleOpenUpdateDialog(video)}  >
                              {t("edit")}
                            </Button>
                            <Button variant="outlined" color="primary" style={{ marginLeft: 8 }} onClick={()=>handleDeleteVideo(video.id)}>
                              {t("delete")}
                            </Button>
                              {/* <Button variant="outlined" color="primary" style={{ marginLeft: 8 }} onClick={()=>{setStatus("comfirmed"),console.log(status)}}  >
                              accept_status
                            </Button> */}

                          </TableCell>

                        </TableRow>
                      ))

                    }

                  </TableBody>
                </Table>

              </TableContainer>
              <Stack spacing={2}>
                <Pagination style={{ margin: 10 }} count={lastPage} page={page} onChange={handleChange} variant="outlined" color="primary" />

              </Stack>

            </div>

              </React.StrictMode>
            </div>
          );
        }
      };
    
      return renderPage();

}
export default ListVideo