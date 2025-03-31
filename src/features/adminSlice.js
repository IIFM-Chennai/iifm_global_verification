import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, Timestamp, getDocs, getDoc, doc, where, addDoc, serverTimestamp, deleteDoc, query, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { toast } from "react-toastify";
import { uploadImageToFirebase, deleteImageFromStorage } from "../utils/firebassImages";



// Pre-defined list of academic years (update based on your needs)
const predefinedAcademicYears = [
  "2017-2018",
  "2018-2019",
  "2019-2020",
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026"
];


export const fetchCandidateCount = createAsyncThunk(
  "admin/fetchCandidateCount",
  async (_, { rejectWithValue }) => {
    try {
      const q = collection(db, "candidateData");
      const querySnapshot = await getDocs(q);

      let total = 0;

      // Initialize department and academic year counts with 0
      let departmentCounts = {
        HVAC: 0,
        IBMS: 0,
        MEP: 0,
        POWER_PLANT: 0,
        WTP: 0,
        SAFETY: 0,
      };

      let academicYearCounts = predefinedAcademicYears.reduce((acc, year) => {
        acc[year] = 0;
        return acc;
      }, {});

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total++;

        // Normalize department names
        const normalizedDepartment = data.department?.toUpperCase().replace(/\s+/g, "_");
        if (departmentCounts[normalizedDepartment] !== undefined) {
          departmentCounts[normalizedDepartment]++;
        }

        // Academic Year count
        if (data.academicYear) {
          const year = data.academicYear;

          // Increment the count if the year exists in Firestore
          if (academicYearCounts[year] !== undefined) {
            academicYearCounts[year]++;
          }
        }
      });

      return { total, departmentCounts, academicYearCounts };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchCandidates = createAsyncThunk(
  "admin/fetchCandidates",
  async ({ page, pageSize }, { getState }) => {
    const candidateCollection = collection(db, "candidateData");
    let candidatesQuery = query(candidateCollection, orderBy("createdAt", "desc"), limit(pageSize));

    const { lastVisibleDoc } = getState().admin;

    if (page > 1 && lastVisibleDoc) {
      // Convert stored seconds back to Firestore Timestamp
      const lastTimestamp = new Timestamp(lastVisibleDoc.seconds, lastVisibleDoc.nanoseconds);
      candidatesQuery = query(
        candidateCollection,
        orderBy("createdAt", "desc"),
        startAfter(lastTimestamp),
        limit(pageSize)
      );
    }

    const snapshot = await getDocs(candidatesQuery);
    const candidates = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: new Date(doc.data().createdAt.seconds * 1000).toLocaleString(),
    }));

    return {
      candidates,
      lastVisibleDoc: snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1].data().createdAt.toJSON()  // Convert Firestore Timestamp to JSON
        : null,
      totalCount: snapshot.size
    };
  }
);


export const deleteCandidate = createAsyncThunk(
  "admin/deleteCandidate",
  async (candidateId, { dispatch, getState, rejectWithValue }) => {
    try {
      const candidateRef = doc(db, "candidateData", candidateId);
      const candidateSnap = await getDoc(candidateRef);

      if (!candidateSnap.exists()) {
        throw new Error("Candidate not found");
      }

      const candidateData = candidateSnap.data();

      // Extract image URLs
      const { markSheet, idCardFront, idCardBack } = candidateData;

      // Delete all candidate images
      await Promise.all([
        deleteImageFromStorage(markSheet),
        deleteImageFromStorage(idCardFront),
        deleteImageFromStorage(idCardBack),
      ]);

      // Delete candidate document from Firestore
      await deleteDoc(candidateRef);

      // Remove from search results in the store
      const currentSearchResults = getState().admin.searchCandidatesData;
      const updatedResults = currentSearchResults.filter((c) => c.id !== candidateId);
      dispatch(updateSearchResults(updatedResults));

      dispatch(fetchCandidates({ page: 1, pageSize: 5 })); // Refresh list

      return candidateId; // Return deleted ID
    } catch (error) {
      console.error("Error deleting candidate:", error);
      return rejectWithValue(error.message);
    }
  }
);


export const addCandidate = createAsyncThunk("admin/addCandidate", async ({ registerNo, name, department, academicYear, markSheet, idCardFront, idCardBack, setUploadProgress }, { rejectWithValue }) => {
  try {
    if (!registerNo || !/^\d+$/.test(registerNo)) {
      toast.error("Register Number must be a valid number.");
      return rejectWithValue("Invalid Register Number.");
    }

    if (!name || name.trim().length < 3) {
      toast.error("Name must be at least 3 characters long.");
      return rejectWithValue("Invalid Name.");
    }

    const marksheetUrl = await uploadImageToFirebase(markSheet, "markSheet", registerNo, setUploadProgress);
    const idCardFrontUrl = await uploadImageToFirebase(idCardFront, "idCardFront", registerNo, setUploadProgress);
    const idCardBackUrl = await uploadImageToFirebase(idCardBack, "idCardBack", registerNo, setUploadProgress);

    await addDoc(collection(db, "candidateData"), {
      registerNo,
      name: name.toLowerCase(),
      department,
      academicYear,
      markSheet: marksheetUrl,
      idCardFront: idCardFrontUrl,
      idCardBack: idCardBackUrl,
      createdAt: serverTimestamp(),
    });

    toast.success("Candidate added successfully");
    return { success: true };
  } catch (error) {
    toast.error("Error adding candidate");
    return rejectWithValue(error.message);
  }
});

export const searchCandidates = createAsyncThunk(
  "search/searchCandidates",
  async ({ searchQuery, department, academicYear }, { rejectWithValue }) => {
    try {
      if (!searchQuery.trim() && !department && !academicYear) {
        toast.error("Please select at least one search or filter option!");
        return rejectWithValue("No filters or search query provided");
      }

      let candidatesRef = collection(db, "candidateData");
      
      // Apply limit() to Firestore query (max 50 candidates)
      const candidatesQuery = query(candidatesRef, limit(50));

      // Fetch only 50 candidates from Firestore
      const querySnapshot = await getDocs(candidatesQuery);

      let candidates = [];

      querySnapshot.forEach((doc) => {
        let candidate = doc.data();

        // ✅ Apply filtering manually in JS
        if (
          (!searchQuery.trim() ||
            candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            candidate.registerNo.includes(searchQuery)) &&
          (!department || candidate.department === department) &&
          (!academicYear || candidate.academicYear === academicYear)
        ) {
          candidates.push({
            id: doc.id,
            ...candidate,
            createdAt: candidate.createdAt
              ? new Date(candidate.createdAt.seconds * 1000).toLocaleString()
              : null,
          });
        }
      });

      // ✅ Sort by createdAt (latest candidates first)
      candidates.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));

      if (candidates.length === 0) {
        toast.error("No candidates found!");
      } else {
        toast.success(`Found ${candidates.length} candidate(s)!`);
      }

      return candidates;
    } catch (error) {
      toast.error("Error searching candidates");
      return rejectWithValue(error.message);
    }
  }
);


const adminSlice = createSlice({
  name: "admin",
  initialState: {
    totalCandidates: 0,
    departmentCounts: {},
    academicYearCounts: {},

    candidates: [],
    lastVisibleDoc: null,
    loading: false,
    error: null,

    addCandidateLoading: false,
    addCandidateError: false,

    deleteCandidateLoading: false,
    deleteCandidateError: false,

    searchCandidatesData: [],
    searchLoading: false,
    searchError: null,

  },
  reducers: {
    updateSearchResults: (state, action) => {
      state.searchCandidatesData = action.payload; // Update search results after deletion
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateCount.fulfilled, (state, action) => {
        state.totalCandidates = action.payload.total;
        state.departmentCounts = action.payload.departmentCounts;
        state.academicYearCounts = action.payload.academicYearCounts;
      })
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload.candidates;
        state.lastVisibleDoc = action.payload.lastVisibleDoc; // Now safely stored as JSON
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCandidate.pending, (state) => {
        state.deleteCandidateLoading = true;
      })
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.deleteCandidateLoading = false;
        state.candidates = state.candidates.filter(c => c.id !== action.payload); // Remove deleted candidate
      })
      .addCase(deleteCandidate.rejected, (state, action) => {
        state.deleteCandidateLoading = false;
        state.deleteCandidateError = action.payload;
      })
      .addCase(addCandidate.pending, (state) => {
        state.addCandidateLoading = true;
      })
      .addCase(addCandidate.fulfilled, (state) => {
        state.addCandidateLoading = false;
      })
      .addCase(addCandidate.rejected, (state, action) => {
        state.addCandidateLoading = false;
        state.addCandidateError = action.payload;
      })
      .addCase(searchCandidates.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchCandidates.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchCandidatesData = action.payload;
      })
      .addCase(searchCandidates.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      });
  },
});

export const { updateSearchResults } = adminSlice.actions;

export default adminSlice.reducer;


