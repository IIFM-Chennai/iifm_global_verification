import { useState } from "react";
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { deleteCandidate} from "../features/adminSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";  


const CandidateActions = ({ candidateId }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { deleteCandidateLoading } = useSelector(state => state.admin);

  const navigate = useNavigate();

  const handleDelete = async () => {
    dispatch(deleteCandidate(candidateId))
      .unwrap()
      .then(() => {
        toast.success("Candidate deleted successfully!");
        setOpen(false);
      })
      .catch((error) => {
        toast.error("Error deleting candidate: " + error);
        setOpen(false);
      });

  };

  return (
    <>
      {/* View Button */}
      <IconButton color="primary" onClick={() => navigate(`/dashboard/candidate/${candidateId}`)}>
        <VisibilityIcon />
      </IconButton>

      {/* Delete Button (Opens Confirmation Dialog) */}
      <IconButton color="error" onClick={() => setOpen(true)}>
        <DeleteIcon />
      </IconButton>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this candidate? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" disabled={deleteCandidateLoading}>
            {deleteCandidateLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CandidateActions;
