import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { isValidMember } from "../../hooks/validate";
import { useLoadConfig } from "../../hooks/useLoadConfig";
import localforage from 'localforage';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'

import {
  Text,
  Box,
  Link,
  useDisclosure,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";

import { DeleteIcon, ChatIcon , AddIcon} from '@chakra-ui/icons'

import jData from "./PrivateNotice.json";

export default function PrivateNotice() {
  const { address,  isConnected } = useAccount();
  const [status, setStatus] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [noticeData, setNoticeData] = useState([]);
  const [modify, setModify] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const { config, configLoading } = useLoadConfig();

  const setMembershipStatus = (key, status) => {
    localforage.setItem(key, status);
  };

  const edit = () => {
   // console.log("Modify");
    setModify(true);
  };

  const update = async () => {
    console.log("Update");
    try {
      // Send an HTTP POST request to the API route
      const response = await fetch('/api/message/update-notice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-token': process.env.NEXT_PUBLIC_PASSWORD,
        },
        body: JSON.stringify({
          title,
          notes,
        }),
      });

      if (response.ok) {
        console.log('Data updated successfully');
        setModify(false); // Set modify to false when the update is successful
      } else {
        console.error('Failed to update data');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };


  const deleteEntry = async (entryID) => {
    try {
      // Send an HTTP DELETE request to the API route
      const response = await fetch(`/api/message/delete-notice/?id=${entryID}`, {
        method: 'DELETE',
        headers: {
          'api-token': process.env.NEXT_PUBLIC_PASSWORD,
        },
      });

      //console.log(response);

      if (response.ok) {
        console.log(`Entry with ID ${entryID} deleted successfully`);
        // Refresh the data by calling the useEffect
        setNoticeData([...noticeData.filter((entry) => entry.ID !== entryID)]);
      } else {
        console.error(`Failed to delete entry with ID ${entryID}`);
      }
    } catch (error) {
      console.error(`Error deleting entry with ID ${entryID}:`, error);
    }
  };

  const closeModal = () => {
   // console.log("Close the modal");
    setModify(false); // Set modify to false when the modal is closed
    onClose(); // Close the modal
  };

  useEffect(() => {
    if (address) {
      async function getStatus() {
        let test = await isValidMember(address);
        //console.log(test);
        //console.log(address);
        //console.log(ADMIN_WALLET);
          // Ensure config is loaded
  if (configLoading) {
    console.log("Configuration is loading...");
    return null;
  }
        if (address == config.ADMIN_WALLET) {
          let addr = address?.toString();
          setMembershipStatus(addr, "ADMIN");
        }

        setStatus(test);
      }
      getStatus();
    }
  }, [address, status]);

  useEffect(() => {
    // Fetch and set the JSON data (you can use an API request or import it as in this example)
  //  console.log(jData); // Add this line for debugging
    setNoticeData(jData);
  }, [noticeData]);

  useEffect(() => {
    // Fetch and set the JSON data (you can use an API request or import it as in this example)
   // console.log(modify); // Add this line for debugging
    // setNoticeData(jData);
  }, [modify]);

      // If loading, show a loading state for the header
      if (configLoading) {
        return <div>Loading...</div>;
      }
    
      // If config is missing or failed to load
      if (!config) {
        return <div>Error loading configuration.</div>;
      }

  return (
    <div>
      <Button onClick={onOpen} m='3'><ChatIcon/></Button>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {config.NOTICE_TITLE} &nbsp;
            {(!modify && status == "ADMIN") && isConnected ? <Button onClick={() => edit()}><AddIcon/></Button> : null}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {(status == "GOLD" || status == "ADMIN") && isConnected ? (
              <>
                {!modify ? (
                  <>
                    <Accordion>



                      {noticeData.map((notice) => (


                        <AccordionItem key={notice.ID}>
                          <h2>
                            <AccordionButton>
                              <Box as="span" flex='1' textAlign='left'>
                              <Text as='b'> {notice.Title}</Text>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4}>
                          {notice.Message}
                          {status == "ADMIN" ? (
                          <Link
                  onClick={() => deleteEntry(notice.ID)}
                  color="red"
                  cursor="pointer"
                  ml="2"
                ><DeleteIcon/></Link> ):null}
                          </AccordionPanel>
                        </AccordionItem>


                      ))}
                    </Accordion>
                  </>
                ) : (
                  <>
                    <Text mb='8px'>Title:</Text>
                    <Input
                      type="text"
                      placeholder="Headline or Topic"
                      size="md"
                      value={title}
                      onChange={(event) =>
                        setTitle(event.currentTarget.value)
                      }
                    />

                    <Text mb='8px'>Message:</Text>
                    <Textarea
                      value={notes}
                      onChange={(event) =>
                        setNotes(event.currentTarget.value)
                      }
                      placeholder='Private messages, Stock tips, Giveaway Link'
                      size='sm'
                    />

                  </>
                )}
              </>
            ) : (
              <>{config.NOTICE_NON_MEMBER}</>
            )}
          </ModalBody>

          <ModalFooter>
            {modify ? <Button onClick={() => update()}>Update</Button> : null}

            <Button colorScheme="blue" mr={3} onClick={closeModal}>
              Close
            </Button>

            {!(status === "GOLD" || status === "ADMIN") && (
              <Link href="/list">
                <Button colorScheme="teal" variant="solid">
                  Check Domain {status}
                </Button>
              </Link>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
