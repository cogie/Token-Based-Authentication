import { jwtDecode } from "jwt-decode";
import React, { useReducer, createContext } from "react";

const initialState = {
  user: null,
};

//acccess localStorage. Get token && decode it
if (localStorage.getItem("token")) {
  const decodedToken = jwtDecode(localStorage.getItem("token"));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  login: (_userData) => {},
  logout: () => {},
});

//handles the state of the users
function AuthReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state, //current state
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state, //current state
        user: null, //will return null cause logout/no token
      };
    default:
      return state;
  }
}

// provider
function AuthProvider(props) {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  //if user gets succesful response from the apollo server
  //handles login
  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  };

  //handles logout
  function logout() {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  }

  //   return( <AuthContext.Provider value={{ user: state.user, login, logout }}>
  //         {props.children}
  //     <AuthContext.Provider/>
  return (
    <AuthContext.Provider value={{ user: state.user, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
