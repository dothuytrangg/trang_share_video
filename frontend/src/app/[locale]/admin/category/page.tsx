
'use client'
import { NextPage } from 'next';

interface Props { }

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/stores/hookStore';
import requestApi from '../../../../../helpers/api';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { _GLOBAL } from '@/contstants';
function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}
const Page: NextPage<Props> = ({ }) => {
  var ranonce = false;
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const locale = useLocale();
  const [categories, setCategories] = useState([]);
  const masterStore = useAppSelector(state => state.master);
  useEffect(() => {
 
    if (!ranonce) {
      if (masterStore.isAdmin) {
        setLoading(false);

      }
      loadCategories();
      ranonce = true
    }
  }, [])

  const loadCategories = async () => {
    await requestApi('categories', 'GET', (res: any) => {
      if (res.success) {
        setCategories(res.data)
      }
    })
  }
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];
  const renderPage = () => {

    if (!loading) {
      return <div className="grid grid-cols-1 gap-4">
        <React.StrictMode>
          <div className="m-5 mt-20">
            <TableContainer className='p-5' sx={{ border: 0 }} component={Paper}>
              <Button onClick={()=>{
                router.push(`/${locale}/${_GLOBAL.ROUTE_ADMIN}/${_GLOBAL.ROUTE_ADMIN_CATEGORY}/${_GLOBAL.ROUTE_ADMIN_ADD}`)
              }} variant="outlined" startIcon={<AddIcon />}>
                Thêm danh mục
              </Button>

              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">Created Date</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.calories}</TableCell>
                      <TableCell align="right">{row.fat}</TableCell>
                      <TableCell align="right">{row.carbs}</TableCell>
                    </TableRow>
                  ))}
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

export default Page;