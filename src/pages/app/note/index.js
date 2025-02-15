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
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import localforage from 'localforage';

const getRandomColor = (isDarkMode) => {
  const lightColors = ["#FFFAF0", "#F0FFF4", "#F0F8FF", "#FFF5F5", "#F5FFFA"];
  const darkColors = ["#2D3748", "#1A202C", "#4A5568", "#2A4365", "#3C366B"];
  return isDarkMode ? darkColors[Math.floor(Math.random() * darkColors.length)] : lightColors[Math.floor(Math.random() * lightColors.length)];
};

const Board = () => {
  const { config, configLoading } = useLoadConfig(); // Load configuration
  const bg = useColorModeValue("white", "gray.700");
  const color = useColorModeValue("gray.700", "whiteAlpha.900");
  const noteHoverBorder = useColorModeValue("neonBlue", "neonBlue");
  const isDarkMode = useColorModeValue(false, true);
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
      console.log('Adding note:', { title, notes: content }); // Debug log
      const response = await fetch('/api/app/note/note?action=add-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-token': process.env.NEXT_PUBLIC_PASSWORD,
        },
        body: JSON.stringify({
          title,
          notes: content, // Ensure the correct field name is used
        }),
      });
      console.log('Response status:', response.status); // Debug log
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
      console.log('Updating note:', { id: selectedNote._id, title, notes: content }); // Debug log
      const response = await fetch('/api/app/note/note?action=update-note', {
        method: 'POST', // Use POST method for updating
        headers: {
          'Content-Type': 'application/json',
          'api-token': process.env.NEXT_PUBLIC_PASSWORD,
        },
        body: JSON.stringify({
          id: selectedNote._id, // Include the note ID in the request body
          title,
          notes: content, // Ensure the correct field name is used
        }),
      });
      console.log('Response status:', response.status); // Debug log

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
    onClose(); // Ensure the modal is closed
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
                  bg={getRandomColor(isDarkMode)}
                  p={4}
                  borderRadius="md"
                  shadow="md"
                  cursor="pointer"
                  _hover={{ borderColor: noteHoverBorder, borderWidth: "2px" }}
                >
                  <Text fontSize="xs" color="gray.500" textAlign="center">{new Date(note.Date).toGMTString()}</Text>
                  <Text fontWeight="bold" textAlign="center" mt={2}>{note.Title}</Text>
                  <HStack justifyContent="flex-end" mt={4}>
                    <IconButton
                      icon={<EditIcon />}
                      size="sm"
                      onClick={() => handleNoteClick(note)}
                      aria-label="Edit Note"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      onClick={() => deleteNote(note._id)}
                      aria-label="Delete Note"
                    />
                  </HStack>
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