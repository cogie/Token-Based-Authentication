import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Container, Typography, Avatar } from "@mui/material";

function Userpage() {
  const { user } = useContext(AuthContext);

  return (
    <Container maxWidth="sm" style={{ alignItems: "center", display: "grid", paddingTop: 2 }}>
      <br/><br/>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      {user ? (
        <>
          <Typography variant="h6" gutterBottom>
            Username: {user.username}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Email: {user.email}
          </Typography>
        </>
      ) : (
        <Typography variant="h6">No data</Typography>
      )}
    </Container>
  );
}

export default Userpage;
