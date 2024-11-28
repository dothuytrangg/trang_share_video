import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";

export const ReponsiveContainer = styled(Stack)(({ theme }) => ({
    height: '100%',
    padding: 4, 
    [theme.breakpoints.up('xs')]: {
        padding: 2, // Padding cho màn hình nhỏ
    },
    [theme.breakpoints.up('sm')]: {
       
        padding: 3, // Điều chỉnh padding cho màn hình nhỏ và vừa
    },
    [theme.breakpoints.up('md')]: {
     
        padding: 4, // Điều chỉnh padding cho màn hình lớn
    },
    [theme.breakpoints.up('lg')]: {

        padding: 5, // Điều chỉnh padding cho màn hình lớn hơn
    },
}));
