import React from "react";
import { Box, Typography, Card, CardActionArea, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" gutterBottom align="center" color="2c3e50" marginBottom={4} fontWeight={700} fontSize={"2rem"}>
        Admin Dashboard
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
          justifyContent: "center",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        {/* Manage Candidates */}
        <Card
          sx={{
            flex: 1,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            boxShadow: 3,
            transition: "0.3s",
            "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
          }}
        >
          <CardActionArea onClick={() => navigate("/dashboard/manage-candidate")}>
            <CardContent>
              <Typography variant="h5" align="center" sx={{color : "#2c3e50", marginBottom : "5px"}}>
                Manage Candidates
              </Typography>
              <Typography variant="body2" align="center" color="textSecondary">
                View and manage all registered candidates.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        {/* Add Candidate */}
        <Card
          sx={{
            flex: 1,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            boxShadow: 3,
            transition: "0.3s",
            "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
          }}
        >
          <CardActionArea onClick={() => navigate("/dashboard/add-candidate")}>
            <CardContent>
              <Typography variant="h5" align="center"sx={{color : "#2c3e50", marginBottom : "5px"}}>
                Add Candidate
              </Typography>
              <Typography variant="body2" align="center" color="textSecondary">
                Register a new candidate for verification.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        {/* Search Candidate */}
        <Card
          sx={{
            flex: 1,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            boxShadow: 3,
            transition: "0.3s",
            "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
          }}
        >
          <CardActionArea onClick={() => navigate("/dashboard/search-candidate")}>
            <CardContent>
              <Typography variant="h5" align="center"sx={{color : "#2c3e50", marginBottom : "5px"}}>
              Search Candidate
              </Typography>
              <Typography variant="body2" align="center" color="textSecondary">
              Find a candidate for verification.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
