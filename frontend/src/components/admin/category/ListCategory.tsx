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
import { useLocale } from "next-intl";
import { _GLOBAL } from "@/contstants";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField } from "@mui/material";
import { updateLocalStorage } from "@/stores/features/masterSlice";
import requestApi from "../../../../helpers/api";

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
  const locale = useLocale();
  const [categories, setCategories] = useState([]);
  const masterStore = useAppSelector((state) => state.master);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  let [errorCreate, setErrorCreate] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");

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
 

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!ranonce) {
      if (masterStore.isAdmin) {
        setLoading(false);
      }
      loadCategories();
      ranonce = true;
    }
  }, []);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const loadCategories = async () => {
    var check = await requestApi("categories", "GET", (res: any) => {
      // if (res.success) {  
        
      //   console.log('categories:'+ categories);
      // }
    });
    console.log(check)
    setCategories(check.data);
  };
  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];


  const validateInputs = () => {
    const name = document.getElementById("name") as HTMLInputElement;
    const description = document.getElementById("description") as HTMLInputElement;

    let isValid = true;

    // Validate name
    if (!name.value) {
        setNameError(true);
      setNameErrorMessage("Category name isn't empty.");
        isValid = false;
    } else if (name.value.length < 3) {
        setNameError(true);
        setNameErrorMessage("Category name must be at least 3 characters long.");
        isValid = false;
    } else if (name.value.length > 30) {
        setNameError(true);
      setNameErrorMessage("Category name must be less than 30 characters.");
        isValid = false;
    } else {
        setNameError(false);
        setNameErrorMessage("");
    }

    setDescriptionError(false);
    return isValid;
};

function slugify(str: string): string {
  // Chuyển đổi ký tự Unicode có dấu thành ký tự không dấu
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 

  str = str.replace(/^\s+|\s+$/g, ''); // loại bỏ khoảng trắng ở đầu và cuối
  str = str.toLowerCase(); // chuyển thành chữ thường
  str = str.replace(/[^a-z0-9 -]/g, '') // loại bỏ các ký tự không phải chữ và số
           .replace(/\s+/g, '-') // thay thế khoảng trắng bằng dấu gạch ngang
           .replace(/-+/g, '-'); // loại bỏ dấu gạch ngang liên tiếp

  return str;
}
  
const handleCreateCategory = (): void => {
  const valid: boolean = validateInputs();

  if (valid) {

    const slug = slugify(name);
    const CategoryData = { name, description,slug}; // Login data to be sent to the API

    console.log(CategoryData);
    requestApi("categories", "POST", CategoryData)
      .then((res: any) => {
        if (res.success) {
          setErrorCreate("");
          // dispatch(loginSuccess({ ...res }));
          dispatch(updateLocalStorage());
          // router.replace(`/${locale}/admin/category`)
     
          // setCategories(res.data)
          console.log('create success')
          setOpen(false)
          setSnackbarMessage("Category created successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
        } else {
          setErrorCreate(res.message);
          setSnackbarMessage(res.message || "Category creation failed.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      })
      .catch((err: any) => {
        console.error("Create category failed:", err.response?.data || err.message);
        setSnackbarMessage("An error occurred while creating the category.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        // Handle login failure (e.g., show error message)
      });
  }
};

const handleDeleteCategory = (categoryId: string) => {
  requestApi(`categories/${categoryId}`, "DELETE")
    .then((res: any) => {
      
      if (res.success) {
        console.log("Category deleted:", res);

        // setCategories((prevCategories) =>
        //   prevCategories.filter((category) => category.id !== categoryId)
        // );

        setSnackbarMessage("Category deleted successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } else {
        console.error("Delete category failed:", res.message);
        setSnackbarMessage(res.message || "Failed to delete category.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    })
    .catch((err: any) => {
      console.error("Delete category failed:", err.response?.data || err.message);
      setSnackbarMessage("An error occurred while deleting the category.");
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
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault(); 
            handleCreateCategory();
       
          },
        }}
      >
        <DialogTitle>Add category</DialogTitle>
        <DialogContent>
          <DialogContentText>
          To add a new category, please enter the category name below. We will update your list immediately after submission.
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
            label="Name category"
            type="text"
            fullWidth
            variant="standard"
            placeholder="Name category..."
          />
           <TextField
            autoFocus
            error={descriptionError}
            helperText={descriptionErrorMessage}
            onChange={(val) => {
              setDescription(val.target.value);
            }}
            margin="dense"
            id="description"
            name="description"
            label="description"
            type="text"
            fullWidth
            variant="standard"
          />
      
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" >Add</Button>
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
                <Button onClick={handleOpen} variant="outlined" startIcon={<AddIcon />}>
                  Thêm danh mục
                </Button>

                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell >ID</TableCell>
                        <TableCell >Name</TableCell>
                        <TableCell >Created Date</TableCell>
                        <TableCell >Action</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                  {
                    categories.map((category: any) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.id}</TableCell>
                        <TableCell >{category.name}</TableCell>
                        <TableCell >
                          {category.created_at}
                        </TableCell>
                     
                        <TableCell  >
                          <Button variant="outlined" color="primary">
                            Edit
                          </Button>
                          <Button variant="outlined" color="primary" style={{ marginLeft: 8 }} onClick={()=>handleDeleteCategory(category.id)}>
                            Delete
                          </Button>
                          
                        </TableCell>
                      
                      </TableRow>
                    ))
                  
                  }
                
                </TableBody>
                </Table>
              </TableContainer>

            </div>
          </React.StrictMode>
        </div>
      );
    }
  };

  return renderPage();
};

export default ListCategory