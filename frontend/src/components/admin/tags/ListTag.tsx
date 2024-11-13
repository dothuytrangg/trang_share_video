'use client'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hookStore";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { _GLOBAL } from "@/contstants";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, Pagination, Snackbar, Stack, TextField } from "@mui/material";
import { updateLocalStorage } from "@/stores/features/masterSlice";
import requestApi from "../../../../helpers/api";
import { ReponsiveContainer } from "@/util/reponsiveUtil";
import { Select, MenuItem } from '@mui/material';


// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import AddTag from "@/components/admin/Tag/add";



const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid silver",
    boxShadow: 24,
    p: 4,
};

const ListTag = () => {
    var ranonce = false;
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [tags, setCategories] = useState([]);
    const masterStore = useAppSelector((state) => state.master);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    let [errorCreate, setErrorCreate] = useState("");
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState("");
    const [slugError, setSlugError] = useState(false);
    const [slugErrorMessage, setSlugErrorMessage] = useState("");
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const locale = useLocale();
    const t = useTranslations("HomePage");
    const dispatch = useAppDispatch();
    const[status,setStatus] = useState('');
    // Custom Alert for Snackbar
    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null); 


    useEffect(() => {
        if (!ranonce) {
            if (masterStore.isAdmin) {
                setLoading(false);
                router.push(`/${locale}/${_GLOBAL.ROUTE_ADMIN}/${_GLOBAL.ROUTE_ADMIN_TAGS}`);


            }
            loadTags(page);
            ranonce = true;
        }
    }, []);
    // const [open, setOpen] = React.useState(false);
    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);
    const loadTags = async (pageSelected: number) => {
        await requestApi(`tags?page=${pageSelected}&items_per_page=5&search`, "GET").then((res: any) => {
            console.log('res Tag', res);
            if (res.success) {
                setCategories(res.data);
                setLastPage(res.lastPage);
            }

        }).catch((err: any) => {
            console.error(err);
        })
        // console.log(check)
        // setCategories(check.data);
        // console.log('Tag hhh',categories);
    };



    const validateInputs = () => {
        const name = document.getElementById("name") as HTMLInputElement;
        const slug = document.getElementById("slug") as HTMLInputElement;

        let isValid = true;

        if (!name.value) {
            setNameError(true);
            setNameErrorMessage(t('name'));
            isValid = false;
        } else if (name.value.length < 3) {
            setNameError(true);
            setNameErrorMessage(t('name_least_3'));
            isValid = false;
        } else if (name.value.length > 20) {
            setNameError(true);
            setNameErrorMessage(t('name_more_20'));
            isValid = false;
        }
        else {
            setNameError(false);
            setNameErrorMessage('');
        }
        return isValid;
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

    const handleCreateTag = (): void => {
        const valid: boolean = validateInputs();

        if (valid) {

            const slug = slugify(name);
            const TagData = { name, slug }; // Login data to be sent to the API

            console.log(TagData);
            requestApi("tags", "POST", TagData)
                .then((res: any) => {
                    console.log('res create', res);
                    if (res.success) {
                        setErrorCreate("");
                        // dispatch(loginSuccess({ ...res }));
                        // dispatch(updateLocalStorage());
                        // router.replace(`/${locale}/admin/Tag`)
                        loadTags(page);
                        console.log('create success')
                        setOpenAddDialog(false)
                        setSnackbarMessage(t("create_tag_success"));
                        setSnackbarSeverity("success");
                        setOpenSnackbar(true);
                    } else {
                        setErrorCreate(res.message);
                        setSnackbarMessage(res.message || t("create_tag_failed"));
                        setSnackbarSeverity("error");
                        setOpenSnackbar(true);
                    }
                })
                .catch((err: any) => {
                    console.error("Create Tag failed:", err.response?.data || err.message);
                    setSnackbarMessage(t("create_tag_occerred"));
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                    // Handle login failure (e.g., show error message)
                });
        }
    };

    const [selectedTag, setSelectedTag] = useState<any>(null);
    const handleOpenUpdateDialog = (tag: any) => {
        console.log('categoy', tag);
        setSelectedTag(tag);
        setName(tag.name); // Set giá trị hiện tại của Tag name
        setSlug(tag.slug); // Set giá trị hiện tại của slug
        setStatus(tag.status);
        setOpenUpdateDialog(true);
    };

    const handleUpdateTag = (tagId: string) => {
        const valid: boolean = validateInputs();

        if (valid) {
            const TagData_update = { name, slug, status };

            requestApi(`tags/${tagId}`, "PUT", TagData_update)
                .then((res: any) => {
                    if (res.success) {
                        loadTags(page)
                        console.log('res update', res)
                        dispatch(updateLocalStorage());

                        setOpenUpdateDialog(false);
                        setSnackbarMessage(t("update_tag_success"));
                        setSnackbarSeverity("success");
                        setOpenSnackbar(true);
                    } else {
                        setSnackbarMessage(res.message || t("update_tag_failed"));
                        setSnackbarSeverity("error");
                        setOpenSnackbar(true);
                    }
                })
                .catch((err: any) => {
                    console.error("Update Tag failed:", err.response?.data || err.message);
                    setSnackbarMessage(t("update_tag_occerred"));
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                });
        }
    };

    const handleDeleteTag = (tagId: string) => {
        requestApi(`tags/${tagId}`, "DELETE")
            .then((res: any) => {

                if (res.success) {
                    loadTags(page)
                    console.log("Tag deleted:", res);
                    setSnackbarMessage(t("delete_tag_success"));
                    setSnackbarSeverity("success");
                    setOpenSnackbar(true);
                } else {
                    console.error("Delete Tag failed:", res.message);
                    setSnackbarMessage(res.message || t("delete_tag_failed"));
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                }
            })
            .catch((err: any) => {
                console.error("Delete Tag failed:", err.response?.data || err.message);
                setSnackbarMessage(t("delete_tag_occerred"));
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            });
    };

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        loadTags(value);
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
                                    handleCreateTag();

                                },
                            }}
                        >
                            <DialogTitle>{t("addTag")}</DialogTitle>
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
                                    label={t("name_tag")}
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    placeholder={t("name_tag")}
                                />
                                <TextField
                                    autoFocus
                                    error={slugError}
                                    helperText={slugErrorMessage}
                                    onChange={(val) => {
                                        setSlug(val.target.value);
                                    }}
                                    value={slug}
                                    margin="dense"
                                    id="slug"
                                    name="slug"
                                    label={t("slug_text")}
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                />

                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenAddDialog(false)}>{t("btnCancel")}</Button>
                                <Button type="submit" >{t("addTag")}</Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            open={openUpdateDialog}
                            onClose={() => setOpenUpdateDialog(false)}
                            PaperProps={{
                                component: 'form',
                                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                                    event.preventDefault();
                                    handleUpdateTag(selectedTag.id)

                                },
                            }}
                        >
                            <DialogTitle>{t("update_tag")}</DialogTitle>
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
                                    label={t("name_tag")}
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    placeholder={t("name_tag")}
                                />
                                <TextField
                                    autoFocus
                                    error={slugError}
                                    helperText={slugErrorMessage}
                                    onChange={(val) => {
                                        setSlug(val.target.value);
                                    }}
                                    value={slug}
                                    margin="dense"
                                    id="tag"
                                    name="tag"
                                    label={t("slug_text")}
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                />
                                {thumbnailPreview && (
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
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
                                    <option value="active">{t('active')}</option>
                                    <option value="inactive">{t('inactive')} </option>
                                </TextField>



                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenUpdateDialog(false)}>{t("btnCancel")}</Button>
                                <Button type="submit" >{t("btnUpdate")}</Button>
                            </DialogActions>
                        </Dialog>
                        {/* Snackbar for notifications */}
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
                                    {t('addTag')}
                                </Button>


                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>{t("name_tag")}</TableCell>
                                            <TableCell>{t("slug_text")}</TableCell>
                                            <TableCell>{t("Status")}</TableCell>
                                            <TableCell>{t("create_date")}</TableCell>
                                            <TableCell>{t("action")}</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {tags.map((tag: any) => (
                                            <TableRow key={tag.id}>
                                                <TableCell>{tag.id}</TableCell>
                                                <TableCell>{tag.name}</TableCell>
                                                <TableCell>{tag.slug}</TableCell>
                                                <TableCell>
                                                    {locale === 'en'
                                                        ? (tag.status === 'active' ? 'Active' : 'Inactive')
                                                        : (tag.status === 'active' ? 'hoạt động' : 'không hoạt động')}
                                                </TableCell>

                                                <TableCell>{tag.created_at}</TableCell>

                                                <TableCell>
                                                    <Button variant="outlined" color="primary" onClick={() => handleOpenUpdateDialog(tag)}>
                                                        {t("edit")}
                                                    </Button>
                                                    <Button variant="outlined" color="primary" style={{ marginLeft: 8 }} onClick={() => handleDeleteTag(tag.id)}>
                                                        {t("delete")}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
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
};

export default ListTag