
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
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField } from '@mui/material';
import { updateLocalStorage } from '@/stores/features/masterSlice';
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
 

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!ranonce) {
      if (masterStore.isAdmin) {
        setLoading(false);
      }
      loadUsers();
      ranonce = true;
    }
  }, []);

  const loadUsers = async () => {
    await requestApi("users", "GET").then((res:any)=>{
    console.log('res',res);
    if(res.success){
      setUsers(res.data);
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

  if (!full_name.value ) {
    setNameError(true);
    setNameErrorMessage("Please enter full name.");
    isValid = false;
  } else {
    setNameError(false);
    setNameErrorMessage("");
  }

  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
    setEmailError(true);
    setEmailErrorMessage("Please enter a valid email address.");
    isValid = false;
  } else {
    setEmailError(false);
    setEmailErrorMessage("");
  }

  if (!password.value || password.value.length < 6) {
    setPasswordError(true);
    setPasswordErrorMessage("Password must be at least 6 characters long.");
    isValid = false;
  } else {
    setPasswordError(false);
    setPasswordErrorMessage("");
  }

  return isValid;
};

const updateValidateInputs = () => {
  const full_name = document.getElementById("full_name") as HTMLInputElement;

  let isValid = true;

  if (!full_name.value ) {
    setNameError(true);
    setNameErrorMessage("Please enter full name.");
    isValid = false;
  } else {
    setNameError(false);
    setNameErrorMessage("");
  }


  return isValid;
};
const handleCreateUser = (): void => {
  const valid: boolean = validateInputs();

  if (valid) {


    const userData = {full_name ,email,password}; 

    console.log('userdata',userData);
    requestApi("users", "POST", userData)
      .then((res: any) => {
        console.log('res create',res);
        if (res.success) {
          loadUsers()
          console.log('create success')
          setOpenAddDialog(false)
          setSnackbarMessage("User created successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
        } else {
          setErrorCreate(res.message);
          setSnackbarMessage(res.message || "User creation failed.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      })
      .catch((err: any) => {
        console.error("Create user failed:", err.response?.data || err.message);
        setSnackbarMessage("An error occurred while creating the user.");
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
  setOpenUpdateDialog(true);
};

const handleUpdateUser = (userId: string) => {
  const valid: boolean = updateValidateInputs();

  if (valid) {
    const userData_update = { full_name };

    requestApi(`users/${userId}`, "PUT", userData_update)
      .then((res: any) => {
        if (res.success) {
           loadUsers();
           console.log('res update',res)
           dispatch(updateLocalStorage());
       
          setOpenUpdateDialog(false);
          setSnackbarMessage("User updated successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
        } else {
          setSnackbarMessage(res.message || "User update failed.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      })
      .catch((err: any) => {
        console.error("Update user failed:", err.response?.data || err.message);
        setSnackbarMessage("An error occurred while updating the user.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      });
  }
};


const handleDeleteUser = (userId: string) => {
  requestApi(`users/${userId}`, "DELETE")
    .then((res: any) => {
      
      if (res.success) {
        loadUsers()
        setSnackbarMessage("User deleted successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } else {
        console.error("Delete user failed:", res.message);
        setSnackbarMessage(res.message || "Failed to delete user.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    })
    .catch((err: any) => {
      console.error("Delete user failed:", err.response?.data || err.message);
      setSnackbarMessage("An error occurred while deleting the user.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    });
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
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <DialogContentText>
          To add a new user, please enter the user name below. We will update your list immediately after submission.
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
            label="Full Name"
            type="text"
            fullWidth
            variant="standard"
            placeholder="Full name..."
          />
           <TextField
            autoFocus
            error={emailError}
            helperText={emailErrorMessage}
            onChange={(val) => {
              setEmail(val.target.value);
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
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            
          />
      
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenAddDialog(false)}>Cancel</Button>
          <Button type="submit" >Add</Button>
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
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          <DialogContentText>
          To update user, please enter the user name below. We will update your list immediately after submission.
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
            label="Full Name"
            type="text"
            fullWidth
            variant="standard"
            placeholder="Full name..."
          />
    
      
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenUpdateDialog(false)}>Cancel</Button>
          <Button type="submit" >Update</Button>
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
              Thêm tài khoản
            </Button>

            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell >Full Name</TableCell>
                  <TableCell >Email</TableCell>
                  <TableCell >Created at</TableCell>
                  <TableCell >Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  {
                    users.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell >{user.full_name}</TableCell>
                        <TableCell >{user.email}</TableCell>
                        <TableCell >
                          {user.created_at}
                        </TableCell>
                     
                        <TableCell  >
                          <Button variant="outlined" color="primary"  onClick={()=>handleOpenUpdateDialog(user)} >
                            Edit
                          </Button>
                          <Button variant="outlined" color="primary" style={{ marginLeft: 8 }} onClick={()=>handleDeleteUser(user.id)} >
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
    }
  }

  return renderPage()
};

export default ListAccount;