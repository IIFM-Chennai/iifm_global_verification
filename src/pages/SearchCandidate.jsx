import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCandidates } from "../features/adminSlice";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box
} from "@mui/material";
import CandidateActions from "../components/CandiateAction";
import Spinner from "../components/Spiner";
import {toast} from "react-toastify"

const SearchCandidates = () => {
  const dispatch = useDispatch();
  const { searchCandidatesData, searchLoading, searchError } = useSelector((state) => state.admin);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Search field cannot be empty!");
      return;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(searchQuery)) {
      toast.error("Invalid characters in search!");
      return;
    }

    dispatch(searchCandidates({ searchQuery }));
  };


  return (
    <Box sx={{ p: 3 }}>
      {/* Search Bar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <TextField
          label="Search by Name or Register No"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "300px", marginRight: "10px" }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {/* Candidate List */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Register No</strong></TableCell>
                <TableCell><strong>Department</strong></TableCell>
                <TableCell><strong>Created At</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Spinner />
                  </TableCell>
                </TableRow>
              ) : searchCandidatesData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No candidates found.
                  </TableCell>
                </TableRow>
              ) : (
                searchCandidatesData.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.registerNo}</TableCell>
                    <TableCell>{candidate.department}</TableCell>
                    <TableCell>
                      {candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <CandidateActions candidateId={candidate.id} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SearchCandidates;
