import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './title.js';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';


export default function Chart() {
  const [data,setData]=useState({});

  useEffect(() => {
    const incomeFetch = async () => {
      try {  
        await axios.get("http://localhost:4100/summary",{
          withCredentials:true
        }).then(res=>{
          setData(res.data.data)
        })

      } catch (error) {
        console.log(error.message);
      }
    };
    incomeFetch();

  }, []);

  return (
    <React.Fragment>
      <Title>Summary</Title>
      <div>
      <Typography color="text.secondary" >
        <b>Savings</b>: ${data.savings}
      </Typography>
      <Typography color="text.secondary" >
      <b>Income:</b> ${data.income}
      </Typography>
      <Typography color="text.secondary" >
      <b>Expense:</b> ${data.expense}
      </Typography>
      <Typography color="text.secondary" >
      <b>Spending Rate:</b> {data.spending}%
      </Typography>
    </div>

      

    </React.Fragment>
  );
}