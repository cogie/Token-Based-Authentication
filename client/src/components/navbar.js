import { AppBar, Box, Toolbar, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import HomeRounded from "@mui/icons-material/HomeRounded";

function NavBar() {
  let navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const onLogout = () => {
    logout();
    navigate("/login");
  };
  console.log(user);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography component="div" variant="h4">
            <HomeRounded sx={{ fontSize: 30 }} />
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              Home
            </Link>
          </Typography>
          <Box alignItems="right" sx={{ flexGrow: 1, textAlign: "right" }}>
            {user ? (
              <>
                <Link
                  to="/user"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <Button style={{ textDecoration: "none", color: "white" }}>
                    User
                  </Button>
                </Link>
                <Button
                  onClick={onLogout}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    margin: "8px",
                  }}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Login
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;
