import { PasswordField } from '@/components/PasswordField'
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { getSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function Home({ ids }: any) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/main'
  const loginError = searchParams.get('error') ? 'Invalid credentials' : ''
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    signIn('credentials', {
      email,
      password,
      callbackUrl,
    })
  }

  const handleInputEmailChange = (e: any) => setEmail(e.target.value)

  const handleInputPasswordChange = (e: any) => setPassword(e.target.value)

  return (
    <Flex
      bgColor="orange.200"
      w="100wh"
      height="100vh"
      justify="center"
      gap="8"
    >
      <Center>
        <HStack spacing={8} bgColor="orange.400" p="20" borderRadius="8">
          <Box>
            <Stack spacing="2">
              <Heading fontSize="3xl" color="white">
                Bem vindo a Claire
              </Heading>
              <Text fontSize="xl" color="white" fontWeight="bold">
                Faça seu login
              </Text>
            </Stack>
          </Box>

          <Card bgColor="white" align="center">
            <CardBody w="sm">
              <Stack spacing="5">
                <form onSubmit={handleSubmit}>
                  <FormControl isRequired>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleInputEmailChange}
                    />

                    <PasswordField
                      value={password}
                      onChange={handleInputPasswordChange}
                    />
                    {loginError ? (
                      <Text mt="2" fontWeight="bold" color="red.500">
                        {loginError}
                      </Text>
                    ) : (
                      ''
                    )}
                  </FormControl>
                  <Stack spacing="6" mt="6">
                    <Button
                      variant="primary"
                      bgColor="orange.300"
                      color="white"
                      _hover={{
                        backgroundColor: 'orange.600',
                      }}
                      type="submit"
                      // onClick={() => signIn()}
                    >
                      Login
                    </Button>
                    <HStack>
                      <Divider />
                      <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                        ou
                      </Text>
                      <Divider />
                    </HStack>
                    <Button
                      variant="primary"
                      bgColor="orange.300"
                      color="white"
                      _hover={{
                        backgroundColor: 'orange.600',
                      }}
                    >
                      <Link href="/auth/signup">Crie sua conta</Link>
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </CardBody>
          </Card>
        </HStack>
      </Center>
    </Flex>
  )
}

Home.getInitialProps = async (context: any) => {
  const session = await getSession(context)

  if (session) {
    // redirecionar o usuário para a página de login ou mostrar uma mensagem de erro
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    session,
  }
}
