import { Button } from '@chakra-ui/react'
import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <Button
      w="3xs"
      bgColor="orange.300"
      _hover={{
        backgroundColor: 'orange.400',
      }}
      color="white"
      onClick={() =>
        signOut({
          callbackUrl: '/',
        })
      }
    >
      Sign Out
    </Button>
  )
}
