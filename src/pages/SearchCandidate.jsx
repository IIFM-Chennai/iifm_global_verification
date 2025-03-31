import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCandidates, updateSearchResults } from "../features/adminSlice";
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
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography
} from "@mui/material";
import CandidateActions from "../components/CandiateAction";
import Spinner from "../components/Spiner";
import { toast } from "react-toastify";

const SearchCandidates = () => {
  const dispatch = useDispatch();
  const { searchCandidatesData, searchLoading } = useSelector((state) => state.admin);

  // Search filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");

  // Sample department and academic year options (replace with dynamic options if needed)
  const departmentOptions = ["", "HVAC", "IBMS", "MEP", "POWER_PLANT", "WTP", "SAFETY"];
  const academicYearOptions = ["", "2017-2018", "2018-2019", "2019-2020", "2020-2021", "2021-2022", "2022-2023", "2023-2024", "2024-2025", "2025-2026"];

  // Handle Search
  const handleSearch = () => {
    if (!searchQuery.trim() && !selectedDepartment && !selectedAcademicYear) {
      toast.error("Please enter a search query or select filters.");
      return;
    }

    if (searchQuery && !/^[a-zA-Z0-9\s]+$/.test(searchQuery)) {
      toast.error("Invalid characters in search!");
      return;
    }

    // Dispatching the search with filters
    dispatch(
      searchCandidates({
        searchQuery: searchQuery.trim(),
        department: selectedDepartment,
        academicYear: selectedAcademicYear,
      })
    );
  };

  // Handle Reset
  const handleReset = () => {
    setSearchQuery("");
    setSelectedDepartment("");
    setSelectedAcademicYear("");
    dispatch(updateSearchResults([]))
    toast.info("Candidate data cleared, you can search again.");
  };

  return (
    <Box sx={{ p: 3 }}>


      <Typography
        variant="h3"
        color="#2c3e50"
        sx={{
          fontFamily: "Open Sans, Roboto, Oxygen, Ubuntu, Cantarell, Lato, Helvetica Neue, sans-serif",
          fontWeight: 'bold',
          mb: 4,
          fontSize: { xs: '28px', sm: '32px', md: '36px' },  // Responsive font size
          textAlign: "center"             // Centered on mobile, left on desktop
        }}
      >
        Search Candidates
      </Typography>


      {/* Search and Filter Section */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
          mb: 3,
          flexDirection: { xs: "column", sm: "row" }, // Column on mobile, row on larger screens
        }}
      >
        {/* Search Field */}
        <TextField
          label="Search by Name or Register No"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: "100%", sm: "250px" } }} // Full width on mobile
        />

        {/* Department Dropdown */}
        <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            label="Department"
          >
            {departmentOptions.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept || "All Departments"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Academic Year Dropdown */}
        <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
          <InputLabel>Academic Year</InputLabel>
          <Select
            value={selectedAcademicYear}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            label="Academic Year"
          >
            {academicYearOptions.map((year) => (
              <MenuItem key={year} value={year}>
                {year || "All Years"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Search & Reset Buttons */}
        <Button variant="contained" onClick={handleSearch} sx={{ height: "56px", width: { xs: "100%", sm: "auto" } }}>
          Search
        </Button>
        <Button variant="outlined" onClick={handleReset} sx={{ height: "56px", width: { xs: "100%", sm: "auto" } }}>
          Reset
        </Button>
      </Box>

      {/* Candidate List */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Register No</strong></TableCell>
                <TableCell><strong>Department</strong></TableCell>
                <TableCell><strong>Academic Year</strong></TableCell>
                <TableCell><strong>Created At</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Spinner />
                  </TableCell>
                </TableRow>
              ) : searchCandidatesData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No candidates found.
                  </TableCell>
                </TableRow>
              ) : (
                searchCandidatesData.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.registerNo}</TableCell>
                    <TableCell>{candidate.department}</TableCell>
                    <TableCell>{candidate.academicYear}</TableCell>
                    <TableCell>{candidate.createdAt}</TableCell>
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

