import React, { useEffect, useState } from "react";
import {
    Container,
    Paper,
    Grid,
    MenuItem,
    TextField,
    Typography,
    Button,
    Box,
    LinearProgress,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";

import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, increment , setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

import {
    uploadImageToFirebase,
    deleteImageFromStorage,
} from "../utils/firebassImages";

import { toast } from "react-toastify";

export const updateCandidateCountsOnEdit = async (
  oldDepartment,
  oldAcademicYear,
  newDepartment,
  newAcademicYear
) => {

  const countDocRef = doc(db, "CandidateTotalCount", "countsSummary");

  const updates = {};

  // Department changed
  if (oldDepartment && newDepartment && oldDepartment !== newDepartment) {
    updates[`departmentCounts.${oldDepartment}`] = increment(-1);
    updates[`departmentCounts.${newDepartment}`] = increment(1);
  }

  // Academic year changed
  if (oldAcademicYear && newAcademicYear && oldAcademicYear !== newAcademicYear) {
    updates[`academicYearCounts.${oldAcademicYear}`] = increment(-1);
    updates[`academicYearCounts.${newAcademicYear}`] = increment(1);
  }

  if (Object.keys(updates).length === 0) return;

  try {

    await updateDoc(countDocRef, updates);

  } catch (error) {

    console.error("Error updating counts:", error);
    throw error;

  }

};
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

const documentTypes = [
    { key: "markSheet", label: "Mark Sheet" },
    { key: "certificate", label: "Certificate" },
    { key: "idCardFront", label: "ID Card Front" },
    { key: "idCardBack", label: "ID Card Back" },
];

const EditCandidatePage = () => {
    const { candidateId } = useParams();

    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        department: "",
        academicYear: "",
    });

    const [files, setFiles] = useState({});
    const [filePreview, setFilePreview] = useState({});
    const [uploadProgress, setUploadProgress] = useState({});

    const [previewUrl, setPreviewUrl] = useState(null);

    const candidateRef = doc(db, "candidatesDiplomaData", candidateId);

    useEffect(() => {
        fetchCandidate();
    }, []);

    const fetchCandidate = async () => {
        try {
            const snap = await getDoc(candidateRef);

            if (!snap.exists()) {
                toast.error("Candidate not found");
                return;
            }

            const data = snap.data();

            setCandidate(data);

            setFormData({
                name: data.name || "",
                department: data.department || "",
                academicYear: data.academicYear || "",
            });
        } catch (error) {
            toast.error("Failed to load candidate");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (type, file) => {
        if (!file) return;

        setFiles((prev) => ({
            ...prev,
            [type]: file,
        }));

        const preview = URL.createObjectURL(file);

        setFilePreview((prev) => ({
            ...prev,
            [type]: preview,
        }));
    };

    const removeSelectedFile = (type) => {
        setFiles((prev) => ({
            ...prev,
            [type]: null,
        }));

        setFilePreview((prev) => ({
            ...prev,
            [type]: null,
        }));
    };

    const handleDeleteDoc = async (type) => {
        try {
            const url = candidate[type];

            if (!url) return;

            await deleteImageFromStorage(url);

            await updateDoc(candidateRef, {
                [type]: null,
            });

            setCandidate((prev) => ({
                ...prev,
                [type]: null,
            }));

            toast.success(`${type} deleted`);
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleSave = async () => {
        try {
            const updatedData = { ...formData };

            for (const docType of documentTypes) {
                const type = docType.key;

                if (files[type]) {
                    const url = await uploadImageToFirebase(
                        files[type],
                        type,
                        candidate.registerNo,
                        setUploadProgress
                    );

                    updatedData[type] = url;

                    setUploadProgress((prev) => ({
                        ...prev,
                        [type]: 0,
                    }));
                }
            }

            await updateDoc(candidateRef, updatedData);

            await updateCandidateCountsOnEdit(
                candidate.department,
                candidate.academicYear,
                formData.department,
                formData.academicYear
            );

            toast.success("Candidate updated successfully");

            setFiles({});
            setFilePreview({});
            fetchCandidate();
        } catch (error) {
            toast.error("Update failed");
            console.error("Error updating candidate:", error);
        }
    };

    if (loading) {
        return (
            <Container>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                    Edit Candidate
                </Typography>

                {/* Candidate Fields */}

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Register Number"
                            value={candidate.registerNo}
                            fullWidth
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Candidate Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            select
                            fullWidth
                            label="Department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            margin="normal"
                        >
                            {departments.map((dept) => (
                                <MenuItem key={dept} value={dept}>
                                    {dept}
                                </MenuItem>
                            ))}
                        </TextField>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            select
                            fullWidth
                            label="Academic Year"
                            name="academicYear"
                            value={formData.academicYear}
                            onChange={handleInputChange}
                            margin="normal"
                        >
                            {academicYears.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </TextField>

                    </Grid>
                </Grid>

                {/* Documents Section */}

                <Typography variant="h6" mt={5} mb={3}>
                    Candidate Documents
                </Typography>

                <Grid container spacing={3}>
                    {documentTypes.map((docType) => {
                        const url = candidate[docType.key];
                        const preview = filePreview[docType.key];

                        return (
                            <Grid item xs={12} md={6} key={docType.key}>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        minHeight: 160,
                                    }}
                                >
                                    <Typography fontWeight="bold" mb={2}>
                                        {docType.label}
                                    </Typography>

                                    {/* Existing Image */}

                                    {url && !preview && (
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <img
                                                src={url}
                                                alt=""
                                                style={{
                                                    width: 70,
                                                    height: 70,
                                                    objectFit: "cover",
                                                    borderRadius: 6,
                                                }}
                                            />

                                            <Stack direction="row">
                                                <IconButton onClick={() => setPreviewUrl(url)}>
                                                    <VisibilityIcon />
                                                </IconButton>

                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDeleteDoc(docType.key)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                    )}

                                    {/* Upload Button */}

                                    {!url && !preview && (
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            startIcon={<UploadIcon />}
                                            fullWidth
                                        >
                                            Upload Document

                                            <input
                                                hidden
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileChange(docType.key, e.target.files[0])
                                                }
                                            />
                                        </Button>
                                    )}

                                    {/* Selected Image Preview */}

                                    {preview && (
                                        <Box>
                                            <img
                                                src={preview}
                                                alt=""
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    objectFit: "cover",
                                                    borderRadius: 6,
                                                }}
                                            />

                                            <Stack direction="row" spacing={1} mt={1}>
                                                <Button
                                                    size="small"
                                                    onClick={() => setPreviewUrl(preview)}
                                                >
                                                    Preview
                                                </Button>

                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => removeSelectedFile(docType.key)}
                                                >
                                                    Remove
                                                </Button>
                                            </Stack>
                                        </Box>
                                    )}

                                    {/* Progress */}

                                    {uploadProgress[docType.key] > 0 && (
                                        <Box mt={2}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={uploadProgress[docType.key]}
                                            />
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Save Button */}

                <Box mt={5} display="flex" justifyContent="flex-end">
                    <Button variant="contained" size="large" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Box>
            </Paper>

            {/* Preview Modal */}

            <Dialog
                open={Boolean(previewUrl)}
                onClose={() => setPreviewUrl(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Document Preview</DialogTitle>

                <DialogContent>
                    <img src={previewUrl} alt="" style={{ width: "100%" }} />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setPreviewUrl(null)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EditCandidatePage;