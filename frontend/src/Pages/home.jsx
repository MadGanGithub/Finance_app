import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chart from "../Components/chart.js";
import Deposits from "../Components/deposit.js";
import Orders from "../Components/order.js";
import DateFilter from "../Components/datefilter.js";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Title from "../Components/title.js";
import LogoutIcon from "@mui/icons-material/Logout";
import { LogContext } from "../Components/logcontext.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const { logged, setLogged } = useContext(LogContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!logged) {
      navigate("/signin");
    }
  }, [logged]);

  const [formData, setFormData] = React.useState({
    description: "",
    amount: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post("http://localhost:4100/transactions", formData, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Transaction created successfully");
        window.location.reload();
      });

    handleClose();
  };

  const handleLogOut = async (e) => {
    e.preventDefault();
    try {
      await axios
        .get("http://localhost:4100/logout", {
          withCredentials: true,
        })
        .then((res) => {
          window.location.reload();
        });
    } catch (eror) {
      console.log(eror);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute">
          <Toolbar
            sx={{
              pr: "24px",
            }}
          >
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit" onClick={handleOpen}>
              <AddIcon /> <div style={{ fontSize: 20 }}>Create</div>
            </IconButton>
            <IconButton color="inherit" onClick={handleLogOut}>
              <LogoutIcon /> <div style={{ fontSize: 20 }}>Logout</div>
            </IconButton>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="notification-modal-title"
              aria-describedby="notification-modal-description"
            >
              <Box sx={style}>
                <Title>New Transaction</Title>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    required
                    style={{ margin: 7 }}
                  />
                  <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    fullWidth
                    required
                    style={{ margin: 7 }}
                  />
                  <TextField
                    select
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    fullWidth
                    required
                    style={{ margin: 7 }}
                  >
                    <MenuItem value="credit">Credit</MenuItem>
                    <MenuItem value="debit">Debit</MenuItem>
                  </TextField>
                  <Grid container spacing={2} style={{ marginTop: 5 }}>
                    <Grid item xs={6}>
                      <Button
                        type="submit"
                        fullWidth
                        style={{
                          color: "white",
                          backgroundColor: "#1976D2",
                          borderRadius: 10,
                        }}
                      >
                        Submit
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        onClick={handleClose}
                        fullWidth
                        style={{
                          color: "white",
                          backgroundColor: "red",
                          borderRadius: 10,
                        }}
                      >
                        Close
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Modal>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: 1,
                }}
              >
                <DateFilter />
              </Paper>
            </Grid>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 190,
                  }}
                >
                  <Chart />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 190,
                  }}
                >
                  <Deposits />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Orders />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
