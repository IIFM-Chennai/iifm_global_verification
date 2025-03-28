import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, Timestamp, getDocs, getDoc,doc, where, addDoc, serverTimestamp, deleteDoc, query, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
// import uploadImageToCloudinary from '../config/cloudinaryUpload';
import { toast } from "react-toastify";
import { uploadImageToFirebase, deleteImageFromStorage } from "../utils/firebassImages";



// Fetch department-wise count
export const fetchCandidateCount = createAsyncThunk(
  "admin/fetchCandidateCount",
  async (_, { rejectWithValue }) => {
    try {
      const q = collection(db, "candidateData");
      const querySnapshot = await getDocs(q);
      let total = 0;
      let departmentCounts = {
        HVAC: 0,
        IBMS: 0,
        MEP: 0,
        POWER_PLANT: 0,
        WTP: 0,
        SAFETY: 0,
      };

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total++;

        // Normalize the department name (replace spaces with underscores)
        const normalizedDepartment = data.department.toUpperCase().replace(/\s+/g, "_");

        if (departmentCounts[normalizedDepartment] !== undefined) {
          departmentCounts[normalizedDepartment]++;
        }
      });

      return { total, departmentCounts };
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

//   try {

//     // Validate Register No & Name
//     if (!candidateData.registerNo || !/^\d+$/.test(candidateData.registerNo)) {
//       toast.error("Register Number must be a valid number.");
//       return rejectWithValue("Invalid Register Number.");
//     }

//     if (!candidateData.name || candidateData.name.trim().length < 3) {
//       toast.error("Name must be at least 3 characters long.");
//       return rejectWithValue("Invalid Name.");
//     }

//     // const marksheetUrl = await uploadImageToCloudinary(candidateData.markSheet, "MarkSheet");
//     // const idCardFrontUrl = await uploadImageToCloudinary(candidateData.idCardFront, "ID Card (Front)");
//     // const idCardBackUrl = await uploadImageToCloudinary(candidateData.idCardBack, "ID Card (Back)");
//     const marksheetUrl = await uploadImageToFirebase(candidateData.markSheet, "markSheet", candidateData.registerNo);
//     const idCardFrontUrl = await uploadImageToFirebase(candidateData.idCardFront, "Id Card Front", candidateData.registerNo);
//     const idCardBackUrl = await uploadImageToFirebase(candidateData.idCardBack, "Id Card Back", candidateData.registerNo);


//     // Ensure all URLs are valid before storing in Firestore
//     if (!marksheetUrl || !idCardFrontUrl || !idCardBackUrl) {
//       toast.error("Upload failed. Please check file formats and try again.");
//       return rejectWithValue("Invalid file upload.");
//     }

//     await addDoc(collection(db, "candidateData"), {
//       registerNo: candidateData.registerNo,
//       name: candidateData.name.toLowerCase(),
//       department: candidateData.department,
//       markSheet: marksheetUrl,
//       idCardFront: idCardFrontUrl,
//       idCardBack: idCardBackUrl,
//       createdAt: serverTimestamp(),
//     });

//     toast.success("Candidate added successfully");
//     return { success: true };
//   } catch (error) {
//     toast.error("Error adding candidate");
//     return rejectWithValue(error.message);
//   }
// });

export const addCandidate = createAsyncThunk("admin/addCandidate", async ({ registerNo, name, department, markSheet, idCardFront, idCardBack, setUploadProgress }, { rejectWithValue }) => {
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
  async ({ searchQuery }, { rejectWithValue }) => {
    try {
      if (!searchQuery.trim()) {
        toast.error("Search query cannot be empty!");
        return rejectWithValue("Empty search query");
      }

      let candidatesRef = collection(db, "candidateData");
      let searchQueryRef;

      if (!isNaN(searchQuery)) {
        // Exact Match for Register Number
        searchQueryRef = query(candidatesRef, where("registerNo", "==", searchQuery));
      } else {
        // Exact Match for Name (Case-Insensitive)
        searchQueryRef = query(candidatesRef, where("name", "==", searchQuery.toLowerCase()));
      }

      const querySnapshot = await getDocs(searchQueryRef);
      let results = [];

      querySnapshot.forEach((doc) => {
        let candidate = doc.data();

        results.push({
          id: doc.id,
          ...candidate,
          createdAt: candidate.createdAt ? candidate.createdAt.toDate().toISOString() : null,
        });
      });

      if (results.length === 0) {
        toast.error("No candidates found!");
      } else {
        toast.success(`Found ${results.length} candidate(s)!`);
      }

      return results;
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


