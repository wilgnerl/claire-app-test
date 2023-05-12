import {
  Heading,
  Center,
  Text,
  useDisclosure,
  Button,
  Flex,
} from '@chakra-ui/react'
import Image from 'next/image'
import imageUrl from '../assets/logo.jpg'
import { cms } from '@/lib/cms'
import { getSession } from 'next-auth/react'
import Header from '@/components/Header'
import DrawerItem from '@/components/DrawerItem'
import Link from 'next/link'

export default function Main({ contents, session }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const userRole = session.user.role

  return (
    <>
      <Header onOpen={onOpen} />
      <DrawerItem isOpen={isOpen} onClose={onClose} contents={contents} />
      <Flex width="100%" direction="column">
        <Center>
          <Image src={imageUrl} alt="" width={600} height={200} />
        </Center>
        <Heading textAlign="center" color="orange.600" mt="6">
          Bem vindo a Metodologia Claire
        </Heading>
        <Text
          textAlign="center"
          mt="6"
          fontSize="xl"
          color="orange.600"
          fontWeight="bold"
        >
          Clique no menu lateral para ver as aulas
        </Text>
        <Flex w="100%" direction="column" align="center">
          {userRole === 'admin' ? (
            <Button
              mt="5"
              bgColor="orange.300"
              _hover={{
                backgroundColor: 'orange.600',
              }}
              color="white"
              w="30%"
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

export async function getServerSideProps(context: any) {
  const session = await getSession(context)
  // console.log(session)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  try {
    const ids = await cms.fetch(`*[_type=="content"]`)
    const transformedData: any = {}

    ids.forEach((item: any) => {
      const moduleName = item.moduleName
      const weekName = item.weekName
      const content = { text: item.WeekInfo[0], id: item._id }

      if (!transformedData[moduleName]) {
        transformedData[moduleName] = { moduleName, data: [] }
      }

      const existingWeek = transformedData[moduleName].data.find(
        (w: any) => w.weekName === weekName,
      )

      if (existingWeek) {
        existingWeek.content.push(content)
      } else {
        transformedData[moduleName].data.push({
          weekName,
          content: [content],
        })
      }
    })
    // Ordena os dados da semana primeiro por 'weekName' e depois por 'text.children[0].text'
    Object.values(transformedData).forEach((module: any) => {
      module.data.forEach((week: any) => {
        week.content.sort((a: any, b: any) =>
          a.text.children[0].text.localeCompare(b.text.children[0].text),
        )
      })
    })

    const result = Object.values(transformedData)
    return {
      props: {
        contents: result,
        session,
      },
    }
  } catch (error) {
    console.log(error)
    return {
      props: { data: null },
      notFound: true,
    }
  }
}
