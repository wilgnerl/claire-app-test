import { ProgressContextProvider } from '@/context/ProgressContext'
import { theme } from '@/styles/default'
import { ChakraProvider, CSSReset } from '@chakra-ui/react'
import '@fontsource/montserrat'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'

export default function myApp({ Component, pageProps, session }: any) {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={session}>
        <ProgressContextProvider>
          <CSSReset />
          <Head>
            <title>Claire App</title>
          </Head>
          <Component {...pageProps} />
        </ProgressContextProvider>
      </SessionProvider>
    </ChakraProvider>
  )
}
