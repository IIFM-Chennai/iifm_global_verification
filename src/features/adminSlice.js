import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, increment, getDoc, doc, addDoc, serverTimestamp, deleteDoc, query, orderBy, limit, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { toast } from "react-toastify";
import { uploadImageToFirebase, deleteImageFromStorage } from "../utils/firebassImages";
import sendCandidateNotification from "../utils/candidateActionNotify";


export const updateCandidateCounts = async (department, academicYear, isAdding = true) => {
  const countDocRef = doc(db, "CandidateTotalCount", "countsSummary");

  try {
    // Read the current document only if necessary
    const docSnapshot = await getDoc(countDocRef);
    let currentData = docSnapshot.exists() ? docSnapshot.data() : {};

    let departmentCounts = currentData.departmentCounts || {};
    let academicYearCounts = currentData.academicYearCounts || {};

    // Ensure initial values exist
    const currentDeptCount = departmentCounts[department] || 0;
    const currentYearCount = academicYearCounts[academicYear] || 0;

    const countChange = isAdding ? 1 : -1;

    // Prevent decrementing below 0
    if (!isAdding) {
      if (currentDeptCount <= 0 && currentYearCount <= 0) {
        console.warn(`Cannot decrement below 0 for ${department} or ${academicYear}`);
        return;
      }
    }

    // Update Firestore counts
    await setDoc(
      countDocRef,
      {
        totalCount: increment(countChange),
        departmentCounts: {
          ...departmentCounts,
          [department]: isAdding || currentDeptCount > 0 ? increment(countChange) : 0
        },
        academicYearCounts: {
          ...academicYearCounts,
          [academicYear]: isAdding || currentYearCount > 0 ? increment(countChange) : 0
        },
      },
      { merge: true }
    );

    // console.log(`Counts updated successfully (${isAdding ? "Added" : "Deleted"})`);
  } catch (error) {
    // console.error("Error updating counts:", error.message);
    throw new Error(error.message);
  }
};

export const fetchLatestCandidates = createAsyncThunk(
  "admin/fetchLatestCandidates ",
  async (_, { rejectWithValue }) => {
    try {
      const candidateCollection = collection(db, "candidateData");
      const candidatesQuery = query(candidateCollection, orderBy("createdAt", "desc"), limit(10));

      const snapshot = await getDocs(candidatesQuery);
      const candidates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: new Date(doc.data().createdAt.seconds * 1000).toLocaleString(),
      }));

      return candidates;

    } catch (error) {
      return rejectWithValue(error.message);
    }
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
      const { markSheet, idCardFront, idCardBack, department, academicYear } = candidateData;

      // Delete all candidate images
      await Promise.all([
        deleteImageFromStorage(markSheet),
        deleteImageFromStorage(idCardFront),
        deleteImageFromStorage(idCardBack),
      ]);

      // Delete candidate document from Firestore
      await deleteDoc(candidateRef);

      // Send email after deletion
      const success = await sendCandidateNotification(
        {
          name: candidateData.name,
          reg_no: candidateData.registerNo,
          department: candidateData.department,
          academic_year: candidateData.academicYear,
        },
        "Deleted"
      );

      if (!success) {
        console.warn("Candidate email notification failed to send.");
      }

      // Update candidate counts after deletion
      await updateCandidateCounts(department, academicYear, false);

      dispatch(fetchCandidateCount()); // Refresh list
      dispatch(fetchLatestCandidates()); // Refresh list

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

    // Send email notification
    const success = await sendCandidateNotification(
      {
        name,
        reg_no: registerNo,
        department,
        academic_year: academicYear,
      },
      "Added"
    );
    if (!success) {
      console.warn("Candidate email notification failed to send.");
    }

    // Update candidate counts after adding
    await updateCandidateCounts(department, academicYear, true);

    toast.success("Candidate added successfully");
    return { success: true };
  } catch (error) {
    toast.error("Error adding candidate");
    return rejectWithValue(error.message);
  }
});

export const fetchCandidateCount = createAsyncThunk(
  "admin/fetchCandidateCount",
  async (_, { rejectWithValue }) => {
    try {
      // Reference to the count document 
      const countDocRef = doc(db, "CandidateTotalCount", "countsSummary");
      const countSnap = await getDoc(countDocRef);

      if (!countSnap.exists()) {
        toast.error("Candidate counts not found.");
        return rejectWithValue("Candidate counts not found.");
      }

      const countData = countSnap.data();

      // Convert Firestore Timestamp to ISO String for Redux
      return countData;
    } catch (error) {
      toast.error("Error fetching candidate counts.");
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
    totalCandidatesLoading: false,
    totalCandidatesError: false,

    candidates: [],
    candidatesLoading: false,
    candidatesError: null,

    addCandidateLoading: false,
    addCandidateError: false,

    deleteCandidateLoading: false,
    deleteCandidateError: false,

  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateCount.pending, (state, action) => {
        state.totalCandidatesLoading = true;
      })
      .addCase(fetchCandidateCount.fulfilled, (state, action) => {
        state.totalCandidatesLoading = false;
        state.totalCandidates = action.payload.totalCount;
        state.departmentCounts = action.payload.departmentCounts;
        state.academicYearCounts = action.payload.academicYearCounts;
      })
      .addCase(fetchCandidateCount.rejected, (state, action) => {
        state.totalCandidatesLoading = false;
        state.totalCandidatesError = action.error.message;
      })
      .addCase(fetchLatestCandidates.pending, (state) => {
        state.candidatesLoading = true;
      })
      .addCase(fetchLatestCandidates.fulfilled, (state, action) => {
        state.candidatesLoading = false;
        state.candidates = action.payload;
      })
      .addCase(fetchLatestCandidates.rejected, (state, action) => {
        state.candidatesLoading = false;
        state.candidatesError = action.error.message;
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
  },
});

export default adminSlice.reducer;


