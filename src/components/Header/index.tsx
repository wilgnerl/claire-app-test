import { Flex, Heading, Container, Text } from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link'
import IconButtonHeader from '../IconButtonHeader'
import LogoutButton from '../Auth'

interface HeaderProps {
  content?: any
  onOpen: any
}

export default function Header({ onOpen }: HeaderProps) {
  return (
    <>
      <Flex
        w="100%"
        p="12"
        bgColor="orange.600"
        justify="space-between"
        align="center"
      >
        <Flex>
          <IconButtonHeader isOpen={onOpen} />
          <Link href="/main">
            <Container ml="8">
              <Heading color="white" fontSize="3xl" fontWeight="light">
                claire.
              </Heading>
              <Text color="white">Evite burnout e desengajamento</Text>
            </Container>
          </Link>
        </Flex>

        <LogoutButton />
      </Flex>
    </>
  )
}
