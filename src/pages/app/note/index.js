import React, { useEffect, useState } from 'react';
import { useLoadConfig } from "../../../hooks/useLoadConfig";
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Spinner,
  useColorModeValue,
  Text,
  Button,
  Input,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import localforage from 'localforage';

const Board = () => {
  const { config, configLoading } = useLoadConfig(); // Load configuration
  const bg = useColorModeValue("white", "gray.700");
  const color = useColorModeValue("gray.700", "whiteAlpha.900");
  const noteBg = useColorModeValue("gray.100", "gray.800");
  const noteHoverBg = useColorModeValue("gray.200", "gray.700");
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/app/note/note?action=get-note');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async () => {
    try {
      const response = await fetch('/api/app/note/note?action=update-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-token': process.env.NEXT_PUBLIC_PASSWORD,
        },
        body: JSON.stringify({
          title,
          notes: content,
        }),
      });

      if (response.ok) {
        console.log('Note added successfully');
        setTitle("");
        setContent("");
        fetchNotes(); // Refresh the notes after adding a new one
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Failed to add note:', errorData.error);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const updateNote = async () => {
    try {
      const response = await fetch('/api/app/note/note?action=update-note', {
        method: 'POST', // Use POST method for updating
        headers: {
          'Content-Type': 'application/json',
          'api-token': process.env.NEXT_PUBLIC_PASSWORD,
        },
        body: JSON.stringify({
          id: selectedNote._id, // Include the note ID in the request body
          title,
          notes: content,
        }),
      });

      if (response.ok) {
        console.log('Note updated successfully');
        setSelectedNote(null);
        setTitle("");
        setContent("");
        fetchNotes(); // Refresh the notes after updating
      } else {
        const errorData = await response.json();
        console.error('Failed to update note:', errorData.error);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (noteID) => {
    try {
      const response = await fetch(`/api/app/note/note?action=delete-note&id=${noteID}`, {
        method: 'DELETE',
        headers: {
          'api-token': process.env.NEXT_PUBLIC_PASSWORD,
        },
      });

      if (response.ok) {
        console.log(`Note with ID ${noteID} deleted successfully`);
        setNotes(notes.filter((note) => note._id !== noteID));
        setSelectedNote(null);
      } else {
        const errorData = await response.json();
        console.error(`Failed to delete note with ID ${noteID}:`, errorData.error);
      }
    } catch (error) {
      console.error(`Error deleting note with ID ${noteID}:`, error);
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setTitle(note.Title);
    setContent(note.Message);
  };

  const handleOpenAddNote = () => {
    setSelectedNote(null);
    setTitle("");
    setContent("");
    onOpen();
  };

  const handleCloseNote = () => {
    setSelectedNote(null);
    setTitle("");
    setContent("");
  };

  useEffect(() => {
    fetchNotes(); // Fetch notes from the database
  }, []);

  if (configLoading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner size="xs" />
      </Flex>
    );
  }

  if (!config) {
    return <div>Error loading configuration.</div>;
  }

  return (
    <>
      <Flex
        align="center"
        justify="center"
        bg={bg}
        borderRadius="md"
        color={color}
        shadow="base"
        width="100%" // Ensure the Flex container takes full width
        position="relative" // Add relative positioning to the Flex container
      >
        <Box
          textAlign="center"
          alignContent={"center"}
          borderRadius="lg"
          p={{ base: 2, lg: 1 }}
          bgSize={"lg"}
          maxH={"80vh"}
          width="100%" // Ensure the Box takes full width
        >
          <Container
            maxW={"100%"} // Set the maximum width to 100%
            width="100%" // Ensure the container takes full width
            alignItems={"center"}
            justifyContent={"center"}
            py={{ base: 40, md: 32 }} // Increase the padding on the y-axis
          >
            <Button
              onClick={handleOpenAddNote}
              m='3'
              position="absolute"
              top="10px"
              right="10px"
              zIndex={1} // Ensure the button is on top of other elements
            >
              <AddIcon />
            </Button>
            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
              {notes.map((note) => (
                <GridItem
                  key={note._id}
                  w="100%"
                  bg={noteBg}
                  p={4}
                  borderRadius="md"
                  shadow="md"
                  cursor="pointer"
                  _hover={{ bg: noteHoverBg }}
                  onClick={() => handleNoteClick(note)}
                >
                  <Text fontWeight="bold">{note.Title}</Text>
                  <Text>{note.Message}</Text>
                </GridItem>
              ))}
            </Grid>
          </Container>
        </Box>
      </Flex>

      {isOpen && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg={bg}
          p={6}
          borderRadius="md"
          shadow="md"
          zIndex={1000}
        >
          <Text mb='8px'>Title:</Text>
          <Input
            type="text"
            placeholder="Headline or Topic"
            size="md"
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
          />

          <Text mb='8px'>Message:</Text>
          <Textarea
            value={content}
            onChange={(event) => setContent(event.currentTarget.value)}
            placeholder='Private messages, Stock tips, Giveaway Link'
            size='sm'
          />

          {selectedNote ? (
            <>
              <Button onClick={updateNote} colorScheme="green" mt={4}>Update</Button>
              <Button onClick={() => deleteNote(selectedNote._id)} colorScheme="red" mt={4} ml={2}>Delete</Button>
            </>
          ) : (
            <Button onClick={addNote} colorScheme="green" mt={4}>Add Note</Button>
          )}
          <Button onClick={handleCloseNote} colorScheme="blue" mt={4} ml={2}>Close</Button>
        </Box>
      )}

      {selectedNote && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg={bg}
          p={6}
          borderRadius="md"
          shadow="md"
          zIndex={1000}
          width="80%"
        >
          <Text mb='8px'>Title:</Text>
          <Input
            type="text"
            placeholder="Headline or Topic"
            size="md"
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
          />

          <Text mb='8px'>Message:</Text>
          <Textarea
            value={content}
            onChange={(event) => setContent(event.currentTarget.value)}
            placeholder='Private messages, Stock tips, Giveaway Link'
            size='sm'
          />

          <Button onClick={updateNote} colorScheme="green" mt={4}>Update</Button>
          <Button onClick={handleCloseNote} colorScheme="blue" mt={4} ml={2}>Close</Button>
          <Button onClick={() => deleteNote(selectedNote._id)} colorScheme="red" mt={4} ml={2}>Delete</Button>
        </Box>
      )}
    </>
  );
};

export default Board;