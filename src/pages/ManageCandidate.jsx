import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCandidateCount, fetchCandidates } from "../features/adminSlice";
import {
  Box, Typography, Card, CardContent, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button,
  CardMedia,
} from "@mui/material";
import { toast } from "react-toastify";
import Spiner from '../components/Spiner'
import CandidateActions from "../components/CandiateAction";
import { useNavigate } from "react-router-dom";  


// Department to image mapping
const departmentImages = {
  HVAC: '/assets/hvac.jpg',
  IBMS: '/assets/ibms.png',
  MEP: '/assets/mep.png',
  POWER_PLANT: '/assets/power-plant.png',
  WTP: '/assets/wtp.png',
  SAFETY: '/assets/safety.png',
};


const ManageCandidate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { totalCandidates, departmentCounts, academicYearCounts,candidates, error } = useSelector(state => state.admin);

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

      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}

      {/* Total Candidates Card */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-start' },   // Center on mobile, left on desktop
          mb: 4                                                // Spacing below the total card
        }}
      >
        <Card
         onClick={() => navigate(`/dashboard/manage-candidate/total-candidate`)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',                               // Center align content
            justifyContent: 'center',
            width: { xs: '100%', sm: '60%', md: '33%' },        // Smaller width on desktop
            height: { xs: 'auto', md: '180px' },                // Reduced height on desktop
            boxShadow: 3,
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.05)' }             // Hover effect
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',                             // Center align text
              justifyContent: 'center',
              p: { xs: 3, md: 3 }
            }}
          >
            <Typography color="#2c3e50" variant="h3" sx={{
              fontWeight: 'bold', mb: 1,
              fontFamily: "Open Sans, Roboto, Oxygen, Ubuntu, Cantarell, Lato, Helvetica Neue, sans-serif",
              fontSize: { xs: '28px', sm: '32px', md: '36px' },  // Responsive font size
            }}>
              Total Candidates
            </Typography>
            <Typography variant="h3" color="secondary">
              {totalCandidates}
            </Typography>
          </CardContent>
        </Card>
      </Box>



      {/* new department card */}

      <Typography
        variant="h3"
        color="#2c3e50"
        sx={{
          fontFamily: "Open Sans, Roboto, Oxygen, Ubuntu, Cantarell, Lato, Helvetica Neue, sans-serif",
          fontWeight: 'bold',
          mb: 4,
          fontSize: { xs: '28px', sm: '32px', md: '36px' },  // Responsive font size
          textAlign: { xs: 'center', md: 'left' }             // Centered on mobile, left on desktop
        }}
      >
        Departments
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 2,
          mb: 3
        }}
      >


        {Object.entries(departmentCounts).map(([dept, count]) => {
          const formattedDept = dept.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

          // Map image dynamically, fallback to a default image if not found
          const imageSrc = departmentImages[dept.toUpperCase()] || '/assets/default.jpg';


          return (
            <Card
            onClick={() => navigate(`/dashboard/manage-candidate/${formattedDept.toLowerCase()}`)}
              key={dept}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' },
                height: '100%',
                boxShadow: 3,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' }  // Subtle hover effect
              }}
            >
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="h3" variant="h5" sx={{ fontWeight: 'bold' }}>
                  {formattedDept.toUpperCase()}
                </Typography>
                <Typography variant="h6" color="secondary">
                  {count}
                </Typography>
              </CardContent>
              <CardMedia
                component="img"
                sx={{ width: { xs: '100%', sm: 151 }, height: { xs: 200, sm: 'auto' }, objectFit: 'cover' }}
                image={imageSrc}
                alt={`${formattedDept} Image`}
              />
            </Card>
          );
        })}
      </Box>


      {/* New Academic Year Card */}

      <Typography
        variant="h3"
        color="#2c3e50"
        sx={{
          fontFamily: "Open Sans, Roboto, Oxygen, Ubuntu, Cantarell, Lato, Helvetica Neue, sans-serif",
          fontWeight: 'bold',
          mb: 2,
          fontSize: { xs: '28px', sm: '32px', md: '36px' },     // Responsive font size
          textAlign: { xs: 'center', md: 'left' }               // Centered on mobile, left on desktop
        }}
      >
        Academic Years
      </Typography>

      {/* Academic Year Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3,
          p: 3
        }}
      >
        {Object.entries(academicYearCounts).map(([year, count]) => (
          <Card
          onClick={() => navigate(`/dashboard/manage-candidate/${year}`)}
            key={year}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: { xs: 'auto', md: '120px' },                // Same height as department cards
              boxShadow: 3,
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.05)' }             // Hover effect
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 2, md: 3 }
              }}
            >
              <Typography
                component="h3"
                variant="h5"
                sx={{ fontWeight: 'bold', mb: 1 }}
              >
                {year}
              </Typography>
              <Typography variant="h6" color="secondary">
                {count}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>


        {/* List for candidates table */}
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

        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "20px" }}>
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
