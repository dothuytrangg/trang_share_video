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
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination, Snackbar, Stack, TextField, Tooltip } from "@mui/material";
import { updateLocalStorage } from "@/stores/features/masterSlice";
import requestApi from "../../../../helpers/api";
import { resolveSoa } from "dns";
import { format } from 'date-fns';


// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import AddCategory from "@/components/admin/category/add";



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
function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}
const ListCategory = () => {
  var ranonce = false;
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const masterStore = useAppSelector((state) => state.master);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  let [errorCreate, setErrorCreate] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const locale = useLocale();
  const t = useTranslations("HomePage");
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    if (!ranonce) {
      if (masterStore.isAdmin) {
        setLoading(false);
        router.push(`/${locale}/${_GLOBAL.ROUTE_ADMIN}/${_GLOBAL.ROUTE_ADMIN_CATEGORY}`);
        

      }
      loadCategories(page);
      ranonce = true;
    }
  }, []);
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  const loadCategories = async (pageSelected: number) => {
    await requestApi(`categories?page=${pageSelected}&items_per_page=5&search`, "GET").then((res: any) => {
      console.log('res category', res);
      if (res.success) {
        setCategories(res.data);
        setLastPage(res.lastPage);
      }

    }).catch((err: any) => {
      console.error(err);
    })
    // console.log(check)
    // setCategories(check.data);
    // console.log('category hhh',categories);
  };



  const validateInputs = () => {
    const name = document.getElementById("name") as HTMLInputElement;

    let isValid = true;

    if (!name.value) {
      setNameError(true);
      setNameErrorMessage(t('name'));
      isValid = false;
    } else if (name.value.length < 3) {
      setNameError(true);
      setNameErrorMessage(t('name_least_3'));
      isValid = false;
    } else if(name.value.length > 20){
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

  const handleCreateCategory = (): void => {
    const valid: boolean = validateInputs();

    if (valid) {

      const slug = slugify(name);
      const CategoryData = { name, description, slug }; // Login data to be sent to the API

      console.log(CategoryData);
      requestApi("categories", "POST", CategoryData)
        .then((res: any) => {
          console.log('res create', res);
          if (res.success) {
            setErrorCreate("");
            // dispatch(loginSuccess({ ...res }));
            // dispatch(updateLocalStorage());
            // router.replace(`/${locale}/admin/category`)
            loadCategories(page);
            console.log('create success')
            setOpenAddDialog(false)
            setSnackbarMessage(t("create_category_success"));
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
          } else {
            // console.log('loi')
            if(res.statusCode == 400){
              setNameError(true);
              setNameErrorMessage(t('category_with_name_already_exists'))
              setErrorCreate(res.message);
              setSnackbarMessage(t("create_category_failed"));
              setSnackbarSeverity("error");
              setOpenSnackbar(true);

            }else{
              setErrorCreate(res.message);
              setSnackbarMessage(t("create_category_failed"));
              setSnackbarSeverity("error");
              setOpenSnackbar(true);

            }
          }
        })
        .catch((err: any) => {
          console.log('loi ha',err);
          console.error("Create category failed:", err.response?.data || err.message);
          setSnackbarMessage(t("create_category_occerred"));
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          // Handle login failure (e.g., show error message)
        });
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const handleOpenUpdateDialog = (category: any) => {
    console.log('categoy', category);
    setSelectedCategory(category);
    setName(category.name); // Set giá trị hiện tại của category name
    setDescription(category.description); // Set giá trị hiện tại của description
    setOpenUpdateDialog(true);
  };

  const handleUpdateCategory = (categoryId: string) => {
    const valid: boolean = validateInputs();

    if (valid) {
      const CategoryData_update = { name, description };

      requestApi(`categories/${categoryId}`, "PUT", CategoryData_update)
        .then((res: any) => {
          if (res.success) {
            loadCategories(page)
            console.log('res update', res)
            dispatch(updateLocalStorage());
            setOpenUpdateDialog(false);
            setSnackbarMessage(t("update_caterogy_success"));
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
          } else {
            setNameError(true);
            setNameErrorMessage(t('category_with_name_already_exists'))
            setSnackbarMessage(t("update_caterogy_failed"));
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
          }
        })
        .catch((err: any) => {
          console.error("Update category failed:", err.response?.data || err.message);
          setSnackbarMessage(t("update_category_occerred"));
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        });
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    requestApi(`categories/${categoryId}`, "DELETE")
      .then((res: any) => {

        if (res.success) {
          loadCategories(page)
          console.log("Category deleted:", res);
          setSnackbarMessage(t("delete_category_success"));
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
        } else {
          console.error("Delete category failed:", res.message);
          setSnackbarMessage(res.message || t("delete_category_failed"));
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      })
      .catch((err: any) => {
        console.error("Delete category failed:", err.response?.data || err.message);
        setSnackbarMessage(t("delete_category_occerred"));
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      });
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    loadCategories(value);
  };
  const formatDateTime = (isoString: string): string => {
    try {
      return format(new Date(isoString), "dd/MM/yyyy HH:mm:ss");
    } catch (error) {
      console.error("Invalid date format:", isoString, error);
      return t('invalid_date'); // Hiển thị một thông báo lỗi được dịch
    }
  };
  // console.log(formatDateTime("2024-11-14T16:11:52.379Z"));

  


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
                  handleCreateCategory();

                },
              }}
            >
              <DialogTitle>{t("addCategory")}</DialogTitle>
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
                  label={t("name_category")}
                  type="text"
                  fullWidth
                  variant="standard"
                  placeholder={t("name_category")}
                />
                <TextField
                  autoFocus
                  onChange={(val) => {
                    setDescription(val.target.value);
                  }}
                  margin="dense"
                  id="description"
                  name="description"
                  label={t("description_text")}
                  type="text"
                  fullWidth
                  variant="standard"
                />

              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenAddDialog(false)}>{t("btnCancel")}</Button>
                <Button type="submit" >{t("add")}</Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openUpdateDialog}
              onClose={() => setOpenUpdateDialog(false)}
              PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  handleUpdateCategory(selectedCategory.id)

                },
              }}
            >
              <DialogTitle>{t("update_caterogy")}</DialogTitle>
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
                  label={t("name_category")}
                  type="text"
                  fullWidth
                  variant="standard"
                  placeholder={t("name_category")}
                />
                <TextField
                  autoFocus
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
                  {t('addCategory')}
                </Button>

                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell >ID</TableCell>
                      <TableCell >{t("name_category")}</TableCell>
                      <TableCell >{t("description_text")}</TableCell>
                      <TableCell >slug</TableCell>
                      <TableCell >{t("create_date")}</TableCell>
                      <TableCell >{t("action")}</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {
                      categories.map((category: any) => (
                        <TableRow key={category.id}>
                          <TableCell>{category.id}</TableCell>
                          <TableCell >{category.name}</TableCell>
                          <TableCell>
                            {category.description 
                              ? (category.description.length > 20 
                                  ? (
                                    <Tooltip title={category.description}>
                                      <span>{`${category.description.substring(0, 20)}...`}</span>
                                    </Tooltip>
                                  ) 
                                  : category.description
                                ) 
                              : t('no')
                            }
                          </TableCell>
                          <TableCell >{category.slug}</TableCell>
                          <TableCell >
                            {formatDateTime(category.created_at)}
                          </TableCell>

                          <TableCell  >
                            <Button variant="outlined" color="primary" onClick={() => handleOpenUpdateDialog(category)} >
                              {t("edit")}
                            </Button>
                            <Button variant="outlined" color="primary" style={{ marginLeft: 8 }} onClick={() => handleDeleteCategory(category.id)}>
                              {t("delete")}
                            </Button>

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
};

export default ListCategory