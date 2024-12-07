// CustomCard.js
import { styled } from '@mui/system';
import MuiCard from '@mui/material/Card';

const CustomCard = styled(MuiCard)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '100%',
        padding: theme.spacing(4),
        margin: 'auto',
        boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px',
        backgroundColor: theme.palette.background.default,
        [theme.breakpoints.up('sm')]: {
            width: '450px',
          
        },
        [theme.breakpoints.up('md')]: {
            
        },
        [theme.breakpoints.up('lg')]: {
           
        },
    }));

export default CustomCard;
