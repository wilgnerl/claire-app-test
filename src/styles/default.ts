import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        backgroundColor: '##FDFDFD',
      },
    },
  },
  fonts: {
    heading: 'Montserrat',
    body: 'Montserrat',
  },
  colors: {
    orange: {
      200: '#ffb383',
      300: '#ed7340',
      400: '#e26600',
      500: '#e8731e',
      600: '#d95319',
    },
  },
})
