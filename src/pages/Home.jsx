import React, { useState, useRef } from "react";
import { TextField, Button, Container, Typography, Box, Card, CardMedia, Paper } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import ReCAPTCHA from "react-google-recaptcha";
import Spiner from "../components/Spiner";
import { toast } from "react-toastify";

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

const StudentSearch = () => {
  const [registerNo, setRegisterNo] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const recaptchaRef = useRef(null);

  // Handle Google reCAPTCHA verification
  const handleCaptchaVerify = (token) => {
    if (token) {
      setIsVerified(true);
      toast.success("reCAPTCHA verified successfully! ✅");
    }
  };

  // Reset reCAPTCHA after every search
  const resetCaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset(); // Resets reCAPTCHA
    }
    setIsVerified(false);
  };

  const handleSearch = async () => {
    if (!registerNo.trim()) {
      toast.error("Please enter a Register Number!");
      return;
    }
    if (!isVerified) {
      toast.error("Please verify reCAPTCHA before searching!");
      return;
    }

    // Disable the search button immediately after searching
    setIsVerified(false);

    setError(null);
    setStudentData(null);
    setLoading(true);

    try {
      const q = query(collection(db, "candidateData"), where("registerNo", "==", registerNo));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setStudentData(doc.data());
        });
        toast.success("Candidate found successfully!");
      } else {
        setError("Candidate not found!");
        toast.error("Candidate not found ❌");
      }
    } catch (err) {
      setError("Error fetching data");
      toast.error("Error fetching data ⚠️");
    } finally {
      setLoading(false);
      resetCaptcha(); // Reset reCAPTCHA after search
      setRegisterNo("");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" mb={3} gutterBottom align="center" color="#2c3e50" sx={{ fontFamily: "Open Sans, Roboto, Oxygen, Ubuntu, Cantarell, Lato, Helvetica Neue, sans-serif", fontSize : "32px", fontWeight : "700" }}>
        Global Verification
      </Typography>

      {/* reCAPTCHA Verification */}
      <Paper elevation={3} sx={{
        p: 2,
        mb: 4,
        backgroundColor: "#f8f9fa",
        display: "inline-block", // Fit content width
        mx: "auto", // Center horizontally
        textAlign: "center",
      }}>
        <ReCAPTCHA
          sitekey={siteKey}
          onChange={handleCaptchaVerify}
          ref={recaptchaRef}
        />
      </Paper>

      {/* Search Form */}
      <Paper elevation={3} sx={{ p: 3, backgroundColor: "#fff" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Search Candidate</Typography>
        <TextField
          label="Enter Register No"
          variant="outlined"
          fullWidth
          value={registerNo}
          onChange={(e) => setRegisterNo(e.target.value)}
          sx={{ mb: 2 }}
          error={Boolean(error)}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#4460aa", width: "100%" }}
          onClick={handleSearch}
          disabled={loading || !isVerified}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </Paper>

      {loading && <Spiner />}
      {error && <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>{error}</Typography>}

      {studentData && !loading && (
        <Box sx={{ mt: 4 }}>
          {/* Marksheet */}
          <Card sx={{ mb: 3, position: "relative" }}>
            <CardMedia
              loading="lazy"
              component="img"
              image={studentData.markSheet}
              alt="Marksheet"
              sx={{ pointerEvents: "none", userSelect: "none" }}
            />
          </Card>

          {/* ID Cards */}
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Card sx={{ flex: 1, position: "relative" }}>
              <CardMedia
                loading="lazy"
                component="img"
                image={studentData.idCardFront}
                alt="ID Card Front"
                sx={{ pointerEvents: "none", userSelect: "none" }}
              />
            </Card>

            <Card sx={{ flex: 1, position: "relative" }}>
              <CardMedia
                loading="lazy"
                component="img"
                image={studentData.idCardBack}
                alt="ID Card Back"
                sx={{ pointerEvents: "none", userSelect: "none" }}
              />
            </Card>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default StudentSearch;
