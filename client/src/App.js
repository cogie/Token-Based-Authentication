import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homePage";
import NavBar from "./components/navbar";
import Register from "./pages/register";
import Login from "./pages/login";
import { AuthContext } from "./context/authContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Userpage from "./pages/userpage";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <NavBar />
      <Routes>
        {user ? ( //verify if user is authenticated if true grant access to home otherwise navigate to log and register
          <>
            <Route path="/" element={<Homepage />} />
            <Route path="/user" element={<Userpage />} />
          </>
        ) : (
          <>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<Navigate to="login" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
