import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  // useDisclosure,
  Text,
  ModalFooter,
  FormControl,
} from '@chakra-ui/react'
import React from 'react'
import { PasswordField } from '../PasswordField'

export default function BasicUsage({
  isOpen,
  onClose,
  title,
  setPassword,
  password,
  handleFormPassword,
}: any) {
  // const { isOpen: isOpen2, onOpen, onClose } = useDisclosure()

  const handleInputPasswordChange = (e: any) => setPassword(e.target.value)

  function handleClose(e: React.FormEvent) {
    e.preventDefault()
    handleFormPassword()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleClose}>
            <ModalBody>
              <Text>Coloque a senha do modulo</Text>
              <FormControl isRequired>
                <PasswordField
                  value={password}
                  onChange={handleInputPasswordChange}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Validar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
