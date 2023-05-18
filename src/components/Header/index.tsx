import { Flex, Heading, Container, Text, Button } from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link'
import IconButtonHeader from '../IconButtonHeader'
import LogoutButton from '../Auth'

interface HeaderProps {
  content?: any
  onOpen: any
  session: any
}

export default function Header({ onOpen, session }: HeaderProps) {
  const userRole = session.user.role
  return (
    <>
      <Flex
        bgColor="orange.600"
        justify="space-between"
        align="center"
        w="100%"
        p="12"
      >
        <Flex>
          <IconButtonHeader isOpen={onOpen} />
          <Link href="/main">
            <Container>
              <Heading color="white" fontSize="xl" fontWeight="light">
                claire.
              </Heading>
              <Text color="white">Evite burnout e desengajamento</Text>
            </Container>
          </Link>
        </Flex>
        <Flex flexDirection="column">
          <LogoutButton />
          {userRole === 'admin' ? (
            <Button
              mt="5"
              bgColor="orange.300"
              _hover={{
                backgroundColor: 'orange.400',
              }}
              color="white"
            >
              <Link href="/admin">Admin Page</Link>
            </Button>
          ) : (
            ''
          )}
        </Flex>
      </Flex>
    </>
  )
}
