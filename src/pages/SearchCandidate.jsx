import React, { useState } from "react";
import {
  TextField,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Container,
  TableContainer,
} from "@mui/material";
import {
  collection,
  getDocs,
  query,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { toast } from "react-toastify";
import CandidateActions from "../components/CandiateAction";

// ✅ Helper for validating names
const validateName = (name) => {
  const trimmed = name.trim().replace(/\s+/g, " "); // remove extra spaces
  const pattern = /^[A-Za-z\s]+$/; // only letters & spaces

  if (trimmed.length < 2) {
    toast.error("Name must have at least 2 characters.");
    return null;
  }
  if (!pattern.test(trimmed)) {
    toast.error("Name can only contain letters and spaces.");
    return null;
  }
  return trimmed.toLowerCase();
};

const CandidateSearch = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!search) {
      toast.error("Please enter a name or register number.");
      return;
    }

    setLoading(true);
    try {
      let constraints = [];
      let searchLower = search.toLowerCase();

      if (/^\d+$/.test(search)) {
        // Searching by register number
        constraints.push(orderBy("registerNo"));
        constraints.push(startAt(search));
        constraints.push(endAt(search + "\uf8ff"));
      } else {
        // Validate name before search
        const cleanName = validateName(search);
        if (!cleanName) {
          setLoading(false);
          return;
        }
        searchLower = cleanName;
        constraints.push(orderBy("name"));
        constraints.push(startAt(searchLower));
        constraints.push(endAt(searchLower + "\uf8ff"));
      }

      const q = query(collection(db, "candidateData"), ...constraints);
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setResults([]);
        toast.error("No results found.");
      } else {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResults(data);
        toast.success(`Found ${data.length} candidate(s).`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Something went wrong while searching.");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h3"
        color="#2c3e50"
        sx={{
          fontFamily:
            "Open Sans, Roboto, Oxygen, Ubuntu, Cantarell, Lato, Helvetica Neue, sans-serif",
          fontWeight: "bold",
          mb: 4,
          mt: 4,
          fontSize: { xs: "28px", sm: "32px", md: "36px" },
          textAlign: "center",
        }}
      >
        Search Candidates
      </Typography>
      <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 4 }}>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={8} md={10}>
            <TextField
              fullWidth
              label="Search by Name or Register No"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              size="small"
              sx={{ height: "100%" }}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </Grid>
        </Grid>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Register No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.length > 0 ? (
                results.map((c, index) => (
                  <TableRow key={c.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{c.registerNo}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.department}</TableCell>
                    <TableCell>{c.academicYear}</TableCell>
                    <TableCell>
                      {c.createdAt
                        ? c.createdAt.toDate().toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <CandidateActions candidateId={c?.id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default CandidateSearch;
