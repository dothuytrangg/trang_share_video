import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";

export const ReponsiveContainer = styled(Stack)(({ theme }) => ({
    height: '100%',
    padding: 4,
    [theme.breakpoints.down('sm')]: {
     
    },
    [theme.breakpoints.between('sm', 'md')]: {
        padding: 3, // Giữa sm và md
    },
    [theme.breakpoints.up('md')]: {
        padding: 4, // Màn hình lớn hơn hoặc bằng md
    },
    [theme.breakpoints.up('lg')]: {
        padding: 5, // Màn hình lớn hơn hoặc bằng lg
    },
}));
