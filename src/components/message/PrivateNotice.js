// src/components/message/PrivateNotice.js
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
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  Box,
  Link,
  useDisclosure,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { DeleteIcon, ChatIcon, AddIcon } from '@chakra-ui/icons';

export default function PrivateNotice() {
  const { address, isConnected } = useAccount();
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

  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/message/get-notices');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNoticeData(data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const edit = () => {
    setModify(true);
  };

  const update = async () => {
    try {
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
        setModify(false);
        setTitle("");
        setNotes("");
        fetchNotices(); // Refresh the notice data after update
      } else {
        const errorData = await response.json();
        console.error('Failed to update data:', errorData.error);
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const deleteEntry = async (entryID) => {
    try {
      const response = await fetch(`/api/message/delete-notice?id=${entryID}`, {
        method: 'DELETE',
        headers: {
          'api-token': process.env.NEXT_PUBLIC_PASSWORD,
        },
      });

      if (response.ok) {
        console.log(`Entry with ID ${entryID} deleted successfully`);
        setNoticeData(noticeData.filter((entry) => entry.ID !== entryID));
      } else {
        const errorData = await response.json();
        console.error(`Failed to delete entry with ID ${entryID}:`, errorData.error);
      }
    } catch (error) {
      console.error(`Error deleting entry with ID ${entryID}:`, error);
    }
  };

  const closeModal = () => {
    setModify(false);
    onClose();
  };

  useEffect(() => {
    if (address && !configLoading && config) {
      const timeoutId = setTimeout(() => {
        async function getStatus() {
          try {
            let test = await isValidMember(address);
            if (address === config.ADMIN_WALLET) {
              setMembershipStatus(address.toString(), "ADMIN");
              setStatus("ADMIN");
            } else {
              setMembershipStatus(address.toString(), test);
              setStatus(test);
            }
          } catch (error) {
            console.error("Error fetching membership status:", error);
          }
        }

        getStatus();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [address, config, configLoading]);

  useEffect(() => {
    fetchNotices(); // Fetch notice data from MongoDB
  }, []);

  if (configLoading) {
    return <Spinner size="xs" />;
  }

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
            {(!modify && status === "ADMIN") && isConnected ? (
              <Button onClick={edit}><AddIcon/></Button>
            ) : null}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {(status === "GOLD" || status === "ADMIN") && isConnected ? (
              <>
                {!modify ? (
                  <Accordion allowToggle>
                    {noticeData.map((notice) => (
                      <AccordionItem key={notice.ID}>
                        <h2>
                          <AccordionButton>
                            <Box flex='1' textAlign='left'>
                              <Text as='b'>{notice.Title}</Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          {notice.Message}
                          {status === "ADMIN" ? (
                            <Link
                              onClick={() => deleteEntry(notice.ID)}
                              color="red"
                              cursor="pointer"
                              ml="2"
                            >
                              <DeleteIcon />
                            </Link>
                          ) : null}
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <>
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
                      value={notes}
                      onChange={(event) => setNotes(event.currentTarget.value)}
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
            {modify && <Button onClick={update} colorScheme="green" mr={3}>Update</Button>}
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
