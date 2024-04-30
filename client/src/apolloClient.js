import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

//create link to get the actual apollo server/ authentication server
const httpLink = createHttpLink({
  uri: "http://localhost:5000",
});

//autorization link to pass token under auth headers
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers, //note
      authorization: localStorage.getItem("token") || "",
    },
  };
});

//client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
