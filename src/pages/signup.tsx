import { PasswordField } from '@/components/PasswordField'
import { api } from '@/lib/axios'
import {
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

interface Company {
  id: string
  name: string
  createdAt: string
  _count: {
    users: number
  }
}

interface AdminProps {
  companies: Company[]
}

export default function SignUp({ companies }: AdminProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [companyId, setCompanyId] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const response = await api.post('/api/signup', {
      name,
      companyId,
      email,
      password,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.data) {
      setEmail('')
      setPassword('')
      setName('')
      setCompanyId('')
      router.push('/')
    }
  }

  return (
    <Flex
      bgColor="orange.300"
      w="100wh"
      height="100vh"
      justify="center"
      align="center"
      direction="column"
    >
      <Flex
        bgColor="orange.600"
        px="20"
        pb="20"
        borderRadius="8"
        w="100%"
        direction="column"
      >
        <Flex direction="column" align="center" mt="10" mb="2">
          <Heading fontSize="2xl" color="white">
            Bem vindo a Claire
          </Heading>
          <Text fontSize="xl" color="white" fontWeight="bold">
            Crie sua conta
          </Text>
        </Flex>
        <Flex direction="column" align="center" mt="2" mx="2">
          <Card bgColor="white" align="center">
            <CardBody w="sm">
              <form onSubmit={handleSubmit}>
                <Stack spacing="4">
                  <FormControl>
                    <FormLabel htmlFor="email" mb="2">
                      Email
                    </FormLabel>
                    <Input
                      id="email"
                      type="email"
                      mb="2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormLabel htmlFor="name" mb="2">
                      Nome
                    </FormLabel>
                    <Input
                      id="name"
                      type="text"
                      mb="2"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <FormLabel htmlFor="empresa" mb="2">
                      Empresa
                    </FormLabel>
                    <Select
                      placeholder="Selecione sua empresa"
                      mb="2"
                      onChange={(e) => setCompanyId(e.target.value)}
                      value={companyId}
                    >
                      {companies.map((company) => {
                        return (
                          <option value={company.id} key={company.id}>
                            {company.name}
                          </option>
                        )
                      })}
                    </Select>
                    <PasswordField
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                </Stack>
                <Stack spacing="6" mt="6">
                  <Button
                    variant="primary"
                    bgColor="orange.300"
                    color="white"
                    _hover={{
                      backgroundColor: 'orange.600',
                    }}
                    type="submit"
                  >
                    Sign Up
                  </Button>
                </Stack>
              </form>
            </CardBody>
          </Card>
        </Flex>
      </Flex>
    </Flex>
  )
}

export async function getServerSideProps(context: any) {
  const response = await api.get('/api/company/list', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })

  return {
    props: {
      companies: response.data,
    },
  }
}
