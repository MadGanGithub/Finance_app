import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { LogContext } from "../Components/logcontext.js";
import Title from "./title.js";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Orders() {
  const [data, setData] = useState([]);
  const { logged, setLogged } = useContext(LogContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!logged) {
      navigate("/signin");
    }
  }, [logged, data]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        await axios
          .get("http://localhost:4100/transactions", {
            withCredentials: true,
          })
          .then((response) => {
            setData(response.data.transaction);
          });
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAll();
  }, [logged]);

  const handleClick = async (id) => {
    try {
      await axios.delete(`http://localhost:4100/delete/${id}`);
      toast.success("Transaction deleted successfully");
      window.location.reload();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDate = (date) => {
    const parts = date.split("T");
    return parts[0];
  };

  return (
    <React.Fragment>
      <Title>All Transactions</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Debit</TableCell>
            <TableCell>Credit</TableCell>
            {/* <TableCell align="right">Balance</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{handleDate(row.date)}</TableCell>
              <TableCell>{row.description}</TableCell>
              {row.type === "debit" ? (
                <TableCell>-${row.amount}</TableCell>
              ) : (
                <TableCell></TableCell>
              )}
              {row.type === "credit" ? (
                <TableCell>+${row.amount}</TableCell>
              ) : (
                <TableCell></TableCell>
              )}
              <TableCell>
                <IconButton
                  onClick={() => handleClick(row.transaction_id)}
                  style={{ color: "red" }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
