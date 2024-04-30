import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import CreateMessageForm from "./cMessage";

function Homepage() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <h3>Hello here you can CRUD a message!</h3>
      {user ? (
        <>
          <CreateMessageForm />
        </>
      ) : (
        <>
          <h1>no data</h1>;
        </>
      )}
    </>
  );
}

export default Homepage;
