import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { useForm } from "../utils/hooks";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "graphql-tag";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Stack,
  Alert,
  Typography,
} from "@mui/material";

const LOGIN_USER = gql`
  mutation login($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      email
      username
      token
    }
  }
`;

function Login(props) {
  let navigate = useNavigate();
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState([]);

  //validate forms
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      setErrors([{ message: "Please enter a valid email address" }]);
      return false;
    }
    if (!values.password) {
      setErrors([{ message: "Please enter password" }]);
      return false;
    }
    return true;
  };

  function loginUserCallback() {
    if (validateForm()) {
      loginUser();
    }
  }

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    email: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, { data }) {
      console.log("Response Data:", data); // Log the entire response data
      const userData = data ? data.loginUser : null; // Extracting registerUser data
      if (userData) {
        context.login(userData);
        navigate("/");
      } else {
        console.error("Error: Unable to extract userData from response data");
      }
    },
    onError(error) {
      console.error("GraphQL Error:", error.message); // Log GraphQL errors
      if (error.networkError) {
        console.error("Network Error:", error.networkError.message); // Log network errors
      }
      setErrors(error.graphQLErrors);
    },
    variables: { loginInput: values },
  });

  return (
    <Container spacing={2} maxWidth="sm">
      <h1>Login</h1>
      <p>Login an account</p>

      {/* Need to be fixed where users are required to inputs on the fields */}
      <Stack spacing={2} paddingBottom={2}>
        <TextField
          label="Email"
          name="email"
          required
          onChange={onChange}
          value={values.email}
        />
        <TextField
          type="password"
          label="Password"
          name="password"
          required
          onChange={onChange}
          value={values.password}
        />
      </Stack>
      {errors.map(function (error, index) {
        return (
          <Alert key={index} severity="error">
            {error.message}
          </Alert>
        );
      })}
      <Button variant="contained" onClick={onSubmit}>
        Login
      </Button>
      <br />
      <br />
      <Link to={"/register"}>Don't have an account ?</Link>
    </Container>
  );
}

export default Login;
