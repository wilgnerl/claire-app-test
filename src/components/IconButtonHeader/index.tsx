import { HamburgerIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'

export default function IconButtonHeader({ isOpen }: any) {
  return (
    <>
      <IconButton
        aria-label=""
        bgColor="transparent"
        color="white"
        variant="solid"
        fontSize="30"
        colorScheme="teal"
        onClick={isOpen}
      >
        <HamburgerIcon />
      </IconButton>
    </>
  )
}
