import {
  Heading,
  Text,
  useDisclosure,
  Flex,
  Button,
  useMediaQuery,
  Link,
} from '@chakra-ui/react'
import { cms } from '@/lib/cms'
import { getSession } from 'next-auth/react'
import Header from '@/components/Header'
import DrawerItem from '@/components/DrawerItem'
import { useContext } from 'react'
import { ProgressContext } from '@/context/ProgressContext'
import { parseISO, isAfter } from 'date-fns'
import { api } from '@/lib/axios'
import NextLink from 'next/link'

export default function Main({
  contents,
  session,
  recentTaskData,
  recentTask,
}: any) {
  const [isLargerThan] = useMediaQuery('(min-width: 600px)')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { tasks } = useContext(ProgressContext)

  let lastTasksFinished = ''
  if (tasks.length > 0) {
    lastTasksFinished = recentTaskData[0].WeekInfo[0].children[0].text
  }

  return (
    <Flex bgColor="orange.300" h="100vh" w="100wh" direction="column">
      <Header onOpen={onOpen} session={session} />
      <DrawerItem isOpen={isOpen} onClose={onClose} contents={contents} />

      {isLargerThan ? (
        <Flex mt="10" align="center" justify="space-around" mx="10">
          {tasks.length === 0 ? (
            <>
              <Flex width="50%" flexDirection="column" justify="start">
                <Heading as="h2" fontSize="2xl" color="white">
                  Olá {session.user.name}!!
                </Heading>
                <Text fontSize="xl" color="white" mt="4">
                  Bem vindo(a) ao Programa de desenvolvimento Claire
                </Text>
                <Text mt="4" fontSize="lg" color="white" fontWeight="bold">
                  Como é seu primeiro acesso, clique no botão ao lado para
                  encontrar o modulo que foi informado para você
                </Text>
              </Flex>

              <Button
                bgColor="orange.600"
                color="white"
                h="100%"
                _hover={{
                  backgroundColor: 'orange.400',
                }}
                onClick={onOpen}
                mt="10"
              >
                Clique aqui para abrir o catalogo de modulos
              </Button>
            </>
          ) : (
            <>
              <Flex
                width="50%"
                display="flex"
                flexDirection="column"
                justify="center"
              >
                <Heading as="h2" fontSize="2xl" color="white">
                  Ola {session.user.name}!!
                </Heading>
                <Text fontSize="xl" color="white" mt="4">
                  Bem vindo de volta, você parou na aula:
                </Text>

                <Text mt="4" fontSize="xl" fontWeight="extrabold">
                  {JSON.stringify(lastTasksFinished)}
                </Text>
              </Flex>
              {/* <Flex width="50%" justify="center" h="100%" wrap="nowrap"> */}
              <Link as={NextLink} href={`/day/${recentTask.checkBoxId}`}>
                <Button
                  bgColor="orange.600"
                  color="white"
                  // w="100%"
                  h="100%"
                  _hover={{
                    backgroundColor: 'orange.400',
                  }}
                  mt="10"
                >
                  <Flex wrap="wrap">Clique aqui para voltar a essa aula</Flex>
                </Button>
              </Link>
              {/* </Flex> */}
            </>
          )}
        </Flex>
      ) : (
        <Flex
          my="10"
          align="center"
          justify="space-around"
          mx="10"
          direction="column"
          height="50%"
        >
          {tasks.length === 0 ? (
            <>
              <Flex flexDirection="column">
                <Heading as="h2" fontSize="2xl" color="white">
                  Olá {session.user.name}!!
                </Heading>
                <Text fontSize="xl" color="white" mt="4">
                  Bem vindo(a) ao Programa de desenvolvimento Claire
                </Text>
                <Text mt="4" fontSize="lg" color="white" fontWeight="bold">
                  Como é seu primeiro acesso, clique no botão ao lado para
                  encontrar o modulo que foi informado para você
                </Text>
              </Flex>

              <Button
                bgColor="orange.600"
                color="white"
                h="100%"
                _hover={{
                  backgroundColor: 'orange.400',
                }}
                onClick={onOpen}
                mt="10"
              >
                Clique aqui para abrir o catalogo de modulos
              </Button>
            </>
          ) : (
            <>
              <Flex flexDirection="column">
                <Heading as="h2" fontSize="2xl" color="white">
                  Ola {session.user.name}!!
                </Heading>
                <Text fontSize="xl" color="white" mt="4">
                  Bem vindo de volta, você parou na aula:
                </Text>

                <Text mt="4" fontSize="xl" fontWeight="extrabold">
                  {JSON.stringify(lastTasksFinished)}
                </Text>
              </Flex>
              <Button
                bgColor="orange.600"
                color="white"
                w="100%"
                h="100%"
                _hover={{
                  backgroundColor: 'orange.400',
                }}
                mt="10"
              >
                <Link as={NextLink} href={`/day/${recentTask.checkBoxId}`}>
                  Clique aqui para voltar a essa aula
                </Link>
              </Button>
            </>
          )}
        </Flex>
      )}
    </Flex>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const response = await api.get(`api/progress/list?id=${session?.user.id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
  })

  let recentTask = null
  let recentTaskData = null
  if (response.data.length > 0) {
    recentTask = response.data.reduce((previousTask: any, currentTask: any) => {
      const previousTime = parseISO(previousTask.createdAt)
      const currentTime = parseISO(currentTask.createdAt)
      return isAfter(currentTime, previousTime) ? currentTask : previousTask
    })
  }
  if (recentTask !== null) {
    const query = `*[_id=="${recentTask.checkBoxId}"]`
    recentTaskData = await cms.fetch(query)
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
        recentTaskData,
        recentTask,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      props: { data: null },
      notFound: true,
    }
  }
}
