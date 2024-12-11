import * as React from "react";
import { Link } from "react-router-dom";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import IconButton from "@mui/joy/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import Person from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [menuIndex, setMenuIndex] = React.useState(null);
  let leaveTimeout = null;
  const { user, logout } = useAuth();

  const handleMouseLeave = () => {
    leaveTimeout = setTimeout(() => {
      setMenuIndex(null);
    }, 300);
  };

  const handleMouseEnter = (index) => {
    clearTimeout(leaveTimeout);
    setMenuIndex(index);
  };

  React.useEffect(() => {
    return () => clearTimeout(leaveTimeout);
  }, [leaveTimeout]);

  return (
    <Box
      sx={{
        backgroundColor: "primary.700",
        color: "white",
        padding: "8px 16px",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            component={Link}
            to="/"
            sx={{
              color: "primary",
              "&:hover": {
                backgroundColor: "primary.500",
                color: "white",
                borderRadius: "8px",
                border: "2px solid white",
              },
            }}
          >
            <HomeIcon />
          </IconButton>

          <Dropdown
            open={menuIndex === 1}
            onOpenChange={(_, isOpen) => {
              if (isOpen) {
                handleMouseEnter(1);
              }
            }}
          >
            <MenuButton
              slots={{ root: IconButton }}
              slotProps={{
                root: {
                  sx: {
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.500",
                      color: "white",
                      borderRadius: "8px",
                      border: "2px solid white",
                    },
                  },
                },
              }}
              onMouseEnter={() => handleMouseEnter(1)}
              onMouseLeave={handleMouseLeave}
            >
              <SchoolIcon />
            </MenuButton>
            <Menu
              onMouseEnter={() => handleMouseEnter(1)}
              onMouseLeave={handleMouseLeave}
              placement="bottom-start"
              sx={{ width: 200 }}
            >
              <MenuItem component={Link} to="/programs">
                Programs
              </MenuItem>
              <MenuItem component={Link} to="/courses">
                Courses
              </MenuItem>
            </Menu>
          </Dropdown>
        </Stack>

        <Stack direction="row" spacing={2}>
          {user ? (
            <>
              <Dropdown
                open={menuIndex === 3}
                onOpenChange={(_, isOpen) => {
                  if (isOpen) {
                    handleMouseEnter(3);
                  }
                }}
              >
                <MenuButton
                  slots={{ root: IconButton }}
                  slotProps={{
                    root: {
                      sx: {
                        color: "white",
                        "&:hover": {
                          backgroundColor: "primary.500",
                          color: "white",
                          borderRadius: "8px",
                          border: "2px solid white",
                        },
                      },
                    },
                  }}
                  onMouseEnter={() => handleMouseEnter(3)}
                  onMouseLeave={handleMouseLeave}
                >
                  <DashboardIcon />
                </MenuButton>
                <Menu
                  onMouseEnter={() => handleMouseEnter(3)}
                  onMouseLeave={handleMouseLeave}
                  placement="bottom-start"
                  sx={{ width: 200 }}
                >
                  {user.role === "student" && (
                    <>
                      <MenuItem component={Link} to="/student-dashboard">
                        Student Dashboard
                      </MenuItem>
                      <MenuItem component={Link} to="/my-courses">
                        My Courses
                      </MenuItem>
                      <MenuItem component={Link} to="/my-programs">
                        My Programs
                      </MenuItem>
                      <MenuItem component={Link} to="/contact">
                        Contact
                      </MenuItem>
                    </>
                  )}

                  {user.role === "admin" && (
                    <>
                      <MenuItem component={Link} to="/admin-dashboard">
                        Admin Dashboard
                      </MenuItem>
                      <MenuItem component={Link} to="/adm-add-courses">
                        Add Courses
                      </MenuItem>
                      <MenuItem component={Link} to="/adm-add-programs">
                        Add Programs
                      </MenuItem>
                      <MenuItem component={Link} to="/adm-contact">
                        Contact
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </Dropdown>

              <Dropdown
                open={menuIndex === 2}
                onOpenChange={(_, isOpen) => {
                  if (isOpen) {
                    handleMouseEnter(2);
                  }
                }}
              >
                <MenuButton
                  slots={{ root: IconButton }}
                  slotProps={{
                    root: {
                      sx: {
                        color: "white",
                        "&:hover": {
                          backgroundColor: "primary.500",
                          color: "white",
                          borderRadius: "8px",
                          border: "2px solid white",
                        },
                      },
                    },
                  }}
                  onMouseEnter={() => handleMouseEnter(2)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Person />
                </MenuButton>
                <Menu
                  onMouseEnter={() => handleMouseEnter(2)}
                  onMouseLeave={handleMouseLeave}
                  placement="bottom-start"
                  sx={{ width: 200 }}
                >
                  <MenuItem component={Link} to="/profile">
                    <Person sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={logout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </Dropdown>
            </>
          ) : (
            <>
              <Dropdown
                open={menuIndex === 2}
                onOpenChange={(_, isOpen) => {
                  if (isOpen) {
                    handleMouseEnter(2);
                  }
                }}
              >
                <MenuButton
                  slots={{ root: IconButton }}
                  slotProps={{
                    root: {
                      sx: {
                        color: "white",
                        "&:hover": {
                          backgroundColor: "primary.500",
                          color: "white",
                          borderRadius: "8px",
                          border: "2px solid white",
                        },
                      },
                    },
                  }}
                  onMouseEnter={() => handleMouseEnter(2)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Person />
                </MenuButton>
                <Menu
                  onMouseEnter={() => handleMouseEnter(2)}
                  onMouseLeave={handleMouseLeave}
                  placement="bottom-start"
                  sx={{ width: 200 }}
                >
                  <MenuItem component={Link} to="/login">
                    <LoginIcon sx={{ mr: 1 }} />
                    Login
                  </MenuItem>
                  <MenuItem component={Link} to="/signup">
                    <AppRegistrationIcon sx={{ mr: 1 }} />
                    Sign Up
                  </MenuItem>
                </Menu>
              </Dropdown>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
