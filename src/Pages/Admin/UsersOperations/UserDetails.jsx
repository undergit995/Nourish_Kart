import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { setData, deleteUser } from "../../../Redux/Slices/userSlice";
import api from "../../../api/axiosConfig";

function UserDetails() {
  const customers = useSelector((state) => state.user.users);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [verifyFilter, setVerifyFilter] = useState("all");
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  async function getData() {
    try {
      const res = await api.get("/crudAdmin/getAllcustomers");
      dispatch(setData(res.data));
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteCustomer(id) {
    try {
      await api.delete(`/crudAdmin/deletecustomer/${id}`);
      dispatch(deleteUser(id));
      setOpenDelete(false);
      setSelectedUserId(null);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const filteredCustomers = customers?.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesVerify =
      verifyFilter === "all"
        ? true
        : verifyFilter === "verified"
        ? item.isVerified === true
        : item.isVerified === false;

    return matchesSearch && matchesVerify;
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 1.5, sm: 2.5, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
          p: { xs: 1.5, sm: 2.5, md: 4 },
          borderRadius: { xs: 2, sm: 3 },
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: { xs: 2, sm: 3 },
            textAlign: { xs: "center", sm: "left" },
            fontSize: { xs: "1.3rem", sm: "1.7rem", md: "2rem" },
            lineHeight: 1.2,
          }}
        >
          Users
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "column", md: "row" }}
          spacing={2}
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          <TextField
            fullWidth
            placeholder="Search customer by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.9rem", sm: "1rem" },
                minHeight: { xs: 44, sm: 48 },
              },
              "& .MuiInputBase-input": {
                py: { xs: 1.2, sm: 1.4 },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ fontSize: { xs: 20, sm: 22 }
                    }}
                      color="action"
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            select
            value={verifyFilter}
            onChange={(e) => setVerifyFilter(e.target.value)}
            size="small"
            sx={{
               borderRadius: 2,
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.9rem", sm: "1rem" },
                minHeight: { xs: 44, sm: 48 },
              },
              "& .MuiInputBase-input": {
                py: { xs: 1.2, sm: 1.4 },
              },

            }}
          >
            <MenuItem value="all">All Users</MenuItem>
            <MenuItem value="verified">Verified Users</MenuItem>
            <MenuItem value="notVerified">Not Verified Users</MenuItem>
          </TextField>
        </Stack>

        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: "100%",
          }}
        >
          <TableContainer
            component={Paper}
            elevation={1}
            sx={{
              borderRadius: 3,
              overflowX: "auto",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    Verified
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredCustomers?.length > 0 ? (
                  filteredCustomers.map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell sx={{ fontSize: "0.95rem" }}>
                        {item.name}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.95rem", wordBreak: "break-word" }}
                      >
                        {item.email}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.isVerified ? "Verified" : "Not Verified"}
                          color={item.isVerified ? "success" : "warning"}
                          size="small"
                          sx={{
                            fontSize: "0.78rem",
                            height: 28,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => {
                            setSelectedUserId(item._id);
                            setOpenDelete(true);
                          }}
                          sx={{
                            textTransform: "none",
                            fontSize: "0.85rem",
                            px: 2,
                            py: 0.8,
                            borderRadius: 2,
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ py: 4, fontSize: "0.95rem" }}
                    >
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Stack
          spacing={{ xs: 1.5, sm: 2 }}
          sx={{
            display: { xs: "flex", md: "none" },
          }}
        >
          {filteredCustomers?.length > 0 ? (
            filteredCustomers.map((item) => (
              <Paper
                key={item._id}
                elevation={2}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: { xs: 2.5, sm: 3 },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1rem", sm: "1.08rem" },
                    wordBreak: "break-word",
                  }}
                >
                  {item.name}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mt: 0.7,
                    fontSize: { xs: "0.88rem", sm: "0.95rem" },
                    wordBreak: "break-word",
                    lineHeight: 1.5,
                  }}
                >
                  {item.email}
                </Typography>

                <Box sx={{ mt: 1.5, mb: 1.5 }}>
                  <Chip
                    label={item.isVerified ? "Verified" : "Not Verified"}
                    color={item.isVerified ? "success" : "warning"}
                    size="small"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.8rem" },
                      height: { xs: 26, sm: 28 },
                    }}
                  />
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setSelectedUserId(item._id);
                    setOpenDelete(true);
                  }}
                  sx={{
                    textTransform: "none",
                    mt: 1,
                    py: { xs: 1, sm: 1.1 },
                    fontSize: { xs: "0.9rem", sm: "0.95rem" },
                    borderRadius: 2,
                  }}
                >
                  Delete
                </Button>
              </Paper>
            ))
          ) : (
            <Paper
              sx={{
                p: { xs: 2.5, sm: 3 },
                textAlign: "center",
                borderRadius: 3,
              }}
            >
              <Typography sx={{ fontSize: { xs: "0.95rem", sm: "1rem" } }}>
                No customers found
              </Typography>
            </Paper>
          )}
        </Stack>
      </Paper>

      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete User?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this customer? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deleteCustomer(selectedUserId)}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserDetails;