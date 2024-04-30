import { useContext, useState, useEffect } from "react";
import { useForm } from "../utils/hooks";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "graphql-tag";
import {
  TextField,
  Button,
  Container,
  Stack,
  Alert,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const CREATE_MESSAGE = gql`
  mutation Mutation($messageInput: MessageInput) {
    createMessage(messageInput: $messageInput) {
      createdAt
      createdBy
      text
    }
  }
`;

const GET_MESSAGES = gql`
  query GetMessages {
    getMessages {
      id
      text
      createdBy
      createdAt
    }
  }
`;

const EDIT_MESSAGE = gql`
  mutation Mutation($id: ID!, $messageInput: MessageInput) {
    editMessage(ID: $id, messageInput: $messageInput)
  }
`;

const DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: ID!) {
    deleteMessage(ID: $id)
  }
`;

const CreateMessageForm = () => {
  const { values, onChange, onSubmit } = useForm(createMessageCallback, {
    text: "",
    username: "",
  });

  const { loading, error, data, refetch } = useQuery(GET_MESSAGES);

  const [createMessage] = useMutation(CREATE_MESSAGE);
  const [notification, setNotification] = useState("");
  const [errors, setErrors] = useState([]);
  const [editMessage] = useMutation(EDIT_MESSAGE);
  const [deleteMessage] = useMutation(DELETE_MESSAGE);

  // Validate inputs
  const validateForm = () => {
    if (!values.text.trim()) {
      setErrors([{ message: "Please enter a message" }]);
      return false;
    }
    return true;
  };

  // Callback function for form submission
  async function createMessageCallback() {
    if (validateForm()) {
      try {
        await createMessage({
          variables: {
            messageInput: {
              text: values.text,
              username: values.username,
            },
          },
        });
        setNotification("Message saved successfully!");
        refetch(); //refetch after new msg created
      } catch (error) {
        console.error("Error creating message:", error);
        setErrors([{ message: "Error creating message" }]);
      }
    }
  }

  const handleEdit = async (id) => {
    const messageToEdit = data.getMessages.find((message) => message.id === id);
    if (!messageToEdit) return;

    // Set values to the message being edited
    onChange({ target: { name: "text", value: messageToEdit.text } });
    onChange({
      target: { name: "username", value: messageToEdit.createdBy },
    });

    // Submit the form for editing
    await editMessage({
      variables: {
        id,
        messageInput: {
          text: values.text,
          username: values.username,
        },
      },
    });
    setNotification("Message edited successfully!");
    refetch(); // Refetch messages after editing a message
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage({ variables: { id } });
      setNotification("Message deleted successfully!");
      refetch(); // Refetch messages after deleting a message
    } catch (error) {
      console.error("Error deleting message:", error);
      setErrors([{ message: "Error deleting message" }]);
    }
  };

  return (
    <Container spacing={2} maxWidth="sm">
      <h1>Create Message</h1>
      <p>Input text</p>

      <Stack spacing={2} paddingBottom={2}>
        <TextField
          label="text"
          name="text"
          required
          onChange={onChange}
          value={values.text}
        />
        <TextField
          type="text"
          label="username"
          name="username"
          required
          onChange={onChange}
          value={values.username}
        />
      </Stack>
      {errors.map(function (error, index) {
        return (
          <Alert key={index} severity="error">
            {error.message}
          </Alert>
        );
      })}
      {notification && <div>{notification}</div>}
      <br />
      <Button variant="contained" onClick={onSubmit}>
        save
      </Button>
      <br />
      <br />

      <h2>All Messages:</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <ul>
          <List>
            {data.getMessages.map((message) => (
              <ListItem key={message.id}>
                <ListItemText
                  primary={message.text}
                  secondary={`Created by: ${message.createdBy} - Created at: ${message.createdAt}`}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleEdit(message.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(message.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </ul>
      )}
    </Container>
  );
};

export default CreateMessageForm;
