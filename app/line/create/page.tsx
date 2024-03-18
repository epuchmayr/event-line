'use client';
import {
  Card,
  Chip,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  CardActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import React, { useRef, useState } from 'react';

export default function Page() {
  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    console.log('You clicked the Chip.');
  }
  function handleDelete(event: React.MouseEvent<HTMLDivElement>) {
    console.info('You clicked the delete icon.');
  }

  return (
    <div className='h-screen flex justify-center items-center'>
      <Card sx={{ maxWidth: 500 }}>
        <CardMedia
          component='img'
          alt='green iguana'
          height='140'
          image='/static/images/cards/contemplative-reptile.jpg'
        />
        <CardHeader
          title='Shrimp and Chorizo Paella'
          subheader='September 14, 2016'
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'></Typography>
          <Box
            component='form'
            sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
            }}
          >
            <TextField
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
              }}
              required
              id='outlined-required'
              label='Name'
              defaultValue='Hello World'
            />
          <TextField
            id='outlined-multiline-static'
            label='Description'
            multiline
            minRows={4}
            maxRows={8}
            defaultValue='Default Value'
          />
          </Box>

          <Typography variant='body2' color='text.secondary'>
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>

        <CardActions>
          <Chip
            label='Clickable Deletable'
            onClick={handleClick}
            onDelete={handleDelete}
          />
          <Chip
            label='Clickable Deletable'
            variant='outlined'
            onClick={handleClick}
            onDelete={handleDelete}
          />
        </CardActions>
      </Card>
    </div>
  );
}
