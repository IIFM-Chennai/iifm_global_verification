// import React, { useState, useRef } from "react";
// import { TextField, Button, Container, Typography, Box, Card, CardMedia, Paper } from "@mui/material";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../config/firebaseConfig";
// import ReCAPTCHA from "react-google-recaptcha";
// import Spiner from "../components/Spiner";
// import { toast } from "react-toastify";

// const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// const StudentSearch = () => {
//   const [registerNo, setRegisterNo] = useState("");
//   const [studentData, setStudentData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const [searchComplete, setSearchComplete] = useState(false);

//   const recaptchaRef = useRef(null);

//   const handleCaptchaVerify = (token) => {
//     if (token) {
//       setIsVerified(true);
//       toast.success("reCAPTCHA verified successfully!");
//     }
//   };

//   const resetCaptcha = () => {
//     if (recaptchaRef.current) {
//       recaptchaRef.current.reset();
//     }
//     setIsVerified(false);
//   };

//   const handleSearch = async () => {
//     if (!registerNo.trim()) {
//       toast.error("Please enter a Register Number!");
//       return;
//     }
//     if (!isVerified) {
//       toast.error("Please verify reCAPTCHA before searching!");
//       return;
//     }

//     setIsVerified(false);
//     setError(null);
//     setStudentData(null);
//     setLoading(true);

//     try {
//       const q = query(collection(db, "candidateData"), where("registerNo", "==", registerNo));
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         querySnapshot.forEach((doc) => {
//           setStudentData(doc.data());
//         });
//         toast.success("Candidate found successfully!");
//         setSearchComplete(true); // Hide form after successful search
//       } else {
//         setError("Candidate not found!");
//         toast.error("Candidate not found");
//       }
//     } catch (err) {
//       setError("Error fetching data");
//       toast.error("Error fetching data");
//     } finally {
//       setLoading(false);
//       resetCaptcha();
//       setRegisterNo("");
//     }
//   };

//   const handleRescan = () => {
//     setSearchComplete(false);
//     setStudentData(null);
//     setRegisterNo("");
//     resetCaptcha();
//   };

//   return (
//     <Container maxWidth="md" sx={{ mt: 5 }}>
//       <Typography
//         variant="h1"
//         mb={3}
//         align="center"
//         color="#2c3e50"
//         sx={{
//           fontWeight: 700,
//           fontSize: {
//             xs: "2rem",   // mobile
//             sm: "3rem",   // small devices
//             md: "4rem",   // tablets and up
//             lg: "5rem",   // large screens
//           },
//         }}
//       >
//         IIFM Global Verification
//       </Typography>


//       {!searchComplete ? (
//         <Paper elevation={3} sx={{ p: 3, backgroundColor: "#fff" }}>
//           <Typography variant="h6" sx={{ mb: 2 }}>Search Candidate</Typography>

//           {/* Input Field */}
//           <TextField
//             label="Enter Register No"
//             variant="outlined"
//             name="search"
//             fullWidth
//             value={registerNo}
//             onChange={(e) => setRegisterNo(e.target.value)}
//             sx={{ mb: 2 }}
//             error={Boolean(error)}
//           />

//           {/* reCAPTCHA */}
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "left",
//               transform: { xs: "scale(0.85)", sm: "scale(1)" },
//               transformOrigin: "left",
//               mb: 2,
//             }}
//           >

//             <ReCAPTCHA
//               sitekey={siteKey}
//               onChange={handleCaptchaVerify}
//               ref={recaptchaRef}
//               aria-label="reCAPTCHA Verification"
//             />
//           </Box>

//           {/* Search Button */}
//           <Button
//             variant="contained"
//             sx={{
//               backgroundColor: "#4460aa",
//               width: "100%",
//               opacity: loading || !isVerified ? 0.5 : 1, // Visual cue
//               cursor: loading || !isVerified ? "not-allowed" : "pointer"
//             }}
//             onClick={handleSearch}
//             disabled={loading || !isVerified}
//           >
//             {loading ? "Searching..." : "Search"}
//           </Button>
//         </Paper>
//       ) : (

//         <Box sx={{ mt: 4 }}>

//           {/* Rescan Button */}
//           <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>

//             <Button
//               variant="contained"
//               sx={{
//                 backgroundColor: "#4460aa",
//                 "&:hover": { backgroundColor: "#36508a" }, // Darker on hover
//                 "&:active": { backgroundColor: "#2c4378" } // No blue tint on click
//               }}
//               onClick={handleRescan}
//             >
//               Research
//             </Button>
//           </Box>


//           {/* Marksheet */}
//           <Card sx={{ mb: 3 }}>
//             <CardMedia
//               component="img"
//               image={studentData?.markSheet}
//               alt="Marksheet"
//               sx={{ pointerEvents: "none", userSelect: "none" }}
//             />
//           </Card>

//           {/* ID Cards */}
//           <Box sx={{
//             display: "flex",
//             flexDirection: { xs: "column", sm: "row" }, // Stack on mobile
//             justifyContent: "space-between",
//             gap: 2
//           }}>
//             <Card sx={{ flex: 1 }}>
//               <CardMedia
//                 component="img"
//                 image={studentData?.idCardFront}
//                 alt="ID Card Front"
//                 sx={{ pointerEvents: "none", userSelect: "none" }}
//               />
//             </Card>

//             <Card sx={{ flex: 1 }}>
//               <CardMedia
//                 component="img"
//                 image={studentData?.idCardBack}
//                 alt="ID Card Back"
//                 sx={{ pointerEvents: "none", userSelect: "none" }}
//               />
//             </Card>
//           </Box>


//         </Box>
//       )}

//       {loading && <Spiner />}
//       {error && <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>{error}</Typography>}
//     </Container>
//   );
// };

// export default StudentSearch;

import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  Paper
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import Spiner from "../components/Spiner";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import CaptchaCanvas from "../components/CaptchaCanvas";

const generateCaptcha = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const StudentSearch = () => {
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);

  const [captcha, setCaptcha] = useState(generateCaptcha());

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  const handleSearch = async (data) => {
    if (data.captchaInput !== captcha) {
      toast.error("Invalid CAPTCHA!");
      return;
    }

    setError(null);
    setStudentData(null);
    setLoading(true);

    try {
      const q = query(
        collection(db, "candidateData"),
        where("registerNo", "==", data.registerNo.trim())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setStudentData(doc.data());
        });
        toast.success("Candidate found successfully!");
        setSearchComplete(true);
      } else {
        setError("Candidate not found!");
        toast.error("Candidate not found");
      }
    } catch (err) {
      setError("Error fetching data");
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
      reset({ registerNo: "", captchaInput: "" });
      setCaptcha(generateCaptcha());
    }
  };

  const handleRescan = () => {
    setSearchComplete(false);
    setStudentData(null);
    reset({ registerNo: "", captchaInput: "" });
    setCaptcha(generateCaptcha());
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography
        variant="h1"
        mb={3}
        align="center"
        color="#2c3e50"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "2rem", sm: "3rem", md: "4rem", lg: "5rem" },
        }}
      >
        IIFM Global Verification
      </Typography>

      {!searchComplete ? (
        <Paper elevation={3} sx={{ p: 3, backgroundColor: "#fff" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Search Candidate</Typography>

          <form onSubmit={handleSubmit(handleSearch)}>
            {/* Register No */}
            <TextField
              label="Enter Register No"
              variant="outlined"
              fullWidth
              {...register("registerNo", {
                required: "Register number is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Only numbers are allowed"
                }
              })}
              sx={{ mb: 2 }}
              error={Boolean(errors.registerNo)}
              helperText={errors.registerNo?.message}
            />

            {/* Captcha Display */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
             <CaptchaCanvas text={captcha} />

              <Button
                variant="outlined"
                onClick={() => setCaptcha(generateCaptcha())}
              >
                Refresh
              </Button>
            </Box>

            {/* Captcha Input */}
            <TextField
              label="Enter Captcha"
              variant="outlined"
              fullWidth
              {...register("captchaInput", { required: "Captcha is required" })}
              sx={{ mb: 2 }}
              error={Boolean(errors.captchaInput)}
              helperText={errors.captchaInput?.message}
            />

            {/* Search Button */}
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#4460aa",
                width: "100%",
                opacity: loading ? 0.5 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>
        </Paper>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#4460aa",
                "&:hover": { backgroundColor: "#36508a" },
                "&:active": { backgroundColor: "#2c4378" }
              }}
              onClick={handleRescan}
            >
              Research
            </Button>
          </Box>

          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              image={studentData?.markSheet}
              alt="Marksheet"
              sx={{ pointerEvents: "none", userSelect: "none" }}
            />
          </Card>

          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: 2
          }}>
            <Card sx={{ flex: 1 }}>
              <CardMedia
                component="img"
                image={studentData?.idCardFront}
                alt="ID Card Front"
                sx={{ pointerEvents: "none", userSelect: "none" }}
              />
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardMedia
                component="img"
                image={studentData?.idCardBack}
                alt="ID Card Back"
                sx={{ pointerEvents: "none", userSelect: "none" }}
              />
            </Card>
          </Box>
        </Box>
      )}

      {loading && <Spiner />}
      {error && <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>{error}</Typography>}
    </Container>
  );
};

export default StudentSearch;
