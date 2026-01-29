
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { 
  Box, Typography, Card, CardContent, CircularProgress, 
  Paper, Divider 
} from "@mui/material";

const CandidateDetails = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const docRef = doc(db, "candidateData", candidateId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCandidate(docSnap.data());
        } else {
          setCandidate(null);
        }
      } catch (error) {
        console.error("Error fetching candidate details:", error);
      }
      setLoading(false);
    };
    fetchCandidateDetails();
  }, [candidateId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!candidate) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h5" color="error">Candidate Not Found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      {/* Candidate Details Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" textAlign={"center"} gutterBottom color="primary">
            Candidate Details
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6"><strong>Name:</strong> {candidate.name}</Typography>
          <Typography variant="h6"><strong>Register No:</strong> {candidate.registerNo}</Typography>
          <Typography variant="h6"><strong>Department:</strong> {candidate.department}</Typography>
          <Typography variant="h6"><strong>Academic Year:</strong> {candidate.academicYear}</Typography>
          {candidate.createdAt?.seconds && (
            <Typography variant="h6">
              <strong>Created At:</strong>{" "}
              {new Date(candidate.createdAt.seconds * 1000).toLocaleString()}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Marksheet Section (only if available) */}
      {candidate.markSheet && (
        <Paper sx={{ p: 3, mb: 3, textAlign: "center" }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Marksheet
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img 
              src={candidate.markSheet} 
              loading="lazy" 
              alt="Marksheet" 
              style={{ maxWidth: "100%", height: "auto", borderRadius: 10 }} 
            />
          </Box>
        </Paper>
      )}

      {/* Certificate Section (only if available) */}
      {candidate.certificate && (
        <Paper sx={{ p: 3, mb: 3, textAlign: "center" }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Certificate
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img 
              src={candidate.certificate} 
              loading="lazy" 
              alt="Certificate" 
              style={{ maxWidth: "100%", height: "auto", borderRadius: 10 }} 
            />
          </Box>
        </Paper>
      )}

      {/* ID Card Section (only if at least one side exists) */}
      {(candidate.idCardFront || candidate.idCardBack) && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            ID Card
          </Typography>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, justifyContent: "center" }}>
            {candidate.idCardFront && (
              <Box sx={{ flex: 1, textAlign: "center" }}>
                <Typography variant="h6">Front</Typography>
                <img 
                  src={candidate.idCardFront} 
                  loading="lazy" 
                  alt="ID Card Front" 
                  style={{ width: "100%", maxWidth: "250px", borderRadius: 10 }} 
                />
              </Box>
            )}
            {candidate.idCardBack && (
              <Box sx={{ flex: 1, textAlign: "center" }}>
                <Typography variant="h6">Back</Typography>
                <img 
                  src={candidate.idCardBack} 
                  loading="lazy"  
                  alt="ID Card Back" 
                  style={{ width: "100%", maxWidth: "250px", borderRadius: 10 }} 
                />
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default CandidateDetails;
