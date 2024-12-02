import { _ENV, _GLOBAL } from "@/contstants";
import { useAppDispatch, useAppSelector } from "@/stores/hookStore";
import { Alert, Autocomplete, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem, Pagination, Paper, Select, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import requestApi from "../../../../helpers/api";
import AddIcon from "@mui/icons-material/Add";
import { updateLocalStorage } from "@/stores/features/masterSlice";
import Link from "next/link";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { Span } from "next/dist/trace";
import { format } from "date-fns";
import { extname } from "path";




const ListVideo = () => {

    var ranonce = false;
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
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
            loadAllCategory();
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

    const loadAllCategory = async () => {
      await requestApi(`categories/all`, "GET").then((res: any) => {
          console.log('res category all', res);
          if (res.success) {
            setCategories(res.data)
          }

      }).catch((err: any) => {
          console.error(err);
      })

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
    let [errorCreateMessage, setErrorCreateMessage] = useState("");
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState("");
    const [descriptionError, setDescriptionError] = useState(false);
    const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
    const [optionError, setOptionError] = useState(false);
    const [optionErrorMessage, setOptionErrorMessage] = useState("");
    const [thumbnailError, setThumbnailError] = useState(false);
    const [thumbnailErrorMessage, setThumbnailErrorMessage] = useState("");
    const [videoError, setVideoError] = useState(false);
    const [videoErrorMessage, setVideoErrorMessage] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [status, setStatus] = useState("confirming");

    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [urlVideo, setUrlVideo] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            console.log(event.target.files);
            const file = event.target.files[0];
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file));
            setThumbnailError(false)
        }
    };

    const handleFileVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setVideoFile(file);
            setVideoError(false)
            console.log(file);

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
          setNameErrorMessage(t("name_video_must_more_than_3_characters"));
          isValid = false;
        } else if (name.value.length > 70) {
          setNameError(true);
          setNameErrorMessage(t("name_video_must_least_than_70_characters"));
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
          setDescriptionErrorMessage(t("description_video_must_more_than_10_characters"));
          isValid = false;
        } else if (description.value.length > 300) {
          setDescriptionError(true);
          setDescriptionErrorMessage(t("description_video_must_least_than_300_characters"));
          isValid = false;
        } else {
          setDescriptionError(false);
          setDescriptionErrorMessage("");
        }

        if(categoryOptions.length < 1 )
        {
            setOptionError(true);
            setOptionErrorMessage(t("select_at_least_1_category"))
            isValid = false;

        }
        const allowedExtArr = ['.jpg','.png','.jpeg','.webp','.PNG','.JPG'];
       
        if (!thumbnailFile) {
          setThumbnailError(true)
          setThumbnailErrorMessage(t("thumbnail_required"))
          isValid = false;
        }
    
        if (!videoFile) {
          setVideoError(true)
          setVideoErrorMessage(t("video_required"))
          isValid = false;
        }
      
        return isValid;
      };
    

    

    const handleCreateVideo = (): void => {
        const valid: boolean = validateInputs();

        if (valid && thumbnailFile && videoFile) {
            const slug = slugify(name);
            const formData = new FormData();


            formData.append("thumbnail", thumbnailFile);
            formData.append("name", name);
            formData.append("description", description);
            formData.append("slug", slug);
            formData.append("url", videoFile);
            categoryOptions.forEach((category:any) => {
                formData.append("categories[]", category.id);
            });
            
            // formData.append("categories", JSON.stringify(categoryOptions.filter((category: any) => category.name !=='All').map((category:any) => category.id)));
            
            console.log(thumbnailFile.type)
            console.log(videoFile)

            requestApi("videos", "POST", formData)
                .then((res: any) => {
                    if (res.success) {
                        setOpenAddDialog(false);
                        // setThumbnailFile(null);
                        setThumbnailPreview(null);
                        setVideoFile(null);     
                        setCategoryOptions([]); 
                        setSnackbarMessage(t("create_video_success"));
                        setSnackbarSeverity("success");
                        setOpenSnackbar(true);
                        loadVideos(page);
                      


                    } else {
                        setErrorCreateMessage(res.message || t("create_video_failed"));
                        setSnackbarMessage(res.message);
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
            console.log('No file selected for thumbnail or video');
        }
    };



    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const handleOpenUpdateDialog = (video: any) => {
        console.log('video', video);
        setSelectedVideo(video);
        console.log('ss',selectedVideo);
        setName(video.name);
        setDescription(video.description);
        setThumbnailFile(null);
        // setThumbnailPreview(`${_ENV.NEXT_URL_RESOURCE}/avatars/${video.thumbnail}`);
        setThumbnailPreview(`${_ENV.NEXT_URL_RESOURCE}/videos/${video.thumbnail}`);
        setStatus(video.status);
        // console.log('console thumbnail',selectedVideo.thumbnail);

        // console.log('thumbnailFile',thumbnailFile);
        setOpenUpdateDialog(true);
    };

    const handleCloseUpdateDialog = () => {
        setOpenUpdateDialog(false);
        setThumbnailPreview(null);
    };

    const validateUpdateInputs = () => {
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
        } else if (name.value.length > 70) {
          setNameError(true);
          setNameErrorMessage(t("name_more_70"));
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
        } else if (description.value.length > 300) {
          setDescriptionError(true);
          setDescriptionErrorMessage(t("description_more_300"));
          isValid = false;
        } else {
          setDescriptionError(false);
          setDescriptionErrorMessage("");
        }
      
       
        // if (!thumbnailFile) {
        //   setThumbnailError(true)
        //   setThumbnailErrorMessage(t("thumbnail_required"))
        //   isValid = false;
        // }
    
        // if (!videoFile) {
        //   setVideoError(true)
        //   setVideoErrorMessage(t("video_required"))
        //   isValid = false;
        // }
      
        return isValid;
      };
    
    
      const handleUpdateVideo = (VideoId: string,thumbnail:File) => {
        const valid: boolean = validateUpdateInputs();
        console.log(valid)
        
      
        if (valid && thumbnail) {
          
      
          console.log('hehhh');
      
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
          // formData.append("url", videoFile);
          
          console.log('form data',formData);
         
          // requestApi(`categories/${categoryId}`, "PUT", CategoryData_update)
      
          requestApi(`videos/${VideoId}`, "PUT", formData)
            .then((res: any) => {
              // console.log('res update video',formData);
              if (res.success) {
                loadVideos(page)
                // console.log('res update video', res)
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
        }else{
          console.log('id',VideoId)
          console.log('update error')
        }
      };
      


  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);


  const handleOpenDeleteDialog = (video: any) => {
    console.log("Category selected:", video); // Log để kiểm tra giá trị
    setSelectedVideo(video);
    setOpenDeleteDialog(true);
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
            setOpenConfirmDialog(false)
       
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

const formatDateTime = (isoString: string): string => {
        try {
          return format(new Date(isoString), "dd/MM/yyyy HH:mm:ss");
        } catch (error) {
          console.error("Invalid date format:", isoString, error);
          return t('invalid_date'); // Hiển thị một thông báo lỗi được dịch
        }
    };
    const categoryData = categories
    .filter((category: any) => category.name !=='All')
    .map((category: any) => ({
        label: `${category.name}`,
        id: `${category.id}`
    }));

  
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
                            fullWidth
                            maxWidth="sm"
                        >
                            <DialogTitle>{t("addVideo")}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    {/* {t("addText_category")} */}
                                </DialogContentText>

                                {/* Input for Video Name */}
                                <TextField
                                    autoFocus
                                    error={nameError}
                                    helperText={nameErrorMessage}
                                    onChange={(val) => setName(val.target.value)}
                                    margin="dense"
                                    id="name"
                                    name="name"
                                    label={t("name_video")}
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    placeholder={t("name_video")}
                                    style={{ marginBottom: 20 }}
                                />

                                {/* Input for Video Description */}
                                <TextField
                                    error={descriptionError}
                                    helperText={descriptionErrorMessage}
                                    onChange={(val) => setDescription(val.target.value)}
                                    margin="dense"
                                    id="description"
                                    name="description"
                                    label={t("description_text")}
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    InputProps={{ style: { resize: 'vertical' } }}
                                    style={{ marginBottom: 20 }}
                                />
                                <Grid container spacing={2}>
                                    <Grid item xs={6} >
                                        {/* Khung chứa ảnh*/}
                                        <Box
                                            sx={{
                                                width: '250px',
                                                height: '150px',
                                                border: '2px dashed #3f51b5',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                backgroundColor: '#f0f0f0',
                                                marginTop: 2
                                            }}
                                        >
                                            {thumbnailPreview ? (
                                                <img
                                                    src={thumbnailPreview}
                                                    alt="Thumbnail Preview"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            ) : (
                                                <span style={{ color: '#999' }}>{t('thumbnail')}</span>
                                            )}
                                        </Box>
                                       
                                            <span style={{ color: 'red', display: 'block'}}>
                                                {thumbnailError ? (thumbnailErrorMessage):("")}
                                            </span>
                                     

                                    </Grid>
                                    <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Grid item style={{
              
                                           display: 'flex', justifyContent: 'flex-end', marginTop: "16px", marginRight:"30px" }}>
                                                <Autocomplete
                                                    multiple
                                                    options={categoryData}
                                                    getOptionLabel={(option) => option.label}
                                                    value={categoryOptions} // Giá trị hiện tại (các mục đã chọn)
                                                    onChange={(event, newValue:any) => {
                                                      setCategoryOptions(newValue),
                                                      categoryOptions.length != null &&(
                                                        setOptionError(false),
                                                        setOptionErrorMessage("")
                                                      )
                                                    }} // Cập nhật state khi thay đổi
                                                    renderInput={(params) => (
                                                        <TextField {...params}
                                                         label={t('add_to_category')}
                                                         error={optionError}
                                                         helperText={optionErrorMessage} />
                                                    )}
                                                    filterOptions={(options) =>
                                                      // Lọc ra các option chưa được chọn
                                                      options.filter(
                                                          (option) =>
                                                              !categoryOptions.some(
                                                                  (selectedOption:any) => selectedOption.id === option.id
                                                              )
                                                      )
                                                  }
                                                    style={{ width: 300 }}
                                                    

                                                />
                                             
                                                
                                        </Grid>

                                        <Grid item style={{ marginTop: '75px', justifyContent:"flex-end", display:"flex" }}>

                                          {videoError ? (<span style={{ color: 'red', display: 'block', paddingTop: "18px" }}>
                                                    {videoErrorMessage}
                                                </span>):(<span style={{ color: 'black', display: 'block' }}>
                                                        {videoFile &&(videoFile.name)}
                                                    </span>) }
                                        </Grid>
                                    </Grid>

                                    {/* </Grid> */}


                                    {/* Cột nút chọn ảnh Thumbnail */}
                                    <Grid item xs={6}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            component="label"
                                            startIcon={<PhotoCameraIcon />}
                                            style={{
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                padding: '8px 16px',
                                            }}
                                        >
                                            {t('Choose_thumbnail')}
                                            <input
                                                type="file"
                                                hidden
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </Button>

                                    </Grid>

                                    {/* Cột nút chọn video */}
                                    <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            component="label"
                                            startIcon={<VideoLibraryIcon />}
                                            style={{
                                                padding: '8px 16px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {t('upload_video')}
                                            <input
                                                type="file"
                                                hidden
                                                onChange={handleFileVideoChange}
                                                accept="video/*"
                                            />
                                        </Button>
                                    </Grid>


                                </Grid>

                            </DialogContent>

                            {/* Dialog Actions */}
                            <DialogActions>
                                <Button onClick={() => setOpenAddDialog(false)}>{t("btnCancel")}</Button>
                                <Button type="submit">{t("add")}</Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={openUpdateDialog}
                            onClose={() => handleCloseUpdateDialog()}
                            PaperProps={{
                                component: 'form',
                                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                                    event.preventDefault();
                                    handleUpdateVideo(selectedVideo.id, selectedVideo.thumbnail);

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

                                <Button variant="outlined" component="label">
                                    {t('Choose_thumbnail')}
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
                                        style={{ marginTop: 10, width: '60%', height: 'auto', maxHeight: '200px' }}
                                    />
                                )}
                                <TextField
                                    select
                                    label={t('Status')}
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    fullWidth
                                    SelectProps={{
                                        native: true,
                                    }}
                                    style={{ marginTop: 50 }}
                                >
                                    <option value="confirming">{t('Confirming')}</option>
                                    <option value="confirmed">{t('Confirmed')}</option>
                                </TextField>



                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenUpdateDialog(false)}>{t("btnCancel")}</Button>
                                <Button type="submit" >{t("btnUpdate")}</Button>
                            </DialogActions>
                        </Dialog>
                        {/* <Dialog
                      open={openConfirmDialog}
                      onClose={()=>setOpenConfirmDialog(false)}
                    >
                  <DialogTitle>{t("confirm_delete")}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                        {t("are_you_sure_delete") + '?'}
                    </DialogContentText>
                 </DialogContent>
                 <DialogActions>
                    <Button onClick={()=>setOpenConfirmDialog(false)} color="primary">
                        {t("cancel")}
                    </Button>
                    <Button  onClick={()=>setConfirm(true)} color="primary" autoFocus>
                        {t("delete")}
                    </Button>
                 </DialogActions>
                 </Dialog> */}

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
                      <TableCell >{t('ID')}</TableCell>
                      <TableCell >{t('Name')}</TableCell>
                      <TableCell >{t('description_text')}</TableCell>
                      <TableCell >{t('Thumbnail')}</TableCell>
                      <TableCell >URL</TableCell>
                      <TableCell >{t('Poster')}</TableCell>
                      <TableCell >{t('Status')}</TableCell>
                      <TableCell>{t('create_date')}</TableCell>
                      <TableCell >{t('action')}</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {
                      videos.map((video: any) => (
                        <TableRow key={video.id}>
                          <TableCell>{video.id}</TableCell>
                          <TableCell>
                          {video.name.length > 20 ? (
                            <Tooltip title={video.name}>
                              <span>{`${video.name.substring(0, 20)}...`}</span>
                            </Tooltip>
                          ) : (
                            video.name
                          )}
                        </TableCell>
                        <TableCell>
                          {video.description.length > 20 ? (
                            <Tooltip title={video.description}>
                              <span>{`${video.description.substring(0, 20)}...`}</span>
                            </Tooltip>
                          ) : (   
                            video.description
                          )}
                        </TableCell>
                          <TableCell>
                                <img 
                                // src={`${_ENV.NEXT_URL_RESOURCE}/avatars/${video.thumbnail}`} 
                                src={`${_ENV.NEXT_URL_RESOURCE}/videos/${video.thumbnail}`} 
                                alt={video.name} 
                                style={{ width: '100px', height: 'auto' }} // Adjust width and height as needed
                                />
                         </TableCell>
                         <TableCell>
                       
                         {video.url ? (
                          <Tooltip title={video.url}>
                            {/* <Link href={`${_ENV.NEXT_URL_RESOURCE}/videos/${video.url}`} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                              {video.url.length > 20 ? `${video.url.substring(0, 20)}...` : video.url}
                            </Link> */}
                            <Link href={`${_ENV.NEXT_URL_RESOURCE}/videos/${video.url}`} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                              {video.url.length > 20 ? `${video.url.substring(0, 20)}...` : video.url}
                            </Link>
                          </Tooltip>
                        ) : (
                          'N/A'
                        )}
                        </TableCell>

                        <TableCell>
                          {video.user.full_name}
                        </TableCell>

                        <TableCell >
                          {/* {video.status == 'confirming' ? `${t('Confirming')}`: `${t('Confirmed')}`} */}
                          <Typography
                              variant="body2"
                              color={video.status === "confirmed" ? "green" : "#dc143c"}
                             
                            >

                          {video.status === "confirmed" ? t("Confirmed") : t("Confirming")}
                        </Typography>
                        </TableCell>
                        <TableCell>
                          {formatDateTime(video.created_at)}
                        </TableCell>


                          <TableCell  >
                            <Button variant="outlined" color="primary" onClick={()=>handleOpenUpdateDialog(video)}  >
                              {t("edit")}
                            </Button>
                            <Button variant="outlined" color="primary" style={{ marginLeft: 8 }} onClick={()=>handleOpenDeleteDialog(video)}>
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
                      <Dialog
                        open={openDeleteDialog}
                        onClose={() => setOpenDeleteDialog(false)}
                      >
                        <DialogTitle>{t("confirm_delete")}</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            {t("are_you_sure_delete_category", { category: selectedVideo?.name })}
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setOpenDeleteDialog(false)}>{t("btnCancel")}</Button>
                          <Button
                            onClick={() => {
                              console.log("Selected Category ID:", selectedVideo?.id); // Log để kiểm tra
                              if (selectedVideo?.id) {
                                handleDeleteVideo(selectedVideo.id);
                              }
                              setOpenDeleteDialog(false);
                            }}
                            color="error"
                          >
                            {t("btnDelete")}
                          </Button>

                        </DialogActions>
                      </Dialog>



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