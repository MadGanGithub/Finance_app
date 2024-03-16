import { Box } from '@material-ui/core';
import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import Title from './title.js';
import axios from 'axios';
import { IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DateFilter() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [data,setData]=useState([]);
    const [dateOption, setDateOption] = useState('range');
    const [showTable, setShowTable] = useState(false); 

    const handleClick=async(id)=>{
        try{
        await axios.delete(`http://localhost:4100/delete/${id}`)
        toast.success("Transaction deleted successfully")
        window.location.reload()
    }catch(error){
          console.log(error.message)
        }
      }

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (dateOption === 'range') {
            const data={
                start:startDate,
                end:endDate
            }

            await axios.post("http://localhost:4100/transactions/range",data,{
                withCredentials:true
              }).then(response=>{
                setData(response.data.transaction)
              })

        } else {
            const data={
                date:startDate
            }

            await axios.post("http://localhost:4100/transactions/particular",data,{
                withCredentials:true
              }).then(response=>{
                setData(response.data.transaction)
              })
        }
        setShowTable(true);
    };

    return (
        <Box style={{ alignItems: 'center' }}>
            <form onSubmit={handleSubmit} style={{paddingBottom:5}}>
              <div style={{padding:1}}>
                <input
                    type="radio"
                    id="range"
                    name="dateOption"
                    value="range"
                    checked={dateOption === 'range'}
                    onChange={() => setDateOption('range')}
                />
                <label htmlFor="range">Range of Dates</label>
                <input
                    type="radio"
                    id="particular"
                    name="dateOption"
                    value="particular"
                    checked={dateOption === 'particular'}
                    onChange={() => setDateOption('particular')}
                />
                <label htmlFor="particular">Particular Date</label>
                </div>
                <br />
                {dateOption === 'range' && (
                    <>
                        <label htmlFor="startDate" style={{paddingRight:5}}>Start Date:</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            style={{marginRight:10}}
                        />
                        <label htmlFor="endDate" style={{paddingRight:5}}>End Date:</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                            style={{marginRight:10}}
                        />
                    </>
                )}
                {dateOption === 'particular' && (
                    <>
                        <label htmlFor="selectedDate" style={{paddingRight:5}}>Selected Date:</label>
                        <input
                            type="date"
                            id="selectedDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            style={{marginRight:10}}
                        />
                    </>
                )}
                <button type="submit" style={{backgroundColor:"#1976D2",color:"white",borderColor:"#1976D2",borderRadius:10,padding:3}}>Filter</button>
            </form>
            <hr/>
            {showTable && (
                <>
            <Title>Filtered Transactions</Title>
            <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Debit</TableCell>
            <TableCell>Credit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {data==""?<TableCell><h3>No Results found</h3></TableCell>:null}
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.description}</TableCell>
              {row.type === "debit" ? <TableCell>-${row.amount}</TableCell> : <TableCell></TableCell>}
              {row.type === "credit" ? <TableCell>+${row.amount}</TableCell> : <TableCell></TableCell>}
              <TableCell><IconButton onClick={()=>handleClick(row.transaction_id)} style={{color:"red"}}><DeleteIcon/></IconButton></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </>
      )}
        </Box>
    );
}

export default DateFilter;
