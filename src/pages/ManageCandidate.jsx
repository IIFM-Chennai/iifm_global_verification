import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCandidateCount, fetchLatestCandidates  } from "../features/adminSlice";
import {
  Box, Typography, Card, CardContent, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CardMedia, Skeleton
} from "@mui/material";
import { toast } from "react-toastify";
import CandidateActions from "../components/CandiateAction";

// Department to image mapping
const departmentImages = {
  HVAC: '/assets/hvac.jpg',
  IBMS: '/assets/ibms.png',
  MEP: '/assets/mep.png',
  POWER_PLANT: '/assets/power-plant.png',
  WTP: '/assets/wtp.png',
  SAFETY: '/assets/safety.png',
  LSCM: '/assets/lscm.jpg',
};

const ManageCandidate = () => {
  const dispatch = useDispatch();

  const {
    totalCandidates, departmentCounts, academicYearCounts, totalCandidatesError,
    candidates, candidatesError, candidatesLoading,totalCandidatesLoading 
  } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchCandidateCount()).unwrap()
      .catch(err => toast.error(`Error fetching counts: ${err}`));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchLatestCandidates()).unwrap()
      .catch(err => toast.error(`Error fetching candidates: ${err}`));
  }, [dispatch]);

  return (
    <Box sx={{ p: 3 }}>
      {totalCandidatesError && <Typography color="error" textAlign="center">{totalCandidatesError}</Typography>}
      <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 4 }}>
        <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: { xs: '100%', sm: '60%', md: '33%' }, height: { xs: 'auto', md: '180px' }, boxShadow: 3, cursor: "pointer", transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <Typography color="#2c3e50" variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '28px', sm: '32px', md: '36px' } }}>
              Total Candidates
            </Typography>
            {totalCandidatesLoading ? <Skeleton variant="text" width={100} height={40} /> : (
              <Typography variant="h3" color="secondary">{totalCandidates}</Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h3" color="#2c3e50" sx={{ fontWeight: 'bold', mb: 4 }}>Departments</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3, mb: 3 }}>
        {totalCandidatesLoading ? Array.from(new Array(6)).map((_, index) => (
          <Skeleton key={index} variant="rectangular" width={200} height={150} />
        )) : Object.entries(departmentCounts).map(([dept, count]) => (
          <Card key={dept} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' }, height: '100%', boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography component="h3" variant="h5" sx={{ fontWeight: 'bold' }}>{dept.replace(/_/g, " ")}</Typography>
              <Typography variant="h6" color="secondary">{count}</Typography>
            </CardContent>
            <CardMedia component="img" sx={{ width: { xs: '100%', sm: 151 }, height: { xs: 200, sm: 'auto' }, objectFit: 'cover' }} image={departmentImages[dept.toUpperCase().replace(" ", "_")] || '/assets/default.jpg'} alt={dept} />
          </Card>
        ))}
      </Box>

      <Typography variant="h3" color="#2c3e50" sx={{ fontWeight: 'bold', mb: 2 }}>Academic Years</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, p: 3 }}>
        {totalCandidatesLoading ? Array.from(new Array(6)).map((_, index) => (
          <Skeleton key={index} variant="rectangular" width={200} height={150} />
        )) : Object.entries(academicYearCounts)
        .sort(([yearA], [yearB]) => yearB.localeCompare(yearA)) // Sort in descending order
        .map(([year, count]) => (
          <Card key={year} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: { xs: 'auto', md: '120px' }, boxShadow: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
              <Typography component="h3" variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>{year}</Typography>
              <Typography variant="h6" color="secondary">{count}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Typography variant="h3" color="#2c3e50" sx={{ fontWeight: 'bold', mb: 4 }}>Latest 10 Candidates List</Typography>
      {candidatesError && <Typography color="error" textAlign="center">{candidatesError}</Typography>}
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
              {candidatesLoading ? (
                <TableRow>
                  <TableCell  align="center"><Skeleton variant="text" width={100} height={40} /></TableCell>
                  <TableCell  align="center"><Skeleton variant="text" width={100} height={40} /></TableCell>
                  <TableCell  align="center"><Skeleton variant="text" width={100} height={40} /></TableCell>
                  <TableCell  align="center"><Skeleton variant="text" width={100} height={40} /></TableCell>
                  <TableCell  align="center"><Skeleton variant="text" width={100} height={40} /></TableCell>
                  </TableRow>
              ) : (
                candidates.map(candidate => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.registerNo}</TableCell>
                    <TableCell>{candidate.department}</TableCell>
                    <TableCell>{candidate.academicYear}</TableCell>
                    <TableCell>{candidate.createdAt}</TableCell>
                    <TableCell><CandidateActions candidateId={candidate.id} /></TableCell>
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

export default ManageCandidate;
