import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  Paper,
  Divider,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CaptchaCanvas from "../components/CaptchaCanvas";
import Spiner from "../components/Spiner";

/* ---------------- CAPTCHA ---------------- */
const generateCaptcha = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 6 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};

const StudentSearch = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /* ---------------- SEARCH HANDLER ---------------- */
  const handleSearch = async (data) => {
    if (data.captchaInput !== captcha) {
      toast.error("Invalid captcha");
      return;
    }

    setLoading(true);
    setStudentData(null);

    try {
      const q = query(
        collection(db, "candidateData"),
        where("registerNo", "==", data.registerNo.trim())
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        snapshot.forEach((doc) => setStudentData(doc.data()));
        setSearchComplete(true);
        toast.success("Verification successful");
      } else {
        toast.error("Candidate not found");
      }
    } catch (err) {
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
    <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
      {/* ---------------- HEADER ---------------- */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography sx={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a" }}>
          IIFM Global Verification
        </Typography>
        <Typography sx={{ mt: 1, color: "#64748b", fontSize: "0.95rem" }}>
          Official verification of certificates issued by IIFM Academy
        </Typography>
      </Box>

      {/* ---------------- SEARCH FORM ---------------- */}
      {!searchComplete ? (
        <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid #e2e8f0" }}>
          <Typography sx={{ fontWeight: 600, mb: 2 }}>
            Candidate Verification
          </Typography>

          <form onSubmit={handleSubmit(handleSearch)}>
            <TextField
              label="Register Number"
              fullWidth
              sx={{ mb: 2 }}
              {...register("registerNo", {
                required: "Register number is required",
                pattern: { value: /^[0-9]+$/, message: "Only numbers allowed" },
              })}
              error={Boolean(errors.registerNo)}
              helperText={errors.registerNo?.message}
            />

            {/* CAPTCHA */}
            {/* <Box sx={{ mb: 2 }}>
              <CaptchaCanvas text={captcha} />
              <Button
                variant="outlined"
                onClick={() => setCaptcha(generateCaptcha())}
                sx={{ mt: 1 }}
              >
                <RefreshIcon fontSize="small" /> Refresh
              </Button>
            </Box> */}

            <Box
              sx={{
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <CaptchaCanvas text={captcha} />
                </Box>

                <Button
                  variant="outlined"
                  onClick={() => setCaptcha(generateCaptcha())}
                  sx={{
                    height: 46,
                    px: 1.5,
                    textTransform: "none",
                    display: "flex",
                    gap: 0.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  <RefreshIcon fontSize="small" />
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    Refresh
                  </Box>
                </Button>
              </Box>
            </Box>

            <TextField
              label="Enter Captcha"
              fullWidth
              sx={{ mb: 3 }}
              {...register("captchaInput", { required: "Captcha is required" })}
              error={Boolean(errors.captchaInput)}
              helperText={errors.captchaInput?.message}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ height: 48 }}
            >
              {loading ? "Verifying..." : "Verify Candidate"}
            </Button>
          </form>
        </Paper>
      ) : (
        /* ---------------- RESULT VIEW (PROTECTED) ---------------- */
        <Box
          onContextMenu={(e) => e.preventDefault()}
          sx={{
            userSelect: "none",
            WebkitUserSelect: "none",
            WebkitUserDrag: "none",
          }}
        >
          <Paper
            sx={{
              p: 2,
              mb: 3,
              borderLeft: "4px solid #16a34a",
              backgroundColor: "#f0fdf4",
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              Verification Successful
            </Typography>
            <Typography sx={{ fontSize: "0.9rem" }}>
              This record is valid and issued by IIFM Academy.
            </Typography>
          </Paper>

          <Button variant="outlined" onClick={handleRescan} sx={{ mb: 3 }}>
            Verify Another Candidate
          </Button>

          {/* DOCUMENTS */}
          {studentData?.markSheet && (
            <Card sx={{ mb: 3 }}>
              <Typography sx={{ p: 1 }}>Marksheet</Typography>
              <Divider />
              <CardMedia
                component="img"
                image={studentData.markSheet}
                draggable={false}
              />
            </Card>
          )}

          {studentData?.certificate && (
            <Card sx={{ mb: 3 }}>
              <Typography sx={{ p: 1 }}>Certificate</Typography>
              <Divider />
              <CardMedia
                component="img"
                image={studentData.certificate}
                draggable={false}
              />
            </Card>
          )}

          {(studentData?.idCardFront || studentData?.idCardBack) && (
            <Box sx={{ display: "flex", gap: 2 }}>
              {studentData?.idCardFront && (
                <Card sx={{ flex: 1 }}>
                  <Typography sx={{ p: 1 }}>ID Card Front</Typography>
                  <Divider />
                  <CardMedia
                    component="img"
                    image={studentData.idCardFront}
                    draggable={false}
                  />
                </Card>
              )}

              {studentData?.idCardBack && (
                <Card sx={{ flex: 1 }}>
                  <Typography sx={{ p: 1 }}>ID Card Back</Typography>
                  <Divider />
                  <CardMedia
                    component="img"
                    image={studentData.idCardBack}
                    draggable={false}
                  />
                </Card>
              )}
            </Box>
          )}

        </Box>
      )}

      {loading && <Spiner />}
    </Container>
  );
};

export default StudentSearch;
