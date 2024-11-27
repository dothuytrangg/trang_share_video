
'use client'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hookStore';
import requestApi from '../../../../helpers/api';
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { updateLocalStorage } from '@/stores/features/masterSlice';
import { _GLOBAL } from '@/contstants';
import router from 'next/router';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from "next/navigation";
import { format } from 'date-fns';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const ListAccount = () => {
  var ranonce = false;
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const masterStore = useAppSelector(state => state.master);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [openAddDialog,setOpenAddDialog] = useState(false);
  const [openUpdateDialog,setOpenUpdateDialog] = useState(false);
  const [full_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let [errorCreate, setErrorCreate] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [page,setPage] = useState(1);
  const locale = useLocale();
  const t = useTranslations("HomePage");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!ranonce) {
      if (masterStore.isAdmin) {
        setLoading(false);
      //  router.push(`/${locale}/${_GLOBAL.ROUTE_ADMIN}/${_GLOBAL.ROUTE_ADMIN_user}`);
      }
      loadUsers(page);
      ranonce = true;
    }
  }, []);
  // users?page=2&items_per_page=3&search

  const loadUsers = async (pageSelected:number) => {
    await requestApi(`users?page=${pageSelected}&items_per_page=5&search`, "GET").then((res:any)=>{
    console.log('res',res);
    if(res.success){
      setUsers(res.data);
      setLastPage(res.lastPage)
    }

  }).catch((err:any)=>{
      console.error(err);
  })

};
  
const validateInputs = () => {
  const full_name = document.getElementById("full_name") as HTMLInputElement;
  const email = document.getElementById("email") as HTMLInputElement;
  const password = document.getElementById("password") as HTMLInputElement;

  let isValid = true;
  if(!full_name.value){
    setNameError(true);
    setNameErrorMessage(t("name"));
    isValid = false;
  }else if(full_name.value.length < 3){
    setNameError(true);
    setNameErrorMessage(t("name_least_3"));
    isValid = false;
  } else if (full_name.value.length > 20) 
    {
      setNameError(true);
      setNameErrorMessage(t("name_more_20"));
      isValid = false;
    }else{
    setNameError(false);
    setNameErrorMessage("");
  }
//----------------------------email-----------------------------------------

  if (!email.value) {
    setEmailError(true);
    setEmailErrorMessage(t('email_not_empty'));
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    setEmailError(true);
    setEmailErrorMessage(t('email_invalid'));
    isValid = false;
  } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
//----------------------------password--------------------------------
  if (!password.value) {
    setPasswordError(true);
    setPasswordErrorMessage(t('password_not_empty'));
    isValid = false;
  } else if (password.value.length < 6) {
    setPasswordError(true);
    setPasswordErrorMessage(t('password_least_6'));
    isValid = false;
  } else {
    setPasswordError(false);
    setPasswordErrorMessage('');
  }
  return isValid;
};

const updateValidateInputs = () => {
  const full_name = document.getElementById("full_name") as HTMLInputElement;
  const password = document.getElementById("password") as HTMLInputElement;
  let isValid = true;

  if (!full_name.value) {
    setNameError(true);
    setNameErrorMessage(t("name"));
    isValid = false;
  } else if (full_name.value.length <3 ) {
    setNameError(true);
    setNameErrorMessage(t("name_least_3"));
    isValid = false;
  } else if (full_name.value.length > 20) {
    setNameError(true);
    setNameErrorMessage(t("name_more_20"));
    isValid = false;
  } else {
    setNameError(false);
    setNameErrorMessage("");
  }

  if (!password.value) {
    setPasswordError(true);
    setPasswordErrorMessage(t('password_not_empty'));
    isValid = false;
  } else if (password.value.length < 6) {
    setPasswordError(true);
    setPasswordErrorMessage(t('password_least_6'));
    isValid = false;
  } else {
    setPasswordError(false);
    setPasswordErrorMessage('');
  }

  return isValid;
};

const [lastPage,setLastPage] = useState(1);
const handleCreateUser = (): void => {
  const valid: boolean = validateInputs();

  if (valid) {


    const userData = {full_name ,email,password}; 

    console.log('userdata',userData);
    requestApi("users", "POST", userData)
      .then((res: any) => {
        console.log('res create',res);
        if (res.success) {
          loadUsers(page)
          console.log('create success')
          setOpenAddDialog(false)
          setSnackbarMessage(t("create_user_success"));
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
        } else {
           if(res.statusCode == 400){
            setEmailError(true);
            setEmailErrorMessage(t('user_with_email_already_exists'))
            setErrorCreate(res.message);
            setSnackbarMessage(t("create_user_failed"));
            setSnackbarSeverity("error");
            setOpenSnackbar(true);

          }else{
            setErrorCreate(res.message);
            setSnackbarMessage(t("create_user_failed"));
            setSnackbarSeverity("error");
            setOpenSnackbar(true);

          }
        }
      })
      .catch((err: any) => {
        console.error("Create user failed:", err.response?.data || err.message);
        setSnackbarMessage(t("create_user_occerred"));
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      });
  }
};


const [selectedUser, setSelectedUser] = useState<any>(null);
const handleOpenUpdateDialog = (user:any) => {
  console.log('user',user);
  setSelectedUser(user);
  setName(user.full_name);
  // setPassword(user.password)
  setOpenUpdateDialog(true);
};

const handleUpdateUser = (userId: string) => {
  const valid: boolean = updateValidateInputs();

  if (valid) {
    const userData_update = { full_name ,password};
    

    requestApi(`users/${userId}`, "PUT", userData_update)
      .then((res: any) => {
        if (res.success) {
           loadUsers(page);
           console.log('res update',res)
           dispatch(updateLocalStorage());
       
          setOpenUpdateDialog(false);
          setSnackbarMessage(t("update_user_success"));
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
        } else {
          setSnackbarMessage(res.message || t(("update_user_failed")));
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      })
      .catch((err: any) => {
        console.error("Update user failed:", err.response?.data || err.message);
        setSnackbarMessage(t("update_user_occerred"));
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      });
  }
};

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);




  const handleOpenDeleteDialog = (user: any) => {
    console.log("user selected:", user); // Log để kiểm tra giá trị
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

const handleDeleteUser = (userId: string) => {
  requestApi(`users/${userId}`, "DELETE")
    .then((res: any) => {
      
      if (res.success) {
        loadUsers(page)
        setSnackbarMessage(t("delete_user_success"));
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } else {
        console.error("Delete user failed:", res.message);
        setSnackbarMessage(res.message || t("delete_user_failed"));
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    })
    .catch((err: any) => {
      console.error("Delete user failed:", err.response?.data || err.message);
      setSnackbarMessage(t("delete_user_occerred"));
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    });
};
const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
  setPage(value);
  loadUsers(value);
};

const formatDateTime = (isoString: string): string => {
  try {
    return format(new Date(isoString), "dd/MM/yyyy HH:mm:ss");
  } catch (error) {
    console.error("Invalid date format:", isoString, error);
    return t('invalid_date'); // Hiển thị một thông báo lỗi được dịch
  }
};

const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);




const handleOpenDeleteDialog = (user: any) => {
  console.log("user selected:", user); // Log để kiểm tra giá trị
  setSelectedUser(user);
  setOpenDeleteDialog(true);
};
  

  const renderPage = () => {
    if (!loading) {
      return <div className="grid grid-cols-1 gap-4">
        <React.StrictMode>

      
        <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault(); 
            handleCreateUser()
       
          },
        }}
      >
        <DialogTitle>{t("add_user")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          {t("add_text")}
          </DialogContentText>
          <TextField
            autoFocus
            error={nameError}
            helperText={nameErrorMessage}
            onChange={(val) => {
              setName(val.target.value);
            }}
            margin="dense"
            id="full_name"
            name="full_name"
            label={t("name_account")}
            type="text"
            fullWidth
            variant="standard"
            placeholder= {t("input_name")}
          />
           <TextField
            autoFocus
            error={emailError}
            helperText={emailErrorMessage}
            onChange={(val) => {
              setEmail(val.target.value);
              setEmailErrorMessage('');
            }}
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            placeholder="Email..."
          />
            <TextField
            autoFocus
            error={passwordError}
            helperText={passwordErrorMessage}
            onChange={(val) => {
              setPassword(val.target.value);
            }}
            margin="dense"
            id="password"
            name="password"
            label= {t("password")}
            type="password"
            fullWidth
            variant="standard"
            
          />
      
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenAddDialog(false)}>{t("btnCancel")}</Button>
          <Button type="submit" >{t("add_user")}</Button>
        </DialogActions>
      </Dialog>
     
      <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault(); 
            handleUpdateUser(selectedUser.id);
       
          },
        }}
      >
        <DialogTitle>{t("update_user")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          {t("update_text")}
          </DialogContentText>
          <TextField
            autoFocus
            error={nameError}
            helperText={nameErrorMessage}
            onChange={(val) => {
              setName(val.target.value);
            }}
            value={full_name}
            margin="dense"
            id="full_name"
            name="full_name"
            label= {t("name_account")}
            type="text"
            fullWidth
            variant="standard"
            placeholder= {t("input_name")}
          />
          <TextField
            autoFocus
            error={passwordError}
            helperText={passwordErrorMessage}
            onChange={(val) => {
              setPassword(val.target.value);
            }}
            value={password}
            margin="dense"
            id="password"
            name="password"
            label= {t("password")}
            type="password"
            fullWidth
            variant="standard"
            
          />
    
      
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenUpdateDialog(false)}>{t("btnCancel")}</Button>
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
            <Button variant="outlined" startIcon={<AddIcon />} onClick={()=>setOpenAddDialog(true)}>
                {t("addAccount")}
            </Button>

            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell >{t("name_account")}</TableCell>
                  <TableCell >Email</TableCell>
                  <TableCell >{t("role")}</TableCell>
                  <TableCell >{t("create_date")}</TableCell>
                  <TableCell >{t("action")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  {
                    users.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell >{user.full_name}</TableCell>
                        <TableCell >{user.email}</TableCell>
                        <TableCell >{
                           user.role == 3 ? (t("admin")) :(t('user'))
                          }</TableCell>
                        <TableCell >
                          {formatDateTime(user.created_at)}
                        </TableCell>
                     
                        <TableCell  >
                          <Button variant="outlined" color="primary"  onClick={()=>handleOpenUpdateDialog(user)} >
                            {t("edit")}
                          </Button>
                          <Button variant="outlined" color="primary" style={{ marginLeft: 8 }} onClick={() => handleOpenDeleteDialog(user)} >
                          <Button variant="outlined" color="primary" style={{ marginLeft: 8 }} onClick={() => handleOpenDeleteDialog(user)} >
                            {t("delete")}
                          </Button>
                          
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
                    {t("are_you_sure_delete_user", { user: selectedUser?.name })}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDeleteDialog(false)}>{t("btnCancel")}</Button>
                  <Button
                    onClick={() => {
                      console.log("Selected user ID:", selectedUser?.id); // Log để kiểm tra
                      if (selectedUser?.id) {
                        handleDeleteUser(selectedUser.id);
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
      <Pagination style={{margin:10}}  count={lastPage} page={page} onChange={handleChange}  variant="outlined" color="primary"  />
  
    </Stack>
 



        </div>
    


        </React.StrictMode>

  
      </div>
    }
  }

  return renderPage()
};

export default ListAccount;