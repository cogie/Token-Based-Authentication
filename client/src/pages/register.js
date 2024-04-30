import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { useForm } from "../utils/hooks";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "graphql-tag";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Container, Stack, Alert } from "@mui/material";

//graphql mutation
const REGISTER_USER = gql`
  mutation Mutation($registerInput: RegisterInput) {
    registerUser(registerInput: $registerInput) {
      email
      username
      token
    }
  }
`;

function Register(props) {
  const context = useContext(AuthContext);
  let navigate = useNavigate();
  const [errors, setErrors] = useState([]);

  //validate forms
  const validateForm = () => {
    if (!values.username) {
      setErrors([{ message: "Please enter username" }]);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      setErrors([{ message: "Please enter a valid email address" }]);
      return false;
    }
    if (!values.password) {
      setErrors([{ message: "Please enter password" }]);
      return false;
    }
    if (values.password !== values.confirmPassword) {
      setErrors([{ message: "Passwords do not match" }]);
      return false;
    }
    return true;
  };

  function registerUserCallback() {
    if (validateForm()) {
      registerUser();
      console.log("Callback");
    }
  }

  //return objects of diffirent inputs
  const { onChange, onSubmit, values } = useForm(registerUserCallback, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // const [registerUser, { loading }] = useMutation(REGISTER_USER, {
  //   update(proxy, { data: { registerUser: userData } }) {
  //     context.login(userData);
  //     navigate("/");
  //   },

  //   onError({ graphQLErrors }) {
  //     setErrors(graphQLErrors);
  //   },
  //   variables: { registerInput: values }, //values == useform , onChange/onSubmit
  // });

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, { data }) {
      console.log("Response Data:", data); // Log the entire response data
      const userData = data ? data.registerUser : null; // Extracting registerUser data
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
    variables: { registerInput: values },
  });

  return (
    <Container spacing={2} maxWidth="sm">
      <h1>Register</h1>
      <p>Register to create an account</p>

      <Stack spacing={2} paddingBottom={2}>
        <TextField
          required
          label="Username"
          name="username"
          onChange={onChange}
          value={values.username}
        />
        <TextField
          required
          type="Email"
          label="Email"
          name="email"
          onChange={onChange}
          value={values.email}
        />
        <TextField
          required
          type="password"
          label="Password"
          name="password"
          onChange={onChange}
          value={values.password}
        />
        <TextField
          required
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          onChange={onChange}
          value={values.confirmPassword}
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
        Register
      </Button>
      <br />
      <br />
      <Link to={"/login"}> Already have an account ?</Link>
    </Container>
  );
}

export default Register;
