import { useState } from "react";
import { AppBar, Toolbar, Button, Menu, MenuItem, Avatar, Box, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/authSlice"; // Import logout action
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)"); // Detects mobile screens

  // Open Profile Menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close Profile Menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Logout Handler
  const handleLogout = () => {
    dispatch(logoutUser());
    handleMenuClose();
    navigate("/");
  };

  // Toggle Mobile Drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  return (
    <AppBar position="static" sx={{ backgroundColor: "#4460aa" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left - Logo */}
        <Box
          component="a"
          href="https://www.integratedinstituteoffacilitymanagement.com/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            padding: "4px",
            borderRadius: "10px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.2s ease-in-out",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          <img src="/logo.png" alt="IIFM Logo" style={{ width: "30px", height: "auto" }} />
        </Box>

        {isMobile ? (
          // Mobile Menu (Hamburger)
          <>
            <IconButton edge="end" color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>

            {/* Mobile Drawer */}
            <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle} >
              <List sx={{ width: 200 }}>
                <ListItem  component={Link} to="/" onClick={handleDrawerToggle}>
                  <ListItemText primary="Home" sx={{color : "black"}}/>
                </ListItem>
                <ListItem  component={Link} to="/about" onClick={handleDrawerToggle}>
                  <ListItemText primary="About" sx={{color : "black"}}/>
                </ListItem>
                <ListItem  component={Link} to="/contact" onClick={handleDrawerToggle}>
                  <ListItemText primary="Contact" sx={{color : "black"}}/>
                </ListItem>

                {isAuth ? (
                  <>
                    <ListItem  component={Link} to="/dashboard" onClick={handleDrawerToggle}>
                      <ListItemText primary="Dashboard" sx={{color : "black"}}/>
                    </ListItem>
                    <ListItem  onClick={handleLogout}>
                      <ListItemText primary="Logout" sx={{color : "black"}}/>
                    </ListItem>
                  </>
                ) : (
                  <ListItem  component={Link} to="/login" onClick={handleDrawerToggle}>
                    <ListItemText primary="Admin Login" sx={{color : "black"}}/>
                  </ListItem>
                )}
              </List>
            </Drawer>
          </>
        ) : (
          // Desktop Navigation
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button component={Link} to="/" color="rgb(255, 255, 255)" sx={{ fontFamily: "Open Sans, Roboto, Oxygen, Ubuntu, Cantarell, Lato, Helvetica Neue, sans-serif", fontSize : "1rem", fontWeight : "600" , textDecoration : "none", textTransform: "none"}}>Home</Button>
            <Button component={Link} to="/about" color="rgb(255, 255, 255)" sx={{ fontFamily: "Open Sans, Roboto, Oxygen, Ubuntu, Cantarell, Lato, Helvetica Neue, sans-serif", fontSize : "1rem", fontWeight : "600" , textDecoration : "none", textTransform: "none"}}>About</Button>
            <Button component={Link} to="/contact" color="rgb(255, 255, 255)" sx={{ fontFamily: "Open Sans, Roboto, Oxygen, Ubuntu, Cantarell, Lato, Helvetica Neue, sans-serif", fontSize : "1rem", fontWeight : "600" , textDecoration : "none", textTransform: "none"}}>Contact</Button>

            {isAuth ? (
              <>
                <Button component={Link} to="/dashboard" color="rgb(255, 255, 255)" sx={{ fontFamily: "Open Sans, Roboto, Oxygen, Ubuntu, Cantarell, Lato, Helvetica Neue, sans-serif", fontSize : "1rem", fontWeight : "600" , textDecoration : "none", textTransform: "none"}}>Dashboard</Button>

                {/* Profile Avatar */}
                <IconButton onClick={handleMenuOpen} sx={{ ml: 2, backgroundColor: "white", width: '40px', height: "40px" }}>
                  <Avatar alt="logo" sx={{ width: 30, height: 30 }}>{user && user.email.charAt(0)}</Avatar>
                </IconButton>

                {/* Dropdown Menu */}
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} sx={{ mt: 1 }}>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button component={Link} to="/login" color="rgb(255, 255, 255)" sx={{ fontFamily: "Open Sans, Roboto, Oxygen, Ubuntu, Cantarell, Lato, Helvetica Neue, sans-serif", fontSize : "1rem", fontWeight : "600" , textDecoration : "none", textTransform: "none"}} >Admin Login</Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
