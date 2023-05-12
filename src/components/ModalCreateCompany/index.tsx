import { api } from '@/lib/axios'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react'
import React, { useState } from 'react'

interface Company {
  id: string
  name: string
  createdAt: string
  _count: {
    users: number
  }
}

export default function ModalCreateCompany({
  isOpen,
  onClose,
  setCompany,
  companies,
}: any) {
  const [companyName, setCompanyName] = useState('')
  const toast = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const response = await api.post('/api/company/create', {
      companyName,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    setCompanyName('')

    const company: Company = response.data

    const newObject = {
      id: company.id,
      name: company.name,
      createdAt: company.createdAt,
      _count: {
        users: 0,
      },
    }
    toast({
      title: 'Empresa criada.',
      status: 'success',
      duration: 9000,
      isClosable: true,
      position: 'top-right',
    })
    setCompany([...companies, newObject])
  }

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cadastrar Empresa</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor="name">Nome da empresa</FormLabel>
              <Input
                id="name"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Flex w="100%" justify="end">
              <Button
                w="3xs"
                bgColor="orange.200"
                _hover={{
                  backgroundColor: 'orange.300',
                }}
                type="submit"
              >
                Cadastrar
              </Button>
            </Flex>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
