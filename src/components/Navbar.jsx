import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Avatar,
  Divider,
  Typography,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth, user } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");

  const username = user?.email?.split("@")[0];

  /* ---------------- HELPERS ---------------- */
  const closeMobileDrawer = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setAnchorEl(null);
    closeMobileDrawer();
    navigate("/");
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#1f2a44" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* ---------------- BRAND ---------------- */}
        <Box
          component="a"
          href="https://iifmacademy.com/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#fff",
            px: 0.5,
            py: 0.5,
            borderRadius: "50%",
            textDecoration: "none",
          }}
        >
          <img src="/logo.png" alt="IIFM Logo" width={40} />
        </Box>

        {/* ---------------- MOBILE ---------------- */}
        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="right"
              open={mobileOpen}
              onClose={closeMobileDrawer}
            >
              <List sx={{ width: 260 }}>
                <ListItem
                  component={Link}
                  to="/"
                  onClick={closeMobileDrawer}
                >
                  <VerifiedIcon sx={{ mr: 1 }} />
                  <ListItemText primary="Global Verification" />
                </ListItem>

                {isAuth && (
                  <ListItem
                    component={Link}
                    to="/dashboard"
                    onClick={closeMobileDrawer}
                  >
                    <DashboardIcon sx={{ mr: 1 }} />
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                )}

                <Divider />

                {isAuth ? (
                  <ListItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    <ListItemText primary={`Logout (${username})`} />
                  </ListItem>
                ) : (
                  <ListItem
                    component={Link}
                    to="/login"
                    onClick={closeMobileDrawer}
                  >
                    <ListItemText primary="Admin Login" />
                  </ListItem>
                )}
              </List>
            </Drawer>
          </>
        ) : (
          /* ---------------- DESKTOP ---------------- */
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              sx={{ fontWeight: 600 }}
            >
              Global Verification
            </Button>

            {isAuth && (
              <Button
                component={Link}
                to="/dashboard"
                color="inherit"
                sx={{ fontWeight: 600 }}
              >
                Dashboard
              </Button>
            )}

            {isAuth ? (
              <>
                <Chip
                  label="Admin"
                  size="small"
                  sx={{
                    bgcolor: "#e3f2fd",
                    color: "#0d47a1",
                    fontWeight: 600,
                  }}
                />

                <IconButton
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  aria-label="User menu"
                >
                  <Avatar sx={{ bgcolor: "#1976d2" }}>
                    {username?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem disabled>
                    <Typography variant="body2">
                      {user?.email}
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                color="inherit"
                sx={{ fontWeight: 600 }}
              >
                Admin Login
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
