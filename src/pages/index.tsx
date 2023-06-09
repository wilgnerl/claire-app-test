import { PasswordField } from '@/components/PasswordField'
import {
  Button,
  Card,
  CardBody,
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
            Programa de desenvolvimento Claire
          </Heading>
          <Text fontSize="xl" color="white" fontWeight="bold">
            Faça seu login
          </Text>
        </Flex>
        <Flex direction="column" align="center" mt="2" mx="2">
          <Card bgColor="white">
            <CardBody w="sm">
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
                    bgColor="orange.600"
                    color="white"
                    _hover={{
                      backgroundColor: 'orange.400',
                    }}
                    type="submit"
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
                    bgColor="orange.600"
                    color="white"
                    _hover={{
                      backgroundColor: 'orange.400',
                    }}
                  >
                    <Link href="/signup">Crie sua conta</Link>
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
