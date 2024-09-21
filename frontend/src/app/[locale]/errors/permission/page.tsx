
'use client'
import { closeDrawer, toggleDrawer } from '@/stores/features/masterSlice';
import { useAppDispatch, useAppSelector } from '@/stores/hookStore';
import { NextPage } from 'next';
import { makeStore } from '@/stores/store';
import { useEffect } from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button'

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const dispatch = useAppDispatch()
  useEffect(()=>{
    dispatch(closeDrawer())
  })

  return (
    <div className='flex h-screen '>
      <div className='grid grid-cols-1 m-auto'>
        <div className='text-5xl text-center mt-5'>You Don't Have Permission</div>
        <br />
        <Button  variant="outlined" color="primary">
        Back  
        </Button>
      </div>
    </div>
  )
};

export default Page;