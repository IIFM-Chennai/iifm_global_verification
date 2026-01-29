import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCandidate } from "../features/adminSlice";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const departments = [
  "HVAC",
  "IBMS",
  "MEP",
  "POWER PLANT",
  "WTP",
  "SAFETY",
  "LSCM",
  "WELDER",
  "CFM",
];

const academicYears = [
  "2011-2012",
  "2012-2013",
  "2013-2014",
  "2014-2015",
  "2015-2016",
  "2016-2017",
  "2017-2018",
  "2018-2019",
  "2019-2020",
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
];

const AddCandidate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addCandidateLoading } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    registerNo: "",
    name: "",
    department: "",
    academicYear: "",
    markSheet: null,
    certificate: null,
    idCardFront: null,
    idCardBack: null,
  });

  const [preview, setPreview] = useState({
    markSheet: "",
    certificate: "",
    idCardFront: "",
    idCardBack: "",
  });

  const [uploadProgress, setUploadProgress] = useState({
    markSheet: 0,
    certificate: 0,
    idCardFront: 0,
    idCardBack: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      setPreview({ ...preview, [name]: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic required fields
    if (!formData.registerNo || !formData.name || !formData.department || !formData.academicYear) {
      toast.error("Register No, Name, Department, and Academic Year are required");
      return;
    }

    // Must have at least one document
    if (!formData.markSheet && !formData.certificate && !formData.idCardFront && !formData.idCardBack) {
      toast.error("Please upload at least one document (Marksheet, Certificate, or ID Card)");
      return;
    }

    dispatch(addCandidate({ ...formData, setUploadProgress })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setFormData({
          registerNo: "",
          name: "",
          department: "",
          academicYear: "",
          markSheet: null,
          certificate: null,
          idCardFront: null,
          idCardBack: null,
        });
        setPreview({ markSheet: "", certificate: "", idCardFront: "", idCardBack: "" });
        setUploadProgress({ markSheet: 0, certificate: 0, idCardFront: 0, idCardBack: 0 });
        navigate("/dashboard");
      }
    });
  };

  return (
    <Box p={3} maxWidth={500} mx="auto">
      <Typography variant="h4" textAlign="center" gutterBottom>
        Add Candidate
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Register No"
          name="registerNo"
          value={formData.registerNo}
          onChange={handleChange}
          margin="normal"
          required
          disabled={addCandidateLoading}
        />
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
          disabled={addCandidateLoading}
        />
        <TextField
          select
          fullWidth
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          margin="normal"
          required
          disabled={addCandidateLoading}
        >
          {departments.map((dept) => (
            <MenuItem key={dept} value={dept}>
              {dept}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          sx={{ marginBottom: 3 }}
          fullWidth
          label="Academic Year"
          name="academicYear"
          value={formData.academicYear}
          onChange={handleChange}
          margin="normal"
          required
          disabled={addCandidateLoading}
        >
          {academicYears.map((years) => (
            <MenuItem key={years} value={years}>
              {years}
            </MenuItem>
          ))}
        </TextField>

        {/* Upload Fields */}
        {Object.entries({
          markSheet: "Marksheet",
          certificate: "Certificate",
          idCardFront: "ID Card Front",
          idCardBack: "ID Card Back",
        }).map(([key, label]) => (
          <div key={key} style={{ marginBottom: "15px" }}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              disabled={addCandidateLoading}
            >
              Upload {label}
              <input
                type="file"
                hidden
                name={key}
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
              />
            </Button>
            {preview[key] && (
              <img
                src={preview[key]}
                alt={label}
                style={{ width: "100px", marginTop: "10px" }}
              />
            )}
            {uploadProgress[key] > 0 && (
              <LinearProgress
                variant="determinate"
                color="success"
                value={uploadProgress[key]}
                sx={{ mt: 1 }}
              />
            )}
          </div>
        ))}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={addCandidateLoading}
        >
          {addCandidateLoading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </form>
    </Box>
  );
};

export default AddCandidate;
