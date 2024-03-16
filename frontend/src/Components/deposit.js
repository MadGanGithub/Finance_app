import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './title.js';
import { useState,useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogContext } from './logcontext.js';
import axios from 'axios';

export default function Deposits() {
  const [data,setData]=useState([]);
  const {logged,setLogged}=useContext(LogContext)
  const [balance,setBalance]=useState(0.0)
  const [income,setIncome]=useState(0.0)
  const [expense,setExpense]=useState(0.0)
  const navigate=useNavigate()

  useEffect(() => {
    if (!logged) {
      navigate('/signin')
    }
  },[logged,navigate]);

  useEffect(()=>{
    const fetchAll=async()=>{
      try{
        await axios.get("http://localhost:4100/transactions",{
          withCredentials:true
        }).then(response=>{
          setData(response.data.transaction);
        })
    
      }catch(error){
        console.log(error.message)
      }
    }
    fetchAll();  
  },[logged])

  useEffect(() => {
    const incomeFetch = async () => {
      try {
        let totalIncome = 0.0;
        let totalExpense = 0.0;
  
        // Calculate total income and expense
        for (const x of data) {
          if (x.type === "credit") {
            totalIncome += parseFloat(x.amount);
          } else {
            totalExpense += parseFloat(x.amount);
          }
        }
  
        // Calculate balance
        const totalBalance = totalIncome - totalExpense;
  
        // Update state
        setIncome(totalIncome.toFixed(2));
        setExpense(totalExpense.toFixed(2));
        setBalance(totalBalance.toFixed(2));
      } catch (error) {
        console.log(error.message);
      }
    };
  
    // Clear existing values before calculating
    setIncome(0.0);
    setExpense(0.0);
    setBalance(0.0);
  
    // Calculate income, expense, and balance
    if (data.length > 0) {
      incomeFetch();
    }
  }, [data]);
  

  return (
    <React.Fragment>
      <Title>Total Balance: </Title>
      <Typography component="p" variant="h4">
        ${balance}
      </Typography>

    </React.Fragment>
  );
}