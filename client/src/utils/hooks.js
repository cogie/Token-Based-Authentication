import { useState } from "react";

//handles the changes from the userside when submitting
//pass: "", email: ""
export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    console.log(values);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    callback(); //call the functionality on the GraphQL Side
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};
