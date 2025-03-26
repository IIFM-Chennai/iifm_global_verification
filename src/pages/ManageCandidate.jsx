import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCandidateCount, fetchCandidates } from "../features/adminSlice";
import {
  Box, Typography, Stack, Card, CardContent, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button
} from "@mui/material";
import { toast } from "react-toastify";
import Spiner from '../components/Spiner'
import CandidateActions from "../components/CandiateAction";

const ManageCandidate = () => {
  const dispatch = useDispatch();
  const { totalCandidates, departmentCounts, candidates, lastVisibleDoc, error } = useSelector(state => state.admin);

  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [prevDocs, setPrevDocs] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  useEffect(() => {
    dispatch(fetchCandidateCount()).unwrap().catch(err => {
      toast.error(`Error fetching counts: ${err.message}`);
    });
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingCandidates(true);
      try {
        const lastDoc = page > 1 ? prevDocs[page - 2] : null;
        const response = await dispatch(fetchCandidates({ page, pageSize, lastDoc })).unwrap();

        // Store lastVisibleDoc for previous pages correctly
        setPrevDocs(prevDocs => {
          const newPrevDocs = [...prevDocs];
          newPrevDocs[page - 1] = response.lastVisibleDoc; // Store lastVisibleDoc at correct index
          return newPrevDocs;
        });

      } catch (err) {
        toast.error(`Error fetching candidates: ${err.message}`);
      }
      setLoadingCandidates(false);
    };

    fetchData();
  }, [dispatch, page, pageSize]);



  const handleNextPage = () => {
    if (candidates.length === pageSize) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" textAlign="center" gutterBottom color="primary">
        Manage Candidates
      </Typography>

      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        <Card sx={{ flex: 1, textAlign: "center" }}>
          <CardContent>
            <Typography variant="h6">Total Candidates</Typography>
            <Typography variant="h4" color="primary">{totalCandidates}</Typography>
          </CardContent>
        </Card>

        {Object.entries(departmentCounts).map(([dept, count]) => {
          // Format department names: Replace "_" with space (e.g., "POWER_PLANT" -> "Power Plant")
          const formattedDept = dept.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

          return (
            <Card key={dept} sx={{ flex: 1, textAlign: "center" }}>
              <CardContent>
                <Typography variant="h6">{formattedDept.toUpperCase()}</Typography>
                <Typography variant="h4" color="secondary">{count}</Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

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
              {loadingCandidates ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Spiner />
                  </TableCell>
                </TableRow>
              ) : (
                candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.registerNo}</TableCell>
                    <TableCell>{candidate.department}</TableCell>
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

        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" , marginBottom : "20px"}}>
          <Button
            onClick={handlePrevPage}
            disabled={page === 1}
            variant="contained"
            sx={{ mx: 1 }}
          >
            Prev
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={candidates.length < pageSize}
            variant="contained"
            sx={{ mx: 1 }}
          >
            Next
          </Button>
        </div>
      </Paper>
    </Box>
  );
};

export default ManageCandidate;
