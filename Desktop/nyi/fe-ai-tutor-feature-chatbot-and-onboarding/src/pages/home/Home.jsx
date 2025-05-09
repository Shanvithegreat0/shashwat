import { Button, Card, Stack, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { useGetAllExamsQuery } from '../../store/slices/apiServices';
import { Link } from 'react-router-dom';
import BreadCrumbs from '../../components/BreadCrumbs';

const Home = () => {
  const LIMIT=4;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [page,setPage]=useState(1);
  const { data, isLoading, isSuccess } = useGetAllExamsQuery({ page, limit: LIMIT });
  

  if(isLoading){
    return <>Loading...</>
  }

  const breadcrumbs = [
    { text: 'Exams' }
  ];


  return (
    <>
    <BreadCrumbs breadcrumbs={breadcrumbs} />
    
      <Stack gap={2} >
          {data?.data?.map(item => (
            <Card 
              key={item.slug}
              sx={{p:3}} 
              variant='outlined'
            >
              <Stack direction="row" justifyContent={'space-between'}>
                <Typography variant='h6'>{item.name}</Typography>
                <Button LinkComponent={Link} to={`/exams/${item.slug}`} variant="contained" >Show Details</Button>
              </Stack>
            </Card>
          ))}
        </Stack>
    </>
  )
}

export default Home